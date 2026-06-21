import rss from "@astrojs/rss";
import { getAllTags, getEntriesByTag, getEntryHtml } from "../../../lib/content.mjs";
import { site } from "../../../lib/site.mjs";

export async function getStaticPaths() {
  return (await getAllTags()).map((tag) => ({
    params: { tag: tag.slug },
    props: { tag },
  }));
}

export async function GET(context) {
  const tag = context.props.tag;
  const entries = await getEntriesByTag(tag.slug);
  const items = await Promise.all(entries.map(async (entry) => ({
    title: entry.title,
    link: entry.permalink,
    description: entry.description,
    pubDate: entry.date,
    content: await getEntryHtml(entry),
  })));

  return rss({
    title: `${site.title} - ${tag.label} Tag`,
    description: `Posts tagged ${tag.label} on ${site.title}`,
    site: context.site,
    items,
  });
}
