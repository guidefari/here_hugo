---
title: "The Durable Object navigation lock in Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 91
description: How Goosebumps.fm serializes each reader's navigation updates on Cloudflare.
tags: [cloudflare, durable-objects, concurrency, navigation, alchemy, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Durable+Object+navigation+lock"]
---

Alchemy binds a `NavigationLockDurableObject` to the API Worker. It replaces the [PostgreSQL row lock](/gbfm-postgres-navigation-lock) that serialized updates for each reader.

```ts
NAVIGATION_LOCK: Cloudflare.DurableObject<NavigationLockDurableObject>('NavigationLock', {
  className: 'NavigationLockDurableObject'
}),
```

The Worker derives one stable Durable Object name from the user's ID or the anonymous device token. Requests for that identity reach the same instance:

```ts
const canonicalName = canonicalNavigationLockName(identity)
const stub = env.NAVIGATION_LOCK.get(env.NAVIGATION_LOCK.idFromName(canonicalName))
await stub.setIdentity(canonicalName)
return await stub.decide(request)
```

The object stores a small session record in its own SQLite storage. `decide` first checks the intent token and cursor. A prior token returns `Duplicate`. A changed cursor returns `Retry`. With current state, the object reserves the following position:

```ts
decide(request: NavigationLockRequestDto): NavigationLockDecisionDto {
  const local = this.readSession()

  if (local?.lastIntentToken === request.intentToken && local.sessionId) {
    return { _tag: 'Duplicate', sessionId: local.sessionId }
  }

  if (local && (local.cursor !== request.cursor || local.updatedAtMs !== request.updatedAtMs)) {
    return { _tag: 'Retry' }
  }

  const position = (local?.cursor ?? request.cursor ?? -1) + 1
  const sessionId = local?.sessionId ?? request.sessionId
  this.writeSession({
    sessionId,
    cursor: position,
    updatedAtMs: request.updatedAtMs,
    lastIntentToken: null
  })
  return { _tag: 'Proceed', sessionId, position }
}
```

The navigation service writes the trail entry and cursor to D1 after `Proceed`. It then calls `commit` with the intent token. A failed D1 write resets the lock state before the service reports the error.

A focused concurrency test sends two decisions at once. It expects one `Proceed` at position 1 and one `Retry`:

```ts
expect(proceeds).toEqual([{ _tag: 'Proceed', sessionId, position: 1 }])
expect(decisions.filter((decision) => decision._tag === 'Retry')).toHaveLength(1)
```

## Take aways

- Keying the object by navigation identity keeps unrelated readers on separate instances.
- The Durable Object owns the serialized decision and position allocation. D1 keeps the trail data that normal queries need.
- The split needs repair logic. Resetting the reservation after a failed D1 write lets the next request rebuild lock state from D1.
- A local contract test checks the race in process. The staging rehearsal sent two same-identity requests through a deployed Durable Object and recorded trail positions 1 followed by 2.

Source: [`036d988b`](https://github.com/guidefari/gbfm/commit/036d988baf15e60a8f3945ac52b2582559275935) added the Durable Object and its concurrency test. [`4e664cfb`](https://github.com/guidefari/gbfm/commit/4e664cfb189d6015b2b94445d5e7f3a9908b5906) records the deployed rehearsal.
