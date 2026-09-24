---
title: "Effect-ts, in practice"
date: 2026-02-04T09:09:29+02:00
description: "Why I'm using Effect in more of my TypeScript code"
tags: [typescript, software-design, effect]
images: ["https://og.guidefari.com/og-image?title=Effect-ts%2C%20in%20practice"]
---

## Why I'm more willing to pay the cost now

[Effect](https://effect.website/) takes time to learn and often results in verbose code. But the barrier to entry is lower now thanks to LLMs. More expressive types, better feedback loop.

## Dependencies stop being vibes

Effect makes dependency injection a first-class part of the code.

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

The service identifies an entry in the runtime's service map. A `Layer` supplies the implementation, while the program's type says what it needs. Some of this feels familiar from `C#`.

The [invoicing app](https://github.com/guidefari/invoicing) is where it clicked. The same workflow runs against my live customer database in prod and a dedicated test database in tests. I swap the layer and leave the workflow alone.

```ts
const DatabaseTest = Layer.succeed(Database, {
  query: () => Effect.succeed([{ id: "invoice_123" }]),
});

const result = await Effect.runPromise(
  createInvoice(input).pipe(Effect.provide(DatabaseTest)),
);
```

## Errors become part of the design

Plain async TypeScript makes it easy to lose track of errors. `Promise<Invoice>` tells you what comes back when things go well. To find out what can fail, you have to read the functions it calls or wait for a failure at runtime. Matt Pocock has [a good talk on this](https://www.youtube.com/watch?v=S2GChOwivwQ).

An effect has the type `Effect<A, E, R>`. It tracks the result, possible errors and required services.

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

Errors pass through the `E` channel. If a helper deep in the call stack adds `RateLimited`, that error appears in the types above it until someone handles it.

## catchTag beats try/catch

Each `catchTag` handler deals with one named error. The type keeps track of any errors left over:

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

With `try/catch`, I'd check each error with `instanceof` myself. If I drop a `catchTag` handler, its error stays in the signature. A new tagged error upstream also shows up at call sites that need to handle it.

I can deal with those failures while writing the code. (`#shift-left`, as the exec's would say😆)

## The runtime is where layers actually run

Creating an `Effect` describes the work. A runtime runs it and manages the services and resources it needs, including DB pools, HTTP clients and OTel exporters.

The `R` channel must be empty before a runtime can run a program. If I forget a layer, the compiler catches it:

```ts
//        Type 'Database' is not assignable to type 'never'
Effect.runPromise(createInvoice(input));
//                ^^^^^^^^^^^^^^^^^^^^

Effect.runPromise(createInvoice(input).pipe(Effect.provide(DatabaseLive)));
```

Missing services show up much like missing function arguments. The test layer and live layer both satisfy the same requirement.

For a one-off script, `Effect.runPromise(program.pipe(Effect.provide(MainLive)))` is enough. Effect builds a runtime for that run and tears it down afterward. In a long-running app, I build one runtime and reuse it:

```ts
import { ManagedRuntime, Layer } from "effect";

const MainLive = Layer.mergeAll(DatabaseLive, EmailLive, ConfigLive, LoggerLive);

export const runtimeLive = ManagedRuntime.make(MainLive);
```

`runtimeLive.runPromise(program)` uses that runtime. The DB pool opens once at startup. On shutdown, `runtimeLive.dispose()` runs each layer's release logic in order.

In tests, I provide a layer inline:

```ts
import { it, expect } from "@effect/vitest";

it.effect("creates an invoice", () =>
  Effect.gen(function* () {
    const result = yield* createInvoice({ customerId: "c_1", amount: 100 });
    expect(result.id).toBe("invoice_123");
  }).pipe(Effect.provide(DatabaseTest)),
);
```

`it.effect` runs the effect and fails the test if it fails. A test also needs to provide everything in the `R` channel, so one that forgets `Database` won't compile.

I'm yet to fully lean into `it.effect`👀

## Tracing

```ts
const sendInvoice = (invoiceId: string) =>
  Email.sendInvoice(invoiceId).pipe(
    Effect.withSpan("invoice.send_email", {
      attributes: { invoiceId },
    }),
  );
```

I can wrap work in spans and send them to a trace collector through the app's runtime. Tracing uses the same way of composing work that the rest of the program uses.

## Some repos to check out

- [invoicing](https://github.com/guidefari/invoicing), the app I keep referencing
- [gbfm](https://github.com/guidefari/gbfm), look inside `apps/vps`
- [opensound](https://github.com/planetaryescape/opensound)
- [Thanda's pokemon-app](https://github.com/guidefari/pokemon-app)
- [lucas-barake/effect-monorepo](https://github.com/lucas-barake/effect-monorepo)
- [overengineeringstudio/effect-utils](https://github.com/overengineeringstudio/effect-utils)
