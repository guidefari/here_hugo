---
title: "Team topologies with James Lewis"
date: 2022-10-17T06:59:27+02:00
description: Thoughtworks' James Lewis shares his experience & research on Team Topologies, software architecture, & complexity science
tags: [leadership, process]
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

# 5.0 Complex Adaptive Systems

- **[00:25:00](https://youtu.be/_mYlSMepTGw?t=1500)** This talk examines the theory behind complex adaptive systems, which are systems that are able to adapt and evolve quickly due to the interactions between many small units. Complexity science is used to study these systems and the mathematics that underlies them. One interesting fact about mice and elephants is that their blood pressure is always the same, regardless of their size. Additionally, heart rate is also invariant across mammals, scaling with their size. These findings suggest that adaptation and evolution is possible even in the face of variation. Another invariant found across mammals is that their lifespan is proportional to their metabolic rate. This suggests that there are some constants that are shared by all mammals. Finally, Jeffery West and James Brown found that as the size of a mammal increases, its metabolic rate does not double. This suggests that there is some limit to how large a mammal can get before its function becomes unsustainable.
- **[00:30:00](https://youtu.be/_mYlSMepTGw?t=1800)** Complex adaptive systems exhibit self-similarity, complexity, and emergent behavior, which makes understanding their behavior difficult. Jeffrey West's book "Scale" discusses economies of scale and how they play a role in complex adaptive systems.
- **[00:35:00](https://youtu.be/_mYlSMepTGw?t=2100)** Three principles behind complex adaptive systems - space filling fractal networks, optimization, and invariant terminating units. He explains that these principles can explain why size increases in an organization slow down software delivery, and how metabolic rates slow down with age.
- **[00:40:00](https://youtu.be/_mYlSMepTGw?t=2400)** This 1-paragraph summary of James Lewis' keynote discusses his thesis that complex systems - such as the human body - are optimized for the flow of stuff, and that this is why larger and more complex organisms are more efficient than smaller ones. He also points out that flow is a key concept in **value stream mapping**(Dan North has a talk on this topic.), which can help organizations see how information is flowing through their hierarchy and delivering value.
- **[00:45:00](https://youtu.be/_mYlSMepTGw?t=2700)** James Lewis discusses the concepts of flow and organizational metabolism, and how they can be used to improve performance. Lewis discusses how change request boards (CQB) and architectural review boards (ARB) can predict low performance, and how optimizing around the **four key metrics of organizational health**(what are they btw?) can help sustain a company.
- **[00:50:00](https://youtu.be/_mYlSMepTGw?t=3000)** James Lewis discusses the economics of scale and how hierarchical organizations tend to lose efficiency and growth as they add more processes and constraints. He also discusses how social networks and small world networks are more efficient because they are independent and decoupled.

# Sources

{{<youtube _mYlSMepTGw>}}

- [Flow: The Principles of Product Development](https://www.amazon.com/Principles-Product-Development-Flow-Generation/dp/1935401009)
- [Team topologies]({{<ref team-topologies>}})
- [Accelerate]({{<ref accelerate>}})
- [Inspired: How to Create Tech Products Customers Love](https://www.goodreads.com/book/show/35249663-inspired)
