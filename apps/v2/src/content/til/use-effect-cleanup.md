---
title: "Use Effect Cleanup"
date: 2023-10-04T05:08:30+02:00
description: 
tags: [react]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Use+Effect+Cleanup']
---

## What is useEffect cleanup about?

Thuto’s description helped me grok it much better than the docs:

> Usually with your clean up function in your useEffect, you would be *deleting* (lack of a better word) and canceling any async calls which might come back and find that the component no longer exists.

Perfectly illustrates how a memory leak can happen

# React Native Component/Screen unmounting
- in react-native, screens don’t always unmount. This is dependent on how you do your routing. 
  - be weary of this when relying on useeffect cleanup 
- I think components do unmount, I don’t have a deterministic description of this yet
## 🔥: Here’s how you can quickly check if the file you’re working on unmounts or not

```tsx
useEffect(() => {
return () => console.log('I just unmounted')
}, [])
```

## Things you might want to clean up
- Event listeners
- DB connections
- web socket connections
- timers like `setInterval`


## useEffect alternatives
- use an event handling function instead
- React Query pattern is good
  * `const {data, error, isLoading} = someFunction()`
  * this declaration is done at the top level of the component
  * `someFunction()` can be a hook, util function, or an abstraction that exists only in the component calling it
  * does this work well with async?

## Related reading
- [Full React Tutorial \#24 - useEffect Cleanup](https://www.youtube.com/watch?v=aKOQtGLT-Yk) - Nice and short illustration by Net Ninja
- [Goodbye, useEffect - David Khourshid](https://youtu.be/bGzanfKVFeU?si=65MKnn-jC149b9Pz) - Great to sharpen overall mental model around useEffects. Plus an intro to state machines right at the end of the talk
- [You might not need an effect](https://react.dev/learn/you-might-not-need-an-effect) - Long, but a good read