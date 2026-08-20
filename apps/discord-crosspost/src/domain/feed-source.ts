import * as Schema from "effect/Schema";

export const BackfillPolicy = Schema.Struct({
  postCount: Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
  publishHourUtc: Schema.Int.check(
    Schema.isGreaterThanOrEqualTo(0),
    Schema.isLessThanOrEqualTo(23),
  ),
});

export const FeedSourceConfig = Schema.Struct({
  id: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  enabled: Schema.Boolean,
  feedUrl: Schema.NonEmptyString,
  format: Schema.Literals(["json-feed", "rss", "atom"]),
  absenceMeansRemoved: Schema.Boolean,
  backfill: BackfillPolicy,
});

export interface FeedSource extends Schema.Schema.Type<typeof FeedSourceConfig> {}
