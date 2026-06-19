import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const v1Dir = path.join(root, "apps", "v1", "public");
const v2Dir = path.join(root, "apps", "v2", "dist");
const intentionalExtraUrls = new Set([
  "/10xts/",
  "/ai-changes-the-balance-of-debt/",
  "/book-notes/",
  "/docker-presentation/scripts/01-dockerception-script/",
  "/docker-presentation/scripts/02-linux-filesystem-script/",
  "/docker-presentation/scripts/03-container-chroot-script/",
  "/docker-presentation/scripts/04-container-namespaces-script/",
  "/docker-presentation/scripts/05-container-cgroups-script/",
  "/docker-presentation/scripts/06-dockerfile-basics-script/",
  "/docker-presentation/scripts/07-dockerfile-execution-script/",
  "/docker-presentation/scripts/08-multi-stage-small-containers-script/",
  "/docker-presentation/scripts/09-copy-gotchas-script/",
  "/docker-presentation/scripts/10-docker-compose-script/",
  "/docker-presentation/scripts/11-volumes-persistence-script/",
  "/docker-presentation/scripts/12-container-runtimes-script/",
  "/docker-presentation/scripts/13-complete-picture-script/",
  "/docker-presentation/series-guide/",
  "/kiro-shell-startup/",
  "/otel-me-more/",
  "/podcast/",
  "/podcast/index.xml",
  "/read/page/1/",
  "/read/page/2/",
  "/read/page/3/",
  "/read/testing-react/",
  "/tags/components/",
  "/tags/components/index.xml",
  "/tags/correctness/",
  "/tags/correctness/index.xml",
  "/tags/kiro/",
  "/tags/kiro/index.xml",
  "/tags/michael-arnaldi/",
  "/tags/michael-arnaldi/index.xml",
  "/tags/open-source/",
  "/tags/open-source/index.xml",
  "/tags/pattern-matching/",
  "/tags/pattern-matching/index.xml",
  "/tags/script/",
  "/tags/script/index.xml",
  "/tags/series/",
  "/tags/series/index.xml",
  "/tags/software-engineering/",
  "/tags/software-engineering/index.xml",
  "/tags/tools/",
  "/tags/tools/index.xml",
  "/tags/tyepescript/",
  "/tags/tyepescript/index.xml",
  "/tags/types/",
  "/tags/types/index.xml",
  "/tags/youtube/",
  "/tags/youtube/index.xml",
  "/tweet/",
  "/tweet/index.xml",
  "/tweet/opencode-references-just-clone-repo/",
]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function toUrl(file, baseDir) {
  const relative = path.relative(baseDir, file).replace(/\\/g, "/");
  if (!relative.endsWith(".html") && !relative.endsWith(".xml")) return undefined;
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.replace(/\/index\.html$/, "/")}`;
  return `/${relative}`;
}

function manifest(dir) {
  return new Set(walk(dir).map((file) => toUrl(file, dir)).filter(Boolean).sort());
}

const v1 = manifest(v1Dir);
const v2 = manifest(v2Dir);
const missing = [...v1].filter((url) => !v2.has(url));
const extra = [...v2].filter((url) => !v1.has(url));
const unexpectedExtra = extra.filter((url) => !intentionalExtraUrls.has(url));
const intentionalExtra = extra.filter((url) => intentionalExtraUrls.has(url));

console.log(`v1 urls: ${v1.size}`);
console.log(`v2 urls: ${v2.size}`);
console.log(`missing in v2: ${missing.length}`);
console.log(`extra in v2: ${extra.length}`);
console.log(`intentional extra in v2: ${intentionalExtra.length}`);
console.log(`unexpected extra in v2: ${unexpectedExtra.length}`);

if (missing.length) {
  console.log("\nMissing in v2:");
  for (const url of missing.slice(0, 200)) console.log(url);
  if (missing.length > 200) console.log(`...and ${missing.length - 200} more`);
  process.exitCode = 1;
}

if (unexpectedExtra.length) {
  console.log("\nUnexpected extra in v2:");
  for (const url of unexpectedExtra.slice(0, 80)) console.log(url);
  if (unexpectedExtra.length > 80) console.log(`...and ${unexpectedExtra.length - 80} more`);
}
