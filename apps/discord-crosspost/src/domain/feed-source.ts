import * as Schema from "effect/Schema";

export const BackfillPolicy = Schema.Struct({
  windowDays: Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
  maxPerRun: Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
});

export const FeedSourceConfig = Schema.Struct({
  id: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  enabled: Schema.Boolean,
  feedUrl: Schema.NonEmptyString,
  format: Schema.Literals(["json-feed", "rss", "atom"]),
  backfill: BackfillPolicy,
});

export interface FeedSource extends Schema.Schema.Type<typeof FeedSourceConfig> {}
