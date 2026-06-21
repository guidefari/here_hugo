---
title: "TIL: Typescript Enum vs Obj"
date: 2022-11-19T12:10:18+02:00
description: In some(most?) cases, it may be preferential to use objects over enums. esp when building a lib
tags: [til, typescript]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Typescript%20Enum%20vs%20Obj']
---

- [Stackblitz](https://stackblitz.com/edit/typescript-beoogv?embed=1&file=index.ts&hideExplorer=1&theme=dark) with the code

```ts
export const Colors = {
  Blue: 'blue',
  Green: 'green',
} as const

export type Colors = typeof Colors[keyof typeof Colors]
// typeof Colors gives you the object literal above. ie const Colors
// keyof then gives you Blue & Green
// typeof Colors[Blue] = 'blue'
// typeof Colors[Green] = 'green'

function showColor(color: Colors) {
  console.log(color)
  return color
}

showColor('blue')
// evaluates to blue

showColor(Colors.Green)
// evaluates to green
```
## Some videos
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/JfcLkoBirZo" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>


<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/0fTdCSH_QEU" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>