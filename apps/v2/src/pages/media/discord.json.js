import { getCanonicalUrl, getEntriesBySection } from "../../lib/content.mjs";
import { site } from "../../lib/site.mjs";

export async function GET() {
  const entries = (await getEntriesBySection("media")).filter(
    (entry) => !entry.draft && entry.date,
  );
  const items = entries.map((entry) => ({
    id: getCanonicalUrl(entry.permalink),
    url: getCanonicalUrl(entry.permalink),
    title: entry.title,
    summary: entry.description,
    date_published: entry.date.toISOString(),
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
  }));

  return new Response(JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title: `${site.title} media for Discord`,
    home_page_url: getCanonicalUrl("/media/"),
    feed_url: getCanonicalUrl("/media/discord.json"),
    items,
  }), {
    headers: { "content-type": "application/feed+json; charset=utf-8" },
  });
}
