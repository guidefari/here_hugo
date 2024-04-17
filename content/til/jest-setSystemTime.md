---
title: "TIL: Jest SetSystemTime"
date: 2024-04-17T11:39:33+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, testing, jest]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Jest+SetSystemTime']
---

## Set environment time

This spins up the test runner with the context of a specified date.

- Meaning I can tell it "yo, for the duration of these tests, assume the date is **XXX**."
- Meaning `new Date() = **XXX**`

```ts
beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-04-17T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
```


## Why this is useful

This helps decouple the test and logic you're testing.
You want to avoid tests that are too aware of the internal implementation they're testing.

You can use string assertions, instead of relying on directly manipulating a `new Date()` object.
Direct manipulation very quickly starts to look lik the internal implementation, which is a smell.
