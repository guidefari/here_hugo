---
title: "TIL: Typography sizing for a blog"
date: 2024-11-07T06:17:37+02:00
description: Fixing horizontal scroll, refactoring my typography sizing.
tags: [til, ux, frontend, design, css]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Typography']
---

## Context
I wasn't happy with the size of headings on [goosebumps](https://goosebumps.fm) - particularly the `h1` & `h2` on mobile.
They were causing horizontal scroll 🤢

I build on top of the scaled typography stuff that [Ronny](https://ronnypries.de/) shared with me a few years ago.

## Constraint
I don't enjoy writing responsive styles, so I didn't even want to think about media queries

## Resources used
- [Carmen Ansio - Creating a modular typography scale with CSS ](https://dev.to/carmenansio/creating-a-modular-typography-scale-with-css-2d29)
- [Chris Lema - What is the right font size for your blog?](https://chrislema.com/what-is-the-right-font-size-for-your-blog/)
- [Zell Liew - Why is Vertical Rhythm an Important Typography Practice?](https://zellwk.com/blog/why-vertical-rhythms/)

## Snapshot of where I landed

```css
:root{
    --scale-ratio: 1.333;
    --font-size-1: clamp(0.875rem, 1rem, 1rem);
    --font-size-2: clamp(1.125rem, calc(var(--font-size-1) * var(--scale-ratio)), 1.25rem);
    --font-size-3: clamp(1.5rem, calc(var(--font-size-2) * var(--scale-ratio)), 1.75rem);
    --font-size-4: clamp(2rem, calc(var(--font-size-3) * var(--scale-ratio)), 2.25rem);
    --font-size-5: clamp(2.625rem, calc(var(--font-size-4) * var(--scale-ratio)), 3rem);
}

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
    margin-top: calc(1ex * 1.65);
    margin-bottom: calc(0.5ex * 1.65);
    word-wrap: break-word;
  }

  h1 {
    font-size: clamp(2rem, 5vw, var(--font-size-5));
  }

  h2 {
    font-size: clamp(1.75rem, 4.5vw, var(--font-size-4));
  }

  h3 {
    font-size: clamp(1.5rem, 4vw, var(--font-size-3));
  }

  h4 {
    font-size: clamp(1.25rem, 3.5vw, var(--font-size-2));
  }

  h5 {
    font-size: clamp(1rem, 3vw, var(--font-size-1));
  }

  h6 {
    font-size: clamp(0.875rem, 2.5vw, var(--font-size-1));
  }

  p,
  li,
  ul,
  body {
    font-size: var(--font-size-1);
    line-height: clamp(calc(var(--font-size-1) * 1.5),
        2rem,
        3rem);
  }
```