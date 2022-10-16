---
title: "Guided Music"
date: 2022-01-15T13:57:35+02:00
description: better way to share curated music
tldr: better way to share curated music
tags: [planning, frontend, react, redux, graphql]
---

- draw inspiration from the spotify design website
- CMS driven 
    - comments are a crucial part of the thing - need a markdown editor
    - this will have to take genre's too
    - should be able to query via graphql
- spotify api driven
- can include a now playing section
- sharing by genre is a big one
- should be able to do editorial thing like band camp articles. 
    - could use MDX for this?
- homepage can have featured playlists the same way goosebumps used to have 
- a way to share mixes too eventually 
- plus bandcamp too eventually

## why
- a better way to present curated music
- maybe an opportunity to practice how to use sagas for state management
- opportunity to flex my design skills by building something sleek & very visually appealing
- think of how to improve on the guidefari.com experience for curated music
- storytelling, through music

## mood
- sleek
- sassy(SaaSy, you know, that design feel🥸)

## tech
- storybook for the components, to do testing & all
- Typescript
- tailwind for styles, maybe daisy too?
- images are a big part of this, look into optimizing them. first iteration will use spotify api for images though
- nextjs api to handle data hydration of the components
- redux sagas

### packages
- graphql-request

# future
- I could also eventually create a react native or iOS app that interfaces with the GraphCMS api, this is in the interest of an improved mobile experience, and also an excuse to build a mobile app, lol.

# References
{{<youtube N2q-ZYuQWI8>}}
{{<youtube 9zySeP5vH9c>}}
> define action objects, & dispatch them

{{<youtube iBUJVy8phqw>}}
{{<youtube 2hZhIoRuua4>}}
{{<youtube 1K26DIKt3w8>}}

## persistent layout in nextjs
- [Adam Wathan](https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/)
- [Tomas Gil](https://tomasgildev.com/posts/next-persistent-layout-typescript)
- [Katsiaryna (Kate) Lupachova](https://dev.to/ramonak/nextjs-dashboard-layout-with-typescript-and-styled-components-3ld6)