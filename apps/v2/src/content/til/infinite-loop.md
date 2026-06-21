---
title: "TIL: Env variables & Infinite Rerender"
date: 2024-03-22T10:56:13+02:00
description: useEffect? more like useFootgun
tags: [til, react]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Infinite+Loop']
---

I might start a little series of exploring common bugs in react.
Last one spoke about [trying to `array.map` on an empty array](/react-render-bug)

Key takeaways I hope you get from this:

- Use separate API keys for dev & prod
- The all too common infinite loop bug

## What happened?

I occasionally trigger an [infinite rerender](https://alexsidorenko.com/blog/react-infinite-loop/), especially when integrating a new library.

Now, here's where it gets interesting somewhere in [goosebumps](https://goosebumps.fm):

- I have [a component](https://github.com/guidefari/nextgoose/blob/master/src/components/Track.tsx) that does a network request to the spotify api
- I was trying to implement virtualized lists for [a page that renders hundreds of these components](https://goosebumps.fm/micro)
- I messed something up while implementing the virtualized list , and a ton of components tried to render, meaning hundreds/thousands of network calls
- Of course, the spotify API immediately put me in the naughty corner and rate limited me.
- This highlighted the importance of keeping separate API keys for your dev, and prod environment.

## use~~Effect~~Footgun

useEffect gets a lot of flak these days, but I still find it useful for quickly validating ideas & debugging.
It's an easy way to tap into the render lifecycle of a component, & sometimes I want to check something silly like
> What is the value of this variable when the component first mounts on the screen??

In this case, a console.log with an empty dependency array quickly answers this for me

```tsx
useEffect(() => {
  console.log(some_value)
}, [])
```

but I still occasionally botch it and trigger that infinite loop. Some may say, skill issue💀

## Related reading

- [useEffect infinite re-render](https://www.freecodecamp.org/news/prevent-infinite-loops-when-using-useeffect-in-reactjs/)
- [React Infinite loop](https://alexsidorenko.com/blog/react-infinite-loop/)
