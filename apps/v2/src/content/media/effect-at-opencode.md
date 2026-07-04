---
title: "Effect at OpenCode - Dax Raad (Effect Miami 2026)"
date: 2026-07-04T00:00:00+02:00
description: "Dax Raad walks through the OpenCode codebase, showing Effect patterns in production: Schema, Services, PubSub, Telemetry, and HTTP server."
media_type: youtube
media_url: https://www.youtube.com/watch?v=hY279-A2fC4
youtube_id: hY279-A2fC4
creator: Dax Raad
tags: [media, video, effect, opencode]
images: ["https://i.ytimg.com/vi/hY279-A2fC4/hqdefault.jpg"]
---

## 1. Schema Design & Data Validation

In OpenCode, schema validation replaces libraries like Zod. Defining structures cleanly via `@effect/schema` gives AI agents deterministic boundaries when producing code.

### Branded Types

Prevents mixing of primitives by creating nominal subtypes. OpenCode defines branded identifiers for every domain concept:

```ts
// packages/core/src/auth.ts
export const ID = Schema.String.pipe(
  Schema.brand("Auth.ID"),
  withStatics((schema) => ({ create: () => schema.make("acc_" + Identifier.ascending()) })),
)
export type ID = typeof ID.Type

export const ServiceID = Schema.String.pipe(Schema.brand("ServiceID"))
export type ServiceID = typeof ServiceID.Type

export const OrgID = Schema.String.pipe(Schema.brand("OrgID"))
export type OrgID = typeof OrgID.Type

export const AccessToken = Schema.String.pipe(Schema.brand("AccessToken"))
export type AccessToken = typeof AccessToken.Type

export const RefreshToken = Schema.String.pipe(Schema.brand("RefreshToken"))
export type RefreshToken = typeof RefreshToken.Type
```

The `.pipe(Schema.brand(...))` creates a nominal subtype -- `OrgID` and `ServiceID` are both strings at runtime, but the type system prevents passing one where the other is expected.

### No Magic Strings

Branded types pair directly with domain constants, decoupling raw string references from business logic.

```bash
grep -rn "Schema.brand" packages/core/
```

**Where to look:** `packages/core/src/schema/` -- open `model.ts` or branded types in `auth.ts`.

---

## 2. Services & Layers (Dependency Injection)

OpenCode groups operations into bounded domains using `Context.Service`. Services define the strictly typed API boundary; Layers hold actual implementations.

### Service Interface

Uses the newer `Context.Service` pattern (replaces `Context.Tag`):

```ts
// packages/core/src/global.ts
import { Context, Effect, Layer } from "effect"

export class Service extends Context.Service<Service, Interface>()("@opencode/Global") {}

export interface Interface {
  readonly home: string
  readonly data: string
  readonly cache: string
  readonly config: string
  readonly state: string
  readonly tmp: string
  readonly bin: string
  readonly log: string
  readonly repos: string
}
```

A more complex example with Effect methods:

```ts
// packages/core/src/auth.ts
export interface Interface {
  readonly get: (id: ID) => Effect.Effect<Info | undefined, Error>
  readonly all: () => Effect.Effect<Info[], Error>
  readonly create: (input: { serviceID: ServiceID; credential: Credential; description?: string }) => Effect.Effect<Info | undefined, Error>
  readonly remove: (id: ID) => Effect.Effect<void, Error>
  readonly activate: (id: ID) => Effect.Effect<void, Error>
  readonly active: (serviceID: ServiceID) => Effect.Effect<Info | undefined, Error>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/v2/Account") {}
```

The key pattern: `class MyService extends Context.Service<MyService, Interface>()("identifier") {}` -- the first type param is the class itself, the second is the shape interface, and the runtime argument is a unique string identifier for the service.

### Swappable Runtimes (Git Example)

OpenCode currently spawns a git process but plans to swap it for a native libgit2 layer -- the interface stays the same, only the Layer changes.

```bash
grep -rn "Context.Tag\|Context.Service" packages/core/src/services/
```

**Where to look:** `packages/core/src/services/` -- inspect `git.ts`, `global.ts`, `auth.ts`.

---

## 3. PubSub & Stream APIs

OpenCode processes async event buses with native `PubSub` and `Stream` constructs, preventing timing anomalies and race conditions over WebSockets.

### Creating PubSub Instances

```ts
// packages/core/src/event.ts
const all = yield* PubSub.unbounded<Payload>()
const typed = new Map<string, PubSub.PubSub<Payload>>()

const getOrCreate = (definition: Definition) =>
  Effect.gen(function* () {
    const existing = typed.get(definition.type)
    if (existing) return existing
    const pubsub = yield* PubSub.unbounded<Payload>()
    typed.set(definition.type, pubsub)
    return pubsub
  })
```

### Publishing & Subscribing

```ts
// Publish to all subscribers
yield* PubSub.publish(all, event)

// Subscribe via Stream
Stream.unwrap(
  getOrCreate(definition).pipe(
    Effect.map((pubsub) => Stream.fromPubSub(pubsub))
  )
)

const streamAll = (): Stream.Stream<Payload> => Stream.fromPubSub(all)
```

### Late Subscriptions (Sliding PubSub)

Buffers events so late-joining subscribers don't miss state:

```ts
const pubsub = yield* PubSub.sliding<void>(1)
const subscription = yield* PubSub.subscribe(pubsub)
```

### Cleanup on Shutdown

```ts
yield* Effect.addFinalizer(() =>
  Effect.gen(function* () {
    yield* PubSub.shutdown(all)
    yield* Effect.forEach(typed.values(), PubSub.shutdown, { discard: true })
  }),
)
```

```bash
grep -rn "PubSub\.\|Stream\.fromPubSub" packages/core/src/
```

**Where to look:** `packages/core/src/event.ts` -- stream consumers, event broadcasters, websocket interfaces.

---

## 4. Telemetry Spans & Performance Loops

Effect makes injecting trace bounds simple. Piping effects through `Effect.withSpan` automatically emits OpenTelemetry traces.

### Span on Package Operations

```ts
// packages/core/src/npm.ts
}).pipe(
  Effect.withSpan("Npm.reify", {
    attributes: input,
  }),
)
```

### Span on Tool Execution

```ts
// packages/opencode/src/tool/tool.ts
}).pipe(Effect.orDie, Effect.withSpan("Tool.execute", { attributes: attrs }))
```

### Nested Spans in Plugin Loading

```ts
// packages/core/src/plugin.ts
Effect.withSpan("Plugin.load", {
  attributes: { id: plugin.packageJSON.name },
})

Effect.withSpan(`Plugin.hook.${name}`, {
  attributes: { id: plugin.packageJSON.name },
})
```

The pattern is always `.pipe(Effect.withSpan("SpanName", { attributes? }))` at the end of an Effect chain.

### Agent Feedback Loop

OpenCode's AI agents query these OTEL spans, detect bottlenecks, write a fix, and confirm resolution -- all in real-time.

```bash
grep -rn "withSpan" packages/
```

**Where to look:** `packages/core/src/services/npm.ts`, `packages/core/src/plugin.ts`, `packages/opencode/src/tool/tool.ts`.

---

## 5. Safe HTTP Server & OpenAPI Generation

OpenCode separates endpoint shapes from handler code, verifying safety at compile time.

### Low-level Router (stats server)

```ts
// packages/stats/server/src/router.ts
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"

export const Routes = HttpRouter.use((router) =>
  Effect.gen(function* () {
    const ingestService = yield* Ingest

    yield* Effect.all([
      router.add("GET", "/health", () => json(200, { ok: true })),
      router.add("GET", "/ready", () => json(isShuttingDown() ? 503 : 200, { ok: !isShuttingDown() })),
      router.add("POST", "/", ingestRequests.withPermit(ingest(ingestService))),
    ], { discard: true })
  }),
)

function json(status: number, body: Record<string, unknown>) {
  return HttpServerResponse.json(body, { status }).pipe(Effect.orDie)
}
```

### Schema-Validated Request Body

```ts
const ingest = (ingestService: Ingest.Service) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest
    const payload = yield* HttpServerRequest.schemaBodyJson(IngestPayload).pipe(
      Effect.match({
        onFailure: () => undefined,
        onSuccess: (value) => value,
      }),
    )
  })
```

### Higher-level API Groups

```ts
// packages/server/src/handlers/v2/event.ts
import { HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"

export const eventHandlers = HttpApiBuilder.group(V2Api, "v2.event", (handlers) =>
  Effect.gen(function* () {
    const events = yield* EventV2.Service
    return handlers.handleRaw("events", () =>
      Effect.gen(function* () {
        const location = yield* Location.Service
        return HttpServerResponse.stream(
          Stream.make(connected).pipe(
            Stream.concat(events.all().pipe(/* ... */)),
            Stream.map(eventData),
            Stream.pipeThroughChannel(Sse.encode()),
            Stream.encodeText,
          ),
          { contentType: "text/event-stream" },
        )
      }),
    )
  }),
)
```

### Server Wiring

```ts
// packages/opencode/src/server/server.ts
HttpRouter.serve(HttpApiApp.createRoutes(opts), {
  middleware: disposeMiddleware,
  disableLogger: true,
}).pipe(
  Layer.provideMerge(WebSocketTracker.layer),
  Layer.provideMerge(serverLayer({ port, hostname: opts.hostname })),
)
```

Endpoints declare their requirements (query params, body schemas) directly and compile into API runtime guards. OpenAPI spec is derived from the routes.

```bash
grep -rn "HttpRouter\|HttpServer\|HttpApiBuilder" packages/
```

**Where to look:** `packages/server/src/routes/`, `packages/server/src/handlers/`, `packages/stats/server/src/router.ts`.

## Related reading

- [OpenCode References: Just Clone the Repo](/opencode-references/) -- Dax's tweet on the same workflow
- [Maxwell Brown's note on the repo cloning workflow](https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/)
