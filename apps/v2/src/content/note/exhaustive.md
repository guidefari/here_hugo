---
title: "Exhaustive Pattern Matching"
date: 2026-03-22T02:25:09+02:00
description: Why exhaustive pattern matching matters, and how it makes code safer, clearer, and easier to change.
tags: ["typescript", "ai", "effect"]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=Exhaustive%20Pattern%20Matching",
  ]
---

# Why do I care about this?

I've had a vague understanding of exhaustive pattern matching for a while. 
The topic regularly does the rounds on twitter, and writing more [effect](/effective) has been even more exposure to it.

# What is exhaustive pattern matching?

It means the code is structured in a way that forces every known case to be handled.
If the set of cases changes, I want the compiler to help point out what I missed.

I have a [repo with snippets](https://github.com/guidefari/typescript-pattern-matching) of a few implementations.

# Exhaustiveness is a design tool

If a thing can only be in one of a small number of states, I want that modeled explicitly.
I've spoken in the past about how [code should communicate intent](/intent), 
and I think exhaustive pattern matching can be a useful tool for that!

# Code evolves in a _safer_ manner

When a new case gets added to a union, I want the compiler to make that fact painful to ignore.

Without exhaustive handling, code can keep compiling while silently doing the wrong thing for the new case (or nothing at all).
With exhaustive handling, I get a useful list of places that need a decision.

# Why this is useful with LLMs

I think this matters even more when LLMs are writing or editing code.

LLMs can be lazy. They'll take the shortest path to something that looks done, and without tight feedback, "looks done" is often good enough to stop.

Exhaustive handling changes that. When the domain is modeled as a finite set of explicit cases, the compiler becomes part of the feedback loop. Adding a new variant surfaces compile errors in the right places. The task isn't done until the compiler stops screaming.


# Related reading

- [Pattern Matching in JavaScript](https://kyleshevlin.com/pattern-matching/) by Kyle Shevlin
- [Code should communicate intent](/intent) - exhaustive handling makes the possible states of a thing more legible
- [On Refactoring](/refactoring) - when a domain changes, exhaustive code gives me a better list of places that now need attention
- [TIL: Type narrowing using Type Predicates](/til/type-predicate) - both are really about helping the compiler understand which cases are still possible
- [TIL: Typescript Enum vs Obj](/til/ts-enum-vs-obj) - finite sets matter here; the representation is less important than making the set explicit enough to check completely
- [Cohesion](/cohesion) - this works best when related cases live together instead of being smeared across the codebase