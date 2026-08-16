import { basename, extname, resolve } from "node:path";

const contentDirectory = resolve(
  import.meta.dir,
  "../../../../apps/v2/src/content/media",
);
const mediaDomain = "https://media.guidefari.com";
const bucketName = "here-hugo-prod-media";
const apply = process.argv.includes("--apply");
const accountId =
  process.env.CLOUDFLARE_ACCOUNT_ID ??
  process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

const extensionFor = (contentType: string, source: string): string => {
  const extensionByContentType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };

  return (
    extensionByContentType[contentType.split(";", 1)[0].toLowerCase()] ??
    extname(new URL(source).pathname).slice(1) ??
    "jpg"
  );
};

const coverUrl = (filename: string, extension: string) =>
  `${mediaDomain}/media-covers/${filename.toLowerCase()}.${extension}`;

const sourceUrl = (content: string): string | undefined => {
  const match = content.match(/^images:\s*\[["']([^"']+)["']\]\s*$/m);
  return match?.[1];
};

const archiveCover = async (path: string) => {
  const content = await Bun.file(path).text();
  const source = sourceUrl(content);
  if (source === undefined || source.startsWith(mediaDomain)) return;

  const sourceResponse = await fetch(source, {
    headers: { "User-Agent": "GuideFari media archiver" },
  });
  if (!sourceResponse.ok) {
    throw new Error(`${basename(path)}: source returned ${sourceResponse.status}`);
  }

  const contentType = sourceResponse.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`${basename(path)}: source is not an image (${contentType})`);
  }

  const key = `media-covers/${basename(path, ".md").toLowerCase()}.${extensionFor(contentType, source)}`;
  const destination = `${mediaDomain}/${key}`;
  console.log(`${apply ? "archive" : "check"} ${source} -> ${destination}`);
  if (!apply) return;

  if (accountId === undefined || apiToken === undefined) {
    throw new Error("CLOUDFLARE_API_TOKEN and a Cloudflare account ID are required");
  }

  const body = await sourceResponse.arrayBuffer();
  const uploadResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${key}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
      body,
    },
  );
  if (!uploadResponse.ok) {
    throw new Error(`${basename(path)}: upload returned ${uploadResponse.status}`);
  }

  const publicResponse = await fetch(destination);
  if (!publicResponse.ok) {
    throw new Error(`${basename(path)}: CDN returned ${publicResponse.status}`);
  }

  await Bun.write(path, content.replace(source, destination));
};

const failures: Error[] = [];
for await (const entry of new Bun.Glob("*.md").scan({ cwd: contentDirectory })) {
  try {
    await archiveCover(resolve(contentDirectory, entry));
  } catch (error) {
    failures.push(error instanceof Error ? error : new Error(String(error)));
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure.message);
  process.exitCode = 1;
}
