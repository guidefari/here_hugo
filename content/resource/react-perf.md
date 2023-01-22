---
title: "React Performance"
date: 2022-04-18T14:04:27+02:00
description: Resources to help you write more performant react
tldr: Resources to help you write more performant react
tags: [resource, performance, react]
---

{{<youtube 6zpzo6y4PDo>}}

## Articles

- [How to write performant React code: rules, patterns, do's and don'ts](https://www.developerway.com/posts/how-to-write-performant-react-code)

> Good article, but be careful, sometimes you get better performance from the component re-rendering than wrapping it in a useMemo, I suggest only using it on resource intensive components or when its needed to solve a bug, also I don't entirely agree on the use of useCallback here, useState already provides cached management, but i might have misread something about why it was done this way in the article
