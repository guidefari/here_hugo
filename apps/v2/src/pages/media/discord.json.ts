import type { APIRoute } from "astro";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { getCanonicalUrl, getEntriesBySection } from "../../lib/content.mjs";
import { site } from "../../lib/site.mjs";

const MediaContentEntry = Schema.Struct({
  permalink: Schema.NonEmptyString,
  title: Schema.String,
  description: Schema.String,
  date: Schema.NullishOr(Schema.Date),
  draft: Schema.Boolean,
  tags: Schema.Array(Schema.String),
  images: Schema.Array(Schema.String),
  data: Schema.Struct({
    creator: Schema.String,
    media_type: Schema.String,
    media_url: Schema.String,
  }),
});

const makeFeedResponse = Effect.gen(function* () {
  const rawEntries: unknown = yield* Effect.promise(() => getEntriesBySection("media"));
  const entries = yield* Schema.decodeUnknownEffect(Schema.Array(MediaContentEntry))(rawEntries);
  const items = entries.flatMap((entry) => {
    const publishedAt = entry.date;
    if (entry.draft || publishedAt === null || publishedAt === undefined) return [];
    return [{
      id: getCanonicalUrl(entry.permalink),
      url: getCanonicalUrl(entry.permalink),
      title: entry.title,
      summary: entry.description,
      date_published: publishedAt.toISOString(),
      authors: entry.data.creator ? [{ name: entry.data.creator }] : [],
      tags: entry.tags,
      _here: {
        media_type: entry.data.media_type,
        media_url: entry.data.media_url,
        thumbnail_url: entry.images[0]
          ? getCanonicalUrl(entry.images[0])
          : "",
        draft: false,
      },
    }];
  });

  return new Response(JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title: `${site.title} media for Discord`,
    home_page_url: getCanonicalUrl("/media/"),
    feed_url: getCanonicalUrl("/media/discord.json"),
    items,
  }), {
    headers: { "content-type": "application/feed+json; charset=utf-8" },
  });
});

export const GET: APIRoute = () => Effect.runPromise(makeFeedResponse);
