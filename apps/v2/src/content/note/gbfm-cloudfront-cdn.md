---
title: "The CloudFront CDN for Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 40
description: How the AWS stack routed stable media URLs through CloudFront and how the cutover kept them.
tags: [infra, aws, sst, cloudfront, cdn, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+CloudFront+CDN"]
---

The AWS version of [Goosebumps.fm](https://goosebumps.fm) served uploads through CloudFront. The [current CDN uses a Cloudflare Worker and R2](/gbfm-cloudflare-cdn-router).

SST's router owned `cdn.goosebumps.fm`. Two path rules selected an S3 bucket and removed the public prefix before CloudFront read the object.

```ts
export const fileRouter = new sst.aws.Router('Router', {
  domain: {
    name: `cdn.${domain}`,
    dns: sst.cloudflare.dns()
  }
})

fileRouter.routeBucket('/user-content', contentBucket, {
  rewrite: {
    regex: '^/user-content/(.*)$',
    to: '/$1'
  }
})

fileRouter.routeBucket('/mixes', mixesBucket, {
  rewrite: {
    regex: '^/mixes/(.*)$',
    to: '/$1'
  }
})
```

A stored URL such as `https://cdn.goosebumps.fm/mixes/example.mp3` therefore mapped to `example.mp3` in the mixes bucket. Database rows and feeds could use that address without knowing the S3 bucket name.

CloudFront handled `GET`, `HEAD`, byte ranges, cache validators, object metadata, and CORS. Audio playback depended on byte ranges. Browser and edge caches depended on `ETag`, `If-None-Match`, and `If-Modified-Since`.

## Preparing the cutover

I copied the S3 objects to R2 while CloudFront kept serving the old buckets. The parity check compared all keys and sizes, checked metadata, then compared SHA-256 hashes for selected objects. It caught missing `Content-Type` values before the public route moved.

The replacement Worker first ran at a staging hostname. Its checks covered the same paths and HTTP behaviour:

- 18 sampled objects returned `200` with the expected content type.
- A byte-range request returned `206` with the right `Content-Range`.
- Conditional requests returned `304`.
- Missing keys, bare prefixes, and unknown routes returned `404`.
- `POST` returned `405`.

The test also found that CloudFront sent `Access-Control-Allow-Origin: *` while the first Worker response omitted it. The Worker now adds CORS headers to hits, misses, rejected methods, and `304` responses.

## Keeping the URLs

The cutover kept `cdn.goosebumps.fm` and both path prefixes. No database update or redirect sat in the request path.

CloudFront used an unproxied CNAME to its distribution. Cloudflare could only attach the same hostname to the Worker after that record had gone. The runbook recorded this order:

```text
delete the CloudFront CNAME
attach cdn.goosebumps.fm to the Worker
```

That order created a short gap while Cloudflare issued the Worker hostname and certificate. The rollback record kept the old distribution target, TTL, and proxy setting so the CNAME could return unchanged.

## Teardown ownership

CloudFront and S3 stayed live during the rollback window. SST still owned the distribution, its cache policy, request function, KV store, certificate, and DNS state.

After Alchemy took the hostname, the SST state still contained the old CNAME. The teardown removed the AWS CDN only after live checks showed `cdn.goosebumps.fm` on the Alchemy Worker and every source object in R2. The retained S3 buckets now sit outside that deleted stack and need their own cleanup decision.
