import * as Clock from "effect/Clock";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { DeliveryLedger } from "../adapters/delivery-ledger";
import { DiscordPublisher } from "../adapters/discord-publisher";
import { QuarantineStore } from "../adapters/quarantine-store";
import { SourceConfig } from "../adapters/source-config";
import * as DedupeKey from "../domain/dedupe-key";
import { fromMediaEntry } from "../domain/discord-embed-payload";
import type { FeedSource } from "../domain/feed-source";
import type { MediaEntry } from "../domain/media-entry";
import { FeedIngestion } from "./feed-ingestion";

export const CrossPostRunFailure = Schema.Struct({
  sourceId: Schema.String,
  entryIdentity: Schema.NullOr(Schema.String),
  reason: Schema.String,
});

export interface CrossPostRunFailure extends Schema.Schema.Type<typeof CrossPostRunFailure> {}

export const CrossPostRunSummary = Schema.Struct({
  sourcesProcessed: Schema.Number,
  entriesSent: Schema.Number,
  entriesQuarantined: Schema.Number,
  failures: Schema.Array(CrossPostRunFailure),
});

export interface CrossPostRunSummary extends Schema.Schema.Type<typeof CrossPostRunSummary> {}

export interface CrossPostRunService {
  readonly run: () => Effect.Effect<CrossPostRunSummary>;
}

export class CrossPostRun extends Context.Service<CrossPostRun, CrossPostRunService>()(
  "@here/discord-crosspost/CrossPostRun",
) {}

interface SourceSummary {
  readonly sent: number;
  readonly quarantined: number;
  readonly failures: ReadonlyArray<CrossPostRunFailure>;
}

const failure = (sourceId: string, entryIdentity: string | null, reason: unknown): CrossPostRunFailure => ({
  sourceId,
  entryIdentity,
  reason: String(reason),
});

export const layer = Layer.effect(
  CrossPostRun,
  Effect.gen(function* () {
    const sourceConfig = yield* SourceConfig;
    const ingestion = yield* FeedIngestion;
    const ledger = yield* DeliveryLedger;
    const publisher = yield* DiscordPublisher;
    const quarantine = yield* QuarantineStore;

    const processSource = Effect.fn("CrossPostRun.processSource")(function* (
      source: FeedSource,
      nowMillis: number,
    ) {
      const failures: Array<CrossPostRunFailure> = [];
      let quarantined = 0;
      let sent = 0;
      const now = new Date(nowMillis).toISOString();
      const ingested = yield* Effect.result(ingestion.ingest(source));
      if (Result.isFailure(ingested)) {
        return {
          sent,
          quarantined,
          failures: [failure(source.id, null, ingested.failure.reason)],
        } satisfies SourceSummary;
      }

      const entries = new Map<DedupeKey.DedupeKey, MediaEntry>();
      for (const item of ingested.success) {
        if (Result.isFailure(item)) {
          const recorded = yield* Effect.result(quarantine.record(item.failure, now));
          if (Result.isFailure(recorded)) failures.push(failure(source.id, null, recorded.failure.reason));
          else quarantined += 1;
          continue;
        }
        if (!item.success.draft) entries.set(DedupeKey.make(source.id, item.success.entryIdentity), item.success);
      }

      const hasEntries = yield* Effect.result(ledger.hasEntriesForSource(source.id));
      if (Result.isFailure(hasEntries)) {
        failures.push(failure(source.id, null, hasEntries.failure.reason));
        return { sent, quarantined, failures } satisfies SourceSummary;
      }

      const firstSync = !hasEntries.success;
      const cutoff = nowMillis - source.backfill.windowDays * 86_400_000;
      const staleBefore = new Date(nowMillis - 10 * 60_000).toISOString();
      const due = new Set<DedupeKey.DedupeKey>();

      for (const [dedupeKey, entry] of entries) {
        if (firstSync && Date.parse(entry.publishedAt) < cutoff) continue;
        const claimState = firstSync ? "queued" : "pending";
        const claimed = yield* Effect.result(ledger.claim(
          DedupeKey.make(source.id, entry.entryIdentity),
          entry,
          claimState,
          now,
        ));
        if (Result.isFailure(claimed)) {
          failures.push(failure(source.id, entry.entryIdentity, claimed.failure.reason));
          continue;
        }
        if (claimed.success === "claimed-pending") {
          due.add(dedupeKey);
        } else if (claimed.success === "already-claimed") {
          const retry = yield* Effect.result(ledger.prepareRetry(
            DedupeKey.make(source.id, entry.entryIdentity),
            now,
            staleBefore,
          ));
          if (Result.isFailure(retry)) failures.push(failure(source.id, entry.entryIdentity, retry.failure.reason));
          else if (retry.success) due.add(dedupeKey);
        }
      }

      const promoted = yield* Effect.result(ledger.promoteQueued(
        source.id,
        source.backfill.maxPerRun,
        now,
        [...entries.keys()],
      ));
      if (Result.isFailure(promoted)) failures.push(failure(source.id, null, promoted.failure.reason));
      else for (const dedupeKey of promoted.success) due.add(dedupeKey);

      for (const dedupeKey of due) {
        const entry = entries.get(dedupeKey);
        if (!entry) continue;
        const attempt = yield* Effect.result(ledger.beginAttempt(
          DedupeKey.make(source.id, entry.entryIdentity),
          now,
        ));
        if (Result.isFailure(attempt)) {
          failures.push(failure(source.id, entry.entryIdentity, attempt.failure.reason));
          continue;
        }
        if (!attempt.success) continue;
        const delivered = yield* Effect.result(publisher.publish(fromMediaEntry(entry)));
        if (Result.isFailure(delivered)) {
          const marked = yield* Effect.result(ledger.markFailed(
            DedupeKey.make(source.id, entry.entryIdentity),
            delivered.failure.reason,
            now,
          ));
          failures.push(failure(source.id, entry.entryIdentity, delivered.failure.reason));
          if (Result.isFailure(marked)) failures.push(failure(source.id, entry.entryIdentity, marked.failure.reason));
          continue;
        }
        const marked = yield* Effect.result(ledger.markSent(
          DedupeKey.make(source.id, entry.entryIdentity),
          delivered.success,
          now,
        ));
        if (Result.isFailure(marked)) failures.push(failure(source.id, entry.entryIdentity, marked.failure.reason));
        else sent += 1;
      }

      return { sent, quarantined, failures } satisfies SourceSummary;
    });

    return CrossPostRun.of({
      run: Effect.fn("CrossPostRun.run")(function* () {
        const now = yield* Clock.currentTimeMillis;
        const enabled = sourceConfig.sources.filter((source) => source.enabled);
        const summaries = yield* Effect.forEach(
          enabled,
          (source) => processSource(source, now),
          { concurrency: 4 },
        );
        return {
          sourcesProcessed: enabled.length,
          entriesSent: summaries.reduce((total, summary) => total + summary.sent, 0),
          entriesQuarantined: summaries.reduce((total, summary) => total + summary.quarantined, 0),
          failures: summaries.flatMap((summary) => summary.failures),
        };
      }),
    });
  }),
);
