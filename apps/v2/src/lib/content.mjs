import { flattenedSections, sectionMeta, site } from "./site.mjs";

const modules = import.meta.glob("../../../v1/content/**/*.md", { eager: true });

const indexPages = new Map();

export function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function tagSlugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleize(value) {
  return String(value ?? "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function trimSlashes(value) {
  return String(value ?? "").replace(/^\/+|\/+$/g, "");
}

function withTrailingSlash(value) {
  const path = `/${trimSlashes(value)}`;
  return path === "/" ? path : `${path}/`;
}

function normalizePath(path) {
  const withoutContent = path.replace(/^.*content\//, "");
  const parts = withoutContent.split("/");
  const filename = parts.at(-1) ?? "";
  const basename = filename.replace(/\.md$/, "");
  const section = parts.length > 1 ? parts[0] : "";
  return {
    relativePath: withoutContent,
    section,
    basename,
    isIndex: basename === "_index",
    isRootPage: parts.length === 1,
  };
}

function permalinkFor({ section, basename, isRootPage }) {
  const slug = slugify(basename);

  if (isRootPage) return withTrailingSlash(slug);
  if (flattenedSections.has(section)) return withTrailingSlash(slug);
  return withTrailingSlash(`${section}/${slug}`);
}

function normalizeAliases(value) {
  if (!value) return [];
  const aliases = Array.isArray(value) ? value : [value];
  return aliases
    .filter(Boolean)
    .map((alias) => withTrailingSlash(alias))
    .filter((alias) => alias !== "//");
}

function readDate(frontmatter) {
  const value = frontmatter.date ?? frontmatter.publishDate ?? frontmatter.lastmod;
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

function sortByDateDesc(a, b) {
  return (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0);
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  return [String(tags)];
}

function buildEntry(path, module) {
  const file = normalizePath(path);
  const frontmatter = module.frontmatter ?? {};
  const slug = slugify(file.basename);
  const permalink = permalinkFor(file);
  const rawContent = typeof module.rawContent === "function" ? module.rawContent() : "";

  return {
    ...file,
    module,
    frontmatter,
    slug,
    permalink,
    title: frontmatter.title ?? titleize(file.basename),
    description: frontmatter.description ?? "",
    date: readDate(frontmatter),
    draft: frontmatter.draft === true,
    tags: normalizeTags(frontmatter.tags),
    aliases: normalizeAliases(frontmatter.aliases),
    layout: frontmatter.layout ?? "",
    images: Array.isArray(frontmatter.images) ? frontmatter.images : [],
    hasMermaid: rawContent.includes("```mermaid"),
    hasBody: rawContent.trim().length > 0,
  };
}

const allEntries = Object.entries(modules).map(([path, module]) => buildEntry(path, module));

for (const entry of allEntries) {
  if (entry.isIndex && entry.section) indexPages.set(entry.section, entry);
}

export function getAllEntries() {
  return allEntries.filter((entry) => !entry.isIndex && !entry.draft).sort(sortByDateDesc);
}

export function getEntryByPermalink(permalink) {
  const target = withTrailingSlash(permalink);
  return getAllEntries().find((entry) => entry.permalink === target);
}

export function getFlatEntries() {
  return getAllEntries().filter((entry) => entry.isRootPage || flattenedSections.has(entry.section));
}

export function getNestedEntries(section) {
  return getAllEntries().filter((entry) => entry.section === section && !flattenedSections.has(section));
}

export function getEntriesBySection(section) {
  return getAllEntries().filter((entry) => entry.section === section).sort(sortByDateDesc);
}

export function getSections() {
  return [...new Set(getAllEntries().map((entry) => entry.section).filter(Boolean))].sort();
}

export function getSectionInfo(section) {
  const index = indexPages.get(section);
  const meta = sectionMeta[section];
  return {
    title: index?.title ?? meta?.label ?? titleize(section),
    description: index?.description ?? meta?.description ?? "",
  };
}

export function getAllTags() {
  const tags = new Map();
  for (const entry of getAllEntries()) {
    for (const tag of entry.tags) {
      const slug = tagSlugify(tag);
      const current = tags.get(slug);
      if (current) {
        current.count += 1;
      } else {
        tags.set(slug, { slug, label: tag, count: 1 });
      }
    }
  }
  for (const tag of legacyTags) {
    if (!tags.has(tag)) tags.set(tag, { slug: tag, label: tag, count: 0 });
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function getEntriesByTag(tagSlug) {
  return getAllEntries()
    .filter((entry) => entry.tags.some((tag) => tagSlugify(tag) === tagSlug))
    .sort(sortByDateDesc);
}

export function getAliasTargets() {
  const reserved = new Set(getAllEntries().map((entry) => entry.permalink));
  const aliases = new Map(legacyAliases);

  for (const entry of getAllEntries()) {
    for (const alias of entry.aliases) {
      if (!reserved.has(alias)) aliases.set(alias, entry.permalink);
    }
  }

  return [...aliases.entries()].map(([alias, target]) => ({ alias, target }));
}

export const legacySections = ["podcast", "tweet"];

const legacyTags = [
  "components",
  "correctness",
  "kiro",
  "michael-arnaldi",
  "open-source",
  "pattern-matching",
  "script",
  "series",
  "software-engineering",
  "tools",
  "tyepescript",
  "types",
  "youtube",
];

const legacyAliases = [
  ["/book-notes/", "/book/"],
  ["/10xts/", "/note/"],
  ["/ai-changes-the-balance-of-debt/", "/three-debts/"],
  ["/kiro-shell-startup/", "/bench-shell-startup/"],
  ["/otel-me-more/", "/pulse/"],
  ["/read/page/1/", "/read/"],
  ["/read/page/2/", "/read/"],
  ["/read/page/3/", "/read/"],
  ["/read/testing-react/", "/read/"],
  ["/tweet/opencode-references-just-clone-repo/", "/opencode-references-just-clone-repo/"],
  ["/docker-presentation/scripts/01-dockerception-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/02-linux-filesystem-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/03-container-chroot-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/04-container-namespaces-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/05-container-cgroups-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/06-dockerfile-basics-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/07-dockerfile-execution-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/08-multi-stage-small-containers-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/09-copy-gotchas-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/10-docker-compose-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/11-volumes-persistence-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/12-container-runtimes-script/", "/docker-presentation/"],
  ["/docker-presentation/scripts/13-complete-picture-script/", "/docker-presentation/"],
  ["/docker-presentation/series-guide/", "/docker-presentation/"],
];

export function getCanonicalUrl(pathname) {
  return new URL(pathname, site.url).toString();
}

export async function getEntryHtml(entry) {
  if (typeof entry.module.compiledContent === "function") {
    return await entry.module.compiledContent();
  }
  return entry.description;
}

export function getOgImage(entry) {
  if (entry?.images?.length) return entry.images[0];
  const title = entry?.title ?? site.title;
  return `https://images-here-hugo.vercel.app/api/og-image?title=${encodeURIComponent(title)}`;
}

export function formatDate(date, options = {}) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", options).format(date);
}
