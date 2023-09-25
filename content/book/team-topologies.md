---
title: "Book Notes: Team Topologies"
date: 2022-10-17T07:18:01+02:00
description: "highlights, quotes, & other interesting bits from Team Topologies"
tags: [book, notes, leadership, agile, process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Book%20Notes%3A%20Team%20Topologies']
---

- [Get the book here](https://itrevolution.com/team-topologies/)

# 1.0 Four Different Types of Teams
1. **Stream aligned teams**: organised around value streams, delivering value to a customer. As Jeff Bezos says, this kind of team should have “line of sight to a customer”

**These other teams make the stream aligned teams go faster**

1. **Enabling team**: these help manage scarcity. Eg there aren’t a lot of security engineers, user researchers, super good infrastructure okes going around. Enabling teams then act as consultants to the other teams
1. **Complicated subsystem team** - think PhD math people working on a complex bit of the product
1. **Platform Team** - platform & platform 2.0 from [ING bank]({{<ref ing-bank>}}) pretty interesting

## Team first thinking
 - The team is the means of delivery
 - design team for [cognitive load]({{<ref cognitive-load-theory>}}). Team has a maximum size, of about 8 people. This will also naturally limit the size of the software that the team has to be responsible for, while still understanding their domain pretty well
 - Choosing boundaries for team ownership is a skill. Definitely not something that should be done by a manager with no technical awareness, as it impacts the architecture of your software - Conway’s law
- On **Conway’s Law**: The way your teams are structured, dictates how your software architecture turns out.
    - Reverse Conway to mitigate worst effects
### Team interactions
  - 2 teams working together
  - X-as-a-service: 1 provides, 1 consumes. works best when the provider really takes into consideration the developer experience.
  - Facilitating: 1 team helps another

## Thinnest Viable Platform

- What’s the thinnest platform that could work?
- If your org decides “we use AWS”, your thinnest viable platform can be something as small as a wiki page saying “these are the 5 AWS services that we use for ABCD”

# Beyond the spotify model
{{<youtube lj71GcOnIW8>}}

### Its limitations

- From the original blog post about Spotify Model “this article is only a snapshot of our current way of working - a journey in progress, not a journey completed. By the time you read this, things have already changed” - Kniberg & Ivarsson
- no heuristics for Conway’s law
- no patterns for team interactions
- no triggers for change and evolution

### its strengths

- Encourages flow of change, as each team has all the capabilities it needs to deliver value
- establishes and clarifies team responsibilities. no ambiguity in who owns what
- promotes good kind of collaboration between teams
- plans and budgets for cross-team enablers - think guilds; bringing people together from all over the organisation

# Related reading
- [Engineering management for the rest of us]({{<ref engineering-management>}})
- [Introduction to Shape Up]({{<ref shape-up-notes-introduction>}}) - an alternative to scrum, popularised by [37signals](https://37signals.com/)
- [Cognitive load theory]({{<ref cognitive-load-theory>}})
- [ING Bank's approach to structuring teams & work]({{<ref ing-bank>}})
- [Thoughtworks' James Lewis on Team topologies]({{<ref tt-jl>}})
- [Podcast: Reckoning with the force of Conway's Law]({{<ref conways-law>}})