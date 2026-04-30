---
title: "Effective"
date: 2026-02-04T09:09:29+02:00
description: "Effect has been slowly infesting my Typescript codebases, let's explore why"
tags: [typescript, software-design]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Effective"]
---

All backend logic uses **Effect** for dependency injection,
error handling, and composition. Services are defined with
'Effect.Service and composed into a live layer in app/services/
layer. ts". Routes execute effects via 'runtimeLive.runPromise
(...).

- RE dependency injection, the invoicing app is a good example. like how I effortlessly swap out the db layer in the test suite
- OTel is baked in! Functions are wrapped in spans, and it's relatively straightforward to send things to a trace collector

* barrier to entry is lower than ever, because LLM
* Abstracting your program into services
* Layers, providers, testing, modular effect of it all
* the highly expressive type system is a great feedback loop for llm's
