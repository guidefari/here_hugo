import { Glob } from "bun";
import rss from "@astrojs/rss";
import { compileReports } from "./content";

const directory = new URL("../src/content/reports/", import.meta.url).pathname;
const files = await Array.fromAsync(new Glob("**/*.md").scan(directory));
const reports = await compileReports(await Promise.all(files.map(async (file) => ({
  id: file.replace(/\.md$/, ""),
  text: await Bun.file(`${directory}/${file}`).text(),
}))));
await Bun.write(new URL("../.generated/reports.json", import.meta.url), JSON.stringify(reports));
const feed = await rss({
  title: "Guide Fari Research",
  description: "Agent-generated research, source notes, and open questions.",
  site: "https://research.guidefari.com",
  items: reports.filter((report) => !report.parent).map((report) => ({
    title: report.title,
    description: report.description,
    pubDate: new Date(report.date),
    categories: [...report.tags],
    link: `/reports/${report.id}/`,
  })),
});
await Bun.write(new URL("../public/rss.xml", import.meta.url), await feed.text());
console.log(`Compiled ${reports.length} published reports. Drafts excluded.`);
