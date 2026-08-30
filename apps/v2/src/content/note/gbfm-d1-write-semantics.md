---
title: "D1 write semantics in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 81
description: How Goosebumps.fm translated PostgreSQL transactions into D1 writes.
tags: [cloudflare, d1, sqlite, transactions, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+D1+write+semantics"]
---

D1 accepts a prepared list of statements through an ordered, atomic `batch()` call. Code makes interactive decisions around that call. The [PostgreSQL companion note](/gbfm-postgres-transactions) shows the earlier code. The serialized navigation transaction moved to [a Durable Object](/gbfm-durable-object-navigation-lock).

Show creation now generates its UUID before the write. Both inserts enter one batch. The result read happens afterwards:

```ts
const id = crypto.randomUUID()
const result = yield* Effect.tryPromise({
  try: async () => {
    await db.batch([
      db.insert(showsTable).values({ ...showData, id }),
      ...(hostIds.length > 0
        ? [
            db
              .insert(showCreators)
              .values(hostIds.map((creatorId) => ({ showId: id, creatorId })))
          ]
        : [])
    ])
    const rows = await db.select().from(showsTable).where(eq(showsTable.id, id)).limit(1)
```

A read-dependent write uses a revision as its guard. Playlist reordering reads the playlist and its tracks, then advances the revision only when the stored value still matches. Every position update checks for the new revision inside SQL:

```ts
const revision = playlist.revision + 1
const [advanced] = await db.batch([
  db
    .update(musicPlaylistsTable)
    .set({ revision, updatedAt: new Date() })
    .where(
      and(
        eq(musicPlaylistsTable.id, playlistId),
        eq(musicPlaylistsTable.revision, playlist.revision)
      )
    )
    .returning({ id: musicPlaylistsTable.id }),
  ...trackIds.map((trackId, position) =>
    db
      .update(musicPlaylistTracksTable)
      .set({ position })
      .where(
        and(
          eq(musicPlaylistTracksTable.playlistId, playlistId),
          eq(musicPlaylistTracksTable.trackId, trackId),
          sql`exists (
            select 1
            from ${musicPlaylistsTable}
            where ${musicPlaylistsTable.id} = ${playlistId}
              and ${musicPlaylistsTable.revision} = ${revision}
          )`
        )
      )
  )
])
if (advanced.length > 0) return
```

The D1 test suite makes batch rollback part of the application contract. Its second insert breaks a unique key, then the count checks that D1 rolled back the first insert:

```ts
await expect(
  d1.batch([
    d1
      .prepare('INSERT INTO labels (id, kind, name) VALUES (?, ?, ?)')
      .bind('batch-atomicity-label', 'tag', 'batch-atomicity'),
    d1
      .prepare('INSERT INTO labels (id, kind, name) VALUES (?, ?, ?)')
      .bind('batch-atomicity-label', 'tag', 'batch-atomicity-duplicate')
  ])
).rejects.toThrow()
```

## Take aways

- Generate IDs before a batch when a later statement needs them.
- Put response reads after the batch. The batch then contains only the writes whose outcome must stay atomic.
- Guard a stale read with a revision or unique key. A zero-row guarded update tells the caller to retry.
- Test D1 through Miniflare. The rollback test proved the runtime behaviour that these services depend on.
- Schema checks belong beside write checks. A wrong uniqueness key replaced 53 valid `music_entity_links` rows during the first production rehearsal.

Source: [`0b375bf8`](https://github.com/guidefari/gbfm/commit/0b375bf831f615d012997129f9a569d6de33e425) translated the schema and transaction sites. [`33a6ff40`](https://github.com/guidefari/gbfm/commit/33a6ff405f7a4ab69179ec90bd7c0e522436e416) records the rollback test and rehearsal findings.
