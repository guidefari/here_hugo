import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import type { FeedSource } from "../domain/feed-source";

export interface SourceConfigService {
  readonly sources: ReadonlyArray<FeedSource>;
}

export class SourceConfig extends Context.Service<SourceConfig, SourceConfigService>()(
  "@here/discord-crosspost/SourceConfig",
) {}

export const layer = (sources: ReadonlyArray<FeedSource>) =>
  Layer.succeed(SourceConfig, SourceConfig.of({ sources }));
