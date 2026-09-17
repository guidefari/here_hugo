---
title: "Nested transactions in Effect use savepoints"
date: 2026-09-07T21:17:02+02:00
description: "How composable Effect database helpers share one transaction and isolate optional work with savepoints."
tags: [effect, typescript, sql, transactions]
---

You usually do not write nested transactions on purpose.

They appear when a reusable database helper starts its own transaction, then another transaction calls that helper.

## A helper used on its own

`writeAuditLog` is useful by itself, so it owns a transaction:

```ts
import { Effect } from "effect"
import { SqlClient } from "effect/unstable/sql"

const writeAuditLog = (message: string) =>
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    return yield* sql.withTransaction(
      sql`INSERT INTO audit_log (message) VALUES (${message})`
    )
  })
```

Called by itself, it opens a transaction, writes the audit row, then commits.

## The helper inside another transaction

Now account creation needs the account row and audit row to be part of one larger operation:

```ts
const createAccount = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  return yield* sql.withTransaction(
    Effect.gen(function*() {
      yield* sql`INSERT INTO account (id, balance) VALUES (${"new-account"}, ${0})`
      yield* writeAuditLog("account created")
    })
  )
})
```

The outer call starts the database transaction. When `writeAuditLog` calls `withTransaction`, Effect finds the active transaction instead of opening another connection.

It creates a savepoint around the audit insert. The outer transaction still owns the eventual commit or rollback.

## Handling errors

The simplest choice is to let the helper failure escape:

```ts
const createAccount = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  return yield* sql.withTransaction(
    Effect.gen(function*() {
      yield* sql`INSERT INTO account (id, balance) VALUES (${"new-account"}, ${0})`
      yield* writeAuditLog("account created")
      yield* sql`INSERT INTO welcome_email (account_id) VALUES (${"new-account"})`
    })
  )
})
```

If the audit insert fails, Effect first rolls back to the savepoint. The failure then leaves `writeAuditLog`.

Because `createAccount` does not handle that failure, its outer transaction rolls back too. The account row is not committed.

## Handle an optional inner operation

Sometimes audit logging is optional. Catch the helper failure inside the outer transaction:

```ts
import { Either, Effect } from "effect"

const createAccount = Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  return yield* sql.withTransaction(
    Effect.gen(function*() {
      yield* sql`INSERT INTO account (id, balance) VALUES (${"new-account"}, ${0})`

      const auditResult = yield* writeAuditLog("account created").pipe(Effect.either)

      if (Either.isLeft(auditResult)) {
        yield* sql`INSERT INTO audit_failures (account_id) VALUES (${"new-account"})`
      }

      yield* sql`INSERT INTO welcome_email (account_id) VALUES (${"new-account"})`
    })
  )
})
```

The failed audit insert rolls back to its savepoint. `Effect.either` turns the failure into a value that this code can inspect.

The outer transaction then keeps going. If it succeeds, it commits the account row and welcome-email row, but not the failed audit row.

## The practical rule

Use `withTransaction` at the boundary of an operation that must succeed or fail together.

This works when a helper needs to run by itself or as part of a larger operation. Nested calls are not independent transactions. They share one connection, and the outermost transaction makes the final commit decision.

## References

- [Effect v4 RC.112 `SqlClient` source](https://github.com/Effect-TS/effect/blob/2600f62f4532026928454dcea8d1c48557b3f942/packages/effect/src/unstable/sql/SqlClient.ts)
- [Effect v4 `SqlClient` API](https://effect.website/docs/v4/api/effect/unstable/sql/SqlClient)
