// Dry-run stub for shaping payloads only. Production delivery should poll feeds from a dedicated Cron-triggered Worker with a D1 ledger.

const mediaPathspec = "apps/v2/src/content/media/*.md";
const siteUrl = "https://guidefari.com";
const decoder = new TextDecoder();

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function runGit(args: ReadonlyArray<string>): string {
  const result = Bun.spawnSync(["git", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  if (result.exitCode !== 0) {
    const detail = decoder.decode(result.stderr).trim();
    fail(detail.length > 0 ? detail : `git ${args[0] ?? "command"} failed`);
  }

  return decoder.decode(result.stdout).trim();
}

function resolveCommit(revision: string): string {
  return runGit(["rev-parse", "--verify", `${revision}^{commit}`]);
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function readString(value: object, key: string): string {
  const property: unknown = Reflect.get(value, key);
  return typeof property === "string" ? property : "";
}

function readStringArray(value: object, key: string): ReadonlyArray<string> {
  const property: unknown = Reflect.get(value, key);
  if (!Array.isArray(property)) return [];
  return property.filter((item): item is string => typeof item === "string");
}

function readTimestamp(value: object): string {
  const property: unknown = Reflect.get(value, "date");
  const date = property instanceof Date
    ? property
    : typeof property === "string" || typeof property === "number"
      ? new Date(property)
      : undefined;

  return date !== undefined && !Number.isNaN(date.valueOf())
    ? date.toISOString()
    : "";
}

function parseFrontmatter(markdown: string, file: string): object {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (match === null) fail(`${file}: missing YAML frontmatter`);

  const yaml = match[1];
  if (yaml === undefined) fail(`${file}: missing YAML frontmatter`);

  const parsed: unknown = Bun.YAML.parse(yaml);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    fail(`${file}: frontmatter must be a YAML object`);
  }

  return parsed;
}

function canonicalUrl(file: string): string {
  const filename = file.split("/").at(-1);
  if (filename === undefined) fail(`${file}: cannot derive filename`);

  const slug = slugify(filename.replace(/\.md$/, ""));
  if (slug.length === 0) fail(`${file}: cannot derive canonical slug`);

  return new URL(`/${slug}/`, siteUrl).toString();
}

function buildPayload(frontmatter: object, entryUrl: string) {
  const tags = readStringArray(frontmatter, "tags");
  const images = readStringArray(frontmatter, "images");

  return {
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: readString(frontmatter, "title"),
        url: entryUrl,
        description: readString(frontmatter, "description"),
        author: { name: readString(frontmatter, "creator") },
        fields: [
          {
            name: "Media type",
            value: readString(frontmatter, "media_type"),
            inline: true,
          },
          {
            name: "Media URL",
            value: readString(frontmatter, "media_url"),
          },
          {
            name: "Tags",
            value: tags.join(", "),
          },
        ],
        thumbnail: { url: images[0] ?? "" },
        timestamp: readTimestamp(frontmatter),
      },
    ],
  };
}

const revisions = Bun.argv.slice(2);
if (revisions.length !== 2) {
  fail("Usage: bun scripts/preview-discord-crossposts.ts <base-revision> <head-revision>");
}

const baseRevision = revisions[0];
const headRevision = revisions[1];
if (baseRevision === undefined || headRevision === undefined) {
  fail("Both base and head revisions are required");
}

const baseCommit = resolveCommit(baseRevision);
const headCommit = resolveCommit(headRevision);
const changedFiles = runGit([
  "diff",
  "--diff-filter=A",
  "--name-only",
  baseCommit,
  headCommit,
  "--",
  mediaPathspec,
]).split("\n").filter((file) => file.length > 0);

if (changedFiles.length === 0) {
  console.log("No newly added media files found.");
}

for (const file of changedFiles) {
  const markdown = runGit(["show", `${headCommit}:${file}`]);
  const frontmatter = parseFrontmatter(markdown, file);
  const payload = buildPayload(frontmatter, canonicalUrl(file));

  console.log(`\n${file}`);
  console.log(JSON.stringify(payload, null, 2));
}
