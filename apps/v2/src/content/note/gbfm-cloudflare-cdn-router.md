---
title: "The Cloudflare CDN router for Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 41
description: How a Cloudflare Worker routes Goosebumps.fm media requests to R2 and keeps the old HTTP contract.
tags: [infra, cloudflare, alchemy, workers, r2, cdn, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Cloudflare+CDN"]
---

The current [Goosebumps.fm](https://goosebumps.fm) CDN uses a Cloudflare Worker in front of two R2 buckets. It keeps the hostname and paths from the [CloudFront setup](/gbfm-cloudfront-cdn).

Alchemy creates the Worker, attaches `cdn.goosebumps.fm`, and passes it the same bucket resources used by the API Worker.

```ts
return yield* Cloudflare.Worker('CdnRouter', {
  main: './apps/cdn-router/src/index.ts',
  ...hostname(config, 'cdn.goosebumps.fm'),
  compatibility: { date: '2026-07-04' },
  observability: workerObservability(config.isProduction),
  env: {
    USER_CONTENT: store.userContent,
    MIXES: store.mixes
  }
})
```

The route matcher preserves the old public prefixes and strips them before reading R2.

```ts
const userContentPrefix = '/user-content/'
if (pathname.startsWith(userContentPrefix)) {
  const key = pathname.slice(userContentPrefix.length)
  return key.length === 0 ? null : { bucket: buckets.USER_CONTENT, key }
}

const mixesPrefix = '/mixes/'
if (pathname.startsWith(mixesPrefix)) {
  const key = pathname.slice(mixesPrefix.length)
  return key.length === 0 ? null : { bucket: buckets.MIXES, key }
}
```

This keeps saved image and audio URLs valid after the object copy from [S3 to R2](/gbfm-r2-storage).

## Preserving HTTP behaviour

The Worker passes request validators and ranges to R2. It writes the stored HTTP metadata, `ETag`, custom metadata, content length, and range response headers back to the client.

```ts
const object = await bucket.get(key, {
  onlyIf: request.headers,
  range: request.headers
})

if (request.headers.has('range') && object.range !== undefined) {
  const range = resolveRange(object.range, object.size)
  status = 206
  contentLength = range.length
  headers.set(
    'content-range',
    `bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`
  )
}
```

A failed `If-None-Match` or `If-Modified-Since` condition returns `304`. `HEAD` returns the same headers as `GET` without a body. The router rejects methods outside `GET` and `HEAD` with `405`, and returns `404` for missing keys or paths outside the two public prefixes.

The Worker also restores the CORS header that CloudFront sent:

```ts
const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, HEAD',
  'access-control-expose-headers': 'ETag'
}
```

Tests cover CORS on a hit, a miss, a rejected method, and conditional responses. They also assert that the Worker can reach only `USER_CONTENT` and `MIXES`. The old database-backup bucket never became a public binding.

## Checks and cutover

The first live router used a test hostname. It served a seeded object byte for byte, returned `206` for a range, handled `HEAD`, returned `304` for a matching `ETag`, and returned `404` for a missing key.

Production checks then sampled both prefixes and compared content with `cdn.goosebumps.fm`. After the hostname moved, 17 sampled assets returned `200`; range and conditional requests kept their status and headers. Tests from two Cloudflare edge addresses also checked the certificate.

## Take aways

The first R2 router belonged to SST and pointed at SST's migration buckets. Alchemy later created production buckets with different names, so that router could return `404` for an object that the API Worker could see. Moving the router declaration into Alchemy made both Workers consume the same resources.

SST still held stale DNS records after the hostname moved. Its teardown deleted records that Alchemy's custom domains used and caused an outage on the site hostnames. Redeploying Alchemy restored them. A resource can have one runtime owner while an older stack still holds destructive state, so the teardown check must inspect live DNS and remove stale state before deletion.
