---
title: "Invariants"
date: 2026-07-24T09:00:00+02:00
description: "A property that must always hold true — and what encoding them in your type system buys you."
tags: [typescript, effect-systems, architecture]
images: ['https://og.guidefari.com/og-image?title=Invariants']
---

An **invariant** is a property that must always hold true at a specific point in a program. When you say "this list is never empty" or "this ID was validated before use", you're describing an invariant.

The question is: how do you enforce it?

## Informal invariants

Most codebases rely on convention. Comments, naming conventions, tribal knowledge. "Just don't pass null here." "Make sure you call `validate()` first." These are *unenforced* invariants — they hold only as long as every developer remembers them.

```ts
// Don't call this with a negative amount
function processPayment(amount: number) {
  // ...
}
```

The invariant (`amount >= 0`) exists only in a comment. The type system won't stop you from violating it.

## Encoding invariants in the type system

A type-safe language lets you turn runtime checks into compile-time guarantees. The classic example is `Option<T>` / `Maybe<T>` replacing nullable values — the invariant "this value might be absent" is encoded in the type, and the compiler forces you to handle both cases.

```ts
// Before: invariant in a comment
// Returns null if not found
function findUser(id: string): User | null

// After: invariant encoded in the type
function findUser(id: string): Option<User>
// Callers must handle None — the compiler enforces it
```

The same idea extends to:

- **`Result<T, E>` / `Either<L, R>`** — the invariant that an operation can fail is encoded, not assumed.
- **Branded types** — `type Email = string & { readonly __brand: 'Email' }` ensures validated emails can't be confused with raw strings.
- **Refinement types** — libraries like `zod`, `io-ts`, or `brand` let you define predicates that gate construction, so only valid values exist at runtime.
- **Non-empty arrays** — `ReadonlyArray.NonEmpty<T>` in Effect, or `NonEmptyArray` in fp-ts. The invariant "this list has at least one element" is enforced by the type.

Each of these moves a property from "please remember" to "the compiler checks this for you."

## Effect systems go further

Effect systems (Effect-TS, ZIO, Koka) encode invariants about *computation itself* — not just values, but what a program *does*:

- **Error handling** — The type of an effect declares what errors it can produce. `Effect<User, DatabaseError, never>` means the invariant "this operation can fail with a `DatabaseError`" is tracked through the entire call graph. You can't forget to handle it.
- **Dependency tracking** — Services that an effect requires are part of its type. `Effect<User, never, Database>` says "this needs a `Database` to run." The framework (or the compiler) wires it up for you.
- **Resource safety** — `Effect.acquireRelease` encodes the invariant "this resource will be cleaned up" at the type level. The pattern is baked into the runtime.
- **Concurrency** — In ZIO, `Fiber` and `Ref` types encode invariants about shared state. `Ref.make(initial)` guarantees atomic reads and writes; `Fiber.join` guarantees you wait for completion.

```ts
// The type tells you what invariants to expect:
// - Requires a Database service
// - Can fail with a UserNotFound error
// - Succeeds with a User value
const getUser: Effect<User, UserNotFound, Database> = ...
```

When you compose effects, these invariants compose too. The compiler won't let you wire up a `Database` where a `Logger` is needed any more than it would let you add a `string` to a `number`.

## Trade-offs

Encoding invariants isn't free:

- **Type complexity** — Heavily-typed code can be harder to read and slower to write initially.
- **Abstraction overhead** — Generic effect types and higher-kinded abstractions require developer familiarity with the paradigm.
- **Boundary friction** — The edges of your system (I/O boundaries, serialization, external APIs) are where invariants break down. You still need runtime validation at those boundaries ("parse, don't validate").
- **Partial adoption** — An effect system used in half your codebase creates awkward seams where invariants are enforced on one side of the boundary and not the other.

## The payoff

The more invariants you encode in types, the smaller the gap between "what the code does" and "what the documentation says it does." Types become executable documentation that the compiler verifies on every change.

The goal isn't to eliminate all runtime checks — it's to make the *impossible states* truly unrepresentable. When a property is encoded in the type system, a whole class of bugs becomes a compile error instead of a production incident.

## Further reading

- [Parse, don't validate](/bliki/parse-dont-validate/)
- [Design by contract](https://en.wikipedia.org/wiki/Design_by_contract) — preconditions, postconditions, and class invariants in Eiffel
- [Parse, don’t validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) — the original essay
- [Design by Contract](https://cs.brown.edu/courses/cs173/2012/book/contracts.html) — runtime contracts and invariants
