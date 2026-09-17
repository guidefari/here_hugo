---
title: "Scoped transactions in Effect"
date: 2026-09-07T21:17:02+02:00
description: How Effect keeps a SQL transaction interruptible without leaving its connection or transaction state unfinished
tags: [effect, typescript, sql, transactions, concurrency]
images: ["https://og.guidefari.com/og-image?title=Scoped%20transactions%20in%20Effect"]
---

A scoped transaction keeps a database transaction tied to the lifetime of its connection. Effect can interrupt the work inside the transaction while still ensuring that it commits or rolls back and releases the connection.

[Effect v4 RC.112 release](https://github.com/Effect-TS/effect/releases/tag/effect%404.0.0-rc.112)

```ts
import { SqlClient } from "effect/unstable/sql"

const result = sql.withTransaction(effect)
```

There is no public `transactionScoped` or `withTransactionScoped` function. "Scoped transaction" describes how `withTransaction` manages the transaction and connection.

## The problem with a manual transaction

This looks reasonable, but interruption can stop it before `COMMIT`:

```ts
import { Effect } from "effect"
import { SqlClient } from "effect/unstable/sql"

const transfer = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient
  const connection = yield* sql.reserve

  yield* connection.executeUnprepared("BEGIN", [], undefined)
  yield* connection.executeUnprepared(
    "UPDATE account SET balance = balance - $1 WHERE id = $2",
    [100, "source"],
    undefined
  )
  yield* Effect.sleep("5 seconds")
  yield* connection.executeUnprepared(
    "UPDATE account SET balance = balance + $1 WHERE id = $2",
    [100, "destination"],
    undefined
  )
  yield* connection.executeUnprepared("COMMIT", [], undefined)
}).pipe(Effect.scoped)
```

`Effect.scoped` releases the reserved connection when the scope closes. It does not add the missing transaction rule: commit on success and roll back on every other exit.

If the [fiber](/bliki/effect-fibers/) is interrupted during the sleep or second update, this program skips `COMMIT`. It also has no rollback cleanup that checks how the effect ended.

## Let `withTransaction` manage the transaction

The safer version lets `SqlClient` handle the transaction steps:

```ts
import { Effect } from "effect"
import { SqlClient } from "effect/unstable/sql"

const transfer = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  yield* sql`
    UPDATE account
    SET balance = balance - ${100}
    WHERE id = ${"source"}
  `
  yield* Effect.sleep("5 seconds")
  yield* sql`
    UPDATE account
    SET balance = balance + ${100}
    WHERE id = ${"destination"}
  `
})

const interruptionSafeTransfer = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient
  return yield* sql.withTransaction(transfer)
})
```

For a top-level transaction, `withTransaction`:

1. creates a private `Scope`;
2. reserves one connection in that scope;
3. runs `BEGIN`;
4. makes that connection available to queries in the transaction body;
5. runs the body and records its full `Exit`;
6. runs `COMMIT` on success or `ROLLBACK` on failure, defect, or interruption;
7. closes the scope and releases the connection.

## Interruptible work, uninterruptible cleanup

Do not make the whole transaction uninterruptible.

`withTransaction` protects setup and cleanup from interruption while leaving the transaction body interruptible.

That means:

- the body can respond to cancellation, shutdown, or a timeout;
- once it stops, commit or rollback and connection cleanup cannot be interrupted halfway through;

For example:

```ts
const timedTransfer = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  return yield* sql.withTransaction(
    Effect.gen(function*() {
      yield* sql`UPDATE account SET balance = balance - ${100} WHERE id = ${"source"}`
      yield* Effect.sleep("5 seconds")
      yield* sql`UPDATE account SET balance = balance + ${100} WHERE id = ${"destination"}`
    })
  )
}).pipe(
  Effect.timeout("100 millis")
)
```

The timeout interrupts the five-second pause. `withTransaction` rolls back the first update before it releases the connection. No custom `catchAll` rollback branch is needed.

The tempting but wrong version puts `Effect.uninterruptible` around the whole body:

```ts
const transfer = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  yield* sql`UPDATE account SET balance = balance - ${100} WHERE id = ${"source"}`
  yield* Effect.sleep("5 seconds")
  yield* sql`UPDATE account SET balance = balance + ${100} WHERE id = ${"destination"}`
})

const badTimedTransfer = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  return yield* sql.withTransaction(
    Effect.uninterruptible(transfer)
  )
}).pipe(
  Effect.timeout("100 millis")
)
```

After 100 milliseconds, the timeout asks Effect to interrupt `badTimedTransfer`. The uninterruptible body ignores that request, waits five seconds, and runs the second update. Only then can the pending interruption take effect and let `withTransaction` roll back. The caller waited five seconds for a timeout set to 100 milliseconds.

The same problem applies to a slow query or network call. `withTransaction` protects only the work needed to finish the database transaction and release the connection.

Nested `withTransaction` calls use savepoints rather than independent transactions. [See when that happens and how failure behaves](/note/effect-nested-transactions/).

## The rule of thumb

Use `SqlClient.withTransaction` as the transaction boundary. Keep remote calls and long waits outside it where possible.

A scope handles the connection lifetime. `withTransaction` adds the rule that the scope alone lacks: every exit commits or rolls back before the connection is released.

The API is still prerelease and lives under `effect/unstable/sql`, so check it again when moving beyond `4.0.0-rc.112`.

## Sources

- [Effect v4 RC.112 `SqlClient` source](https://github.com/Effect-TS/effect/blob/2600f62f4532026928454dcea8d1c48557b3f942/packages/effect/src/unstable/sql/SqlClient.ts)
- [Effect v4 `SqlClient` API](https://effect.website/docs/v4/api/effect/unstable/sql/SqlClient)
- [Effect v4 `uninterruptibleMask` API](https://effect.website/docs/v4/api/effect/Effect#uninterruptibleMask)
- [Effect resource scope guide](https://effect.website/docs/resource-management/scope/)
- [Effect PostgreSQL RC.112 client source](https://github.com/Effect-TS/effect/blob/2600f62f4532026928454dcea8d1c48557b3f942/packages/sql/pg/src/PgClient.ts)
- [npm release tags for `effect`](https://registry.npmjs.org/-/package/effect/dist-tags)
