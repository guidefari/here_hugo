import rss from "@astrojs/rss";
import { getAllTags } from "../../lib/content.mjs";
import { site } from "../../lib/site.mjs";

export async function GET(context) {
  const tags = await getAllTags();
  return rss({
    title: `Tags on ${site.title}`,
    description: `Tags on ${site.title}`,
    site: context.site,
    items: tags.map((tag) => ({
      title: tag.label,
      link: `/tags/${tag.slug}/`,
      description: `${tag.count} posts tagged ${tag.label}`,
    })),
  });
}
