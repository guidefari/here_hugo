---
title: "Common React Render Bug"
date: 2023-01-25T20:24:57+02:00
description: The most common react bug I've been having to fix is caused by trying to `value.map()` an `undefined value`
tags: [react, typescript]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Common%20React%20Render%20Bug']
---


## Who this note is not for

In my experience, If you're working in a greenfield environment, modern tooling, with an end-to-end type safe stack, this won't apply to you too much.

It's likely a thing you won't have to think much about, your editor will scream at you for this sort of thing.

### Looping through Data from API

It's very common to map over values coming in from an api to render stuff.

- you can't guarantee 100% return of 'clean' data from an API - unless you write the backend yourself.
- and it's an asynchronous action, which will trigger re-renders - weird things can happen during these
  - clean data refers to data that's shaped exactly how you expect
- Sometimes data changes hands a few times, before you're using it on your frontend. from component to component, different variables in the store, calculations etc. wider surface area for things to go wrong.

## Ways you can help yourself

- Good types - `[] | undefined` - this on its own is not enough in some cases, I experimented with it. It's best paired with the lint rule linked below
- [typescript eslint no unsafe call rule](https://typescript-eslint.io/rules/no-unsafe-call/)

These are just safeguards, for extra resilience, I think it's best to assume that any array you might interact with **will definitely** be undefined at some point in its lifecycle.

What this looks like, is writing defensive code, allowing for safe & gracious failure, as opposed to the white screen of death (crashed app!)

- [short circuiting via optional chaining](https://javascript.info/optional-chaining#short-circuiting) is one way to write such defensive code

```ts
const data: number[] | undefined = [4, 2, 1]

data?.map((item) => console.log(item))

```

- That `data` type is sometimes inherited from API response type definitions, remember to be honest with your types & declare `*** | undefined`
- A final thought, [tweet by Cory](https://twitter.com/housecor/status/1616534961992990746?s=20). "Types as [anti-corruption layer](https://codeopinion.com/anti-corruption-layer-for-mapping-between-boundaries/)" as Dan North put it.
