---
title: "Scoped transactions in Effect"
date: 2026-09-07T21:17:02+02:00
description: How Effect keeps a SQL transaction interruptible without leaving its connection or transaction state unfinished
tags: [effect, typescript, sql, transactions, concurrency]
images: ["https://og.guidefari.com/og-image?title=Scoped%20transactions%20in%20Effect"]
---

A scoped transaction ties a database transaction to a resource lifetime. Effect can interrupt the work inside the transaction while still ensuring that it commits or rolls back and releases its connection.

[Effect v4 RC.112 release](https://github.com/Effect-TS/effect/releases/tag/effect%404.0.0-rc.112)

```ts
import { SqlClient } from "effect/unstable/sql"

const result = sql.withTransaction(effect)
```

There is no public `transactionScoped` or `withTransactionScoped` function. "Scoped transaction" describes how `withTransaction` manages the transaction and its connection.

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

`Effect.scoped` releases the reserved connection when the scope closes. It does not add the missing transaction rule: commit on success, rollback on every other exit.

If the [fiber](/bliki/effect-fibers/) is interrupted during the sleep or second update, this program skips `COMMIT`. It also has no exit-sensitive rollback finalizer.

## Let `withTransaction` manage the transaction

The safer version gives the transaction protocol to `SqlClient`:

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

At the top transaction level, `withTransaction`:

1. creates a private `Scope`;
2. reserves one connection in that scope;
3. runs `BEGIN`;
4. makes that connection available to queries in the transaction body;
5. runs the body and captures its full `Exit`;
6. runs `COMMIT` on success or `ROLLBACK` on failure, defect, or interruption;
7. closes the scope and releases the connection.

## Interruptible work, uninterruptible cleanup

The key is not to make the whole transaction uninterruptible.

`withTransaction` protects setup and cleanup from interruption while keeping the transaction body interruptible.

This gives the useful split:

- the body can respond to cancellation, shutdown, or a timeout;
- once it stops, commit or rollback and connection cleanup cannot be interrupted halfway through.

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

The same problem applies to a slow query or network call. `withTransaction` instead protects only the work needed to leave the database connection in a finished state.

Nested `withTransaction` calls use savepoints rather than independent transactions. [See when that happens and how failure behaves](/note/effect-nested-transactions/).

## What interruption cannot promise

[Fiber](/bliki/effect-fibers/) interruption is not proof that a database command never ran.

The PostgreSQL RC driver makes a best-effort cancellation request for a running query with `pg_cancel_backend`. That request can race with the query finishing, and cancellation itself can fail. Other drivers may behave differently.

Cancelling the application does not guarantee that the database stopped the query. The transaction is the safety boundary: until `COMMIT`, its writes are not permanent.

When the body is interrupted, `withTransaction` sends `ROLLBACK` before it releases the connection. That discards every write made in the transaction, even if the database finished a query after cancellation was requested.

It cannot undo a transaction that already committed. There is also an uncertain edge near commit: once the body succeeds and the masked commit path begins, a pending interrupt does not change that chosen commit into a rollback. If a caller may retry after losing the response, use an idempotency key or a database uniqueness rule.

## The rule of thumb

Use `SqlClient.withTransaction` as the transaction boundary. Keep remote calls and long waits outside it where possible.

A scope handles the connection lifetime. `withTransaction` adds the database rule that the scope alone lacks: every exit ends in commit or rollback before the connection is released.

The API is still prerelease and lives under `effect/unstable/sql`, so check it again when moving beyond `4.0.0-rc.112`.

## Sources

- [Effect v4 RC.112 `SqlClient` source](https://github.com/Effect-TS/effect/blob/2600f62f4532026928454dcea8d1c48557b3f942/packages/effect/src/unstable/sql/SqlClient.ts)
- [Effect v4 `SqlClient` API](https://effect.website/docs/v4/api/effect/unstable/sql/SqlClient)
- [Effect v4 `uninterruptibleMask` API](https://effect.website/docs/v4/api/effect/Effect#uninterruptibleMask)
- [Effect resource scope guide](https://effect.website/docs/resource-management/scope/)
- [Effect PostgreSQL RC.112 client source](https://github.com/Effect-TS/effect/blob/2600f62f4532026928454dcea8d1c48557b3f942/packages/sql/pg/src/PgClient.ts)
- [npm release tags for `effect`](https://registry.npmjs.org/-/package/effect/dist-tags)
