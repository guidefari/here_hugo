---
title: "The module-scope database in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 130
description: How the Bun backend built one PostgreSQL pool at import time, and what that hid from Effect.
tags: [effect, postgres, bun, cloudflare, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+module-scope+database"]
---

The Bun backend created its PostgreSQL pool while loading [`db/index.ts`](https://github.com/guidefari/gbfm/blob/6af5d77368c7fe6fd4e4bc72e2d0ec3ab2078011/apps/vps/src/db/index.ts). The [current Worker database note](/gbfm-worker-database-layer) shows where that work happens now.

```ts
const dbConfig = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  ssl: sslConfig,
  min: 1,
  idleTimeoutMillis: 10 * 60 * 1000
}

console.log(
  `[DB] Connecting stage=${config.app.dbStage || 'prod'} host=${dbConfig.host} db=${dbConfig.database}`
)

const pool = instrumentDatabaseClient(new Pool(dbConfig))
pool.on('connect', (client) => instrumentDatabaseClient(client))

export { pool }
export const db = drizzle(pool, { schema })
```

Here, `db` named the process-wide Drizzle client. The later Worker refactor introduced an Effect service named `Database`. Any file that imported the old `db` shared that client. The old [`health.handlers.ts`](https://github.com/guidefari/gbfm/blob/6af5d77368c7fe6fd4e4bc72e2d0ec3ab2078011/apps/vps/src/http/health.handlers.ts) reached it from module scope:

```ts
import { db } from '@/db'

export const checkDatabase = Effect.tryPromise({
  try: () => db.execute(sql.raw('SELECT 1')),
  catch: (cause) => cause
}).pipe(
  Effect.tapError((cause) => Effect.logError('[health] readiness check failed', cause)),
  Effect.mapError(() => new ReadinessCheckFailedError({ dbConnected: false })),
  Effect.asVoid
)
```

The early [`DatabaseService`](https://github.com/guidefari/gbfm/blob/6af5d77368c7fe6fd4e4bc72e2d0ec3ab2078011/apps/vps/src/services/database.service.ts) wrapped the imported client:

```ts
import { Context, Layer } from 'effect'
import { db } from '@/db'

export interface DatabaseService {
  readonly db: typeof db
}

export const DatabaseService = Context.Service<DatabaseService>('DatabaseService')

export const DatabaseServiceLayer = Layer.succeed(DatabaseService, { db })
```

The import chose and built the database before `Layer.succeed` wrapped it. Other code could import `db` itself. Its Effect type then carried no `Database` requirement in the `R` channel.

## Take aways

- Cloudflare makes `env.DB` available when an event runs, which puts database setup at the Worker entry point.
- A module import made the runtime choice too early.
- The `R` channel can expose a database need only when code asks Effect for the service.
- A composition seam lets tests pass another D1 binding without changing service code.
