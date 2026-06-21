---
title: "Nestjs Rest Api Notes"
date: 2021-10-25T09:38:44+02:00
description: Notes from a nest js crash course
tags: [backend, node, notes]
---

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/wqhNoDE6pb4" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

 - [my repo](https://github.com/txndai/nest-rest-api)

- Controller describes the endpoints & grabs the params from the url.
  - then calls a service method, that's where we handle anything to do with our data.
- **why is it recommended for the controller to use a DTO while a service can use an interface?**
  - Nest recommends for your DTO to be a regular `class` & not an interface. the docs explain why [here](https://docs.nestjs.com/controllers#request-payloads).
> in our class, we need a constructor, cause  we're using dependency injection.

- **difference between a model & a schema btw? where each is used**