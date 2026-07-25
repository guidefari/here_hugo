---
title: "Parse, don't validate"
date: 2026-07-25T09:00:00+02:00
description: "Take raw input, parse it into a safe shape, and keep the invalid states out of the rest of the program."
tags: [typescript]
---

Don't pass raw input through your app and hope every caller behaves.

Parse at the edge, reject bad data early, and work with a value that already means something.

That gives you a smaller surface area for bugs and a simpler program inside the boundary.

```ts
// raw input in, typed value out
const Email = Schema.String.pipe(
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  Schema.brand("Email")
)

type Email = Schema.Schema.Type<typeof Email>

const parsed = Schema.decodeUnknownSync(Email)(input)
```

```ts
// bad input stays bad at the edge
const createUser = (input: unknown) =>
  Effect.gen(function* () {
    const body = yield* Schema.decodeUnknown(BodySchema)(input)
    return yield* Users.create(body.email)
  })
```

```ts
// after parsing, the rest of the app gets to assume shape
function sendReceipt(email: Email) {
  return Mailer.send(email, "receipt")
}
```

The point is not to be clever.

It's to turn "maybe valid" into "valid enough to use" before the program gets interesting.

## References

- [Parse, don’t validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) — the original essay
- [Parse Dont Validate](https://www.joshka.net/practice/patterns/parse-dont-validate/) — a short practical summary
- [Design by Contract](https://cs.brown.edu/courses/cs173/2012/book/contracts.html) — invariants as runtime checks
- [Contract.Invariant](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.contracts.contract.invariant?view=net-10.0) — a concrete contract API
