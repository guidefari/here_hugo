import { getAllEntries, getAllTags, getSections, legacySections } from "../lib/content.mjs";
import { site } from "../lib/site.mjs";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(pathname) {
  return new URL(pathname, site.url).toString();
}

export async function GET() {
  const [sections, tags, entries] = await Promise.all([
    getSections(),
    getAllTags(),
    getAllEntries(),
  ]);
  const paths = new Set([
    "/",
    "/writing/",
    "/media/",
    "/read/",
    "/tags/",
    "/categories/",
    ...[...new Set([...sections, ...legacySections])].map((section) => `/${section}/`),
    ...tags.map((tag) => `/tags/${tag.slug}/`),
    ...entries.map((entry) => entry.permalink),
  ]);

  const urls = [...paths].sort().map((pathname) => `<url><loc>${escapeXml(absoluteUrl(pathname))}</loc></url>`).join("");
  const body = `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
