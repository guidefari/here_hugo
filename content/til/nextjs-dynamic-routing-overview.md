---
title: "Nextjs Dynamic Routing Overview + URL params"
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

---

# url params in rest api
I'm looking at the [uber developer api](https://developer.uber.com/docs/eats/api/v2/get-eats-stores-storeid-menus), and needed to confirm the difference between a `query` parameter & a `path` parameter. [notes are from this site](https://qascript.com/rest-assured-query-parameter-vs-path-parameter/).

## Query parameter
> allows us to control what data is returned in endpoint resources.
> it appears at the end of a URL after the question mark.

the query params in this url `https://api.github.com/user/repos?sort=created&direction=desc`:
1. `sort`
2. `direction`

## Path parameters
> are variables in a URL path. they are used to point to a specific resource within a collection.

the path parameter in this url `https://api.github.com/users/:username/repos` is `usernames`