---
title: "PlanetScale Postgres in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 20
description: How the Bun backend connected to PlanetScale Postgres before the D1 migration.
tags: [infra, planetscale, postgres, drizzle, bun, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+PlanetScale+Postgres"]
---

The AWS-era backend stored its relational data in PlanetScale Postgres. PlanetScale sat outside the SST stack. The [D1 note](/gbfm-cloudflare-d1) shows the current database.

## The connection

The Bun process created a `pg` pool when it imported the database module. [The old module](https://github.com/guidefari/gbfm/blob/6af5d77368c7fe6fd4e4bc72e2d0ec3ab2078011/apps/vps/src/db/index.ts) exported one Drizzle client for the whole process:

```ts
const pool = instrumentDatabaseClient(new Pool(dbConfig))
pool.on('connect', (client) => instrumentDatabaseClient(client))

export { pool }
export const db = drizzle(pool, { schema })
```

Services imported `db` from that module. [A narrower note](/gbfm-module-scope-database) follows the effect of that import through the code. Better Auth used the PostgreSQL adapter:

```ts
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema
  }),
```

## The schema

Drizzle's PostgreSQL schema types matched features the app used. The reminder table shows UUID defaults, a PostgreSQL enum, timestamps, and a boolean:

```ts
export const musicReminder = pgTable(
  'music_reminder',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    musicTitle: text('music_title').notNull(),
    artistName: text('artist_name').notNull(),
    musicUrl: text('music_url').notNull(),
    albumCoverUrl: text('album_cover_url'),
    reminderDate: timestamp('reminder_date').notNull(),
    notes: text('notes'),
    status: reminderStatusEnum('status').default(REMINDER_STATUS.PENDING).notNull(),
    isSent: boolean('is_sent').default(false).notNull(),
```

Other tables also used arrays, JSONB, partial indexes, and GIN indexes. Interactive transactions let code read and write through one callback. [The transaction note](/gbfm-postgres-transactions) shows representative code.

## Schema migrations

Drizzle Kit read the PostgreSQL schemas and wrote migration files under `apps/vps/drizzle`:

```ts
export default defineConfig({
  out: './drizzle',
  schema: './src/db/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
  }
})
```

For much of the Postgres period, `drizzle-kit push` changed the production schema. The repository also collected generated SQL files. Production already had the tables and types. Its migration ledger lacked matching entries.

The first migration run treated that database as fresh and tried to create types that already existed. I baselined the ledger with Drizzle's migration hashes before applying later files. Production changes then ran through reviewed SQL migrations.

That history shaped the D1 move. New databases needed a complete baseline. Deployed databases needed a ledger that matched their schema. [The D1 migration section](/gbfm-cloudflare-d1#schema-and-data-migrations) covers the separate schema and data paths used during cutover.

## Take aways

- A module-level pool fit a long-running Bun process. That import hid the database requirement from service signatures and tied startup to process-wide configuration.
- The production schema came from `drizzle-kit push` for a long time. The first migration run found an empty ledger and tried to create types that already existed. I baselined the ledger with Drizzle's own migration hashes, then moved production changes to reviewed SQL files.
- PlanetScale took over database backups before the Cloudflare cutover, which let me remove the old ECS backup task.
- PostgreSQL supplied UUID generation, array queries, timestamp behaviour, index types, transaction locks, and result ordering. Each feature needed an explicit D1 decision.

The [migration design](https://github.com/guidefari/gbfm/blob/prod/docs/migrations/postgres-to-d1.md) records the transaction classification and the Effect service refactor.
