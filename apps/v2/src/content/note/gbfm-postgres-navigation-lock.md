---
title: "The PostgreSQL navigation lock in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 90
description: How the AWS backend serialized navigation updates with SELECT FOR UPDATE.
tags: [postgresql, concurrency, navigation, aws, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+PostgreSQL+navigation+lock"]
---

Goosebumps.fm keeps a trail and cursor for each signed-in user or anonymous device. Two forward requests from one reader can arrive together. The AWS backend serialized those requests inside a PostgreSQL transaction. The [current companion note](/gbfm-durable-object-navigation-lock) shows the Durable Object that took over this job.

The transaction selected the reader's session with `FOR UPDATE`:

```ts
const locked = yield* Effect.tryPromise({
  try: () =>
    db.transaction(async (tx): Promise<Locked> => {
      const existing = await tx
        .select()
        .from(navigationSessions)
        .where(identityWhere(identity))
        .for('update')
        .limit(1)
      const session = existing[0]
      if (session?.lastIntentToken === intentToken) return { _tag: 'Duplicate', session }
```

The locked section compared the cursor with the state read earlier. A changed cursor caused a retry. For a new session, the transaction inserted one row or selected the row that a concurrent request had created, taking the same lock during that second read:

```ts
const active =
  session ??
  created ??
  (
    await tx
      .select()
      .from(navigationSessions)
      .where(identityWhere(identity))
      .for('update')
      .limit(1)
  )[0]
```

While holding the lock, the service found the last trail position and appended the next entry. It also marked the post as seen before advancing the cursor with the request's intent token.

## Take aways

- The row lock protected a domain rule: one reader receives one next trail position at a time.
- The intent token mapped a repeated request to the earlier result.
- Session creation needed the second locked select when two requests both started before the session row existed.
- D1 rejected `SELECT FOR UPDATE`. This transaction belonged to the audit's mutual-exclusion class. The Durable Object now carries that rule.

Source: [`7628d2f2`](https://github.com/guidefari/gbfm/tree/7628d2f23d85312d9e2bd59f5f1b3a3391a6ee68/apps/vps/src/services) contains the PostgreSQL service. The transaction audit in [`149770f3`](https://github.com/guidefari/gbfm/commit/149770f34ed98aac86887e1697065faeb838ebf9) classified this as its sole mutual-exclusion site.
