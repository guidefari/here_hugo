import { getCollection } from "astro:content";

export async function publishedReports() {
  return (await getCollection("reports", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function libraryReports() {
  return (await publishedReports()).filter((report) => !report.data.parent);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
