import { expect, test } from "bun:test";
import * as Clock from "effect/Clock";
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

const sixUtc = Date.UTC(2026, 0, 1, 6, 0);

const fixedClock = (time: number): Clock.Clock => ({
  currentTimeMillisUnsafe: () => time,
  currentTimeMillis: Effect.succeed(time),
  currentTimeNanosUnsafe: () => BigInt(time) * 1_000_000n,
  currentTimeNanos: Effect.succeed(BigInt(time) * 1_000_000n),
  monotonicTimeNanosUnsafe: () => 0n,
  monotonicTimeNanos: Effect.succeed(0n),
  sleep: () => Effect.void,
});

const source: FeedSource = {
  id: "test-source",
  name: "Test source",
  enabled: true,
  feedUrl: "https://example.com/feed",
  format: "json-feed",
  absenceMeansRemoved: true,
  backfill: { postCount: 10, publishHourUtc: 6 },
};

const makeEntry = (position: number): MediaEntry => ({
  sourceId: source.id,
  entryIdentity: `entry-${position}`,
  title: `Entry ${position}`,
  entryUrl: `https://example.com/entry-${position}/`,
  description: "Summary",
  creator: "Creator",
  mediaType: "video",
  mediaUrl: "https://example.com/video.mp4",
  tags: ["video"],
  thumbnailUrl: "",
  publishedAt: new Date(sixUtc - position * 86_400_000).toISOString(),
  draft: false,
});

const runWith = (
  adapters: Layer.Layer<CrossPostRun>,
  time = sixUtc,
) => Effect.runPromise(Effect.gen(function* () {
  const service = yield* CrossPostRun;
  return yield* service.run();
}).pipe(
  Effect.provide(adapters),
  Effect.provideService(Clock.Clock, fixedClock(time)),
));

test("CrossPostRun queues only the latest ten entries and releases one immediately on first sync", async () => {
  const entries = Array.from({ length: 12 }, (_, index) => makeEntry(index));
  const claimed: Array<{ readonly entryIdentity: string; readonly state: string }> = [];
  const published: Array<unknown> = [];
  const quarantined: Array<MediaEntryRejected> = [];
  let promotedLimit = 0;
  let releaseKind: "initial" | "scheduled" | undefined;
  const promotedEntry = entries[0]!;
  const promotedKey = DedupeKey.make(source.id, promotedEntry.entryIdentity);

  const fakes = Layer.mergeAll(
    SourceConfig.layer([source]),
    Layer.succeed(FeedIngestion, FeedIngestion.of({
      ingest: () => Effect.succeed([
        ...entries.map(Result.succeed),
        Result.fail(new MediaEntryRejected({
          sourceId: source.id,
          rawPayload: "{}",
          decodeError: "invalid",
        })),
      ]),
    })),
    Layer.succeed(DeliveryLedger, DeliveryLedger.of({
      hasEntriesForSource: () => Effect.succeed(false),
      claim: (_key, entry, state) => Effect.sync(() => {
        claimed.push({ entryIdentity: entry.entryIdentity, state });
        return state === "queued"
          ? "claimed-queued"
          : state === "pending"
            ? "claimed-pending"
            : "claimed-ignored";
      }),
      prepareRetries: () => Effect.succeed([]),
      promoteQueued: (_sourceId, limit, release) => Effect.sync(() => {
        promotedLimit = limit;
        releaseKind = release;
        return [{ dedupeKey: promotedKey, entry: promotedEntry }];
      }),
      sentMessageForUpdate: () => Effect.succeed(null),
      markUpdated: () => Effect.void,
      sentEntryIdentities: () => Effect.succeed([]),
      markSourcePresent: () => Effect.void,
      markSourceMissing: () => Effect.succeed(false),
      beginAttempt: () => Effect.succeed(true),
      markSent: () => Effect.void,
      markFailed: () => Effect.void,
    })),
    Layer.succeed(DiscordPublisher, DiscordPublisher.of({
      publish: (payload) => Effect.sync(() => {
        published.push(payload);
        return "discord-message-1";
      }),
      update: () => Effect.succeed("discord-message-1"),
    })),
    Layer.succeed(QuarantineStore, QuarantineStore.of({
      record: (rejected) => Effect.sync(() => {
        quarantined.push(rejected);
      }),
    })),
  );
  const application = CrossPostRunLive.pipe(Layer.provide(fakes));

  const summary = await runWith(application, sixUtc - 55 * 60_000);

  expect(summary.entriesSent).toBe(1);
  expect(summary.entriesQuarantined).toBe(1);
  expect(summary.failures).toEqual([]);
  expect(claimed).toHaveLength(12);
  expect(claimed.filter(({ state }) => state === "queued")).toHaveLength(10);
  expect(claimed.filter(({ state }) => state === "ignored").map(({ entryIdentity }) => entryIdentity)).toEqual([
    "entry-10",
    "entry-11",
  ]);
  expect(promotedLimit).toBe(1);
  expect(releaseKind).toBe("initial");
  expect(published).toHaveLength(1);
  expect(quarantined).toHaveLength(1);
});

test("CrossPostRun requests only an initial release outside the configured UTC hour", async () => {
  let releaseKind: "initial" | "scheduled" | undefined;
  const entry = makeEntry(0);

  const fakes = Layer.mergeAll(
    SourceConfig.layer([source]),
    Layer.succeed(FeedIngestion, FeedIngestion.of({ ingest: () => Effect.succeed([Result.succeed(entry)]) })),
    Layer.succeed(DeliveryLedger, DeliveryLedger.of({
      hasEntriesForSource: () => Effect.succeed(true),
      claim: () => Effect.succeed("already-claimed"),
      prepareRetries: () => Effect.succeed([]),
      promoteQueued: (_sourceId, _limit, release) => Effect.sync(() => {
        releaseKind = release;
        return [];
      }),
      sentMessageForUpdate: () => Effect.succeed(null),
      markUpdated: () => Effect.void,
      sentEntryIdentities: () => Effect.succeed([]),
      markSourcePresent: () => Effect.void,
      markSourceMissing: () => Effect.succeed(false),
      beginAttempt: () => Effect.succeed(true),
      markSent: () => Effect.void,
      markFailed: () => Effect.void,
    })),
    Layer.succeed(DiscordPublisher, DiscordPublisher.of({
      publish: () => Effect.succeed("discord-message-1"),
      update: () => Effect.succeed("discord-message-1"),
    })),
    Layer.succeed(QuarantineStore, QuarantineStore.of({ record: () => Effect.void })),
  );
  const application = CrossPostRunLive.pipe(Layer.provide(fakes));

  const summary = await runWith(application, sixUtc + 5 * 60_000);

  expect(summary.entriesSent).toBe(0);
  expect(releaseKind).toBe("initial");
});

test("CrossPostRun patches edited messages and logs missing published entries without deleting them", async () => {
  const editedEntry = { ...makeEntry(0), description: "Edited summary" };
  const draftEntry = { ...makeEntry(1), draft: true };
  const editedKey = DedupeKey.make(source.id, editedEntry.entryIdentity);
  const updatedMessages: Array<string> = [];
  const markedMissing: Array<string> = [];

  const fakes = Layer.mergeAll(
    SourceConfig.layer([source]),
    Layer.succeed(FeedIngestion, FeedIngestion.of({
      ingest: () => Effect.succeed([Result.succeed(editedEntry), Result.succeed(draftEntry)]),
    })),
    Layer.succeed(DeliveryLedger, DeliveryLedger.of({
      hasEntriesForSource: () => Effect.succeed(true),
      claim: () => Effect.succeed("already-claimed"),
      prepareRetries: () => Effect.succeed([]),
      promoteQueued: () => Effect.succeed([]),
      sentMessageForUpdate: (dedupeKey) => Effect.succeed(
        dedupeKey === editedKey ? "discord-message-edited" : null,
      ),
      markUpdated: () => Effect.void,
      sentEntryIdentities: () => Effect.succeed([
        editedEntry.entryIdentity,
        draftEntry.entryIdentity,
        "deleted-entry",
      ]),
      markSourcePresent: () => Effect.void,
      markSourceMissing: (dedupeKey) => Effect.sync(() => {
        markedMissing.push(dedupeKey);
        return true;
      }),
      beginAttempt: () => Effect.succeed(true),
      markSent: () => Effect.void,
      markFailed: () => Effect.void,
    })),
    Layer.succeed(DiscordPublisher, DiscordPublisher.of({
      publish: () => Effect.succeed("discord-message-new"),
      update: (messageId) => Effect.sync(() => {
        updatedMessages.push(messageId);
        return messageId;
      }),
    })),
    Layer.succeed(QuarantineStore, QuarantineStore.of({ record: () => Effect.void })),
  );
  const application = CrossPostRunLive.pipe(Layer.provide(fakes));

  const summary = await runWith(application, sixUtc + 5 * 60_000);

  expect(summary.entriesUpdated).toBe(1);
  expect(summary.entriesSent).toBe(0);
  expect(updatedMessages).toEqual(["discord-message-edited"]);
  expect(markedMissing).toEqual([
    DedupeKey.make(source.id, draftEntry.entryIdentity),
    DedupeKey.make(source.id, "deleted-entry"),
  ]);
  expect(summary.removedEntries).toEqual([
    {
      sourceId: source.id,
      entryIdentity: draftEntry.entryIdentity,
      reason: "draft",
    },
    {
      sourceId: source.id,
      entryIdentity: "deleted-entry",
      reason: "missing",
    },
  ]);
});

test("CrossPostRun delivers a scheduled backfill entry that has scrolled out of the live feed", async () => {
  const published: Array<unknown> = [];
  let releaseKind: "initial" | "scheduled" | undefined;
  const staleEntry = { ...makeEntry(0), entryIdentity: "backfilled-entry" };
  const staleDedupeKey = DedupeKey.make(source.id, staleEntry.entryIdentity);
  const sourceWithoutRemovalDetection = { ...source, absenceMeansRemoved: false };

  const fakes = Layer.mergeAll(
    SourceConfig.layer([sourceWithoutRemovalDetection]),
    Layer.succeed(FeedIngestion, FeedIngestion.of({ ingest: () => Effect.succeed([]) })),
    Layer.succeed(DeliveryLedger, DeliveryLedger.of({
      hasEntriesForSource: () => Effect.succeed(true),
      claim: () => Effect.succeed("already-claimed"),
      prepareRetries: () => Effect.succeed([]),
      promoteQueued: (_sourceId, _limit, release) => Effect.sync(() => {
        releaseKind = release;
        return [{ dedupeKey: staleDedupeKey, entry: staleEntry }];
      }),
      sentMessageForUpdate: () => Effect.succeed(null),
      markUpdated: () => Effect.void,
      sentEntryIdentities: () => Effect.succeed([]),
      markSourcePresent: () => Effect.void,
      markSourceMissing: () => Effect.succeed(false),
      beginAttempt: () => Effect.succeed(true),
      markSent: () => Effect.void,
      markFailed: () => Effect.void,
    })),
    Layer.succeed(DiscordPublisher, DiscordPublisher.of({
      publish: (payload) => Effect.sync(() => {
        published.push(payload);
        return "discord-message-2";
      }),
      update: () => Effect.succeed("discord-message-2"),
    })),
    Layer.succeed(QuarantineStore, QuarantineStore.of({ record: () => Effect.void })),
  );
  const application = CrossPostRunLive.pipe(Layer.provide(fakes));

  const summary = await runWith(application);

  expect(summary.failures).toEqual([]);
  expect(summary.entriesSent).toBe(1);
  expect(releaseKind).toBe("scheduled");
  expect(published).toHaveLength(1);
});
