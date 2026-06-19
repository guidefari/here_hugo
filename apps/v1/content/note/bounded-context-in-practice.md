---
title: "Bounded Context in Practice"
date: 2023-11-17T17:51:46+02:00
description: 
tags: [ddd, playbook]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Bounded+Context+in+Practice']
---
Theory
> a Bounded Context is a semantic contextual boundary. This means that within the boundary each component of the software model has a specific meaning and does specific things.

> Remember that a Bounded Context is where a [model](https://martinfowler.com/eaaCatalog/domainModel.html) is implemented, and you will have separate software artifacts for each Bounded Context.

# In Practice
- I think this translates to having separate ubiquitous language docs. With each doc separated by the bounded context.
- Keep your artifacts (docs & diagrams) anywhere you can have multiple people work on one file, plus the ability to leave comments.
  - eg confluence, notion, google docs
- Bear your [audience](https://developers.google.com/tech-writing/one/audience) in mind - who’s reading/maintaining these ubiquitous language docs? 
- What other bounded contexts do you have to interact with? A way to think about this is [Team Interaction Modeling with Team Topologies](https://teamtopologies.com/key-concepts-content/team-interaction-modeling-with-team-topologies)
- Event storming for domain modelling
  - miro/figma boards for domain modelling.

# Related Reading
- [Team topologies (book)](https://teamtopologies.com/book)

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/NvBsEnDgA4o" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
