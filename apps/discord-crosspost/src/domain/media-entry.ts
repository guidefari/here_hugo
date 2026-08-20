import * as Schema from "effect/Schema";

export const MediaEntry = Schema.Struct({
  sourceId: Schema.NonEmptyString,
  entryIdentity: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  entryUrl: Schema.NonEmptyString,
  description: Schema.String,
  creator: Schema.String,
  mediaType: Schema.String,
  mediaUrl: Schema.String,
  tags: Schema.Array(Schema.String),
  thumbnailUrl: Schema.String,
  publishedAt: Schema.NonEmptyString,
  draft: Schema.Boolean,
});

export interface MediaEntry extends Schema.Schema.Type<typeof MediaEntry> {}
