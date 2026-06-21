---
title: "React Observables"
date: 2022-09-15T08:25:25+02:00
description: An attempted answer to a question asked in the Frontend masters Discord
tags: [frontend, architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=React%20Observables']
---

There are a few ways to do observables in React.
1. RxJS
2. Mobx
3. Vanilla JS Object.freeze

# MobX
I've been writing MobX for a few weeks now, and in a nutshell, here's how it works:
- You create a store (singleton object, constructed using a class) - **the observable**
- You **observe** the store in your components

# Vanilla JS
I haven't tried this with react yet, but vanilla JS allows you to follow the observables pattern. Frontend masters has a course that teaches these patterns pretty well.

### Why you might wanna use a library instead of vanilla js
What's difficult about handling objects?

## Svelte stores as an example
Svelte uses JS objects as their store. There's a lovely tutorial that shows how this is done.