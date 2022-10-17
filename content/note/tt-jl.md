---
title: "Team topologies with James Lewis"
date: 2022-10-17T06:59:27+02:00
description: Thoughtworks' James Lewis shares his experience & research on Team Topologies, software architecture, & complexity science
tags: [leadership, agile]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Team%20topologies%20with%20James%20Lewis']
---

# 1.0 Misc
I can't speak on every point here without a little bit of preparation, but I figured it'd be good to have it somewhere, for future reference or whatever

![](https://res.cloudinary.com/hokaspokas/image/upload/v1665983175/here-hugo/tt_lahghz.png)
- I think these are topics/ideas from [Team topologies book](https://itrevolution.com/team-topologies/).
- I like how James gives praise to [the book](https://itrevolution.com/team-topologies/) for giving us a ubiquitous language to discuss this stuff
- successful teams are **organised around flow**. Flow of **information**, flow of **requirements**, flow of **value from concept to customer**. You want to design your information structures in a way that facilitates the flow of information & value

### 1.1 AWS teams
- Something I found interesting, a comment from someone from AWS:
> The bigger we get, the easier it becomes to get bigger

- 2 pizza teams. Scale by Dunbar’s number
- Teams must communicate via interface

# 2.0 Book - Team Topologies
This book was referenced so much in this talk, and others, that I feel it's better encapsulated in its own [book]({{<ref book>}}) [note]({{<ref team-topologies>}}) - that way I can add to it when I'm done reading the book.

# 3.0 On Corps
- as companies scale, they add more process & hierarchy. Picture that very long value stream, from requirements capturing, to when it’s finally in the hands of a customer
    - Therefore things slow down
- the 4 key metrics mentioned in accelerate are a great way for you to keep your eye on your pulse, as an org.
    - MTTR
    - Change failure rate
    - Cycle time
    - Number of deploys
- [Valve’s](https://youtu.be/_mYlSMepTGw?t=3348) small world network growth.
- instead of building deeper and deeper hierarchies (which naturally happens as a company ages), you want to build **small world fractal networks.**  Amazon’s teams are a good example of this.

![](https://res.cloudinary.com/hokaspokas/image/upload/v1665985138/here-hugo/hi_qxlapn.png)
- Hierarchies drive [economies of scale](https://en.wikipedia.org/wiki/Economies_of_scale)
- Value flow is slowed down, as the hierarchy gets deeper

![](https://res.cloudinary.com/hokaspokas/image/upload/v1665985096/here-hugo/fractal_ufd2qb.png)
- Social networks or [small world networks](https://en.wikipedia.org/wiki/Small-world_network) drive [returns to scale](https://www.thoughtco.com/overview-of-returns-to-scale-1146825).
- Imagine an organisation that's not made up of deep hierarchies, but rather multiple small world networks, linked together where it makes sense. The book discusses heuristics for team interactions.

# 4.0 Cognitive Load Theory
Another big idea, is that of designing teams & their responsibilities with cognitive load in mind. [Dan North]({{<ref Patterns-of-Effective-Teams>}}) also speaks about this in [Software that fits in your head](https://youtu.be/4Y0tOi7QWqM).

- The total amount of mental effort being used in the working memory
- describes a universal set of principles for managing cognitive load that lead to efficient learning

************************Total cognitive load is comprised of three types:************************

1. **Intrinsic Load**: imposed by the inherent complexity of the task being performed. Manage large tasks by breaking them into smaller ones. Epic → User Story → Task
2. **Extraneous (irrelevant) Load**: imposed by distractions, or tasks irrelevant to the goal. e.g loud environment, unfamiliar dev tool, unreadable code, complex organisational processes to follow before, or during work. Can be mitigated by reducing the number of libraries & tools to a bare minimum, making use of linters, that sorta thing
3. **Germane (relevant) Load**: imposed by tasks relevant to an overall goal. in the context of software delivery, an example of this is knowing the syntax of your team’s language of choice in

{{<youtube DUlFxffjDFo>}}
- This is a full presentation on cognitive load theory, and other stuff around managing information overload, & how we learn.

# Sources
{{<youtube _mYlSMepTGw>}}
- [Flow: The Principles of Product Development](https://www.amazon.com/Principles-Product-Development-Flow-Generation/dp/1935401009)
- [Team topologies]({{<ref team-topologies>}})
- [Accelerate]({{<ref accelerate>}})
- [Inspired: How to Create Tech Products Customers Love](https://www.goodreads.com/book/show/35249663-inspired)