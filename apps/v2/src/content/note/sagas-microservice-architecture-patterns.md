---
title: "Sagas Microservice Architecture Patterns"
date: 2021-10-20T14:40:57+02:00
description: notes on the saga's pattern
tags: [architecture, microservices, backend, frontend, redux, til]
---
I'm exploring `sagas` on backend, & frontend, via [redux](https://redux.js.org/).

# backend
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/WnZ7IcaN_JA" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
### notes
- touches on & illustrates how choreography (event-based) vs orchestration (command-based) architecutures would look, when attempting to solve the same problem.

---

# frontend
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/_TwzWUUTPpk" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/o3A9EvMspig" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
### notes
>  `Redux-saga` is a **middlewear** that helps us get a more async looking style of code

> our sagas are split into 2 categories, **watchers** & **workers**.

- this is just convention, not necessarily the only way to do it.
- **watcher sagas see every action that is dispatched to the redux store, if it matches the action they are told to handle, they assign it to their worker saga**
  - *is this a form of orchestration? as seen & explained in the first backend video*

#### effect creators
- **`call`:** runs a function. if it returns a promise, the saga is paused until it's resolved.
- **`put`:** dispatches an action.
- **`takeEvery`:** takes every matching action and runs the matching saga, can run concurrent tasks.
- **`takeLatest`:** takes every matching action and runs the matching saga, but cancels any previous saga task, if it is still running.
- the `effect creators`(`call`, `put` `take` etc) return plain javascript objects - & don't execute anything, but given to the middlewear, that's where the action happens


---

# resource that made me look into this
<iframe src="https://open.spotify.com/embed/episode/0P9h3edCt6RfxV9q7MuFM4" width="100%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify episode embed"></iframe>
