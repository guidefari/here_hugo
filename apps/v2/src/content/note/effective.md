---
title: "Effect-ts, in practice"
date: 2026-02-04T09:09:29+02:00
description: "Effect has been slowly infesting my Typescript codebases, let's explore why"
tags: [typescript, software-design, effect]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Effect-ts%2C%20in%20practice"]
---

## Why I'm more willing to pay the cost now

[Effect](https://effect.website/) has a learning curve, and can produce code that feels more verbose than usual.
But the barrier to entry is lower now thanks to LLMs. More expressive types, better feedback loop.

## Dependencies stop being vibes

Dependency injection is a first class citizen around here.

```ts
import { Context, Effect, Layer } from "effect";

// service, aka the contract
class Database extends Context.Service<Database, {
  readonly query: (sql: string) => Effect.Effect<unknown[]>;
}>()("Database") {}

// layer, aka the implementation
const DatabaseLive = Layer.succeed(Database, {
  query: (sql) => Effect.promise(() => db.query(sql)),
});
```

The service is just an identifier in the runtime's service map. The implementation lives in a `Layer`, and the program declares what it needs via the type system. Borrows some (favourable) ergonomics from a `C#` codebase.

The [invoicing app](https://github.com/guidefari/invoicing) is where it clicked. The same workflow runs against my live customer database in prod, and a dedicated test database in tests. Swap the layer, nothing else changes.

```ts
const DatabaseTest = Layer.succeed(Database, {
  query: () => Effect.succeed([{ id: "invoice_123" }]),
});

const result = await Effect.runPromise(
  createInvoice(input).pipe(Effect.provide(DatabaseTest)),
);
```


## Errors become part of the design

Plain async TypeScript hides a lot of error state if you aren't disciplined about how you handle errors. 

The signature `Promise<Invoice>` says nothing about what can go wrong. You find out at runtime, or by reading every function it calls. Matt Pocock has [a good talk on this](https://www.youtube.com/watch?v=S2GChOwivwQ).

Every effect is `Effect<A, E, R>`: success, error, requirements. All three channels are tracked.

```ts
class CustomerNotFound extends Data.TaggedError("CustomerNotFound")<{
  customerId: string;
}> {}

class PaymentDeclined extends Data.TaggedError("PaymentDeclined")<{
  reason: string;
}> {}

const createInvoice = (
  input: Input,
): Effect.Effect<Invoice, CustomerNotFound | PaymentDeclined, Database> => {
  // ...
};
```

In natural language, this reads as: 
- produces an `Invoice`,
- can fail with `CustomerNotFound` or `PaymentDeclined`, 
- needs a `Database`.  

Errors bubble through the `E` channel automatically. If a helper deep in the call stack adds `RateLimited` to its errors, the union widens all the way up until somebody handles it. No silent escape route.

## catchTag beats try/catch

`catchTag` is where modularity wins. Each handler narrows the error union by name, and whatever you don't handle stays in the type:

```ts
const program = createInvoice(input).pipe(
  Effect.catchTag("CustomerNotFound", (e) =>
    Effect.succeed(
      Response.json({ error: "customer_not_found", id: e.customerId }, { status: 404 }),
    ),
  ),
  Effect.catchTag("PaymentDeclined", (e) =>
    Effect.succeed(Response.json({ error: e.reason }, { status: 402 })),
  ),
);
//    ┌─── Effect<Response, never, Database>
//    ▼
return runtimeLive.runPromise(program);
```

Compare to `try/catch`: one block, manual `instanceof` checks, no help from the compiler if you forget a case or if a new error tag shows up later.

With `catchTag`, drop a handler and the leftover error stays in the signature until something deals with it. Add a new tagged error upstream and every call site that doesn't handle it lights up.

You deal with known failure modes at compile time instead of runtime. (`#shift-left`, as the exec's would say😆)

## The runtime is where layers actually run

An `Effect` is a description, not an execution. Nothing happens until you hand it to a runtime.

The runtime owns the service map, the scheduler, the fiber supervisor, and the lifecycle of any resources your layers acquired (DB pools, HTTP clients, OTel exporters).

Before a runtime will accept a program, the `R` channel has to be empty. Forget a layer and you get a type error, not a 3am page:

```ts
//        Type 'Database' is not assignable to type 'never'
Effect.runPromise(createInvoice(input));
//                ^^^^^^^^^^^^^^^^^^^^

Effect.runPromise(createInvoice(input).pipe(Effect.provide(DatabaseLive)));
```

Missing services show up the same way missing function arguments do. The test layer and the live layer satisfy the same constraint, so you can't ship a program that forgot one.

For a one-off script, `Effect.runPromise(program.pipe(Effect.provide(MainLive)))` is enough. Effect builds an ad-hoc runtime, runs the program, tears it down. For a long-running app you want it built once and reused:

```ts
import { ManagedRuntime, Layer } from "effect";

const MainLive = Layer.mergeAll(DatabaseLive, EmailLive, ConfigLive, LoggerLive);

export const runtimeLive = ManagedRuntime.make(MainLive);
```

`runtimeLive.runPromise(program)` then runs the program against an already-constructed service map. The DB pool opens once at startup, not per request.

On shutdown you call `runtimeLive.dispose()` and every layer's release logic runs in order.

Tests skip the long-lived runtime and provide a layer inline. The program is the same, only the layer changes:

```ts
import { it, expect } from "@effect/vitest";

it.effect("creates an invoice", () =>
  Effect.gen(function* () {
    const result = yield* createInvoice({ customerId: "c_1", amount: 100 });
    expect(result.id).toBe("invoice_123");
  }).pipe(Effect.provide(DatabaseTest)),
);
```

`it.effect` runs the effect for you and fails the test if the `R` channel isn't satisfied, so a test that forgot to provide `Database` doesn't compile, never mind run.

I'm yet to fully lean into `it.effect`👀

## Observability comes along for the ride

```ts
const sendInvoice = (invoiceId: string) =>
  Email.sendInvoice(invoiceId).pipe(
    Effect.withSpan("invoice.send_email", {
      attributes: { invoiceId },
    }),
  );
```

Wrapping work in spans is straightforward, and shipping those spans to a trace collector is too. The program already has a runtime, services, and a composition model. Tracing fits in instead of getting bolted on later.

## Some repo's to check out

- [invoicing](https://github.com/guidefari/invoicing), the app I keep referencing
- [gbfm](https://github.com/guidefari/gbfm), look inside `apps/vps`
- [opensound](https://github.com/planetaryescape/opensound)
- [Thanda's pokemon-app](https://github.com/guidefari/pokemon-app)

- [lucas-barake/effect-monorepo](https://github.com/lucas-barake/effect-monorepo)
- [overengineeringstudio/effect-utils](https://github.com/overengineeringstudio/effect-utils)