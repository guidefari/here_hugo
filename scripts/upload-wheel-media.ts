import { createHash } from "node:crypto";
import { extname, resolve } from "node:path";
import { Glob } from "bun";

const prepareOnly = process.argv.includes("--prepare");
const paths = process.argv.slice(2).filter((argument) => argument !== "--prepare");
const directory = resolve(paths[0] ?? "apps/research/public/wheels");
const manifestPath = resolve(paths[1] ?? "apps/research/src/wheels/assets.json");
const token = process.env.CLOUDFLARE_API_TOKEN;
const configuredAccount = process.env.CLOUDFLARE_ACCOUNT_ID ?? process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID;
const cacheControl = "public, max-age=31536000, immutable";
const files = (await Array.fromAsync(new Glob("**/*.{jpg,jpeg,png,webp}").scan(directory))).sort();
const manifest: Record<string, { url: string; sha256: string; bytes: number; contentType: string }> = {};

if (!prepareOnly && !token) {
  console.error("A Cloudflare API token is required in the environment.");
  process.exit(1);
}

const resolveAccount = async () => {
  if (configuredAccount) {
    return configuredAccount;
  }
  const response = await fetch("https://api.cloudflare.com/client/v4/accounts", {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error(`Set CLOUDFLARE_ACCOUNT_ID explicitly; account discovery failed: HTTP ${response.status}`);
  }
  const payload: unknown = await response.json();
  if (typeof payload !== "object" || payload === null || !("result" in payload) || !Array.isArray(payload.result)) {
    throw new Error("Unexpected account discovery response.");
  }
  const accounts = payload.result.filter((value: unknown): value is { id: string } =>
    typeof value === "object" && value !== null && "id" in value && typeof value.id === "string");
  const only = accounts[0];
  if (accounts.length !== 1 || !only) {
    throw new Error("Set CLOUDFLARE_ACCOUNT_ID explicitly; account discovery did not return exactly one account.");
  }
  return only.id;
};
const account = prepareOnly ? "" : await resolveAccount();

const contentType = (file: string) => {
  const extension = extname(file).toLowerCase();
  if (extension === ".webp") {
    return "image/webp";
  }
  if (extension === ".png") {
    return "image/png";
  }
  return "image/jpeg";
};

const upload = async (file: string) => {
  const bytes = await Bun.file(resolve(directory, file)).arrayBuffer();
  const hash = createHash("sha256").update(new Uint8Array(bytes)).digest("hex");
  const extension = extname(file);
  const name = file.slice(0, -extension.length);
  const key = `research/wheels/${name}-${hash.slice(0, 16)}${extension}`;
  const url = `https://media.guidefari.com/${key}`;
  const type = contentType(file);
  const record = { url, sha256: hash, bytes: bytes.byteLength, contentType: type };
  if (prepareOnly) {
    manifest[`/wheels/${file}`] = record;
    return;
  }
  const existing = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(30000) });
  if (existing.ok) {
    const saved = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!saved.ok) {
      throw new Error(`Could not verify existing object ${key}: ${saved.status}`);
    }
    const savedHash = createHash("sha256").update(new Uint8Array(await saved.arrayBuffer())).digest("hex");
    if (savedHash !== hash) {
      throw new Error(`Refusing to overwrite an existing object with different bytes: ${key}`);
    }
  } else {
    if (existing.status !== 404) {
      throw new Error(`Unexpected public object status for ${key}: ${existing.status}`);
    }
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/here-hugo-prod-media/objects/${key}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": type, "Cache-Control": cacheControl },
        body: bytes,
        signal: AbortSignal.timeout(60000),
      },
    );
    if (!response.ok) {
      throw new Error(`R2 upload failed for ${key}: HTTP ${response.status}`);
    }
    const verified = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!verified.ok) {
      throw new Error(`Uploaded object unavailable at ${url}: HTTP ${verified.status}`);
    }
    const verifiedHash = createHash("sha256").update(new Uint8Array(await verified.arrayBuffer())).digest("hex");
    if (verifiedHash !== hash || verified.headers.get("content-type")?.split(";")[0] !== type) {
      throw new Error(`Uploaded object did not match expected bytes and type: ${key}`);
    }
  }
  manifest[`/wheels/${file}`] = record;
  console.log(`Verified ${file}`);
};

await Promise.all(Array.from({ length: 4 }, async () => {
  const next = async (): Promise<void> => {
    const file = files.shift();
    if (file) {
      await upload(file);
      await next();
    }
  };
  await next();
}));

const ordered = Object.fromEntries(Object.entries(manifest).sort(([left], [right]) => left.localeCompare(right)));
await Bun.write(manifestPath, `${JSON.stringify(ordered, null, 2)}\n`);
console.log(`${prepareOnly ? "Prepared" : "Published and verified"} ${Object.keys(manifest).length} immutable wheel assets.`);
