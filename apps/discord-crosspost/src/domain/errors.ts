import * as Schema from "effect/Schema";

export class MediaEntryRejected extends Schema.TaggedErrorClass<MediaEntryRejected>()(
  "MediaEntryRejected",
  {
    sourceId: Schema.String,
    rawPayload: Schema.String,
    decodeError: Schema.String,
  },
) {}

export class FeedUnreachable extends Schema.TaggedErrorClass<FeedUnreachable>()(
  "FeedUnreachable",
  {
    sourceId: Schema.String,
    reason: Schema.String,
  },
) {}

export class FeedFormatUnsupported extends Schema.TaggedErrorClass<FeedFormatUnsupported>()(
  "FeedFormatUnsupported",
  {
    sourceId: Schema.String,
    format: Schema.String,
    reason: Schema.String,
  },
) {}

export class LedgerUnavailable extends Schema.TaggedErrorClass<LedgerUnavailable>()(
  "LedgerUnavailable",
  {
    operation: Schema.String,
    reason: Schema.String,
  },
) {}

export class DiscordDeliveryFailed extends Schema.TaggedErrorClass<DiscordDeliveryFailed>()(
  "DiscordDeliveryFailed",
  {
    status: Schema.NullOr(Schema.Number),
    reason: Schema.String,
  },
) {}

export class QuarantineUnavailable extends Schema.TaggedErrorClass<QuarantineUnavailable>()(
  "QuarantineUnavailable",
  {
    reason: Schema.String,
  },
) {}
