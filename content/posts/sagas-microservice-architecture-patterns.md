---
title: "Sagas Microservice Architecture Patterns"
date: 2021-10-20T14:40:57+02:00
description: notes on the saga's pattern
tags: [architecture, microservices, backend, frontend, redux, til]
---
I'm exploring `sagas` on backend, & frontend, via [redux](https://redux.js.org/).

# backend
{{<youtube WnZ7IcaN_JA >}}
### notes
- touches on & illustrates how choreography (event-based) vs orchestration (command-based) architecutures would look, when attempting to solve the same problem.

---

# frontend
{{<youtube _TwzWUUTPpk >}}

{{<youtube o3A9EvMspig >}}
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
{{<spotifyembed episode 0P9h3edCt6RfxV9q7MuFM4 "100%" 232 >}}
