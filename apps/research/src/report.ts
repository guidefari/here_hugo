import { Schema } from "effect";

export const Heading = Schema.Struct({
  depth: Schema.Number,
  slug: Schema.String,
  text: Schema.String,
});

export const Report = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  description: Schema.String,
  date: Schema.String,
  updated: Schema.optional(Schema.String),
  tags: Schema.Array(Schema.String),
  parent: Schema.optional(Schema.String),
  html: Schema.String,
  headings: Schema.Array(Heading),
  chapters: Schema.Array(Schema.Struct({
    slug: Schema.String,
    title: Schema.String,
    start: Schema.Number,
    end: Schema.Number,
    anchors: Schema.Array(Schema.String),
  })),
});

export type Report = typeof Report.Type;

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
