import * as Schema from "effect/Schema";

export class MediaEntryRejected extends Schema.TaggedError<MediaEntryRejected>()(
  "MediaEntryRejected",
  {
    sourceId: Schema.String,
    rawPayload: Schema.String,
    decodeError: Schema.String,
  },
) {}

export class FeedUnreachable extends Schema.TaggedError<FeedUnreachable>()(
  "FeedUnreachable",
  {
    sourceId: Schema.String,
    reason: Schema.String,
  },
) {}

export class FeedFormatUnsupported extends Schema.TaggedError<FeedFormatUnsupported>()(
  "FeedFormatUnsupported",
  {
    sourceId: Schema.String,
    format: Schema.String,
    reason: Schema.String,
  },
) {}

export class LedgerUnavailable extends Schema.TaggedError<LedgerUnavailable>()(
  "LedgerUnavailable",
  {
    operation: Schema.String,
    reason: Schema.String,
  },
) {}

export class DiscordDeliveryFailed extends Schema.TaggedError<DiscordDeliveryFailed>()(
  "DiscordDeliveryFailed",
  {
    status: Schema.NullOr(Schema.Number),
    reason: Schema.String,
  },
) {}

export class QuarantineUnavailable extends Schema.TaggedError<QuarantineUnavailable>()(
  "QuarantineUnavailable",
  {
    reason: Schema.String,
  },
) {}
