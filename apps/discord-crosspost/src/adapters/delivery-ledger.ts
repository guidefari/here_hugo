import type { D1Database, D1Result } from "@cloudflare/workers-types";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { DedupeKey, type DedupeKey as DedupeKeyType } from "../domain/dedupe-key";
import { LedgerUnavailable } from "../domain/errors";
import { MediaEntry } from "../domain/media-entry";

export type ClaimResult = "claimed-pending" | "claimed-queued" | "claimed-ignored" | "already-claimed";

export interface DeliveryLedgerService {
  readonly hasEntriesForSource: (sourceId: string) => Effect.Effect<boolean, LedgerUnavailable>;
  readonly claim: (
    dedupeKey: DedupeKeyType,
    entry: MediaEntry,
    state: "queued" | "pending" | "ignored",
    now: string,
  ) => Effect.Effect<ClaimResult, LedgerUnavailable>;
  readonly prepareRetries: (
    sourceId: string,
    now: string,
    staleBefore: string,
    limit: number,
  ) => Effect.Effect<ReadonlyArray<{ readonly dedupeKey: DedupeKeyType; readonly entry: MediaEntry }>, LedgerUnavailable>;
  readonly promoteQueued: (
    sourceId: string,
    limit: number,
    now: string,
  ) => Effect.Effect<ReadonlyArray<{ readonly dedupeKey: DedupeKeyType; readonly entry: MediaEntry }>, LedgerUnavailable>;
  readonly sentMessageForUpdate: (
    dedupeKey: DedupeKeyType,
    entry: MediaEntry,
  ) => Effect.Effect<string | null, LedgerUnavailable>;
  readonly markUpdated: (
    dedupeKey: DedupeKeyType,
    entry: MediaEntry,
    now: string,
  ) => Effect.Effect<void, LedgerUnavailable>;
  readonly sentEntryIdentities: (
    sourceId: string,
  ) => Effect.Effect<ReadonlyArray<string>, LedgerUnavailable>;
  readonly markSourcePresent: (
    dedupeKey: DedupeKeyType,
    now: string,
  ) => Effect.Effect<void, LedgerUnavailable>;
  readonly markSourceMissing: (
    dedupeKey: DedupeKeyType,
    now: string,
  ) => Effect.Effect<boolean, LedgerUnavailable>;
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

const CountRow = Schema.Struct({ count: Schema.Number });
const PayloadRow = Schema.Struct({ dedupe_key: Schema.String, payload: Schema.String });
const SentMessageRow = Schema.Struct({ discord_message_id: Schema.String });
const EntryIdentityRow = Schema.Struct({ entry_identity: Schema.String });

const MAX_DELIVERY_ATTEMPTS = 6;
const RETRY_BASE_SECONDS = 5 * 60;

const safeReason = (cause: unknown): string =>
  cause instanceof Error ? cause.name : "external operation failed";

const parsePayloadRows = (
  rows: ReadonlyArray<unknown>,
): Result.Result<ReadonlyArray<{ dedupeKey: DedupeKeyType; entry: MediaEntry }>, string> => {
  const parsedRows = Schema.decodeUnknownResult(Schema.Array(PayloadRow))(rows);
  if (Result.isFailure(parsedRows)) return Result.fail("invalid persisted ledger rows");

  const out: Array<{ dedupeKey: DedupeKeyType; entry: MediaEntry }> = [];
  for (const row of parsedRows.success) {
    const dedupeKey = Schema.decodeUnknownResult(DedupeKey)(row.dedupe_key);
    let payload: unknown;
    try {
      payload = JSON.parse(row.payload);
    } catch {
      return Result.fail(`corrupt ledger row for ${row.dedupe_key}`);
    }
    const entry = Schema.decodeUnknownResult(MediaEntry)(payload);
    if (Result.isFailure(dedupeKey) || Result.isFailure(entry)) {
      return Result.fail(`corrupt ledger row for ${row.dedupe_key}`);
    }
    out.push({ dedupeKey: dedupeKey.success, entry: entry.success });
  }
  return Result.succeed(out);
};

const unavailable = (operation: string, cause: unknown): LedgerUnavailable =>
  new LedgerUnavailable({ operation, reason: safeReason(cause) });

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
          dedupe_key, source_id, entry_identity, entry_url, published_at, payload, state, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (dedupe_key) DO NOTHING
      `).bind(
        dedupeKey,
        entry.sourceId,
        entry.entryIdentity,
        entry.entryUrl,
        entry.publishedAt,
        JSON.stringify(entry),
        state,
        now,
        now,
      ).run()).pipe(
        Effect.map((result) => result.meta.changes === 1
          ? state === "queued"
            ? "claimed-queued"
            : state === "pending"
              ? "claimed-pending"
              : "claimed-ignored"
          : "already-claimed"),
      )),
    prepareRetries: Effect.fn("DeliveryLedger.prepareRetries")((sourceId, now, staleBefore, limit) =>
      run("prepareRetries", () => database.prepare(`
        UPDATE discord_deliveries
        SET state = 'pending', updated_at = ?
        WHERE dedupe_key IN (
          SELECT dedupe_key FROM discord_deliveries
          WHERE source_id = ? AND attempt_count < ?
            AND (
              (state = 'failed' AND unixepoch(?) >= unixepoch(updated_at)
                + (? * (1 << (attempt_count - 1))))
              OR (state = 'pending' AND updated_at <= ?)
            )
          ORDER BY updated_at ASC
          LIMIT ?
        )
        RETURNING dedupe_key, payload
      `).bind(
        now,
        sourceId,
        MAX_DELIVERY_ATTEMPTS,
        now,
        RETRY_BASE_SECONDS,
        staleBefore,
        limit,
      ).all()).pipe(
        Effect.flatMap((result) => {
          const parsed = parsePayloadRows(result.results);
          return Result.isFailure(parsed)
            ? Effect.fail(unavailable("prepareRetries.parse", parsed.failure))
            : Effect.succeed(parsed.success);
        }),
      )),
    promoteQueued: Effect.fn("DeliveryLedger.promoteQueued")((sourceId, limit, now) =>
      run("promoteQueued", () => database.prepare(`
        UPDATE discord_deliveries
        SET state = 'pending', updated_at = ?
        WHERE dedupe_key IN (
          SELECT dedupe_key FROM discord_deliveries
          WHERE source_id = ? AND state = 'queued'
          ORDER BY published_at ASC
          LIMIT ?
        )
        RETURNING dedupe_key, payload
      `).bind(now, sourceId, limit).all()).pipe(
        Effect.flatMap((result) => {
          const parsed = parsePayloadRows(result.results);
          return Result.isFailure(parsed)
            ? Effect.fail(unavailable("promoteQueued.parse", parsed.failure))
            : Effect.succeed(parsed.success);
        }),
      )),
    sentMessageForUpdate: Effect.fn("DeliveryLedger.sentMessageForUpdate")((dedupeKey, entry) =>
      run("sentMessageForUpdate", () => database.prepare(`
        SELECT discord_message_id
        FROM discord_deliveries
        WHERE dedupe_key = ? AND state = 'sent'
          AND discord_message_id IS NOT NULL AND payload <> ?
      `).bind(dedupeKey, JSON.stringify(entry)).all()).pipe(
        Effect.flatMap((result) => {
          const parsed = Schema.decodeUnknownResult(Schema.Array(SentMessageRow))(result.results);
          if (Result.isFailure(parsed) || parsed.success.length > 1) {
            return Effect.fail(unavailable("sentMessageForUpdate.parse", "invalid sent delivery rows"));
          }
          return Effect.succeed(parsed.success[0]?.discord_message_id ?? null);
        }),
      )),
    markUpdated: Effect.fn("DeliveryLedger.markUpdated")((dedupeKey, entry, now) =>
      run("markUpdated", () => database.prepare(`
        UPDATE discord_deliveries
        SET entry_url = ?, payload = ?, last_error = NULL, updated_at = ?
        WHERE dedupe_key = ? AND state = 'sent' AND discord_message_id IS NOT NULL
      `).bind(entry.entryUrl, JSON.stringify(entry), now, dedupeKey).run()).pipe(
        Effect.flatMap((result) => result.meta.changes === 1
          ? Effect.void
          : Effect.fail(unavailable("markUpdated", "sent delivery was not found"))),
      )),
    sentEntryIdentities: Effect.fn("DeliveryLedger.sentEntryIdentities")((sourceId) =>
      run("sentEntryIdentities", () => database.prepare(`
        SELECT entry_identity
        FROM discord_deliveries
        WHERE source_id = ? AND state = 'sent'
      `).bind(sourceId).all()).pipe(
        Effect.flatMap((result) => {
          const parsed = Schema.decodeUnknownResult(Schema.Array(EntryIdentityRow))(result.results);
          return Result.isFailure(parsed)
            ? Effect.fail(unavailable("sentEntryIdentities.parse", "invalid sent delivery rows"))
            : Effect.succeed(parsed.success.map((row) => row.entry_identity));
        }),
      )),
    markSourcePresent: Effect.fn("DeliveryLedger.markSourcePresent")((dedupeKey, now) =>
      run("markSourcePresent", () => database.prepare(`
        UPDATE discord_deliveries
        SET source_missing_at = NULL, updated_at = ?
        WHERE dedupe_key = ? AND state = 'sent' AND source_missing_at IS NOT NULL
      `).bind(now, dedupeKey).run()).pipe(Effect.asVoid)),
    markSourceMissing: Effect.fn("DeliveryLedger.markSourceMissing")((dedupeKey, now) =>
      run("markSourceMissing", () => database.prepare(`
        UPDATE discord_deliveries
        SET source_missing_at = ?, updated_at = ?
        WHERE dedupe_key = ? AND state = 'sent' AND source_missing_at IS NULL
      `).bind(now, now, dedupeKey).run()).pipe(
        Effect.map((result) => result.meta.changes === 1),
      )),
    beginAttempt: Effect.fn("DeliveryLedger.beginAttempt")((dedupeKey, now) =>
      run("beginAttempt", () => database.prepare(`
        UPDATE discord_deliveries
        SET attempt_count = attempt_count + 1, updated_at = ?
        WHERE dedupe_key = ? AND state = 'pending' AND attempt_count < ?
      `).bind(now, dedupeKey, MAX_DELIVERY_ATTEMPTS).run()).pipe(
        Effect.map((result) => result.meta.changes === 1),
      )),
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
