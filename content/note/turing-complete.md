---
title: "Turing Completeness"
date: 2026-02-05T17:15:12+02:00
description: What Turing completeness means, why it matters, and why it keeps showing up in surprising places.
tags: [typescript, computer-science]
images:
  ["https://images-here-hugo.vercel.app/api/og-image?title=Turing+Completeness"]
---

## What does it mean to be Turing complete

To understand Turing completeness, it's helpful to get refresher on what a Turing machine is.
Alan Turing was on a quest to develop a machine that could compute any math problem.

> [Turing’s explanation of his machine was meant as a theoretical construct and not really something to implement physically](https://erik-engheim.medium.com/turing-machines-for-dummies-81e8e25471b2)

For the sake of illustration though, I've commonly seen Turing machines have the following 'physical' properties attributed to them:
- Infinite tape, divided into cells. Each can hold a symbol, or be blank for that matter.
- A read/write head
- State register
- A finite table of rules

Key properties of a Turing machine:
- ~~Infinite~~ Arbitrary amount of memory. "You must be able to get as much memory as the problem needs"
- Conditional branching (if statements, go to)

## The Typescript type system is turing complete
One of the most interesting Syntax episodes for me. Dimitri Metropolis ran Doom inside the type system.

{{<youtube 0cXD1FGvRdA>}}

## What are the implications of this?

> Anything which can be computed can be computed with a Turing machine.

## What else out there is surprisingly turing complete?
I'm yet to read more into these, but at a glance, seems like

- Minecraft
- SQL
- Excel
- CSS: [Is CSS Turing Complete?](https://notlaura.com/is-css-turing-complete/) seems like a good read.

## Related reading

{{<youtube yhznYsjOhSU>}}

- Infinite is of course theoretical.
  - Boolos, Burgess & Jeffrey (2002, p. 25) include the possibility of "there is someone stationed at each end to add extra blank squares as needed".
  - Chomsky Hierarchy
- Halting problem
