---
title: "TIL: Prefer h-dvh over h-screen on iOS Safari"
date: 2026-06-14T09:59:54+02:00
description: On iOS and iPadOS Safari, h-screen can overshoot the visible viewport. h-dvh maps better to the space users can actually see.
tags: [til, css, tailwind, safari, ios]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Prefer+h-dvh+over+h-screen+on+iOS+Safari']
---

```css
/* Tailwind utility, expanded into real CSS */
/* <div class="lg:h-screen"> */
@media (width >= 64rem) {
  .lg\:h-screen {
    height: 100vh;
  }
}
/* <div class="lg:h-dvh"> */
@media (width >= 64rem) {
  .lg\:h-dvh {
    height: 100dvh;
  }
}
/* The key part is just this: */
height: 100vh;
height: 100dvh;
```

## The issue

`h-screen` is `height: 100vh;`.[^tailwind-height] On iOS Safari, `vh` behaves like the large viewport unit (`lvh`), meaning it assumes the browser UI is retracted.[^mdn-length] When the address bar and tab bar are visible, the element overshoots the visible viewport and causes clipping or overflow.[^webdev-viewport] `h-dvh` is `height: 100dvh;`, which tracks the visible viewport as the UI expands and contracts. For layouts that need to match the actual visible space on iPhone or iPad, `dvh` is the safer choice.

## Sources

[^tailwind-height]: Tailwind CSS, "height" docs: `h-screen` maps to `height: 100vh;` and `h-dvh` maps to `height: 100dvh;` <https://tailwindcss.com/docs/height>
[^mdn-length]: MDN, "`<length>` CSS type": `vh` is equivalent to `lvh`, and `dvh` tracks the dynamic viewport. <https://developer.mozilla.org/en-US/docs/Web/CSS/length>
[^webdev-viewport]: web.dev, "The large, small, and dynamic viewport units": `100vh` can be too tall on mobile when dynamic toolbars are visible, while `100dvh` adapts to them. <https://web.dev/blog/viewport-units>
