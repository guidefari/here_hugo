---
name: r2-media-upload
description: Upload an immutable public media asset to the Guide Fari R2 CDN and reference it in site content. Use when a user asks to publish an image, audio file, or video through media.guidefari.com, or to add a CDN-hosted asset to an article.
---

# R2 Media Upload

Provision infrastructure through Alchemy. Do not use Wrangler for bucket or domain management.

## Provisioning

The production stack owns the bucket and domain:

```ts
Cloudflare.R2.Bucket("Media", {
  name: "here-hugo-prod-media",
  domains: [{ name: "media.guidefari.com", minTLS: "1.2" }],
})
```

Use `bun run deploy -- --stage prod --yes` to apply infrastructure. Confirm a production deployment with the user before running it.

## Upload

1. Use a readable, stable storage key. Do not overwrite an existing object.
2. Preserve the original bytes. If a remote source rejects command-line downloads, retrieve it with `agent-browser` and save the browser capture to a temporary file.
3. Source `.env` without printing secrets. The account ID may be named `CLOUDFLARE_DEFAULT_ACCOUNT_ID`; map it to `CLOUDFLARE_ACCOUNT_ID` for the R2 API request.
4. Upload with `Content-Type` and `Cache-Control: public, max-age=31536000, immutable`.
5. Verify the public URL, `https://media.guidefari.com/<storage-key>`, returns the expected asset.

The R2 object endpoint is:

`PUT https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/r2/buckets/here-hugo-prod-media/objects/<storage-key>`

Use the existing `CLOUDFLARE_API_TOKEN` as a bearer token. This uploads bytes only; it does not replace the asset-store console's metadata and finalize workflow.

## Archive Media Covers

Use `scripts/archive-media-covers.ts` for every entry in `apps/v2/src/content/media`:

```sh
bun .claude/skills/r2-media-upload/scripts/archive-media-covers.ts
```

The default is a source-read-only dry run. After checking all source responses, run:

```sh
set -a && source .env && set +a && bun .claude/skills/r2-media-upload/scripts/archive-media-covers.ts --apply
```

The script writes a CDN URL only after the R2 upload and public URL succeed. It skips cover URLs already served by `media.guidefari.com`.

## Attribution

When publishing a third-party asset, cite its original author and link to the source in the surrounding content or the figure caption. Do not describe a reproduction as original work.

## Content

Reference the stable CDN URL in Markdown. Use a meaningful `alt` value and a `figcaption` for source credit when the asset is informative.
