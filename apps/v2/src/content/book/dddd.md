---
title: "Book Notes: Domain Driven Design Distilled"
date: 2022-02-17T09:06:17+02:00
description: "highlights, quotes, & other interesting bits from Domain Driven Design Distilled and Implementing DDD by Vaughn Vernon"
tldr: very early draft, structuring a note I'd like to start filling up at some point 🙂
tags: [book, notes, backend, ddd]
---

- [Book](https://www.goodreads.com/book/show/28602719-domain-driven-design-distilled)

# Nice summary

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/8Z5IAkWcnIw" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## There's no DDD without Domain Experts

You need to be committed to building a team around them, and having constructive conversations with them.

## Strategic Design

- Domains
- Subdomain
- Bounded Context
- Ubiquitous Language

## Core domain
> Your organization can’t be the best at everything, so it had better choose carefully at what it must excel. - DDDD

> “Your organization will benefit most from software models that explicitly reflect its core competencies. The DDD tactical development tools can help you and your team design useful software that accurately models the business’s unique operations.”

> *the* key strategic initiative of your organization, *is* called the Core Domain. A Core Domain is developed to distinguish your organization competitively from all others.

## What is DDD
> In short, DDD is primarily about modeling a Ubiquitous Language in an explicitly Bounded Context.

## Bounded Context
> a Bounded Context is a semantic contextual boundary.
> This means that within the boundary each component of the software model has a specific meaning and does specific things.

## De-risk business
In a rote about [platform risk](/platform-risk), I spoke about how identifying your core domain can be a way to mitigate the risk your business is exposed to.

# Related reading
- [Domain Model by Martin Fowler](https://martinfowler.com/eaaCatalog/domainModel.html)
