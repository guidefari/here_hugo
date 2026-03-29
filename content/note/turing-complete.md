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

For the sake of illustration though, I've commonly seen Turing machines have the following 'physical' properties attributed to them:
- Infinite tape, divided into cells. Each can hold a symbol, or be blank for that matter.
- A read/write head
- State register
- A finite table of rules

Key properties of a Turing machine:
- Conditional branching (if statements, go to)
- ~~Infinite~~ Arbitrary amount of memory. "You must be able to get as much memory as the problem needs"

## Why TypeScript counts
One of the most interesting Syntax episodes for me. Dimitri Metropolis ran Doom inside the type system.
Word on the street says anything that is Turing complete will eventually run Doom💀

{{<youtube 0cXD1FGvRdA>}}

## Why this is interesting but easy to overhype

> Anything which can be computed can be computed with a Turing machine.

Needless to say, there's physical limitations to infinite memory. 
Because of that, Turing completeness falls into Type 1 of the Chomsky Hierarchy, instead of Type 0.

## Other surprising examples
I'm yet to read more into these, but at a glance, seems like

- Minecraft
- SQL
- Excel
- CSS: [Is CSS Turing Complete?](https://notlaura.com/is-css-turing-complete/) seems like a good read.

## Related reading

{{<youtube yhznYsjOhSU>}}

- on the **Infinite** property.
  - Boolos, Burgess & Jeffrey (2002, p. 25) include the possibility of "there is someone stationed at each end to add extra blank squares as needed".
  - Chomsky Hierarchy
- Halting problem

## References
- https://brilliant.org/wiki/turing-machines/
