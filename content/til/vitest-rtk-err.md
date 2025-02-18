---
title: "TIL: Vitest + RTK - Cannot read properties of undefined (reading 'reducerPath')"
date: 2025-02-18T21:56:18+02:00
description: Import order matters sometimes.
tags: [til, testing]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Vitest+Rtk+Err']
---
# 

Import order is probably the issue here.
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
