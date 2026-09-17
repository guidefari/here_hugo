---
title: "What is an Effect fiber?"
date: 2026-09-07T21:17:02+02:00
description: "A fiber is a running Effect that can be joined, interrupted, or stopped with its parent."
tags: [effect, typescript, concurrency]
---

An `Effect` describes work. A fiber is one running instance of that work.

## Start work in another fiber

`Effect.forkChild` starts an Effect concurrently and gives you a handle to its fiber:

```ts
import { Effect, Fiber } from "effect"

const program = Effect.gen(function*() {
  const fiber = yield* Effect.forkChild(
    Effect.sleep("1 second").pipe(Effect.as("finished"))
  )

  return yield* Fiber.join(fiber)
})
```

The parent can keep doing other work after `forkChild`. `Fiber.join` waits for the child and returns its value.

If the child fails, `Fiber.join` fails with the same error.

## Fibers are not threads

Fibers run on the normal JavaScript runtime, usually its single main thread. Use a Worker, Worker Thread, or separate process for parallel CPU work.

While one fiber waits for I/O, a timer, or another asynchronous operation, Effect can run another. A CPU-heavy synchronous loop blocks every fiber.

## Interrupt work that is no longer useful

```ts
const program = Effect.gen(function*() {
  const fiber = yield* Effect.forkChild(
    Effect.sleep("1 minute")
  )

  yield* Fiber.interrupt(fiber)
})
```

`Fiber.interrupt` asks the child to stop. It waits until the child has run its cleanup before it continues.

In the [scoped-transactions example](/effect-scoped-transactions/), interruption stops the transaction body while `withTransaction` rolls back and releases its connection.

## Child fibers stop with their parent

`Effect.forkChild` creates a child of the current fiber. If the parent finishes or is interrupted, Effect ends the child too.

Background child work ends when the operation that started it ends. Use a detached fiber when the work should outlive its caller.

## References

- [Effect fibers guide](https://effect.website/docs/v4/concurrency/fibers/)
- [Effect `Fiber` API](https://effect.website/docs/v4/api/effect/Fiber)
- [Effect `runFork` guide](https://effect.website/docs/v4/getting-started/running-effects/)

## Related

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/S0umEpJrERc" title="Effect Time #7: What the **** is a Fiber?" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
