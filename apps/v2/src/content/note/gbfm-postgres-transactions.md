---
title: "PostgreSQL transactions in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 80
description: How the AWS version of Goosebumps.fm used interactive PostgreSQL transactions.
tags: [postgresql, transactions, aws, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+PostgreSQL+transactions"]
---

The AWS version of Goosebumps.fm ran 24 `db.transaction()` call sites. The [D1 companion note](/gbfm-d1-write-semantics) follows their current forms. [The navigation lock note](/gbfm-postgres-navigation-lock) covers the transaction that used a row lock.

The transaction audit found 18 ordered write sequences. Show creation needed the inserted show ID before it could add host links:

```ts
db.transaction(async (tx) => {
  const [newShow] = await tx.insert(showsTable).values(data).returning()

  if (!newShow) {
    throw new Error('Failed to create show')
  }

  if (hostIds.length > 0) {
    await tx.insert(showCreators).values(
      hostIds.map((creatorId) => ({
        showId: newShow.id,
        creatorId
      }))
    )
  }

  return newShow
}),
```

Five transactions read state that chose the following writes. Playlist reordering read the current track set inside the transaction, checked the submitted IDs, then wrote each position:

```ts
db.transaction(async (tx) => {
  const existing = await tx
    .select({ trackId: musicPlaylistTracksTable.trackId })
    .from(musicPlaylistTracksTable)
    .where(eq(musicPlaylistTracksTable.playlistId, playlistId))

  const existingSet = new Set(existing.map((r) => r.trackId))
  const incomingSet = new Set(trackIds)

  if (
    existingSet.size !== incomingSet.size ||
    [...existingSet].some((id) => !incomingSet.has(id))
  ) {
    throw new DatabaseError({
      message: 'Reorder track set must match current playlist tracks exactly',
      operation: 'update',
      table: 'music_playlist_tracks'
    })
  }
```

The audit named each behaviour before any rewrite. D1 batches accepted ordered writes once the application generated IDs up front. Read-dependent paths became simpler reads followed by a guarded batch. Navigation required mutual exclusion for each reader. Response reads moved after atomic writes.

## Take aways

- Repository-wide counts need a fixed path. The first search included worktree copies and reported 41 sites. A search limited to `apps/vps/src` found 24.
- Transaction syntax hid several kinds of work. The useful question was which state each write had to protect.
- PostgreSQL could return a generated ID halfway through a transaction. Client-generated UUIDs let D1 prepare the full batch before sending it.
- A read that shapes later writes needs a durable guard. The guard keeps the read valid after code moves it outside the atomic section.

Source: [`7628d2f2`](https://github.com/guidefari/gbfm/tree/7628d2f23d85312d9e2bd59f5f1b3a3391a6ee68) contains the PostgreSQL code. [`149770f3`](https://github.com/guidefari/gbfm/commit/149770f34ed98aac86887e1697065faeb838ebf9) records the 24-site audit.
