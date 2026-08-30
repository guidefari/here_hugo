---
title: "Browser uploads to S3 in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 120
description: How browsers used presigned S3 URLs for image and multipart audio uploads.
tags: [infra, aws, s3, uploads, cors, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+S3+browser+uploads"]
---

The AWS API signed a URL for each upload. The browser sent the bytes to S3, so audio parts skipped the Bun server.

```ts
const { url } = yield* presignPart(working, part.partNumber, signal)
const etag = yield* putPartToS3(url, part.blob, signal)

return { partNumber: part.partNumber, etag, size: part.blob.size }
```

The browser used a plain cross-origin `PUT` and kept the response ETag.

```ts
try: () => fetch(url, { method: 'PUT', body: blob, signal })
```

```ts
const etag = response.headers.get('ETag')
```

S3 needed a CORS rule on the bucket that received the bytes. Exposing `ETag` let browser JavaScript read that header.

```ts
cors: {
  allowOrigins: contentBucketCorsOrigins,
  allowMethods: ['PUT'],
  allowHeaders: ['*'],
  exposeHeaders: ['ETag'],
  maxAge: '1 hour'
}
```

At completion, the API listed S3's parts and compared each ETag with the value the browser supplied.

```ts
const submittedByPartNumber = new Map(parts.map((part) => [part.partNumber, part.etag]))
if (
  parts.length !== uploadedParts.length ||
  submittedByPartNumber.size !== uploadedParts.length ||
  uploadedParts.some((part) => submittedByPartNumber.get(part.partNumber) !== part.etag)
) {
  return yield* new HttpApiError.BadRequest()
}
```

After S3 completed the upload, the API returned a CloudFront address for reads.

```ts
return { url: `${config.urls.bucketRouter}/user-content/${key}`, key }
```

## Take aways

- Presigning moves the data path into the browser and bucket.
- The signed URL carries the write authority for that request.
- Bucket CORS forms part of the upload protocol because the API never proxies these bytes.
- Multipart completion depends on the ETag that S3 returns for each part.

The [R2 note](/gbfm-r2-browser-uploads) follows the same flow on Cloudflare. The upload snippets come from commit `10d43a33e`; `infra/bucket.ts` held the S3 CORS rule.
