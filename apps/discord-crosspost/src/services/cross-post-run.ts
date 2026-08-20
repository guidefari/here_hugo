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

export const RemovedEntry = Schema.Struct({
  sourceId: Schema.String,
  entryIdentity: Schema.String,
  reason: Schema.Literals(["missing", "draft"]),
});

export interface RemovedEntry extends Schema.Schema.Type<typeof RemovedEntry> {}

export const CrossPostRunSummary = Schema.Struct({
  sourcesProcessed: Schema.Number,
  entriesSent: Schema.Number,
  entriesUpdated: Schema.Number,
  entriesQuarantined: Schema.Number,
  removedEntries: Schema.Array(RemovedEntry),
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
  readonly updated: number;
  readonly quarantined: number;
  readonly removedEntries: ReadonlyArray<RemovedEntry>;
  readonly failures: ReadonlyArray<CrossPostRunFailure>;
}

const RETRIES_PER_RUN = 10;

const failure = (sourceId: string, entryIdentity: string | null, reason: unknown): CrossPostRunFailure => ({
  sourceId,
  entryIdentity,
  reason: String(reason),
});

const isBackfillReleaseTime = (nowMillis: number, publishHourUtc: number): boolean => {
  const now = new Date(nowMillis);
  return now.getUTCHours() === publishHourUtc && now.getUTCMinutes() === 0;
};

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
      const removedEntries: Array<RemovedEntry> = [];
      let quarantined = 0;
      let sent = 0;
      let updated = 0;
      const now = new Date(nowMillis).toISOString();
      const ingested = yield* Effect.result(ingestion.ingest(source));
      if (Result.isFailure(ingested)) {
        failures.push(failure(source.id, null, ingested.failure.reason));
      }

      const entries = new Map<DedupeKey.DedupeKey, MediaEntry>();
      const seenEntries = new Map<string, MediaEntry>();
      for (const item of Result.isFailure(ingested) ? [] : ingested.success) {
        if (Result.isFailure(item)) {
          const recorded = yield* Effect.result(quarantine.record(item.failure, now));
          if (Result.isFailure(recorded)) {
            failures.push(failure(source.id, null, recorded.failure.reason));
          } else {
            quarantined += 1;
            yield* Effect.logWarning("Feed entry quarantined", { sourceId: source.id });
          }
          continue;
        }
        seenEntries.set(item.success.entryIdentity, item.success);
        if (!item.success.draft) {
          entries.set(DedupeKey.make(source.id, item.success.entryIdentity), item.success);
        }
      }

      const hasEntries = yield* Effect.result(ledger.hasEntriesForSource(source.id));
      if (Result.isFailure(hasEntries)) {
        failures.push(failure(source.id, null, hasEntries.failure.reason));
        return { sent, updated, quarantined, removedEntries, failures } satisfies SourceSummary;
      }

      const firstSync = !hasEntries.success;
      const staleBefore = new Date(nowMillis - 10 * 60_000).toISOString();
      const due = new Set<DedupeKey.DedupeKey>();
      const candidates = [...entries.entries()].sort(
        ([, left], [, right]) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
      );
      for (const [index, [dedupeKey, entry]] of candidates.entries()) {
        const claimState = firstSync
          ? index < source.backfill.postCount ? "queued" : "ignored"
          : "pending";
        const claimed = yield* Effect.result(ledger.claim(dedupeKey, entry, claimState, now));
        if (Result.isFailure(claimed)) {
          failures.push(failure(source.id, entry.entryIdentity, claimed.failure.reason));
          continue;
        }
        if (claimed.success === "claimed-pending") {
          due.add(dedupeKey);
          continue;
        }
        if (claimed.success === "already-claimed") {
          const present = yield* Effect.result(ledger.markSourcePresent(dedupeKey, now));
          if (Result.isFailure(present)) {
            failures.push(failure(source.id, entry.entryIdentity, present.failure.reason));
          }

          const changedMessage = yield* Effect.result(ledger.sentMessageForUpdate(dedupeKey, entry));
          if (Result.isFailure(changedMessage)) {
            failures.push(failure(source.id, entry.entryIdentity, changedMessage.failure.reason));
          } else if (changedMessage.success !== null) {
            const delivered = yield* Effect.result(
              publisher.update(changedMessage.success, fromMediaEntry(entry)),
            );
            if (Result.isFailure(delivered)) {
              failures.push(failure(source.id, entry.entryIdentity, delivered.failure.reason));
            } else {
              const marked = yield* Effect.result(ledger.markUpdated(dedupeKey, entry, now));
              if (Result.isFailure(marked)) {
                failures.push(failure(source.id, entry.entryIdentity, marked.failure.reason));
              } else {
                updated += 1;
              }
            }
          }
        }
      }

      if (source.absenceMeansRemoved && Result.isSuccess(ingested)) {
        const sentIdentities = yield* Effect.result(ledger.sentEntryIdentities(source.id));
        if (Result.isFailure(sentIdentities)) {
          failures.push(failure(source.id, null, sentIdentities.failure.reason));
        } else {
          for (const entryIdentity of sentIdentities.success) {
            const current = seenEntries.get(entryIdentity);
            if (current !== undefined && !current.draft) continue;
            const reason: RemovedEntry["reason"] = current?.draft === true ? "draft" : "missing";
            const marked = yield* Effect.result(
              ledger.markSourceMissing(DedupeKey.make(source.id, entryIdentity), now),
            );
            if (Result.isFailure(marked)) {
              failures.push(failure(source.id, entryIdentity, marked.failure.reason));
            } else if (marked.success) {
              const removed = { sourceId: source.id, entryIdentity, reason } satisfies RemovedEntry;
              removedEntries.push(removed);
              yield* Effect.logWarning("Cross-posted entry no longer published", removed);
            }
          }
        }
      }

      if (isBackfillReleaseTime(nowMillis, source.backfill.publishHourUtc)) {
        const promoted = yield* Effect.result(ledger.promoteQueued(source.id, 1, now));
        if (Result.isFailure(promoted)) {
          failures.push(failure(source.id, null, promoted.failure.reason));
        } else {
          for (const { dedupeKey, entry: promotedEntry } of promoted.success) {
            entries.set(dedupeKey, promotedEntry);
            due.add(dedupeKey);
          }
        }
      }

      const retries = yield* Effect.result(ledger.prepareRetries(
        source.id,
        now,
        staleBefore,
        RETRIES_PER_RUN,
      ));
      if (Result.isFailure(retries)) {
        failures.push(failure(source.id, null, retries.failure.reason));
      } else {
        for (const { dedupeKey, entry } of retries.success) {
          entries.set(dedupeKey, entry);
          due.add(dedupeKey);
        }
      }

      for (const dedupeKey of due) {
        const entry = entries.get(dedupeKey);
        if (!entry) continue;
        const attempt = yield* Effect.result(ledger.beginAttempt(dedupeKey, now));
        if (Result.isFailure(attempt)) {
          failures.push(failure(source.id, entry.entryIdentity, attempt.failure.reason));
          continue;
        }
        if (!attempt.success) continue;
        const delivered = yield* Effect.result(publisher.publish(fromMediaEntry(entry)));
        if (Result.isFailure(delivered)) {
          const marked = yield* Effect.result(ledger.markFailed(
            dedupeKey,
            delivered.failure.reason,
            now,
          ));
          failures.push(failure(source.id, entry.entryIdentity, delivered.failure.reason));
          if (Result.isFailure(marked)) {
            failures.push(failure(source.id, entry.entryIdentity, marked.failure.reason));
          }
          continue;
        }
        const marked = yield* Effect.result(ledger.markSent(dedupeKey, delivered.success, now));
        if (Result.isFailure(marked)) failures.push(failure(source.id, entry.entryIdentity, marked.failure.reason));
        else sent += 1;
      }

      return { sent, updated, quarantined, removedEntries, failures } satisfies SourceSummary;
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
          entriesUpdated: summaries.reduce((total, summary) => total + summary.updated, 0),
          entriesQuarantined: summaries.reduce((total, summary) => total + summary.quarantined, 0),
          removedEntries: summaries.flatMap((summary) => summary.removedEntries),
          failures: summaries.flatMap((summary) => summary.failures),
        };
      }),
    });
  }),
);
