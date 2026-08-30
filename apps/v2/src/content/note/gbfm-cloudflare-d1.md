---
title: "Cloudflare D1 in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 21
description: How Alchemy, Workers, Effect, and Drizzle connect Goosebumps.fm to D1.
tags: [infra, cloudflare, d1, alchemy, drizzle, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Cloudflare+D1"]
---

Goosebumps.fm now stores its relational data in Cloudflare D1. The [PlanetScale Postgres note](/gbfm-planetscale-postgres) records the source system.

## Provisioning and access

[Alchemy creates the database](https://github.com/guidefari/gbfm/blob/prod/alchemy/storage.ts) and applies the Worker migrations:

```ts
const db = yield* Cloudflare.D1.Database('Database', {
  ...(productionD1DatabaseName ? { name: productionD1DatabaseName } : undefined),
  ...(config.isLocalDev ? undefined : { migrationsDir: './apps/server/drizzle-d1' })
}).pipe(adopt(config.isLocalDev), Alchemy.remote(config.isLocalDev))
```

Cloudflare passes that database to the Worker as `env.DB`. The Worker provides it to the application through an Effect Layer:

```ts
return AppLayer({
  database: DatabaseLayer(env.DB),
  sitemapCache: SitemapCacheLayer(env.SITEMAP),
```

[The database adapter](https://github.com/guidefari/gbfm/blob/prod/apps/server/src/db/layer.ts) builds the Drizzle client:

```ts
export class Database extends Context.Service<Database, DatabaseClient>()('Database') {}

export const DatabaseLayer = (database: D1Database) =>
  Layer.sync(Database, () => drizzle(database, { schema }))
```

Services ask Effect for `Database`. Cloudflare types stay at the Worker and adapter boundary. [The database Layer note](/gbfm-worker-database-layer) traces that composition seam.

## SQLite shapes

Drizzle's SQLite schema maps the API values to SQLite storage forms:

```ts
id: text('id')
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
userId: text('user_id')
  .notNull()
  .references(() => user.id, { onDelete: 'cascade' }),
musicTitle: text('music_title').notNull(),
artistName: text('artist_name').notNull(),
musicUrl: text('music_url').notNull(),
albumCoverUrl: text('album_cover_url'),
reminderDate: integer('reminder_date', { mode: 'timestamp_ms' }).notNull(),
notes: text('notes'),
status: text('status', { enum: reminderStatusEnum }).default(REMINDER_STATUS.PENDING).notNull(),
isSent: integer('is_sent', { mode: 'boolean' }).default(false).notNull(),
```

Better Auth now receives the same request-scoped Drizzle client with its SQLite adapter:

```ts
database: drizzleAdapter(database, { provider: 'sqlite', schema: authSchema }),
```

## Schema and data migrations

Alchemy applies the SQL files in `apps/server/drizzle-d1` when it deploys the database:

```ts
const db = yield* Cloudflare.D1.Database('Database', {
  ...(productionD1DatabaseName ? { name: productionD1DatabaseName } : undefined),
  ...(config.isLocalDev ? undefined : { migrationsDir: './apps/server/drizzle-d1' })
})
```

Those files own the D1 schema. Cloudflare records each deployed file in `d1_migrations`.

A separate script moved the data from PostgreSQL. It read each source table, changed PostgreSQL values into SQLite values, then imported tables in foreign-key order. Nine array columns became rows in `labels` and `entity_labels`. The script batched inserts to stay within D1's parameter limits and used `INSERT OR REPLACE` so a rehearsal could run again against the same target.

The importer kept its own ledger for local and deployed targets. On a deployed database, it copied the migration names from Cloudflare's ledger before applying any missing file:

```ts
const deployed = await database
  .prepare('select name from d1_migrations')
  .bind()
  .all<{ name: string }>()

const names = deployed.results.map((row) => row.name)
```

That baseline prevented the importer from replaying schema changes that Alchemy had already applied. An earlier run replayed the email receipt migration and failed on an existing `provider` column.

The verification script compared row counts and checksums across all 41 tables. It also checked foreign keys and the translated forms of UUIDs, timestamps, booleans, JSON, and arrays. The staging rehearsal found the wrong uniqueness key that had replaced 53 valid rows, then caught an import order that broke foreign keys. [The PostgreSQL migration section](/gbfm-planetscale-postgres#schema-migrations) records the ledger problem that informed this setup.

## Take aways

- Cloudflare gives each Worker invocation a D1 binding. Moving `Database` into Effect's requirement channel made that lifetime visible throughout the service layer.
- Schema translation needed data checks. The migration compared row counts and content checksums for all 41 tables, checked foreign keys, and tested UUIDs, timestamps, booleans, JSON, and array fan-out.
- A proposed uniqueness key collapsed 53 valid `music_entity_links` rows during rehearsal. Production data exposed the wrong assumption, so the final schema kept the source identity key.
- SQLite dump order caused a foreign-key failure. The importer now emits tables in dependency order.
- D1 batches cover ordered atomic statements. Guarded writes handle read-then-write races. A Durable Object serializes the navigation operation that once used a PostgreSQL row lock. [The D1 write note](/gbfm-d1-write-semantics) carries the per-transaction details.
- A Time Travel drill captured a bookmark, inserted a marker, restored the bookmark, and found no foreign-key violations after restore.

The [Cloudflare Worker runtime note](/gbfm-cloudflare-worker-runtime) shows where `env.DB` enters the application.
