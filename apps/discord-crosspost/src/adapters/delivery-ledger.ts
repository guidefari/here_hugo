import type { D1Database, D1Result } from "@cloudflare/workers-types";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { DedupeKey, type DedupeKey as DedupeKeyType } from "../domain/dedupe-key";
import { LedgerUnavailable } from "../domain/errors";
import type { MediaEntry } from "../domain/media-entry";

export type ClaimResult = "claimed-pending" | "claimed-queued" | "already-claimed";

export interface DeliveryLedgerService {
  readonly hasEntriesForSource: (sourceId: string) => Effect.Effect<boolean, LedgerUnavailable>;
  readonly claim: (
    dedupeKey: DedupeKeyType,
    entry: MediaEntry,
    state: "queued" | "pending",
    now: string,
  ) => Effect.Effect<ClaimResult, LedgerUnavailable>;
  readonly prepareRetry: (
    dedupeKey: DedupeKeyType,
    now: string,
    staleBefore: string,
  ) => Effect.Effect<boolean, LedgerUnavailable>;
  readonly promoteQueued: (
    sourceId: string,
    limit: number,
    now: string,
    availableKeys: ReadonlyArray<DedupeKeyType>,
  ) => Effect.Effect<ReadonlyArray<DedupeKeyType>, LedgerUnavailable>;
  readonly beginAttempt: (
    dedupeKey: DedupeKeyType,
    now: string,
  ) => Effect.Effect<boolean, LedgerUnavailable>;
  readonly markSent: (
    dedupeKey: DedupeKeyType,
    messageId: string,
    now: string,
  ) => Effect.Effect<void, LedgerUnavailable>;
  readonly markFailed: (
    dedupeKey: DedupeKeyType,
    reason: string,
    now: string,
  ) => Effect.Effect<void, LedgerUnavailable>;
}

export class DeliveryLedger extends Context.Service<DeliveryLedger, DeliveryLedgerService>()(
  "@here/discord-crosspost/DeliveryLedger",
) {}

const DedupeKeyRow = Schema.Struct({ dedupe_key: Schema.String });
const CountRow = Schema.Struct({ count: Schema.Number });

const unavailable = (operation: string, cause: unknown): LedgerUnavailable =>
  new LedgerUnavailable({ operation, reason: String(cause) });

const run = <T>(operation: string, query: () => Promise<D1Result<T>>) =>
  Effect.tryPromise({ try: query, catch: (cause) => unavailable(operation, cause) });

export const layer = (database: D1Database) =>
  Layer.succeed(DeliveryLedger, DeliveryLedger.of({
    hasEntriesForSource: Effect.fn("DeliveryLedger.hasEntriesForSource")((sourceId: string) =>
      run("hasEntriesForSource", () =>
        database.prepare(
          "SELECT COUNT(*) AS count FROM discord_deliveries WHERE source_id = ?",
        ).bind(sourceId).all(),
      ).pipe(
        Effect.flatMap((result) => {
          const parsed = Schema.decodeUnknownResult(Schema.Array(CountRow))(result.results);
          if (Result.isFailure(parsed) || parsed.success.length !== 1) {
            return Effect.fail(unavailable("hasEntriesForSource.parse", Result.isFailure(parsed) ? parsed.failure : "missing row"));
          }
          return Effect.succeed((parsed.success[0]?.count ?? 0) > 0);
        }),
      )),
    claim: Effect.fn("DeliveryLedger.claim")((dedupeKey, entry, state, now) =>
      run("claim", () => database.prepare(`
        INSERT INTO discord_deliveries (
          dedupe_key, source_id, entry_identity, entry_url, state, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (dedupe_key) DO NOTHING
      `).bind(dedupeKey, entry.sourceId, entry.entryIdentity, entry.entryUrl, state, now, now).run()).pipe(
        Effect.map((result) => result.meta.changes === 1
          ? state === "queued" ? "claimed-queued" : "claimed-pending"
          : "already-claimed"),
      )),
    prepareRetry: Effect.fn("DeliveryLedger.prepareRetry")((dedupeKey, now, staleBefore) =>
      run("prepareRetry", () => database.prepare(`
        UPDATE discord_deliveries
        SET state = 'pending', updated_at = ?
        WHERE dedupe_key = ? AND attempt_count < 3
          AND (state = 'failed' OR (state = 'pending' AND updated_at <= ?))
      `).bind(now, dedupeKey, staleBefore).run()).pipe(Effect.map((result) => result.meta.changes === 1))),
    promoteQueued: Effect.fn("DeliveryLedger.promoteQueued")((sourceId, limit, now, availableKeys) => {
      if (availableKeys.length === 0) return Effect.succeed([]);
      const placeholders = availableKeys.map(() => "?").join(", ");
      return run("promoteQueued", () => database.prepare(`
        UPDATE discord_deliveries
        SET state = 'pending', updated_at = ?
        WHERE dedupe_key IN (
          SELECT dedupe_key FROM discord_deliveries
          WHERE source_id = ? AND state = 'queued' AND dedupe_key IN (${placeholders})
          ORDER BY created_at ASC
          LIMIT ?
        )
        RETURNING dedupe_key
      `).bind(now, sourceId, ...availableKeys, limit).all()).pipe(
        Effect.flatMap((result) => {
          const parsed = Schema.decodeUnknownResult(Schema.Array(DedupeKeyRow))(result.results);
          return Result.isFailure(parsed)
            ? Effect.fail(unavailable("promoteQueued.parse", parsed.failure))
            : Effect.succeed(parsed.success.map((row) => Schema.decodeUnknownSync(DedupeKey)(row.dedupe_key)));
        }),
      );
    }),
    beginAttempt: Effect.fn("DeliveryLedger.beginAttempt")((dedupeKey, now) =>
      run("beginAttempt", () => database.prepare(`
        UPDATE discord_deliveries
        SET attempt_count = attempt_count + 1, updated_at = ?
        WHERE dedupe_key = ? AND state = 'pending' AND attempt_count < 3
      `).bind(now, dedupeKey).run()).pipe(Effect.map((result) => result.meta.changes === 1))),
    markSent: Effect.fn("DeliveryLedger.markSent")((dedupeKey, messageId, now) =>
      run("markSent", () => database.prepare(`
        UPDATE discord_deliveries
        SET state = 'sent', discord_message_id = ?, last_error = NULL,
            updated_at = ?, sent_at = ?
        WHERE dedupe_key = ? AND state = 'pending'
      `).bind(messageId, now, now, dedupeKey).run()).pipe(
        Effect.flatMap((result) => result.meta.changes === 1
          ? Effect.void
          : Effect.fail(unavailable("markSent", "pending delivery was not found"))),
      )),
    markFailed: Effect.fn("DeliveryLedger.markFailed")((dedupeKey, reason, now) =>
      run("markFailed", () => database.prepare(`
        UPDATE discord_deliveries
        SET state = 'failed', last_error = ?, updated_at = ?
        WHERE dedupe_key = ? AND state = 'pending'
      `).bind(reason.slice(0, 1_000), now, dedupeKey).run()).pipe(
        Effect.flatMap((result) => result.meta.changes === 1
          ? Effect.void
          : Effect.fail(unavailable("markFailed", "pending delivery was not found"))),
      )),
  }));
