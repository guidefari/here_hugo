---
title: "R2 storage in the Cloudflare version of Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 31
description: How Alchemy provisions R2 for Goosebumps.fm and how the Worker handles uploads.
tags: [infra, cloudflare, alchemy, r2, storage, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+R2+storage"]
---

The Cloudflare version of [Goosebumps.fm](https://goosebumps.fm) stores user content and mixes in R2. The [AWS setup stored the same objects in S3](/gbfm-s3-storage).

Alchemy creates the two buckets. The API Worker receives native R2 bindings, while signed browser uploads use the R2 S3 API.

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

const mixes = yield* Cloudflare.R2.Bucket('Mixes')
```

The Worker storage layer selects a binding by bucket name. Server-side writes call the binding, which avoids an HTTP round trip through the S3-compatible API.

```ts
const selectBucket = (
  buckets: R2ObjectStoreBuckets,
  names: { readonly userContent: string; readonly mixes: string },
  bucketName: string
) => {
  if (bucketName === names.userContent) return buckets.userContent
  if (bucketName === names.mixes) return buckets.mixes
  throw new Error(`R2 bucket is not configured: ${bucketName}`)
}
```

Presigned uploads still need an R2 access key because the browser writes straight to the bucket endpoint. The layer signs each `PUT` for the bucket selected by the same storage interface.

```ts
presignPutObject: ({ bucketName, key, expiresInSeconds }) =>
  presignedUrl({
    config: signingConfig(bucketName),
    method: 'PUT',
    key,
    query: [],
    expiresSeconds: expiresInSeconds
  })
```

## Moving from S3

Cloudflare Super Slurper copied the source objects while S3 still served production reads. I checked object keys, sizes, metadata, and sampled content hashes before the API or CDN used the new buckets. The copy kept every key, so the [Cloudflare CDN router](/gbfm-cloudflare-cdn-router) could serve the old URL paths.

The first copy exposed two gaps. Super Slurper omitted `Content-Type` from multipart objects. The first Alchemy bucket declaration also lacked the S3 CORS rules, which made every browser upload preflight fail. The current declaration carries those rules and exposes `ETag` for multipart completion.

R2 multipart `ETag` values needed a live contract test. The browser submits those values when it completes an upload, and the server checks them against `ListParts`. The contract test covered create, upload, list, retry, resume, complete, and abort with real R2 credentials.

## Ownership after cutover

Alchemy owns the buckets that production Workers use. An earlier SST migration stack had created another pair of R2 buckets and a test router. The teardown compared their contents with the Alchemy buckets before deleting them.

SST's `removal: 'retain'` policy covered S3 and DynamoDB, while non-empty R2 deletion returned `409`. That left some resources outside SST state. I deleted those migration resources only after the parity checks named their Alchemy replacements.

The production bucket names now come from the same Alchemy resources passed to the API Worker and CDN Worker. This keeps storage ownership and runtime bindings in one stack.
