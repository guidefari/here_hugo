---
title: "Book Notes: Team Topologies"
date: 2022-10-17T07:18:01+02:00
description: "highlights, quotes, & other interesting bits from Team Topologies"
tags: [book, notes, leadership, agile, process]
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
# - [ ] each of these should probs be under their own heading
1. **Stream aligned teams**: organised around value streams, delivering value to a customer. As Jeff Bezos says, this kind of team should have “line of sight to a customer”

- [ ] What does a good stream aligned team look like?

**These other teams make the stream aligned teams go faster**

1. **Enabling team**: these help manage scarcity. Eg there aren’t a lot of security engineers, user researchers, super good infrastructure okes going around. Enabling teams then act as consultants to the other teams
1. **Complicated subsystem team** - think PhD math people working on a complex bit of the product,
such as trip forcasting ML jobs for a logistics company.
1. **Platform Team** - There's lots of examples of what this can look like. 
  1. (note to self: one sentence summary plus link to a post by Gergely or similar)
  2. platform & platform 2.0 from [ING bank]({{<ref ing-bank>}}) pretty interesting

# Team interaction modes
# - [ ] each of these should probs be under their own heading
The book highlights that "Well defined interactions are key to effective teams"

> A team may have been told it is autonomous and self-organizing, but team members find they have to interact with many other teams in order to complete their work; and this feels frustrating.

I felt this. Especially difficult
This is usually a smell for unbalanced team are organisation.
Either not enough senior folk in the one team, or an improper mapping of **service/domain ownership -> team**.

> What must be avoided is the need for all teams together
> communicate with all other teams in order to achieve their ends


Anyway, onto the interaction mode that were recommended.
  - Collaboration: 2 teams working together. A useful constraint for managing dependencies is 
  "A team should be working with max 1 other team at any given time".
  - X-as-a-service: 1 provides, 1 consumes.
  Works best when the provider really takes into consideration the developer experience.
  - Facilitating: 1 team helps another

> A combination of all three team interaction modes is likely needed for most medium-sized and large enterprises (and these modes are useful to introduce at smaller organizations sooner than many people expect).

## Thinnest Viable Platform

- What’s the thinnest platform that could work?
- If your org decides “we use AWS”, your thinnest viable platform can be something as small as a wiki page saying “these are the 5 AWS services that we use for ABCD”

# Related reading

- [Beyond the spotify model](/beyond-spotify-model)
- [Engineering management for the rest of us]({{<ref engineering-management>}})
- [Introduction to Shape Up]({{<ref shape-up-notes-introduction>}}) - an alternative to scrum, popularised by [37signals](https://37signals.com/)
- [Cognitive load theory]({{<ref cognitive-load-theory>}})
- [ING Bank's approach to structuring teams & work]({{<ref ing-bank>}})
- [Thoughtworks' James Lewis on Team topologies]({{<ref tt-jl>}})
- [Podcast: Reckoning with the force of Conway's Law]({{<ref conways-law>}})
