---
title: "The process-local Goosebumps.fm sitemap"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 100
description: How the AWS version of Goosebumps.fm generated an hourly sitemap and cached it inside one Bun process.
tags: [infra, aws, sitemap, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+process-local+sitemap"]
---

The AWS version generated its sitemap inside the Bun server. This job forms one part of the [AWS scheduled work](/gbfm-aws-scheduled-work). The [KV sitemap note](/gbfm-kv-sitemap) shows its Cloudflare form. These snippets come from `apps/vps/src/app.ts` and `apps/vps/src/routes/redirect/seo/sitemap.service.ts` at commit `ecd274d6b`.

## The cache

The sitemap service held one value in module scope. A fresh process began with `null`.

```ts
// Cache for generated sitemap
let sitemapCache: { xml: string; generatedAt: Date } | null = null

export const getSitemapCache = () => sitemapCache

export const clearSitemapCache = () => {
  sitemapCache = null
}
```

Regeneration fetched the current records, built the XML, and replaced that value.

```ts
export const regenerateSitemap = Effect.gen(function* () {
  const data = yield* fetchSitemapData
  const siteUrl = config.urls.frontend.replace(/\/$/, '')
  const vpsUrl = config.urls.vps.replace(/\/$/, '')
  const xml = buildSitemapXml(data, siteUrl, vpsUrl)

  sitemapCache = {
    xml,
    generatedAt: new Date()
  }

  yield* Effect.log(
    `✅ Sitemap regenerated with ${data.mixes.length} mixes, ${data.shows.length} shows, ${data.releases.length} releases, ${data.labels.length} labels, ${data.profiles.filter((p) => p.username).length} profiles, ${data.posts.length} posts`
  )

  return sitemapCache
})
```

A request returned the stored value when the process had one. The request generated a sitemap when the cache was empty.

```ts
export const getCachedSitemap = Effect.gen(function* () {
  if (sitemapCache) {
    return sitemapCache
  }
  return yield* regenerateSitemap
})
```

## The timer

The Bun entry point ran an Effect fiber. It regenerated the sitemap, reported the Sentry check-in, then waited an hour before the next run.

```ts
const sitemapRegenerationEffect = Effect.gen(function* () {
  const sentry = yield* SentryService
  const checkInId = yield* sentry.startCheckIn('sitemap-regeneration', {
    schedule: { type: 'interval', value: 1, unit: 'hour' },
    checkinMargin: 5,
    maxRuntime: 10,
    failureIssueThreshold: 2,
    recoveryThreshold: 1
  })

  yield* regenerateSitemap.pipe(
    Effect.tap(() => sentry.finishCheckIn('sitemap-regeneration', checkInId, 'ok')),
    Effect.tapError(() => sentry.finishCheckIn('sitemap-regeneration', checkInId, 'error'))
  )
}).pipe(
  Effect.catch((error) =>
    Effect.logError(
      `Sitemap regeneration failed: ${error instanceof Error ? error.message : String(error)}`
    )
  ),
  Effect.repeat(Schedule.spaced('1 hours'))
)
```

The server started that fiber beside the reminder loop.

```ts
runAppFork(reminderLoopEffect)
runAppFork(sitemapRegenerationEffect)
```

## Take aways

- Module scope made the cache local to one Bun process. A restart cleared it, and each extra process would own another copy.
- The request path already handled an empty cache by regenerating the XML. That rule carried into the KV service.
- The timer and cache shared a runtime. Moving them required two choices: Cloudflare Cron Triggers for the hourly call and KV for the value.
- The existing sitemap builder worked with a small Effect service, which let the same generation code write to a different cache.
