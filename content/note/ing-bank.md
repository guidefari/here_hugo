---
title: "Team Topologies: ING Bank"
date: 2022-10-11T08:18:49+02:00
description: A case study of ING bank and their experiments with team topologies
tags: [leadership, devops, agile, basecamp]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Team%20Topologies%3A%20ING%20Bank']
---


## ING Bank
- {{<youtube X3AHdo34gWM>}}
This video is stories from Dutch [ING Bank](https://www.ing.com/Home.htm). While the topic is focused on team topologies, it also touches on what the expectations of the [company](https://www.ing.com/Home.htm)'s internal dev platform are.

## Team size, cognitive load
- They moved to microsquads, teams of 4 people, that are put together to take care of the most important problem for them, & the company right now.
- Microteams align well with product thinking.
- Beyond a certain size, adding more people to a team will not make it more effective. 

## Stream Aligned teams
- Once they're done with the task, they deallocate themselves and reassigned to the next streams of work, that are of high value right now.
  - This is products, over projects.
- stream aligned teams. One big product backlog, microteams are assigned to value streams, & reallocated when that work is done
- Rather than having activity focused teams, shift towards cross functional, outcome focused teams. This reduces the chances of stuff being thrown over the wall, less ‘us’ vs ‘them’.

## Platform
- Because of the ephemeral nature of the teams, they can't afford to have developers solve common problems all the time, think **auth, event streams (Kafka bus), DBs as a service, analytics, frontend base components, product pricing platform**. 
- Solving and provisioning all the above, is where the **Platform** comes in. Microteams should be able to self-provision the internal capabilities they need.
- I imagine this sort of environment is where private on premises cloud is a good fit too.

# Helpful heuristics
From relevant books, Accelerate & Devops handbook. Things you want to optimize & improve on, for more effective software delivery

****Flow:****

- fast from dev to prod
- trunk based dev
- ci
- immutable, containerized build - enables fast rollback, and maybe other benefits, that I’m not yet aware of

****************feedback (everything after you’ve deployed the code):****************

- fully automated testing
- monitoring, alerting, logging
- code scan, OWASP check
- shift left of risk

************culture :************

- eng culture
- learning organization (Google 20% mastery time)
- post mortems

# Related Reading
- [Accelerate]({{<ref accelerate>}})
- [The Phoenix project](https://www.goodreads.com/book/show/17255186-the-phoenix-project) - this has been a fun, light, & insightful read thus far :)
- [The Devops handbook](https://www.goodreads.com/book/show/26083308-the-devops-handbook?ref=nav_sb_ss_1_15)
- [Site Reliability Engineering](https://www.goodreads.com/book/show/27968891-site-reliability-engineering)
- [Shape Up]({{<ref shape-up-notes-introduction>}}) - Similar to ING Bank, Basecamp follows a microteam approach. 1 or 2 devs, 1 designer, 6 weeks on a task. Slightly smaller than the 4 seen at ING, but built on similar principles of tackling an important business value stream, in a time boxed manner. 
- Would be cool to learn more about how AWS teams are structured. I have [this book](https://www.goodreads.com/book/show/53138083-working-backwards) in my lib, will dig in some day.
- [There is No Spotify Model (infoq.com)](https://www.infoq.com/presentations/spotify-culture-stc/)

