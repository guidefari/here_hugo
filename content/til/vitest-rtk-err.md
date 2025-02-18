---
title: "TIL: Vitest + RTK - Cannot read properties of undefined (reading 'reducerPath')"
date: 2025-02-18T21:56:18+02:00
description: Import order matters sometimes.
tags: [til, testing]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Vitest+Rtk+Err']
---

I faced this error while trying to run a component test using vitest.

Import order was the issue here.
Ultimately, the fix was something like this:

Changing from
```ts
import Component from '@src/Component'
import { renderWithProviders } from '@src/util'
```

To this
```ts
import { renderWithProviders } from '@src/util'
import Component from '@src/component'
```

## More context

- The contents of `renderWithProviders` can be found in [RTK documentation here](https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function).
