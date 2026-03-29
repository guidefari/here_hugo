---
title: "Turing Completeness"
date: 2026-02-05T17:15:12+02:00
description: I recently learnt that the Typescript Type system is Turing complete!
tags: [typescript, computer-science]
images:
  ["https://images-here-hugo.vercel.app/api/og-image?title=Turing+Completeness"]
---

## The rough model in my head

Alan Turing was on a quest to develop a machine that could compute any math problem.

> [Turing’s explanation of his machine was meant as a theoretical construct and not really something to implement physically](https://erik-engheim.medium.com/turing-machines-for-dummies-81e8e25471b2)

For the sake of illustration, a Turing machine is usually described as:

- A tape divided into cells, each holding a symbol or a blank value
- A read/write head that can inspect and modify the current cell
- A state register that tracks the machine's current state
- A finite table of rules that tells the machine what to do next

The important computational ideas underneath that model are:

- Arbitrary memory
- Some way to branch based on the current situation (`if else`)
- Some way to preserve and update state

## Why TypeScript counts

One of the most interesting Syntax episodes for me. Dimitri Metropolis ran Doom inside the type system.
Word on the street says anything that is Turing complete will eventually run Doom💀

{{<youtube 0cXD1FGvRdA>}}

## What being Turing complete actually tells us

> Anything which can be computed can be computed with a Turing machine.

Needless to say, there's physical limitations to infinite memory. 
Because of that, Turing completeness falls into Type 1 of the Chomsky Hierarchy, instead of Type 0.

What matters here is not the exact machinery, but the capabilities it gives you:
- memory
- control flow
- state transitions

## Other surprising examples

I'm yet to read more into these, but at a glance, seems like

- Minecraft
- SQL
- Excel
- CSS: [Is CSS Turing Complete?](https://notlaura.com/is-css-turing-complete/) seems like a good read.

## Snippets

```ts
type IsEven<N extends unknown[]> =
  N extends []                          ? true  // base: empty array = 0, which is even
  : N extends [unknown]                 ? false // base: one element = 1, which is odd
  : N extends [unknown, unknown, ...infer Rest] ? IsEven<Rest> // peel off 2, recurse
  : false;
```


```ts
type Multiply<A extends unknown[], B extends unknown[]> =
  A extends [unknown, ...infer Rest]
    ? [...B, ...Multiply<Rest, B>]
    : [];

type Six = Multiply<[1,1], [1,1,1]>;
type Check = Six["length"]; // 6
```

## Related reading

{{<youtube yhznYsjOhSU>}}

- on the **Infinite** property.
  - Boolos, Burgess & Jeffrey (2002, p. 25) include the possibility of "there is someone stationed at each end to add extra blank squares as needed".
  - Chomsky Hierarchy
- Halting problem

## References
- [Turing Machine - Wikipedia](https://en.wikipedia.org/wiki/Turing_machine)
- [Turing Machines for Dummies](https://erik-engheim.medium.com/turing-machines-for-dummies-81e8e25471b2)
- [Turing Machines - Brilliant](https://brilliant.org/wiki/turing-machines/)
- [You Can Run DOOM in TypeScript's Type System](https://www.youtube.com/watch?v=0cXD1FGvRdA)
- [What Is Turing Complete? - Computerphile](https://www.youtube.com/watch?v=yhznYsjOhSU)
