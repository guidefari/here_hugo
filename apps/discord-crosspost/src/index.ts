import type { D1Database, ExecutionContext, ScheduledController } from "@cloudflare/workers-types";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as DeliveryLedger from "./adapters/delivery-ledger";
import * as DiscordPublisher from "./adapters/discord-publisher";
import * as QuarantineStore from "./adapters/quarantine-store";
import * as SourceConfig from "./adapters/source-config";
import { FeedSourceConfig } from "./domain/feed-source";
import { CrossPostRun, layer as CrossPostRunLive } from "./services/cross-post-run";
import { layer as FeedIngestionLive } from "./services/feed-ingestion";
import { sourceConfig } from "./sources.config";

interface Env {
  readonly DB: D1Database;
  readonly DISCORD_WEBHOOK_URL: string;
}

const run = (env: Env) =>
  Effect.gen(function* () {
    const parsedSources = yield* Schema.decodeUnknownEffect(Schema.Array(FeedSourceConfig))(sourceConfig).pipe(
      Effect.mapError((error) => `Invalid feed source configuration: ${error}`),
    );

    const adapters = Layer.mergeAll(
      DeliveryLedger.layer(env.DB),
      QuarantineStore.layer(env.DB),
      DiscordPublisher.layer(Redacted.make(env.DISCORD_WEBHOOK_URL)),
      SourceConfig.layer(parsedSources),
      FeedIngestionLive.pipe(Layer.provide(FetchHttpClient.layer)),
    );
    const application = CrossPostRunLive.pipe(Layer.provide(adapters));

    yield* Effect.gen(function* () {
      const crossPost = yield* CrossPostRun;
      const summary = yield* crossPost.run();
      yield* Effect.logInfo("Discord cross-post run complete", summary);
    }).pipe(Effect.provide(application));
  }).pipe(
    Effect.catch((error: unknown) => Effect.logError("Discord cross-post run failed", { error })),
  );

export default {
  scheduled(_controller: ScheduledController, env: Env, context: ExecutionContext): void {
    context.waitUntil(Effect.runPromise(run(env)));
  },
};
