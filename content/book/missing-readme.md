---
title: "Book Notes: Missing Readme"
date: 2025-01-15T00:25:55+02:00
description: "highlights, quotes, & other interesting bits from Missing Readme"
tags: [book, notes]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Missing+Readme']
---

## Housekeeping
- The authors: [Chris Riccomini](https://cnr.sh/) & [Dmitriy Ryaboy](https://www.amazon.com/Missing-README-Guide-Software-Engineer/dp/1718501838)
- [Amazon link to the book](https://www.amazon.com/Missing-README-Guide-Software-Engineer/dp/1718501838)

## How I found this book
The YouTube algorithm delivered the [Software Misadventures Podcast](https://www.youtube.com/@softwaremisadventures),
and it was easily one of my favourite pods of 2024. High quality interviews, good dose of dry humour, and lots of lessons in there.

A few episodes I enjoyed, in no particular order:
- [Early Twitter's fail-whale wars | Dmitriy Ryaboy](https://www.youtube.com/watch?v=xAzb7Gtu2a8) - This is the episode with one of the authors of the book.
- The [Oxide](https://oxide.computer/) episodes were real cool.
  - [Build the scary stuff | Bryan Cantrill](https://www.youtube.com/watch?v=cAFD2bq1_tU&t=4137s)
  - [Uncrating the Oxide Rack | Bryan Cantrill, Steve Tuck](https://www.youtube.com/watch?v=d_XqNYt0cY0)
- [Growing and selling an indie business | Michael Lynch - TinyPilot](https://www.youtube.com/watch?v=MW_SZ59GM9s) - I really like [Michael Lynch’s website](https://mtlynch.io/). I’ve spent countless hours on there and I reference his writing a fair amount.
- [Breaking distributed systems for fun and profit | Kyle Kingsbury - Jepsen](https://www.youtube.com/watch?v=FdfZxN-IkpA&t=4441s)

Anyway, onto what we’re here for - book notes.

## Who’s this for?
The book is aimed at new software engineers, and aims to share the practical aspects of software engineering that aren’t taught in computer science curricula. Or as the authors say:
> The Missing README is the book we wish we had when we started out

## On Stickiness & rewriting
They quote [Ben Horowitz - The hard thing about hard things](https://www.amazon.co.za/Hard-Thing-About-Things-Building/dp/0062273205)

> The primary thing that any technology startup must do is build a product that’s at least ten times better at doing something than the current prevailing way of doing that thing. Two or three times better will not be good enough to get people to switch to the new thing fast enough or in large enough volume to matter.

Then go on to say 
> the same idea applies to existing code. If you want to rewrite code or diverge from standards, your improvement must be **an order of magnitude better**. Small gains aren’t enough—the cost is too high. Most engineers underestimate the value of convention and overestimate the value of ignoring it.

I’ve heard Will Larson say something similar [RE migrations](/migrations). It’s only valuable to engage in a migration if you have 10x more users, or 10x more engineers than when the software was first written.

## Use Boring Technology
This one is about managing [cognitive load](/clt).

> All technology is going to break, but old stuff breaks in predictable ways. New things break in surprising ways.

- [Dan McKinley - Choose boring technology](https://boringtechnology.club/)

## Don’t go rogue
> Don’t ignore your company’s (or industry’s) standards because you don’t like them. 
> Your preferences might truly be better. Going rogue still isn’t a good idea. In the short term, do what everyone else is doing. 

Similar to using boring technology to keep cognitive load low, follow convention. If you feel things really need to change, start a conversation, go through the established channels, discuss trade-offs and pragmatic approaches. It’s a team sport at the end of the day.

## Consider rewrites a last resort
> Rewrites should only be undertaken if the benefit exceeds the cost; they are risky, and their cost is high. **Engineers always underestimate how long a rewrite will take.**

I’m guilty of that last sentence. 💀

---

## Throw early, catch late
- Throw exceptions as close to the error as possible
- Propagate exceptions up the call stack until you reach the level of the program that's capable of handling the exception

## Retry intelligently
Exponential backoff (`(retry number)^2`) is good to a certain point. In a distributed system scenario, if all clients experience a blip at the same time, then use the same backoff strategy to retry, they'll issue requests at the same time.

This results in a **thundering herd**! To handle this, add *jitter* - the client adds a random, bounded amount of time to the backoff. This adds an element of randomness, thus reducing th likelihood of a stampede.

Not everything is supposed to be retried, sometimes it's best to let the software crash and let a human trigger the retry. e.g. when writing data, executing some business process, or something with side-effects.

## Misc note about logging
> Beware that changing log verbosity and configuration can eliminate race conditions and bugs because it slows down the application. If you enable verbose logging to debug an issue and discover a bug disappears, the logging change itself might be the reason.

I'm yet to experience this, hopefully never. But it feels like the sort of thing that'd be useful to know on a random Tuesday evening a few years down the line.

## Metrics
There are 3 common metric types:
1. Counters - Measure the number of times an event occurs. These only go up, or reset to 0 when a process restarts.
2. Gauges - For point-in-time measurements
3. Histograms - These break events into ranges based on their magnitude. They commonly measure the amount of time requests take, or data payload sizes.

> Measurements are cheap; you should use them extensively.

Non-exhaustive list of things to measure
- CPU-intensive operations
- I/O-intensive operations
- Exceptions & errors - counters
- Remote requests and responses - histograms
- Resources pools - you can use guages for this

---

## Code review
> Large reviews might need additional planning. If you get a review that’s going to take more than an hour or two to get through, create an issue to track the review itself.

> Respect the scope of the change that’s being made. As you read, you’ll find ways to improve adjacent code and have ideas for new features; don’t insist that these changes be made as part of the existing review.

## Rollout strategies
> There are many rollout strategies: feature flags, circuit breakers, dark launches, canary deployments, and blue-green deployments

This was my first time hearing about **dark launches**.

> In a dark launch, an application proxy sits between the live traffic and the application. The proxy duplicates requests to the dark system. Responses to these identical requests from both systems are compared, and differences are recorded. Only the production system’s responses are sent to the users.

## Design documents

> Don’t wait on final approval before writing code. Spend time implementing prototypes and proof-of-concept “spikes” to increase confidence in the design and to give you a shorter path to production

---

## Career stuff - Working with managers

> If your manager repeatedly cancels your 1:1s, you need to speak to them about it. Part of their job is to manage their team, and part of management is investing time with you. Being “too busy” is not an excuse

> Try to have as few OKRs as possible; it’ll keep you focused. Between one and three OKRs per quarter is a sweet spot. More than five and you’re spreading yourself too thin.

> You should never be surprised by your performance review feedback

> Don’t take feedback at face value. Your manager is just one perspective (albeit an important one). Try to incorporate your manager’s feedback into your perspective rather than adopting your manager’s feedback outright. Ask yourself what gaps your manager has in their perspective, how their feedback fits with yours, what they know that you don’t, and so on.