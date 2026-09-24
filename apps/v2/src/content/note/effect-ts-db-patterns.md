---
title: "Effect-TS DB Patterns"
date: 2026-09-02T00:00:00+02:00
description: Survey of how DB access is structured across my Effect-TS apps
tags: [note, effect, typescript, database]
images: ["https://og.guidefari.com/og-image?title=Effect-TS%20DB%20Patterns"]
---

I looked at DB access across my Effect-TS apps . These are my notes for future projects.

## Service shape

Every repo defines its SQL-backed service as a `Context.Tag` (or
`Context.Service`) contract, with a separate `Layer.effect` implementation.
Tag names are namespaced strings.

```ts
// Services/FiscalPeriodRepository.ts
export interface FiscalPeriodRepositoryService {
  readonly findFiscalYearById: (
    companyId: CompanyId,
    id: FiscalYearId
  ) => Effect.Effect<Option.Option<FiscalYear>, PersistenceError>
  // ...
}

export class FiscalPeriodRepository extends Context.Tag("FiscalPeriodRepository")<
  FiscalPeriodRepository,
  FiscalPeriodRepositoryService
>() {}
```

```ts
// Layers/FiscalPeriodRepositoryLive.ts
export const FiscalPeriodRepositoryLive = Layer.effect(FiscalPeriodRepository, make)
```

Larger/CQRS-style apps ([t3code](https://github.com/pingdotgg/t3code), [accountability](https://github.com/mikearnaldi/accountability)) split the contract
(`Services/`) from the implementation (`Layers/`) into separate folders.
Smaller apps (leave-tracker) just colocate contract + impl in one file.

## Query style

Most use raw tagged-template SQL via `SqlClient.SqlClient`.
[`opencode`](https://github.com/anomalyco/opencode) wraps Drizzle, with a custom bridge package that keeps the same
`Context.Service` shape for the rest of the app.

[`accountability`](https://github.com/mikearnaldi/accountability) and [`t3code`](https://github.com/pingdotgg/t3code) layer `@effect/sql`'s `SqlSchema.findOne` /
`SqlSchema.findAll` on top of raw SQL for schema-validated reads:

```ts
const findFiscalYearByIdQuery = SqlSchema.findOne({
  Request: FindFiscalYearByIdRequest,
  Result: FiscalYearRow,
  execute: ({ companyId, id }) => sql`
    SELECT * FROM fiscal_years
    WHERE id = ${id} AND company_id = ${companyId}
  `
})
```

Each `*Live.ts` file keeps its `Schema.Struct` row shape and a small `rowToX`
mapper that decodes rows into domain entities.

## Errors

Most repos use `Schema.TaggedError` (or `Schema.TaggedErrorClass`), named
`<Operation/Entity><Kind>Error`. In HTTP-facing apps ([accountability](https://github.com/mikearnaldi/accountability),
[videoshare](https://github.com/planetaryescape/videoshare)) errors carry their HTTP status right on the class:

```ts
export class EntityNotFoundError extends Schema.TaggedError<EntityNotFoundError>()(
  "EntityNotFoundError",
  { entityType: Schema.String, entityId: Schema.String },
  HttpApiSchema.annotations({ status: 404 })
) {}

export class PersistenceError extends Schema.TaggedError<PersistenceError>()(
  "PersistenceError",
  { operation: Schema.String, cause: Schema.Defect },
  HttpApiSchema.annotations({ status: 500 })
) {}
```

Simpler apps (leave-tracker) use plain `Data.TaggedError` instead.

Each repository wraps its SQL calls with a curried
`wrap(operation)` / `wrapSqlError(operation)` helper that passes known tagged
errors through unchanged and re-tags anything else (defects aside) as a
generic `PersistenceError`:

```ts
const findFiscalYearById = (companyId, id) =>
  findFiscalYearByIdQuery({ companyId, id }).pipe(
    Effect.map(Option.map(rowToFiscalYear)),
    wrapSqlError("findFiscalYearById")
  )
```

## Client/connection layer

Connection config uses `Config`, with `Config.redacted` for secrets and defaults:

```ts
// Layers/PgClientLive.ts
export const PgClientConfig = Config.all({
  url: Config.redacted("DATABASE_URL").pipe(Config.orElse(() => /* PGHOST/PGPORT/... */)),
  maxConnections: Config.integer("PG_MAX_CONNECTIONS").pipe(Config.withDefault(10)),
  idleTimeout: Config.duration("PG_IDLE_TIMEOUT").pipe(Config.withDefault("60 seconds")),
  connectTimeout: Config.duration("PG_CONNECTION_TIMEOUT").pipe(Config.withDefault("10 seconds"))
})

export const PgClientLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* PgClientConfig
    return PgClient.layer(config)
  })
)
```

## Migrations vary by repo

I found several approaches:

- **leave-tracker**: raw `.sql` files, applied via Alchemy's
  `Cloudflare.D1.Database('Database', { migrations: './migrations' })`.
- **[t3code](https://github.com/pingdotgg/t3code)**: `@effect/sql`'s `Migrator.make`/`fromRecord`, fed by
  ~30 numbered, statically imported migration files.
- **[accountability](https://github.com/mikearnaldi/accountability)**: numbered TS files (`Migration0001_CreateOrganizations.ts`
  … `Migration0026_...ts`), each a default-exported `Effect.gen` that runs
  raw DDL directly against `SqlClient.SqlClient`:

  ```ts
  // Migrations/Migration0004_CreateFiscalPeriods.ts
  export default Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient
    yield* sql`CREATE TYPE fiscal_year_status AS ENUM ('Open', 'Closing', 'Closed')`
    yield* sql`CREATE TABLE fiscal_years ( ... )`
    yield* sql`CREATE INDEX idx_fiscal_years_company_id ON fiscal_years (company_id)`
  })
  ```

- **[opencode](https://github.com/anomalyco/opencode)**: a custom migration runner with its own tracking table and
  a `Semaphore.make(1)` lock. Timestamp-prefixed TS migration files
  exporting `{ id, up(tx) }`.
- **[videoshare](https://github.com/planetaryescape/videoshare) / videoshare-refactor-admin**: idempotent, introspection-driven
  (`PRAGMA table_info`, `sqlite_master` checks) rather than a version-tracked
  list at all.

For a new project that needs migrations, I would start with [t3code](https://github.com/pingdotgg/t3code)'s
`Migrator.make` approach. It uses Effect's migration tooling, and I have no
reason here to prefer the custom runners.
