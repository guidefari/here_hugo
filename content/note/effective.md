---
title: "Effective"
date: 2026-02-04T09:09:29+02:00
description: "Effect has been slowly infesting my Typescript codebases, let's explore why"
tags: [typescript, software-design]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Effective"]
---

## Why I'm more willing to pay the cost now

Effect has a learning curve, and can produce code that feels more verbose than usual.

But the barrier to entry is lower than it used to be because of LLM's. The more expressive the type system is, the better the feedback loop. If a service is missing, a layer is wrong, or an error is unhandled, the compiler has something concrete to say.

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

The service is just an identifier in the runtime's service map. The implementation lives in a `Layer`, and the program declares what it needs via the type system. This borrows some (favourable) ergonomics from a `C#` codebase

The [invoicing app](https://github.com/guidefari/invoicing) is where this started clicking for me. The same invoice workflow can run against the live database with my customers and a dedicated testing database, juat swap the layer, nothing else changes.

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

Errors bubble through the `E` channel automatically. if a helper deep in the call stack adds `RateLimited` to its errors, the union widens all the way up until somebody handles it. No silent escape route.

## Required Environment

The `R` channel is the one that took me a minute to appreciate. Forget to provide a layer and you don't get a runtime crash, you get a type error at the call site:

```ts
//        Type 'Database' is not assignable to type 'never'
Effect.runPromise(createInvoice(input));
//                ^^^^^^^^^^^^^^^^^^^^

Effect.runPromise(createInvoice(input).pipe(Effect.provide(DatabaseLive)));
```

`runPromise` only accepts an effect with `R = never`. Missing services show up the same way missing function arguments do. This is the bit that makes the DI story actually pay off. The test layer and the live layer both satisfy the same constraint, and you can't ship a program that forgot one.

`catchTag` is where modularity beats `try/catch`. Each handler narrows the error union by name, and what's left is still in the type:

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

Compare to a `try/catch`: one catch block, manual `instanceof` checks, no help from the compiler if you forget a case or if a new error tag gets added later. With `catchTag`, drop a handler and the leftover error stays in the signature until something deals with it. Add a new tagged error upstream and every call site that doesn't handle it lights up.

This forces you to deal with your program's known failure modes at compile time, instead of runtime. (`#shift-left` as the exec's would say😆) 

## The runtime is where layers actually run

An `Effect` is a description, not an execution. Nothing happens until you hand it to a runtime. The runtime is the thing that owns the service map, the scheduler, the fiber supervisor, and the lifecycle of any resources your layers acquired (DB pools, HTTP clients, OTel exporters).

For a one-off script, `Effect.runPromise(program.pipe(Effect.provide(MainLive)))` is enough. Effect builds an ad-hoc runtime, runs the program, tears it down. For a long-running app you want the runtime built once and reused:

```ts
import { ManagedRuntime, Layer } from "effect";

const MainLive = Layer.mergeAll(DatabaseLive, EmailLive, ConfigLive, LoggerLive);

export const runtimeLive = ManagedRuntime.make(MainLive);
```

`runtimeLive.runPromise(program)` then runs the program against the already-constructed service map. The DB pool opens once at startup, not per request. On shutdown you call `runtimeLive.dispose()` and every layer's release logic runs in order.

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

Wrapping work in spans is straightforward, and sending those spans to a trace collector is also pretty straightforward. The program already has a runtime, services, and a composition model. Tracing fits into that instead of being bolted on later.

## Where I'm using it

Some repo's to check out

- [invoicing](https://github.com/guidefari/invoicing), the app I keep referencing
- [gbfm](https://github.com/guidefari/gbfm), look inside `apps/vps`
- [opensound](https://github.com/planetaryescape/opensound)
- [Thanda's pokemon-app](https://github.com/guidefari/pokemon-app)

Other people's, that I keep coming back to:

- [lucas-barake/effect-monorepo](https://github.com/lucas-barake/effect-monorepo)
- [overengineeringstudio/effect-utils](https://github.com/overengineeringstudio/effect-utils)