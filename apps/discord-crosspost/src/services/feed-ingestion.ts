import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import type * as Result from "effect/Result";
import * as HttpClient from "effect/unstable/http/HttpClient";
import type { FeedFormatUnsupported, FeedUnreachable, MediaEntryRejected } from "../domain/errors";
import { FeedFormatUnsupported as Unsupported, FeedUnreachable as Unreachable } from "../domain/errors";
import { decodeAtom, decodeJsonFeed, decodeRss } from "../domain/feed-decoders";
import type { FeedSource } from "../domain/feed-source";
import type { MediaEntry } from "../domain/media-entry";

export interface FeedIngestionService {
  readonly ingest: (
    source: FeedSource,
  ) => Effect.Effect<ReadonlyArray<Result.Result<MediaEntry, MediaEntryRejected>>, FeedUnreachable | FeedFormatUnsupported>;
}

export class FeedIngestion extends Context.Service<FeedIngestion, FeedIngestionService>()(
  "@here/discord-crosspost/FeedIngestion",
) {}

export const layer = Layer.effect(
  FeedIngestion,
  Effect.gen(function* () {
    const http = yield* HttpClient.HttpClient;
    return FeedIngestion.of({
      ingest: Effect.fn("FeedIngestion.ingest")(function* (source) {
        const response = yield* http.get(source.feedUrl).pipe(
          Effect.mapError(() => new Unreachable({ sourceId: source.id, reason: "Feed request failed" })),
        );
        if (response.status < 200 || response.status >= 300) {
          return yield* Effect.fail(new Unreachable({
            sourceId: source.id,
            reason: `Feed returned HTTP ${response.status}`,
          }));
        }
        const body = yield* response.text.pipe(
          Effect.mapError(() => new Unreachable({ sourceId: source.id, reason: "Feed body could not be read" })),
        );
        return yield* Effect.try({
          try: () => {
            switch (source.format) {
              case "json-feed": return decodeJsonFeed(source, body);
              case "rss": return decodeRss(source, body);
              case "atom": return decodeAtom(source, body);
            }
          },
          catch: (cause) => new Unsupported({
            sourceId: source.id,
            format: source.format,
            reason: cause instanceof Error ? cause.name : "feed decoding failed",
          }),
        });
      }),
    });
  }),
);
