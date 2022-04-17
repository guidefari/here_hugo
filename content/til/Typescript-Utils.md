---
title: "Typescript Utils"
date: 2022-03-29T22:15:01+02:00
description: Saw use of Record, Omit, and decided to revisit the Typescript utils
tags: [til, typescript]
draft: true
---

## Record

## Omit
While typing the props of a component, we needed to have it allow styling props from the UI library we were consuming - that way, when reusing the custom component, you can style it using Chakra UI props, as you would with any of their components.

The problem is one of our props was a custom `onChange`, & the Chakra 