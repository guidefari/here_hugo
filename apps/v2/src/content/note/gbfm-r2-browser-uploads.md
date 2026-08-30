---
title: "Browser uploads to R2 in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 121
description: How Alchemy configures R2 CORS, upload signing, multipart ETags, and public reads.
tags: [infra, cloudflare, alchemy, r2, uploads, cors, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+R2+browser+uploads"]
---

The [S3 version](/gbfm-s3-browser-uploads) established a direct browser upload flow, which R2 keeps. Alchemy puts CORS on the user-content bucket because the browser sends each signed `PUT` there.

```ts
const userContent = yield* Cloudflare.R2.Bucket('UserContent', {
  cors: [
    {
      id: 'browser-presigned-uploads',
      allowedOrigins: config.isProduction
        ? ['https://www.goosebumps.fm', 'https://goosebumps.fm']
        : ['*'],
      allowedMethods: ['PUT'],
      allowedHeaders: ['*'],
      exposeHeaders: ['ETag'],
      maxAgeSeconds: 3600
    }
  ]
})
```

The first Alchemy port omitted this rule. Every browser preflight then received a 403. Commit `dca249e04` restored it before the AWS teardown.

The Worker signs upload requests against R2's S3 API host.

```ts
const host = `${input.config.accountId}.r2.cloudflarestorage.com`
const path = `/${input.config.bucketName}/${encodeKeyPath(input.key)}`
```

Public links point at the CDN Worker. It picks an R2 binding from each `GET` or `HEAD` path and writes R2's HTTP ETag into the response.

```ts
const writeObjectHeaders = (object: R2Object, headers: Headers) => {
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
}
```

The upload client still reads each part's ETag. The API then asks R2 for its part list and checks the values before completion.

```ts
const uploadedParts = yield* dieOnS3Error(
  s3Service.listMultipartParts(key, uploadId, config.buckets.userContent)
)
const partsError = validateMultipartParts(expectedSize, uploadedParts)
if (partsError) return yield* partsError

const submittedByPartNumber = new Map(parts.map((part) => [part.partNumber, part.etag]))
if (
  parts.length !== uploadedParts.length ||
  submittedByPartNumber.size !== uploadedParts.length ||
  uploadedParts.some((part) => submittedByPartNumber.get(part.partNumber) !== part.etag)
) {
  return yield* new HttpApiError.BadRequest()
}
```

R2 and S3 can calculate a completed multipart object's ETag differently. Copy checks therefore use counts, sizes, metadata, and sampled content hashes. The live completion path compares per-part ETags from one R2 upload, where the browser response and R2 part listing must agree.

## Take aways

- R2 CORS must allow the browser origin, method, headers, and readable `ETag` response.
- The Worker signs writes with `<account>.r2.cloudflarestorage.com`.
- `cdn.goosebumps.fm` or the stage CDN Worker URL serves public reads.
- Cross-provider copy checks cannot rely on multipart object ETags. Per-part ETags still guard upload completion.

The current snippets live in `alchemy/storage.ts`, `apps/server/src/services/storage/r2-signing.ts`, `apps/server/src/http/upload.handlers.ts`, and `apps/cdn-router/src/index.ts`.
