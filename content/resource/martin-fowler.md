---
title: "Notes & Resource: Martin Fowler"
date: 2021-10-28T10:29:36+02:00
description: Various lessons and clippings from Martin Fowler.
tags: [microservices, devops, architecture, backend, resource, notes, process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Notes%20%26%20Resource%3A%20Martin%20Fowler']
---

# microservices
- [microservices.io](https://microservices.io/): I know this isn't Martin, but it may come in handy, too :)
- [main guide](https://martinfowler.com/microservices/)
- [microservice testing](https://martinfowler.com/articles/microservice-testing/)
- [micro frontends](https://martinfowler.com/articles/micro-frontends.html): long read, maybe 40 minute commitment, but a good read, worth a second read.
## event driven architecture
{{<youtube STKCRSUsyP0>}}
- [accompanying article](https://www.martinfowler.com/articles/201701-event-driven.html)
  - [event sourcing vs event driven architecture (not Martin, but related)](https://codeopinion.com/event-sourcing-vs-event-driven-architecture/)
- [CQRS](https://www.martinfowler.com/bliki/CQRS.html)


# continuous delivery
- [infrastructure as code](https://martinfowler.com/bliki/InfrastructureAsCode.html)
- [devops culture](https://martinfowler.com/bliki/DevOpsCulture.html)

# distributed systems
- [patterns of distributed systems](https://martinfowler.com/articles/patterns-of-distributed-systems/?utm_source=pocket_mylist): main aggregation page. 
- [ ] [generation clock](https://martinfowler.com/articles/patterns-of-distributed-systems/generation.html)
- [ ] [low water mark](https://martinfowler.com/articles/patterns-of-distributed-systems/low-watermark.html)
- [ ] [high water mark](https://martinfowler.com/articles/patterns-of-distributed-systems/high-watermark.html)

# Architecture & Workflows of refactoring
{{<youtube vqEg37e4Mkw>}}

{{<youtube DngAZyWMGR0>}}

- Make refactoring a part of your normal day to day workflow
- Boy scout rule, leave something cleaner than you found it, even if it's just a little bit

>  Clean code allows you to go faster

- Present arguments for refactoring with the economic incentive, not the emotional & ethical & "it's my duty as a software professional" to do refactoring
> Cast it in economic terms
- If it's a part of the codebase that's barely used, but still works as expected and doesn't slow you down, leave it alone
- knowing what to refactor, and how much effort is worth investing in it, is also an important consideration
- [Who needs an architect PDF](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf)
- [Software architecture guide](https://www.martinfowler.com/architecture/)
- Architecure starts around "What are the most critical parts of our application(s)"
- Good architecture allows for a more unified common understanding of how things work, how things are laid out.
> Expert developers' shared understanding of the system design
- that shared understanding, is effectively the architecture. architecture is a social thing
- Good design makes it easier to add features over time, as opposed to harder & more fragile. Address those pain points that make it harder to add features.

> Do the appropriate amount of refactoring, as you do your regular work

## Triggers for refactoring
1. Ever look at code and just feel like "**yuck**"? 
2. Have to touch a piece of code and it felt hard to understand? you had to follow variables, really slowly trace it till you finally got to an "**ah-ha**" moment? there's a chance you can rewrite that to be easier to understand. that way you don't have to go through it again, and anyone else from your team won't have to.
3. **We should have done it this way** - when you now have new context, you can evolve the codebase to fit what you now know.

## Refactoring strategies
1. **Planned refactoring** - if there's lots of cruft that just needs to be addressed, identify what needs to be refactored & tackle it like normal feature work. This is last resort though, as it's usually an uphill battle to sell to the business. More mature teams hardly have to rely on this
2. **Long term refactoring** - have a session with the team to communicate what the long term vision for the system is, how we'd like it to look. This way, anytime someone touches a relevant part of the codebase, they do that little bit of cleanup that's required to get 'em closer to that long term vision. This is a sustainable approach.

> We're doing this in order to be able to deliver more functionality more quickly
This is the essence of refactoring towards good design, **it's an economic thing**.

- Controversial take: You don't actually need to be telling this to management. It is your job to keep your codebase clean, and identidy whether or not it's slowing you down, and take the required steps to address that. If you don't do that, you're effectively stealing from your customer.