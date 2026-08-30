---
title: "The KV-backed Goosebumps.fm sitemap"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 101
description: How Alchemy, Cloudflare Cron Triggers, Workers, and KV now serve the Goosebumps.fm sitemap.
tags: [infra, cloudflare, alchemy, sitemap, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+KV+sitemap"]
---

The Cloudflare version stores generated sitemap XML in KV. This job belongs to the [current scheduled work](/gbfm-cloudflare-scheduled-work). Its [AWS predecessor](/gbfm-process-local-sitemap) kept the value inside one Bun process. These snippets come from the current `prod` branch in `alchemy/storage.ts`, `alchemy/api.ts`, and `apps/server/src`.

## The Alchemy resources

Alchemy creates the KV namespace with the other storage resources.

```ts
const mixes = yield* Cloudflare.R2.Bucket('Mixes')
const sitemap = yield* Cloudflare.KV.Namespace('Sitemap')
const reminders = yield* Cloudflare.Queues.Queue('Reminders')

return { db, userContent, mixes, sitemap, reminders }
```

The API Worker receives that namespace as `SITEMAP`. Alchemy also attaches the three Cron Trigger schedules to this Worker.

```ts
crons: [reminderSweepCron, sitemapRegenerationCron, maintenanceSweepCron],
```

```ts
SITEMAP: store.sitemap,
```

## The schedule

The sitemap schedule runs at minute zero each hour. The dispatcher matches Cloudflare's cron string and calls the sitemap job.

```ts
export const reminderSweepCron = '* * * * *'
export const sitemapRegenerationCron = '0 * * * *'
export const maintenanceSweepCron = '17 * * * *'
```

```ts
export const dispatchScheduledJob = (cron: string, jobs: ScheduledJobs): Promise<void> => {
  if (cron === sitemapRegenerationCron) {
    return jobs.regenerateSitemap()
  }
  if (cron === reminderSweepCron) {
    return jobs.sweepReminders()
  }
  if (cron === maintenanceSweepCron) {
    return jobs.runMaintenance()
  }
  return Promise.resolve()
}
```

The Worker supplies the scheduled job with its current bindings.

```ts
scheduled(controller: ScheduledController, env: ApiEnv): Promise<void> {
  return dispatchScheduledJob(controller.cron, {
    regenerateSitemap: () => Effect.runPromise(runSitemapRegeneration(env)),
    sweepReminders: () => Effect.runPromise(runReminderSweep(env)),
    runMaintenance: () => Effect.runPromise(runMaintenanceSweep(env))
  })
},
```

## The KV service

The cache stores one JSON value under `sitemap.xml`. It turns the saved date string back into a `Date` on read.

```ts
const SITEMAP_KEY = 'sitemap.xml'

interface StoredSitemap {
  readonly xml: string
  readonly generatedAt: string
}

export interface SitemapKv {
  get(key: string, type: 'json'): Promise<StoredSitemap | null>
  put(key: string, value: string): Promise<void>
}
```

```ts
export const SitemapCacheLayer = (kv: SitemapKv) =>
  Layer.succeed(SitemapCache, {
    read: Effect.tryPromise(() => kv.get(SITEMAP_KEY, 'json')).pipe(
      Effect.map((stored) =>
        stored
          ? Option.some({ xml: stored.xml, generatedAt: new Date(stored.generatedAt) })
          : Option.none()
      ),
      Effect.catch(() => Effect.succeed(Option.none<SitemapXml>()))
    ),
    write: (sitemap) =>
      Effect.tryPromise({
        try: () =>
          kv.put(
            SITEMAP_KEY,
            JSON.stringify({ xml: sitemap.xml, generatedAt: sitemap.generatedAt.toISOString() })
          ),
        catch: (error) =>
          new SitemapCacheError({
            message: `Failed to write sitemap cache: ${error instanceof Error ? error.message : String(error)}`
          })
      })
  })
```

The sitemap service asks for the cache through Effect. Scheduled regeneration writes the new value. A request reads it and regenerates when KV has no usable value.

```ts
export const regenerateSitemap = Effect.gen(function* () {
  const cache = yield* SitemapCache
  const data = yield* fetchSitemapData
  const config = yield* ConfigService
  const siteUrl = config.urls.frontend.replace(/\/$/, '')
  const vpsUrl = config.urls.vps.replace(/\/$/, '')
  const xml = buildSitemapXml(data, siteUrl, vpsUrl)

  const sitemap = { xml, generatedAt: new Date() }
  yield* cache.write(sitemap)

  yield* Effect.log(
    `✅ Sitemap regenerated with ${data.mixes.length} mixes, ${data.shows.length} shows, ${data.releases.length} releases, ${data.labels.length} labels, ${data.profiles.filter((p) => p.username).length} profiles, ${data.posts.length} posts`
  )

  return sitemap
})
```

```ts
export const getCachedSitemap = Effect.gen(function* () {
  const cache = yield* SitemapCache
  const cached = yield* cache.read
  if (Option.isSome(cached)) {
    return cached.value
  }
  return yield* regenerateSitemap
})
```

## Take aways

- A Worker isolate should receive storage through its invocation environment. `worker.ts` builds `SitemapCacheLayer(env.SITEMAP)` when it composes the application services.
- The cache service keeps Cloudflare types at the Worker boundary. Sitemap generation depends on `SitemapCache`, which also gives tests an in-memory implementation.
- KV read errors become cache misses. The request can rebuild the XML from D1 when KV returns no value or the read fails.
- The cron string acts as the dispatch key. Keeping the same exported value in Alchemy and the Worker dispatcher prevents the provisioned schedule from drifting away from its handler.
