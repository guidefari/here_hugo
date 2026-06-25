---
title: "TIL: Leaking requirements in Effect services"
date: 2026-06-25T10:00:00+02:00
description: A service's signature is a contract. Anything in the R of its methods becomes a requirement every consumer has to satisfy, so keep implementation deps on the Layer.
tags: [effect, typescript, software-design]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Leaking+Requirements+in+Effect+Services']
---

The Effect LSP emits `effect/leakingRequirements` on a service whose methods carry R that should have stayed on the layer. The principle: the service's signature is a contract with its callers. If a method returns `Effect<A, E, R>`, the `R` becomes a requirement for every consumer, even if it only matters to one particular implementation.

Two ways it leaks:

- **Interface leak**: the service's signature declares a method with a non-trivial `R`. Consumers are forced to satisfy deps the implementation chose, not deps the contract needs.
- **Layer leak**: a `Layer<Service, E, R>` lists requirements the service itself doesn't use.

The fix is the same in both cases: keep implementation-specific R off the service's signature, and put it on the Layer. The signature declares the contract; the Layer wires up the implementation.

## Bad

`notify` drags `SentryService` into every caller, because this particular implementation captures exceptions through Sentry.

```ts
import { Context, Effect, Layer } from "effect"

export interface NotifierShape {
  readonly notify: (msg: string) => Effect.Effect<void, never, SentryService>
}

export class NotifierService extends Context.Service<NotifierService, NotifierShape>()(
  "@app/NotifierService"
) {}
```

## Good

`notify` returns `Effect<void>`, no R. The implementation still uses Sentry (via `yield*` inside its `Effect.gen`), and `Layer.provide(SentryServiceLive)` wires it up. Consumers of `NotifierService` never see Sentry in their R.

```ts
import { Context, Effect, Layer } from "effect"

export interface NotifierShape {
  readonly notify: (msg: string) => Effect.Effect<void>
}

export class NotifierService extends Context.Service<NotifierService, NotifierShape>()(
  "@app/NotifierService"
) {}

export const NotifierLive = Layer.effect(
  NotifierService,
  Effect.gen(function*() {
    const sentry = yield* SentryService
    return {
      notify: (msg) =>
        Effect.gen(function*() {
          yield* sendEmail(msg).pipe(
            Effect.catchAll((e) => sentry.captureException(e))
          )
        })
    }
  })
).pipe(Layer.provide(SentryServiceLive))
```

The implementation didn't change. Only the shape did. The `.pipe(Layer.provide(SentryServiceLive))` is the same in both cases, which is the right place to declare the dependency.

## Why bother

- The consumer's R type only grows when the contract itself demands it.
- A test layer doesn't have to wire up services the contract never asked for.
- You can swap the implementation (e.g., one that logs instead of reporting to Sentry) without changing the signature.

For a bigger app, a separate `runtime/services.ts` is where you'd `Layer.mergeAll(NotifierLive, ...)` and then `Layer.provide(AppLoggerLive)` on the result. The contract stays the same when an internal layer swaps.
