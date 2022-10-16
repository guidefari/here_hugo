---
title: "Mobile First Styling"
date: 2021-10-26T18:26:32+02:00
description: Styling is 'easier' if you use a mobile first approach.
tags: [frontend, tailwind, styling]
aliases: [mfs]
---

I first came across this way of thinking about styles from Adam Wathan. Style for the mobile layout first, and `extend` your styles to accomodate for the larger breakpoints. the arguement is that it's easier to expand a small design into a bigger layout than it is to do the opposite, extending *desktop first* styles to accomodate for mobile & other smaller screens.

Extending of those styles is then done using `min-width` breakpoints. Illustrated much better than I can explain in this video (he uses [tailwind](https://tailwindcss.com/) in this example, but the principles & mindset apply to vanilla css.) :

{{<youtube Ff_n_QClipQ>}}