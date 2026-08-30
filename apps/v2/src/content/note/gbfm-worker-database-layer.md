---
title: "The Worker database layer in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 131
description: How the Cloudflare Worker turns env.DB into a request-scoped Effect Database service.
tags: [effect, d1, cloudflare, alchemy, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Worker+database+layer"]
---

The Cloudflare Worker receives D1 as a binding. The [PostgreSQL note](/gbfm-module-scope-database) records the module-scope pool that came before it.

[`worker.ts`](https://github.com/guidefari/gbfm/blob/8dc181a4673601558e4c1e18ea7fc52cfc4dfe23/apps/server/src/worker.ts) owns the Cloudflare types and names the database binding:

```ts
export type ApiEnv = WorkerConfigBindings & {
  readonly DB: D1Database
  readonly USER_CONTENT: R2Bucket
  readonly MIXES: R2Bucket
  readonly SITEMAP: KVNamespace
  readonly REMINDERS: Queue<ReminderJob>
  readonly EMAIL?: SendEmail
  readonly EMAIL_TRANSPORT_MODE?: 'cloudflare' | 'recording'
  readonly NAVIGATION_LOCK: DurableObjectNamespace<NavigationLockDurableObject>
  readonly SPOTIFY_IMPORT_RESOLVER: DurableObjectNamespace<SpotifyImportResolverDurableObject>
  readonly SENTRY_DSN?: string
  readonly SENTRY_ENVIRONMENT?: string
}
```

[`db/layer.ts`](https://github.com/guidefari/gbfm/blob/8dc181a4673601558e4c1e18ea7fc52cfc4dfe23/apps/server/src/db/layer.ts) turns that binding into a Drizzle client and publishes it as an Effect service:

```ts
export type DatabaseClient = DrizzleD1Database<typeof schema>

export class Database extends Context.Service<Database, DatabaseClient>()('Database') {}

export const DatabaseLayer = (database: D1Database) =>
  Layer.sync(Database, () => drizzle(database, { schema }))
```

The Worker passes its binding into `AppLayer`:

```ts
return AppLayer({
  database: DatabaseLayer(env.DB),
  sitemapCache: SitemapCacheLayer(env.SITEMAP),
  navigationLock: navigationLockLive(env),
  spotifyImportResolver: spotifyImportResolverLive(env),
  sentry: workerSentryServiceLive(env),
  tracing: WorkerTracingLive,
  config: configLive,
  objectStore: objectStoreLive,
  emailTransport:
    env.EMAIL !== undefined
      ? CloudflareEmailTransportLayer(env.EMAIL)
      : env.EMAIL_TRANSPORT_MODE === 'recording'
        ? RecordingEmailTransportLayer
        : UnconfiguredEmailTransportLayer
})
```

Each request builds that app layer from its own `env`, then disposes the handler:

```ts
const webHandler = createWebHandler({ appServicesLive: appServicesLive(env) })
try {
  return await webHandler.handler(request)
} finally {
  await webHandler.dispose()
}
```

Service effects read `Database` when they need it. [`bluesky-account.service.ts`](https://github.com/guidefari/gbfm/blob/8dc181a4673601558e4c1e18ea7fc52cfc4dfe23/apps/server/src/services/bluesky-account.service.ts) shows the pattern:

```ts
const listEffect = (userId: string) =>
  Effect.gen(function* () {
    const db = yield* Database
    return yield* Effect.tryPromise({
      try: async () => {
        const rows = await db
          .select({ account: externalAccounts, scheduled: blueskySyncStates.scheduled })
          .from(externalAccounts)
          .leftJoin(blueskySyncStates, eq(blueskySyncStates.externalAccountId, externalAccounts.id))
          .where(eq(externalAccounts.userId, userId))
          .orderBy(externalAccounts.createdAt)
        return rows.map(({ account, scheduled }) => ({ ...account, scheduled: scheduled ?? false }))
      },
      catch: () => databaseError('list')
    })
  })
```

## Take aways

- Effect records `Database` in the `R` channel until a layer supplies it.
- Service modules stay free of Cloudflare binding types because `worker.ts` owns `env`.
- `AppLayer` gives the app one composition seam for the live D1 binding and the migrated Miniflare binding used by HTTP tests.
- Scheduled handlers and Queue consumers also call `appServicesLive(env)`, so each Cloudflare event supplies its runtime input at the entry point.
