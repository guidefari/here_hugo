import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const optionalString = z.union([z.string(), z.null()]).optional().transform((v) => v ?? "");
const optionalStringArray = z.array(z.string()).nullish().transform((v) => v ?? []);
const optionalDate = z.coerce.date().nullish();
const optionalUrl = z.union([z.string(), z.null()]).optional().transform((v) => v ?? "");

const entries = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content",
    generateId: ({ entry }) => {
      const noExt = entry.replace(/\.md$/, "");
      const parts = noExt.split("/content/");
      return parts[parts.length - 1] ?? noExt;
    },
  }),
  schema: z.object({
    title: optionalString,
    date: optionalDate,
    publishDate: optionalDate,
    lastmod: optionalDate,
    description: optionalString,
    summary: optionalString,
    tags: optionalStringArray,
    images: optionalStringArray,
    draft: z.boolean().optional(),
    layout: optionalString,
    aliases: z.array(z.string()).nullish(),
    noindex: z.boolean().optional(),
    tldr: optionalString,
    hide_footer: z.boolean().optional(),
    full_width: z.boolean().optional(),
    intro: optionalString,
    media_type: optionalString,
    media_url: optionalUrl,
    youtube_id: optionalString,
    creator: optionalString,
    artist: optionalString,
    album: optionalString,
    track: optionalString,
    year: z.union([z.string(), z.number()]).optional(),
    rating: z.union([z.string(), z.number()]).optional(),
    author: optionalString,
    issue: z.union([z.string(), z.number()]).optional(),
    cover: optionalString,
    tracks: z.array(z.string()).nullish(),
  }).passthrough(),
});

export const collections = { entries };
