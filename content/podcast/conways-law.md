---
title: "Podcast: Reckoning with the force of Conway's Law"
date: 2022-11-19T13:16:43+02:00
description: You might find this podcast useful👇
tags: [podcast, architecture, leadership]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Reckoning%20with%20the%20force%20of%20Conways%20Law']
---

{{<spotify episode 5Gzga4LIgZy3BdFtIZragP "100%" 232 >}}
- [Transcript of the episode](https://www.thoughtworks.com/insights/podcasts/technology-podcasts/reckoning-with-the-force-conways-law)

## Conway's law defined
> the idea that organizations are constrained to produce systems that mirror their communication structures

> Basically, the way a development team organizes itself will constrain the shape of the system that comes out.
# Key takeaways
- Any good architect needs to be aware of the effects of conways law on their systems
- Understanding organisation design is an important skill for architects
- Inverse conway maneuver
- Take cognitive load into consideration when thinking about organization design
- Architecture is expected to evolve

# Transcript highlights

### Inverse Conway Maneuver?
 
> Johnny Leroy and Matt Simons. They wrote an article in 2010, already, about this idea of using this power of the law to your advantage by thinking about your architecture and then organizing your teams accordingly so you would get that architecture.

> It was certainly a major feature around microservices. The name microservices makes a lot of people think small services.. there are many characteristics of microservices that James and I identified in our original paper. 
> organizing around business capabilities and the idea that you have a team, and it's partly inspired by the Amazon two-pizza teams, which are both small, but also focused on a particular customer interaction.


### Team Topology stuff
> I'd even go further than that now because there's quite a lot of evidence that points to the fact that the deeper the hierarchy of an organization, so essentially the further information has to flow between elements of an organization within an organizational design, the slower an organization proceeds and in fact, the less effective an organization is at doing the thing that it's there for which is making money, saving lives, or whatever it is.


### Domain Driven Design

> Domain-driven design thinking and all of those things. So if you start by looking at how is our product structured, and then we want the architecture to be similar to that because then we'll also have less dependencies and it will be easier for our product people to work with that and then it almost becomes a cycle. You look at how is the product structured? How is the domain structured? That's how the architecture should be

> James: A business capability, going back to the old Microsoft definition, is the people, processes, and tools, where tools are the software that is part of that business capability that make up the stable parts of the business.

### Architecture is expected to evolve
> Yes, it's an evolution. We expect our architectures to evolve, at least we in this group, expect architectures to evolve. That also means our team organizations have to evolve and they have to evolve hand in hand. You can't separate the two. You'll constantly have to be thinking about that because you've got this, you know what's happening in the back of your mind. Conway's Law is that force is always present. Therefore, you have to work up both think about both sides of that force and make use of it instead of having to-- trying to fight it.


## Summary from Martin Fowler
> Martin: Well, the way I would summarize it up is that if you're going to be-- want to be a competent software architect, you **have to be aware of Conway's Law and thus have to be interested in the design of software development organizations**. Unfortunately, you may think your job is only about technical stuff, but no, it's about people and about organizations and the way they work because that's going to have a huge impact upon any software architecture. Whenever you, as you build and as you evolve your software architectures, you've also got to evolve a team organization hand in hand. You've got to be paying attention to both sides of that.

· Original Source : https://www.thoughtworks.com/insights/podcasts/technology-podcasts/reckoning-with-the-force-conways-law