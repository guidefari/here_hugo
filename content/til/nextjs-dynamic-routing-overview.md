---
title: "Nextjs Dynamic Routing Overview"
date: 2021-11-10T14:24:01+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, nextjs, frontend]
---

as simple as it is, I **always** find myself needing a *quick* refresher on dynamic routing in nextjs. & the docs don't feel like they do it justice, all the time.


# dynamic routes
this taught me how to use `pages/product/index.js` - it then becomes the page for `localhost:3000/product`, alongside the use of `pages/product/[productId].js` to dynamically get the details of `localhost:3000/product/1`
{{<youtube Ql5kyJaYbls>}}

# nested dynamic routes
{{<youtube nfAxNTmme64>}}

#### file structure screenshot
![screenshot from youtube video above](/images/review.png)

with this, you get the route `localhost:3000/product/1/review/2`. when creating the files/folders under nextjs' pages directory, square brackets `[ ]` imply **dynamic**. meaning the **1** & **2** in the url above, are in fact dynamic, and it's nested.