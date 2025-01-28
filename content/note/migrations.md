---
title: "On Migrations"
date: 2024-08-17T11:43:42+02:00
description: Will Larson on Migrations, from the book Elegant Puzzle
tags: [strategy]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Migrations']
---

- Migrations are essential, and frustratingly frequent as your codebase ages and your business grows.
- Most tools/processes only support about one order of magnitude of growth before becoming ineffective.
  - Rapid growth therefore makes migrations a way of life.
  - Whether it's growth in number of users of a system, or number of developers
- Migrations are usually the only available avenue to make meaningful progress on tech-debt.
- They also occupy the awkward territory of reduced immediate contribution today
in exchange for more capacity tomorrow.
  - This makes them controversial to schedule
- They also get more expensive to carry out as your system grows.

## Running good migrations
**De-risk** (trigger word, if you know you know💀)
- As quick & cheaply as reasonably possible
- Workshop it with one or two of the most challenged teams. Document, evolve, and migrate with them, so you can build a safe, repeatable playbook for the rest of the organisation.
- Effective de-risking is essential, each team who endorses a migration is making a bet on you that you're going to get this thing done.

**Enable**
- On top of documentation, try to maximise on programmatic migration

**Finish**
> Starting but not finishing migrations often incurs significant technical debt, so your incentives and recognition structure should be careful to avoid perverse incentives.

---

[Read the rest of the book notes here. (Elegant Puzzle by Will Larson)](/elegant-puzzle)