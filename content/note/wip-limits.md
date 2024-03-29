---
title: "On WIP Limits"
date: 2022-10-31T14:42:50+02:00
description: How WIP limits can help your team ship software faster, & more effectively
tags: [leadership, process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=On%20WIP%20Limits']
---

### This note takes a lot from the book [Accelerate](https://itrevolution.com/ßbook/accelerate/)?
- Written by the same people responsible for the annual [State of Devops reports](https://cloud.google.com/resources/state-of-devops), 4 years after they started publishing them, spent looking at the metrics of high performing vs low performing teams.
- Uses well defined, & rigorous (subjective) research methods
- I've seen it cited by many books, articles, & conference talks since. I'm aware that there's many biases involved here, so take it with a grain of salt :)

This book is a highly recommended read in my opinion



# (Chapter 7 - Lean Management Practices)

To understand how WIP limits can be helpful, we need a bit more context of the bigger picture. The idea comes from [lean management practices](https://www.simplilearn.com/what-is-lean-management-article), and these can, and have been used succesfully by software engineering teams.
- WIP limits are a way to "drive process (improvement) and increase throughput". I've heard other authors ([Team Topologies]({{<ref tt-jl>}})) refer to this as "optimising for flow of value through the system"
- Can also be thought of as a way to identify bottlenecks in your system
- Optimising for flow of value works best in an environment that focuses on [team-first thinking]({{<ref "team-topologies#team-first-thinking">}}), as opposed to optimising individuals' output.

- Implementing WIP limits in isolation is not going to be helpful: 
> we’re not just asking teams whether they are good at limiting their WIP and have processes in place to do so. We’re also asking if their WIP limits **make obstacles to higher flow visible**, and if teams **remove these obstacles through process improvement**, leading to improved throughput. WIP limits are no good if they don’t lead to improvements that increase flow.
**read first few pages of chapter 7 for elaboration on quote above**

> WIP limits on their own do not strongly predict delivery performance. It’s only when they’re combined with the use of visual displays and have a feedback loop from production monitoring tools back to delivery teams or the business that we see a strong effect.

- Fast flow/quick throughput result in a team that's more agile to changes, or as [Atlassian](https://www.atlassian.com/agile/kanban/wip-limits) puts it:
> reduce the amount of work "nearly done", by forcing the team to focus on a smaller set of tasks. At a fundamental level, WIP limits encourage a culture of "done."

- [to quote Daniel Terhost-North](https://youtu.be/_mYlSMepTGw?t=620):
> safely & sustainably reduce the lead time to thank you

And as Paul used to say to us
> Stop starting, and start finishing

## What to do when the team has reached WIP limits
- Rather pair with someone to help get their task across the line
  - We sell AC, a good heuristic is this: the thing that's closest to completion is what's closest to `$$`. Get that over the line
  - This helps with organic knowledge sharing
  - This is a way of shifting left on code review & QA

# Related reading
- [Why limiting WIP is a crucial skill for Agile product development](https://lucidspark.com/blog/limiting-WIP-for-agile-development)
- [My notes on delivery process](/tags/process)
- [My barebones notes on the rest of the book]({{<ref accelerate>}})
- John Cutler on [WIP, Multi-Tasking, Context Switching (Videos)](https://cutlefish.substack.com/p/wip-multi-tasking-context-switching)