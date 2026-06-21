import rss from "@astrojs/rss";
import { getAllEntries, getEntryHtml } from "../lib/content.mjs";
import { site } from "../lib/site.mjs";

export async function GET(context) {
  const items = await Promise.all((await getAllEntries()).map(async (entry) => ({
    title: entry.title,
    link: entry.permalink,
    description: entry.description,
    pubDate: entry.date,
    content: await getEntryHtml(entry),
  })));

  return rss({
    title: site.title,
    description: `Recent content on ${site.title}`,
    site: context.site,
    items,
  });
}
