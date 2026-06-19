import rss from "@astrojs/rss";
import { getAllEntries, getEntriesBySection, getEntryHtml, getSectionInfo, getSections, legacySections } from "../../lib/content.mjs";
import { site, writingSections } from "../../lib/site.mjs";

export function getStaticPaths() {
  return [...new Set([...getSections(), ...legacySections, "writing", "categories"])].map((section) => ({
    params: { section },
  }));
}

export async function GET(context) {
  const section = context.params.section;
  const info = section === "writing"
    ? { title: "Writing", description: "Recent writing on Guide Fari" }
    : section === "categories"
      ? { title: "Categories", description: "Categories on Guide Fari" }
      : getSectionInfo(section);

  const entries = section === "writing"
    ? getAllEntries().filter((entry) => writingSections.includes(entry.section))
    : section === "categories"
      ? []
      : getEntriesBySection(section);

  const items = await Promise.all(entries.map(async (entry) => ({
    title: entry.title,
    link: entry.permalink,
    description: entry.description,
    pubDate: entry.date,
    content: await getEntryHtml(entry),
  })));

  return rss({
    title: `${info.title} on ${site.title}`,
    description: info.description || `Recent content in ${info.title} on ${site.title}`,
    site: context.site,
    items,
  });
}
