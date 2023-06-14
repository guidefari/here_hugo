---
title: "Javascript Proxy 101"
date: 2023-06-02T05:15:29+02:00
description: Someone gave me 5 minutes to do a sales pitch on the subject
tags: [design]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=Javascript%20Proxy%20101",
  ]
---

## What is a Proxy

> [Meaning "person who is deputed to represent or act for another" is from 1610s. Of things, "that which takes the place of something else,"](https://www.etymonline.com/word/proxy)

- The idea is used all over software. From networking, to programming, and reporting of metrics by product teams and analysts.
- In Javascript, [The Proxy object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Getter & Setter

When handling objects, these are the methods that retrieve or modify the contents of said object.

- These can be useful for simplifying interfaces, as it allows for equal syntax for properties & methods.
  - You don't have to know the underlying implementation of a class, "is this a method or a property?" is a question you don't have to ask yourself. This can reduce cognitive load when working.

```js
const mix = {
  title: "goosebumps #44",
  link: "",

  set newLink(link) {
    this.link = link;
  },
};

mix.newLink = "example.gb44.mp3";

console.log(mix.link); // example.gb44.mp3
```

Now with this in mind, proxies are commonly used to modify behaviour and set off side effects in these methods. And it makes sense, when updating properties, you might want to inform other parts of your system about what happened: logs, metrics, telemetry, RPC's, or running other code. Not limited to just this, of course

## Common use cases

- Framework authoring: [MobX](https://mobx.js.org/configuration.html), [SolidJS](https://www.solidjs.com/tutorial/stores_createstore), [Vue](https://vuejs.org/guide/extras/reactivity-in-depth.html#what-is-reactivity) and many more
- Native way to handle side effects, for things like logs
- In memory cache:

```js
const cache = {
    'John': ['55', '99']
}
const handler = {
    get: function(target, player) {
        if(target[player]) {
            return target[player]
        } else {
            fetch('some-api-url')
            .then((scoreboard) => {
                target[player] = scoreboard
                return scoreboard
            })
        }
    }
}
const proxy = new Proxy(cache, handler)
// access cache and do something with scoreboard
- https://blog.logrocket.com/practical-use-cases-for-javascript-es6-proxies/
```

- Validation
- Access control

You might not use them everyday, but knowing they exist & understanding them to some level will help you identify situations they're useful in

## Caveats and things to be aware of

- They can complicate code, especially if used unnecessarily
- They don't have 100% browser coverage, but this may be negligible
- Not as performant as native objects

## Related reading

- [Proxy & Reflect from javascript.info](https://javascript.info/proxy)
  a great source for written JS material
- [Challenge: Creating an observable](https://javascript.info/task/observable)
- [Logrocket: Practical use cases for JavaScript ES6 proxies](https://blog.logrocket.com/practical-use-cases-for-javascript-es6-proxies/)
- [Use JavaScript Proxies for Caching](https://newcubator.com/devsquad/366/use-javascript-proxies-for-caching)
- [6 Ways to Implement Metaprogramming in JavaScript with Proxies](https://www.codemotion.com/magazine/frontend/javascript/implement-metaprogramming-javascript-proxies/)
- [Exploring the Power of JavaScript Proxies and Reflect API](https://soshace.com/exploring-the-power-of-javascript-proxies-and-reflect-api/)
- [repo](https://github.com/txndai/proxy)
- [JavaScript Getter and Setter](https://www.programiz.com/javascript/getter-setter)
- [Javascript.info - Property getters and setters](https://javascript.info/property-accessors)
