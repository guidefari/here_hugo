---
title: "Book Notes: Team Topologies"
date: 2022-10-17T07:18:01+02:00
description: "highlights, quotes, & other interesting bits from Team Topologies"
tags: [book, notes, leadership, agile, process, playbook]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Book%20Notes%3A%20Team%20Topologies']
---

- [Get the book here](https://itrevolution.com/team-topologies/)

# Team first thinking
 - The team is the means of delivery
 - design team for [cognitive load]({{<ref cognitive-load-theory>}}). Team has a maximum size, of about 8 people. This will also naturally limit the size of the software that the team has to be responsible for, while still understanding their domain pretty well
 - Choosing boundaries for team ownership is a skill. Definitely not something that should be done by a manager with no technical awareness, as it impacts the architecture of your software - Conway’s law
- On **Conway’s Law**: The way your teams are structured, dictates how your software architecture turns out.
    - Reverse Conway to mitigate worst effects

# Four Different Types of Teams 

## 1. Stream aligned teams
- Organised around value streams. As Jeff Bezos says, this kind of team should have “line of sight to a customer”

> A **stream** is the continuous flow of work aligned to a business domain or organizational capability.

- Operate best when independent, & not requiring handoffs to other teams do parts of the work
- They focus on a [business mission](https://newsletter.pragmaticengineer.com/p/the-platform-and-program-split-at)

> The other types of teams **make the stream aligned teams go faster**

## 2. Enabling team

- These help manage scarcity. Eg there aren’t a lot of security engineers, user researchers, super good infrastructure okes going around. Enabling teams then act as consultants to the other teams
- The nature of their work looks a lot like "from R&D -> Education/Coaching mode"

## 3. Complicated subsystem team

Think PhD math people working on a complex bit of the product,
such as trip forcasting ML jobs for a logistics company.

## 4. Platform Team

- These focus on a technical mission
- Their customers are usually internal users.
  - Sometimes can be public, eg in the case of building a public facing SDK

Some literature on the topic: 
- [Platform stories from ING bank](/ing-bank)
- [The Platform and Program Split at Uber](https://newsletter.pragmaticengineer.com/p/the-platform-and-program-split-at)

# Team interaction modes
The book highlights that "Well defined interactions are key to effective teams"

> A team may have been told it is autonomous and self-organizing, but team members find they have to interact with many other teams in order to complete their work; and this feels frustrating.

I felt this. Especially difficult
This is usually a smell for unbalanced team are organisation.
Either not enough senior folk in the one team, or an improper mapping of **service/domain ownership -> team**.

> What must be avoided is the need for all teams together
> communicate with all other teams in order to achieve their ends


Anyway, onto the interaction mode that were recommended.

## Collaboration
- 2 teams working together (or subsets of 2 teams). A useful constraint for managing dependencies is 
 > Constraint: A team should use collaboration mode with, at most, one other team at a time

 - Watch that this isn't happening too often though, as that's an indication of teams not having been sliced properly.
 - Communication & [coordination](https://cutlefish.substack.com/p/tbm-261-dependencies-in-faster-growing) overhead is something to look out for.
 - 
## X-as-a-service
- 1 provides, 1 consumes.
- Works best when the provider really takes into consideration the [developer experience](/dx).

## Facilitating
- 1 team helps another

> A combination of all three team interaction modes is likely needed for most medium-sized and large enterprises (and these modes are useful to introduce at smaller organizations sooner than many people expect).

## Thinnest Viable Platform

- What’s the thinnest platform that could work?
- If your org decides “we use AWS”, your thinnest viable platform can be something as small as a wiki page saying “these are the 5 AWS services that we use for ABCD”

# Related reading

- [Beyond the spotify model](/beyond-spotify-model)
- [The Platform and Program Split at Uber](https://newsletter.pragmaticengineer.com/p/the-platform-and-program-split-at)
- [Engineering management for the rest of us](/engineering-management)
- [Introduction to Shape Up](/shape-up-notes-introduction) - an alternative to scrum, popularised by [37signals](https://37signals.com/)
- [Cognitive load theory](/cognitive-load-theory)
- [ING Bank's approach to structuring teams & work](/ing-bank)
- [Thoughtworks' James Lewis on Team topologies](/tt-jl)
- [Podcast: Reckoning with the force of Conway's Law](/conways-law)
