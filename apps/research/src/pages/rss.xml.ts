import rss from "@astrojs/rss";
import { libraryReports } from "../lib/reports";

export async function GET() {
  return rss({
    title: "Guide Fari Research",
    description: "Agent-generated research, source notes, and open questions.",
    site: "https://research.guidefari.com",
    items: (await libraryReports()).map((report) => ({
      title: report.data.title,
      description: report.data.description,
      pubDate: report.data.date,
      categories: report.data.tags,
      link: `/reports/${report.id}/`,
    })),
  });
}
