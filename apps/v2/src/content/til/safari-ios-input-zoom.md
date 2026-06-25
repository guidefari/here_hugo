---
title: "TIL: Avoid text-sm on inputs - iOS Safari zooms on focus"
date: 2026-06-21T20:00:00+02:00
description: "On iOS and iPadOS Safari, an input with a computed font-size below 16px auto-zooms the viewport on focus. text-sm (14px) triggers it; text-base (16px) does not."
tags: [til, css, tailwind, safari, ios]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Avoid+text-sm+on+inputs+-+iOS+Safari+zooms+on+focus']
---

```css
/* <input class="text-sm" /> */  .text-sm { font-size: 0.875rem; }   /* 14px */
/* <input class="text-base" /> */ .text-base { font-size: 1rem; }      /* 16px */
/* The key part: keep input font-size >= 16px */
```

## The issue

iOS Safari auto-zooms the viewport when an input is focused and its computed `font-size` is below 16px.[^safari-ios-zoom] The page jumps, the input centers at a larger size, and the user has to manually pinch out to see the layout they were just on. `text-sm` in Tailwind is 14px, so any input tagged with it triggers the zoom. The same trap applies to `text-xs` (12px) and any inline `font-size: ...px` that lands under 16.[^webkit-blog-5611]

The fix is to use `text-base` (16px) or larger on the input itself. The label, helper text, and surrounding copy can stay small - the zoom check only fires on the focused control.

## Worked example

```html
<!-- Bad: triggers the iOS auto-zoom -->
<input type="email" class="font-mono text-sm ..." />

<!-- Good: 16px is the floor that keeps the viewport steady -->
<input type="email" class="font-mono text-base ..." />
```

The padding (`px-3 py-2`) and visual density can stay identical - the only change is the font-size, so the input renders the same way on every browser except iOS Safari, which is the one that stops jumping.

## Why 16px specifically

Apple picked 16 as the threshold for the same reason browser zoom sits at 100% by default: it's roughly the body-text size and the point at which the input is comfortably tappable without needing an enlarged viewport. Chrome on Android does the same thing for the same reason.[^chrome-mobile-text-size]

## Sources

[^safari-ios-zoom]: Stack Overflow, "Disable Auto Zoom in Input 'Text' Tag - Safari on iPhone": iOS Safari auto-zooms inputs with font-size less than 16px on focus. <https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone>
[^webkit-blog-5611]: WebKit Blog, "More Responsive Tapping on iOS": tap targets and form controls - 16px minimum for text inputs to avoid the focus-zoom. <https://webkit.org/blog/5611/more-responsive-tapping-on-ios/>
[^chrome-mobile-text-size]: Chrome for Developers, "Mobile text size adjustment": Chrome on Android applies the same 16px threshold to keep form text legible. <https://developer.chrome.com/docs/css-ui/mobile-text-size-adjustment>
