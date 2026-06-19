---
title: "TIL: Type narrowing using Type Predicates"
date: 2024-04-16T13:47:34+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, typescript]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Type+Predicates']
---

While running an `array.filter`, I needed to change the type of the variable being returned after the filter logic.

```ts
type ThingyOne = {
  item: string
  resolved?: number
}

type FilteredThingy = ThingyOne & {
  resolved: number
}

// or
// type FilteredThingy = Required<ThingyOne>

const things: ThingyOne[] = [
  {
  item: 'one',
  resolved: 1
  },
  {
    item: 'two',
  },
  {
  item: 'three',
  resolved: 1
  },

]

const filteredThings = things.filter((item) => !!item.resolved)
const filteredThingsWithPredicate = things.filter((item): item is FilteredThingy => !!item.resolved)

const accessingFilteredThingWithoutPredicate = filteredThings[1].resolved
const accessingFilteredThingWithPredicate = filteredThingsWithPredicate[1].resolved
```
