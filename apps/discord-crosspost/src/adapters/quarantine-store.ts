import type { D1Database } from "@cloudflare/workers-types";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { QuarantineUnavailable, type MediaEntryRejected } from "../domain/errors";

export interface QuarantineStoreService {
  readonly record: (
    rejected: MediaEntryRejected,
    now: string,
  ) => Effect.Effect<void, QuarantineUnavailable>;
}

export class QuarantineStore extends Context.Service<QuarantineStore, QuarantineStoreService>()(
  "@here/discord-crosspost/QuarantineStore",
) {}

export const layer = (database: D1Database) =>
  Layer.succeed(QuarantineStore, QuarantineStore.of({
    record: Effect.fn("QuarantineStore.record")((rejected, now) =>
      Effect.tryPromise({
        try: () => database.prepare(`
          INSERT INTO discord_quarantine (source_id, raw_payload, decode_error, created_at)
          VALUES (?, ?, ?, ?)
        `).bind(rejected.sourceId, rejected.rawPayload, rejected.decodeError, now).run(),
        catch: (cause) => new QuarantineUnavailable({ reason: String(cause) }),
      }).pipe(Effect.asVoid)),
  }));
