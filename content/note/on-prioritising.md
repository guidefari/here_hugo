---
title: "On Prioritising"
date: 2023-10-24T20:56:20+02:00
description: Some heuristics on how to pick the highest value thing to work on when embedded in a product team.
tags: [process, product]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=On+Prioritising+Your+Work']
---

# Assumptions
- Asynchronous pull requests are part of your dev workflow.
- To keep things simple, this applies as you’re working on a new feature
- In a cross platform team (Dev, QA, Product/Design)
- Your environment encourates [team first thinking](/team-topologies#team-first-thinking), as opposed to measuring individual developer output.
  - This is also a way to organise your teams for optimal throughput
  - Sets you up for a [good system wide flow, more effective than a local optimisation](https://youtube.com/watch?v=1aOItUyZ2wQ&t=600).

# Closest to completion
With that said, during a dev retro, Paul taught us that a Pull Request is the closest thing to completion. Therefore the closest thing to money.
This chat was brought up after we let some PR's get a little stale.

Async pull requests are usually part of some Kanban-like flow, where work moves from the left to right of the board, meaning that after merging in that pull request, it’s usually time for QA, **meaning that work in QA, is closer to money than any open PR’s, or WIP that’s not yet ready for review.**


> We sell AC - Tim S.

I'd add: The AC has to solve a problem that your user has.

## Right to left
A good rule of thumb to identify what the highest value item you can do now is to look at your board from right to left.
Making the priority list look something like:

1. Implementing QA feedback, and bugs reported
2. Pull requests
   - Make sure your own PR’s are fully attended to and waiting for feedback. All comments addressed etc
   - At this point, you can review other PRs
3. Helping out a blocked teammate - assuming you aren’t blocked too, if a teammate has been stuck on something for 45min+, it’s good practice to lend an eye. Sometimes all they need is someone to explain the problem to, and find the solution in that process, or you actually know how to help.
4. If all the above is taken care of, well done 🎉 you can do your own feature work now.

# Related reading
- [Dan North - Value of Flow](/dn-flow)