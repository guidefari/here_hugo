import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Result from "effect/Result";
import { DeliveryLedger } from "../adapters/delivery-ledger";
import { DiscordPublisher } from "../adapters/discord-publisher";
import { QuarantineStore } from "../adapters/quarantine-store";
import * as SourceConfig from "../adapters/source-config";
import * as DedupeKey from "../domain/dedupe-key";
import { MediaEntryRejected } from "../domain/errors";
import type { FeedSource } from "../domain/feed-source";
import type { MediaEntry } from "../domain/media-entry";
import { CrossPostRun, layer as CrossPostRunLive } from "./cross-post-run";
import { FeedIngestion } from "./feed-ingestion";

const source: FeedSource = {
  id: "test-source",
  name: "Test source",
  enabled: true,
  feedUrl: "https://example.com/feed",
  format: "json-feed",
  backfill: { windowDays: 14, maxPerRun: 3 },
};

const entry: MediaEntry = {
  sourceId: source.id,
  entryIdentity: "entry-1",
  title: "Entry one",
  entryUrl: "https://example.com/entry-1/",
  description: "Summary",
  creator: "Creator",
  mediaType: "video",
  mediaUrl: "https://example.com/video.mp4",
  tags: ["video"],
  thumbnailUrl: "",
  publishedAt: new Date().toISOString(),
  draft: false,
};

test("CrossPostRun trickles initial backfill and quarantines malformed peers", async () => {
  const published: Array<unknown> = [];
  const quarantined: Array<MediaEntryRejected> = [];
  let promotedLimit = 0;
  const dedupeKey = DedupeKey.make(source.id, entry.entryIdentity);

  const fakes = Layer.mergeAll(
    SourceConfig.layer([source]),
    Layer.succeed(FeedIngestion, FeedIngestion.of({
      ingest: () => Effect.succeed([
        Result.succeed(entry),
        Result.fail(new MediaEntryRejected({
          sourceId: source.id,
          rawPayload: "{}",
          decodeError: "invalid",
        })),
      ]),
    })),
    Layer.succeed(DeliveryLedger, DeliveryLedger.of({
      hasEntriesForSource: () => Effect.succeed(false),
      claim: () => Effect.succeed("claimed-queued"),
      prepareRetry: () => Effect.succeed(false),
      promoteQueued: (_sourceId, limit) => {
        promotedLimit = limit;
        return Effect.succeed([dedupeKey]);
      },
      beginAttempt: () => Effect.succeed(true),
      markSent: () => Effect.void,
      markFailed: () => Effect.void,
    })),
    Layer.succeed(DiscordPublisher, DiscordPublisher.of({
      publish: (payload) => Effect.sync(() => {
        published.push(payload);
        return "discord-message-1";
      }),
    })),
    Layer.succeed(QuarantineStore, QuarantineStore.of({
      record: (rejected) => Effect.sync(() => {
        quarantined.push(rejected);
      }),
    })),
  );
  const application = CrossPostRunLive.pipe(Layer.provide(fakes));

  const summary = await Effect.runPromise(Effect.gen(function* () {
    const service = yield* CrossPostRun;
    return yield* service.run();
  }).pipe(Effect.provide(application)));

  expect(summary.entriesSent).toBe(1);
  expect(summary.entriesQuarantined).toBe(1);
  expect(summary.failures).toEqual([]);
  expect(promotedLimit).toBe(3);
  expect(published).toHaveLength(1);
  expect(quarantined).toHaveLength(1);
});
