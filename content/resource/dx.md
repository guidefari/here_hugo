---
title: "Resource: Dx"
date: 2023-12-05T07:16:23+02:00
description: Exploring the many ways to Improve Developer experience in organisations.
tags: [resource, playbook, dx, complexity, culture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Dx']
---

**PS: this is a First Draft - brain dump of the sub topics I want to explore**

> DX is multi-faceted. You're gonna have to measure a whole lot of quantitative, and qualitative metrics to get a full understanding of your dx
> - [Jo Franchetti](https://www.youtube.com/watch?v=YkOGZCYWT6w)
- That said, we'll be looking at both the technical, and cultural side of DX.

## Context
This series of notes will likely focus on internal DX, as that's what I have most experience in.
- Improving collaboration and productivity within your teams and the context of your company
- Ensuring your technical practices are aligned with business objectives

### Topics

1. Onboarding
    1. Whenever someone new is onboarding, they’re a very good candidate for collaboration
    2. How much of your onboarding is self-service
        1. Speak to the 2 week threshold I’ve experienced
        2. How much of onboarding should’ve be self-service vs assisted?
    3. Keeping docs up to date
    4. Dan North’s Red carpet philosophy
    5. Trying to minimise the time/cost between a new dev joining the team, and being productive
    6. [Stay Saasy - Optimize onboarding](https://staysaasy.com/management/2020/08/28/Optimize-Onboarding.html)
    7. typical time to first pr.
    8. time to first ticket? feature? what metrics can help you get the pulse on the quality of your onboarding?
    9. why is it important
    10. readwise has a bunch of articles. this is worth its own note at this point😅
    search queries: ` "onboarding" || "dx" || "developer experience" `
2. What is DX
   1. Why does it matter
3. Fast Feedback loops
    -  also go into detail about the different kinds of feedback loops
    - technical: local dev, ci, 
    - social: human interactions: dev to dev collab, dev to qa, dev to product, dev to design, dev to rest of company
    > [We want to reduce the number of people an engineer needs to talk to internally to get something done.](https://sst.dev/about/culture.html)
4. Types of cognitive load, and how you can reduce them
    1. How this ties into complexity
    2. this might be redundant. one of the core ideas of improving dx is reducing cognitive load associated with delivering customer value
    3. There could be some trivial examples of increased cognitive load associated with everyday development that we aren’t even aware of
5. Where does platform engineering fit in
6. Tools to increase dev confidence when pushing, merging
7. Local experience
8. Pull Request process
9. Deploying
    1. iteration velocity increases with improved dx. Dev interuppted podcast or the substack will be good reference. accelerate is also a good source to reference
    2. Are there manual steps pre/during/post deployment that slow the process down?
10. What other areas of the sdlc can be worked on?
11. Tools not limited to development, e.g., tools for comms (Slack, Teams, Discord, etc.)
12. Effects of scrum/agile processes on DX
    1. "All software systems are sociotechnical systems"
13. Collaboration between devs and QA
14. How would you describe delivery efficiency? & how does improving developer experience help here?
    1. [Loom by John Cutler](https://www.loom.com/share/bfc646ce2c114cabbe9792616cb48f17?sid=ba8f1e77-a370-46cb-a491-252870594c5d) semi related to this topic
15. [Improving DX can reduce developer burnout](https://podcasts.apple.com/za/podcast/dev-interrupted/id1537003676?i=1000566944813)
    1. devs actually want to ship. it feels good & has a restorative nature.
16. On Finding out how to improve DX
    1. Talk to your devs. those closest to the work. they’re well aware of the friction
    2. Surveys & polls. keep these short & engaging. & actually action out stuff based off the feedback, if you don’t want to see engagement fizzle.
17. Motivation: for engineering, business, product. what will investing in our DX do for us?
18. Tools: Daily communication & knowledge documentation 

## References

1. [LeeRob](https://leerob.io/blog/developer-experience-examples)
2. [What is DX](https://leaddev.com/process/what-developer-experience-your-route-better-productivity#Echobox=1699956180)
3. [DevEx: What Actually Drives Productivity](https://queue.acm.org/detail.cfm?id=3595878) - there's a few highlights in my readwise that could be good to cite.
4. <https://podcasts.apple.com/za/podcast/legacy-code-rocks/id1146634772?i=1000611333019>
5. <https://open.spotify.com/episode/4kvwFx913BZZl9Ggroz7W7?si=28e61ce4766647cb>
6. <https://open.spotify.com/episode/7ommJx6HsS65WwHYIVcLPu?si=6d3e8b96539448ca>
7. <https://podcasts.apple.com/za/podcast/thoughtworks-technology-podcast/id881136697?i=1000631830296>
8. <https://podcasts.apple.com/za/podcast/corecursive-coding-stories/id1330329512?i=1000633456580>
9. {{< youtube dP8NmcEkxJI>}}
   1. worth taking notes on this vid.

# Acknowledgements

- Shot to [Tyler](https://www.tylerpillay.co.za/) for helping with this outline so far

---
https://www.youtube.com/watch?v=YkOGZCYWT6w

{{<youtube YkOGZCYWT6w>}}

- you're trying to make it easy to:
  - onboard
  - build
  - test
  - debug

## Guiding principles 
- Flow state
  - You know the feels here, being fully immersed & engaged in your work for a few hours.
  - Your processes and company culture can have a huge impact on this. How often are your developers 'interrupted', and for what? It's good to regularly do cost benefit analysis on this
- Cognitive load
- Feedback loops

## How to get started
- Talk to your devs. Surveys are helpful here

## Side-note
- Introspect on, & iterate your process/SDLC as you would your product, & business.
  - This is where regular surveys with devs comes in

# SDLC is part of DX
The process of how something goes from idea to production has a big impact on DX.
Some guiding principles, heuristics, questions:
- 

---

## Stay SaaSy - Optimise onboarding
I asked the authors:

> I'm curious, why do you think [onboarding is one of the highest ROI periods](https://staysaasy.com/management/2020/08/28/Optimize-Onboarding.html)?

# Response
Onboarding is high ROI for many reasons, for example:
* It sets a tempo for the job. People get in routines and if your routine is suboptimal to start, it can be hard to dig out of.
* Things can get challenging around the first performance cycle if you don't start strong (e.g. within 12 months). A bad score there can impact morale and further change your course.
* Then there's complex impacts like when yearly planning happens, e.g. your team might decide they need someone strong to help the team if you haven't started off very well. Then you can suddenly be sharing leadership of a team that hinders your development. First impressions matter!

For all these reasons and more, starting strong is important.

# Related reading
[Patterns of Effective Teams • Dan North • GOTO 2017](https://www.youtube.com/watch?t=1623&v=lvs7VEsQzKY)


---
5 Jan 2024

- DX is a high leverage activity. Simplifying onboarding is part of improving dx
- the effect of man hours saved adds up, when multiplied. 
- you want your devs to spend more time on things that actually matter, ie the product. And less time on ‘fighting’ their tooling, dev environment, and process
