---
title: "S3 storage in the AWS version of Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 30
description: How Goosebumps.fm stored uploads in S3, copied them to R2, and checked the copy.
tags: [infra, aws, sst, s3, storage, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+S3+storage"]
---

The AWS version of [Goosebumps.fm](https://goosebumps.fm) kept user uploads and mixes in separate S3 buckets. The [current setup uses R2](/gbfm-r2-storage).

SST created both buckets. User images and audio parts went from the browser to S3 through presigned `PUT` URLs, so the user-content bucket allowed those requests and exposed each part's `ETag`.

```ts
export const contentBucket = isDevStage
  ? sst.aws.Bucket.get('User_Content', 'gbfm-prod-usercontentbucket-cohrefob')
  : new sst.aws.Bucket('User_Content', {
      access: 'cloudfront',
      cors: {
        allowOrigins: contentBucketCorsOrigins,
        allowMethods: ['PUT'],
        allowHeaders: ['*'],
        exposeHeaders: ['ETag'],
        maxAge: '1 hour'
      }
    })

export const mixesBucket = isDevStage
  ? sst.aws.Bucket.get('Mixes', 'gbfm-prod-mixesbucket-zftkfrfx')
  : new sst.aws.Bucket('Mixes', {
      access: 'cloudfront'
    })
```

The Bun service used the AWS SDK with credentials from its ECS role. The storage layer sent the same commands used by image uploads, multipart audio uploads, the file picker, and cleanup jobs.

```ts
const client = yield* Effect.acquireRelease(
  Effect.sync(() => new S3Client({})),
  destroyClient
)

await client.send(
  new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType
  })
)
```

## Copying the objects

I took an inventory before each copy because production could still write to S3. The final source held 198 user-content objects and 25 mixes. Cloudflare Super Slurper copied the user-content objects. The mixes moved through an earlier Super Slurper job, followed by an R2-to-R2 copy into the buckets Alchemy owned.

The copy kept every object key. Public URLs could keep the same paths under `cdn.goosebumps.fm`, including `/user-content/<key>` and `/mixes/<key>`.

Super Slurper dropped `Content-Type` from multipart objects. I repaired the metadata with same-bucket R2 copies, using each S3 object as the source of truth.

## Checking parity

The verifier compared keys, byte counts, HTTP metadata, and custom metadata. It also downloaded a sample from each provider and compared SHA-256 hashes.

```ts
if (sourceObject.size !== destinationObject.size) {
  mismatches.push({
    kind: 'Size',
    keySha256,
    source: sourceObject.size,
    destination: destinationObject.size
  })
}

const fields = differingMetadataFields(sourceObject.metadata, destinationObject.metadata)
if (fields.length > 0) mismatches.push({ kind: 'Metadata', keySha256, fields })
```

The final check found the same 223 objects and the same byte totals in the Alchemy R2 buckets. Multipart copy tools can change part boundaries, which changes an `ETag` even when the bytes match. Content hashes gave the byte check a stable basis.

## Take aways

- Direct browser uploads make bucket CORS part of the upload contract. The API cannot add those headers after S3 answers the browser.
- Object counts alone missed the lost `Content-Type` values. The parity check had to read object metadata.
- Keeping keys and the public hostname stable removed the need to update stored asset URLs.
- S3 stayed readable through the rollback window. The final SST teardown retained the S3 buckets, so their removal now needs a separate owner and an explicit data-retention choice.
