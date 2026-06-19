---
title: "Raycast Extension Development"
date: 2025-01-20T22:58:48+02:00
description: I worked on some raycast extensions over the holidays. This note shares some of my experiences
tags: [dx]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Raycast+Extension+Development']
aliases: ['red']
---

## Housekeeping & Context

- [My Affiliate link](https://www.raycast.com/?via=guide)
- First extension I worked on - [Close All Open Apps](https://www.raycast.com/guide/close-apps)
- Contributed to [tmux sessioner](https://www.raycast.com/louishuyng/tmux-sessioner)

## Getting started
The raycast team makes it straightforward to get started. I watched like 10 minutes of the video below, then resorted to the docs from there and it was smooth sailing.

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/YPGU-pB5JgY" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## What you can create
- Script Command - simpler and more bare bones, allows you to fire off scripts from raycast. 
You can choose from Bash, Apple script, Swift, Python, Node, or Ruby.
- Full on UI extensions - There's templates to pick from here

## Raycast CLI
- Helps with the publishing process - it automatically opens a pull request for you
- Formatting & lint stuff - includes opinionated configs for prettier & eslint

## The git stuff
Full disclosure, I still have a few gaps here. The repo is so big that cloning the whole thing to work on one 
extension is not practical. Forking an extension from the raycast ui makes starting out a lot easier.

But when you have to review & debug PR's, you have to reach for the terminal.

That's where `git sparse checkout` comes in. This allows you to checkout specific directories from a repo
instead of cloning the whole thing.

# Demos

## [Tmux sessioner](https://www.raycast.com/louishuyng/tmux-sessioner)
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/OoOND8Cq4kM" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## [Close All Open Apps](https://www.raycast.com/guide/close-apps)

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/cwjrNU1adIc" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## [MacPorts](https://www.raycast.com/guide/macports)

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/e3puuWJDZas" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## Conclusion
Overall, I found the developer experience here to be pretty amazing. 
- Easy to get started
- Easy to dev & debug
- Very helpful docs
- Well thought out components
- Lots of other extensions to reference