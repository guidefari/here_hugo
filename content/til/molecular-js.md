---
title: "TIL: Molecular JS"
date: 2022-08-12T10:24:48+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, backend, node, microservices]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Molecular%20JS']
---

## Resources
{{<youtube t4YR6MWrugw>}}
- [My repo](https://github.com/txndai/molecular)

# What is molecular
[A microservices framework](https://moleculer.services/)

## Core concepts
- **Service**: Simple JS module that contains a set of functions
- **Node**: An OS process that **hosts one or many services**
- **ServiceBroker**: Manages services & communication between them. **One Service broker per node**

## Interesting bits
- Molecular is transport independent, can be used with MQTT, TCP, Redis, NATS (Streaming too), Kafka
- Built in load balancing, fault tolerance mechanisms, validators, cache, health monitoring & metrics, dynamic service discovery & registry.
- every action receives `ctx` as input

# Tid bits
- actions are public functions that other services can call
- methods are private functions that are only available within the scope of said service
- services also have lifecycle handlers, ie `created()`, `started()`, and `stopped()`
- molecular's REPL can be pretty handy. used it to load a service, & testing it out too.

## `api.service.js`
```js
const ApiGateway = require("moleculer-web");
```
- `molecular-web` is an http server, and it is then declared as a `mixin` in this file.
- **url pattern:** `localhost:3000/api/[service]/[action]`

#### [Mixin definition](https://en.wikipedia.org/wiki/Mixin)
> a class that contains methods for use by other classes without having to be the parent class of those other classes. How those other classes gain access to the mixin's methods depends on the language. Mixins are sometimes described as being "included" rather than "inherited".
