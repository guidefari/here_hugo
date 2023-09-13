---
title: "On Assigning your team to full capacity"
date: 2023-09-13T08:15:02+02:00
description: The title here is misleading, because I’m here to make a case for not assigning your team to full capacity.
tags: [process]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Slack"]
---

The title here is misleading, because I’m here to make a case for not assigning your team to full capacity. This is another one of those counter-intuitive ways of delivering software more effectively.

Having slack time baked into your process allows for reactive work (bugs, requests from business, requests from customers) to be handled in the same work cycle without having to derail a plan that you have committed to.

These external requests usually aren't ignorable. If you're in a work cycle with
full capacity planned in, this inevitably means you'll fail to deliver on stuff
you had committed to at the beginning of a cycle. Whereas if you have slack,
it's easier to take on the external requests without derailing commitements.

This makes for more reliable & predictable estimates.

> [For planning and coordination, higher confidence is often worth more than trying to maximize throughput.](https://martinfowler.com/bliki/Slack.html#:~:text=For%20planning%20and%20coordination%2C%20higher,stories%20as%20an%20uncommitted%20bonus.)

## Why that matters

- More reliable & predictable estimates mean you can deliver to customers what you promised, on time
- There’s also the advantage of having the capacity to do exploratory work, which can unlock future opportunities

> [Remember that high utilization increases latency.](https://martinfowler.com/bliki/Slack.html#:~:text=For%20planning%20and%20coordination%2C%20higher,stories%20as%20an%20uncommitted%20bonus.)

Being able to respond quickly to change is one of the core principles of agile. Martin Fowler tells a story that goes something like this:

Team A needs an API from Team B to be slightly extended, in order to unlock a capability or stream of work. On a big enough project, you don’t always know about the dependencies up front, ie during the planning phase. Many a time, you discover these dependencies when work on something has started.

With no slack, Team B goes into work cycles with full capacity committed to. You have to wait for that API extension to be planned into the next iteration, whereas if there’s slack on the Team, they could immediately get started - thus reducing latency!

# How to implement slack

- Team level: If your team routinely completes 15 - 23 story points per sprint, only commit to 15 story points per sprint. This is the way that’s been recommended by James Shore & Martin Fowler.
- One team member with no work assigned, rotates every sprint. This one is tricky though, depends a lot on the state of the product, and the experience level of your team. This is the [approach taken/recommended by Adam Wathan & Ben Orenstein](https://hackersincorporated.com/episodes/lessons-learned-in-2022-ish#t=8m27s)

**Q**: _But what if dude that’s not assigned work doesn’t have find anything to do_

**A**: Very unlikely. If their hands are completely idle, pair programming with other engineers assigned stuff is an option

## Continuous Flow & Timeboxed Iteration

During the designated slack hours, the team can switch from [time boxed](https://martinfowler.com/bliki/TimeboxedIterations.html) iteration mode to [continuous flow](https://martinfowler.com/bliki/ContinuousFlow.html). Getting the best of both worlds

## What sort of work can we pick up when we’ve got slack?

- Exploration & experimentation. Make it self directed, take advantage of the fact that devs like to up their skill. Things learnt here usually translate to improving their day to day execution
- Improve DX, code quality, clean up cruft
- Tests, automation, and infra improvements

## Related Reading

- [Martin Fowler - Slack](https://martinfowler.com/bliki/Slack.html)
- [Hackers Incorporated - Lessons Learned in 2022-ish](https://hackersincorporated.com/episodes/lessons-learned-in-2022-ish#t=8m27s)
- [Art of Agile Development Practice: Slack](https://www.jamesshore.com/v2/books/aoad2/slack)
