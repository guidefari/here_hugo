---
title: "TIL: Bounded concurrency first"
date: 2026-06-29T21:30:00+02:00
description: When fanning out async work, default to a bound. The four ways unbounded breaks, heuristics for picking the limit, and when unbounded is actually fine.
tags: [til, concurrency, async]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Bounded+Concurrency+First']
---

From [Bhekani's note](https://digitalgarden.bhekani.com/bounded-concurrency-first/): when fanning out async work, default to **bounded concurrency**. Spawning one task per item is the lazy answer that turns "many tasks" into "many simultaneous failures." The fix is small - a semaphore plus a join set, with the permit released as each task completes. At most N items in flight; new spawns block until a slot frees.

## Why unbounded breaks

Spawning 5,000 tasks for a 5,000-item list looks innocent until you run it on real load. Four failure modes, all capped by capping the input:

1. **Provider throttling.** Most external APIs rate-limit. 5,000 concurrent calls produces 5,000 simultaneous 429s, and now you've got a retry storm on top of the original load.
2. **Lock contention.** If any task touches a shared resource (database, search index, log writer), all 5,000 tasks compete for the same lock. Throughput goes **down**, not up, because most tasks are parked waiting for the lock.
3. **Queue blow-up.** The spawn gate is upstream. Each task feeds into something downstream: a channel between stages, a result accumulator, a retry queue. If you cap the spawn rate but leave downstream accumulators unbounded, the bottleneck just moves - memory grows without limit, or the channel fills and stalls the producers anyway. If you leave the spawn rate unbounded **and** channels are bounded, everyone blocks on `send`. Back-pressure has to exist at **every** stage; the semaphore is the entry gate, the rest of the pipeline needs gates too.
4. **Latency on the interactive surface.** The user's keypress competes with the bulk work for the same scheduler, the same event loop, the same allocations. Suddenly the UI is laggy because a background batch decided everyone is equally important.

## Picking the bound

The bound is a knob, not a magic number. The point is having a knob. The right value depends on the bottleneck:

- **Provider sync fan-out:** match the provider's rate budget divided by typical latency. API allows 60 req/min and each request takes ~1s, that's ~1 concurrent request per slot.
- **CPU work (decode, extract, transforms):** match the CPU core count, or a small multiple. The OS can't give you more compute than cores. Tasks beyond the core count just context-switch, paying switch overhead, cache pressure, and scheduler latency. Throughput goes flat or down beyond `cores`. A small multiple (2x) can absorb scheduling jitter when a "CPU" task briefly touches I/O; beyond that it's pure overhead.
- **Work bound by an executor or model server:** match its queue depth. If the model serves N requests at a time, the queue depth should match.
- **Expensive transforms with large per-task footprint:** match available memory / per-task footprint. Twenty concurrent transforms at 1MB each is fine; twenty thousand isn't.

## When unbounded is acceptable

Real cases where no semaphore is the right call:

- The input list is small and **known** (e.g. 4 accounts to sync, not 5,000 messages).
- Each task is genuinely independent and short.
- The downstream consumers can absorb arbitrary fan-in.

The rule is "bounded **first**," not "bounded always." Default toward the bound, because the cases that need it are common and the cases that need the bound removed are rare.