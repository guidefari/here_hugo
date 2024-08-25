---
title: "Will Larson's An Elegant Puzzle"
date: 2024-08-17T11:43:42+02:00
description: "highlights, quotes, & other interesting bits from An Elegant Puzzle - Systems of engineering management"
tags: [book, notes]
images:
  ["https://images-here-hugo.vercel.app/api/og-image?title=An+Elegant+Puzzle"]
---

## How the book is laid out

- A collection of topic related essays, exploring the different puzzles that you have to solve when you find yourself managing software teams.
- Grouped largely into:
  - Organizations, & org design. I have a few notes on this topic, see [what James Lewis has to say](/tt-jl), and [#leadership](/tags/leadership) groups a bunch of related notes
  - Tools: exploring things such as [#systems theory](/tags/systems-theory), & [#process](/process)
  - Approaches - looks at situations that require you to change how you manage. And "how to manage when your desired impact is beyond your authority"
  - Culture
  - Careers

# Organization design

- When trying to impact change

> if process is too weak a force, and culture too slow, then organizational design lives between those two

- Managers should support 6-8 engineers.
  - Less than that (4 or less engineers) becomes a tech lead manager. Might uniquely leverage your strengths, but this can have limited growth opportunity on the managerial side.
  - 9+ has you moving from manager to being a coach and safety net for problems.

> When I have a problem that I want to solve quickly and cheaply, I start thinking about process design. A problem I want to solve permanently and we have time to go slow? That’s a good time to evolve your culture

## Teams with fewer than 4 are not teams

- Described as a leaky abstraction that functions indiscernibly from individuals.
- Will also says he's regretted every single time he's sponsored teams of this size
- Fragile af, one departure can move them from innovation into maintaining technical debt

## Keep innovation & maintenance together

- Don't spin up separate teams to innovate, while the rest are on maintenance.
  This two-tiered class system isn't ideal
- Keeping these two concerns together fosters a culture of learning

## Creating teams

- Grow a team to 10, then split it
- Never create empty teams (why?)
- Teams should be 6-8 people, in their steady state

### On Support

- This chapter exposed to me the idea of [two-tier on call support](/two-tier-on-call).
  - Betterstack also has some [on call strategies](https://betterstack.com/community/guides/incident-management/on-call-templates/) to look at.

> One specific tool that I’ve found extremely helpful here is an ownership registry, which allows you to look up who owns what, eliminating the frequent “Who owns X?” variety of question

## The Four states of a team

A team's state exists on a continuum

- Falling behind: is the backlog getting bigger each week?
- Treading water: critical work gets done, but we can't pay down technical debt or begin new projects
- Repaying debt: there's a snowball effect to this one. "Each piece of debt you repay leads to more time to repay more debt
- Innovating: tech debt is sustainably low, team's mostly focused on satisfying new user needs

When chatting about growing an org, we reach for hiring too often. Look at what state your team is in, and apply the relevant fix.

### On moving teams from one continuum to the other

- Consolidate your efforts, focus on one team at a time!
  I like this framing:

> Many folks try to move all teams at the same time, peanut buttering their limited resources, but resist that indecision-framed-as-fairness: it’s not a fair outcome if no one gets anything.

- **When falling behind**, hire & provide tactical support until they're treading water.
  - Also set expectations with users.
  - Avoid getting resources from within the company. By nature, it's impossible for this kind of discussion to not become political
- **When treading water**, [consolidate team efforts](/morale), finish more things, [limit WIP](/wip-limits).
  - The idea is to reduce concurrent work until they can start repaying debt.
  - Tactically, you're also highlighting that productivity is viewed through the lens of a team, and not individuals.
- **When repaying debt**, give more time and let things be. This stage is self-healing.
  - Tactically, find ways to support your users without disappearing into maintenance mode only.
- **When innovating**, maintain enough [slack](/slack) into your team's schedule so they can build quality into their work.
  - Tactically, make sure the work your team is doing **is valued**. Quickest say to get defunded is to be viewed as the team that builds **science projects**.

> you only get value from projects when they finish: to make progress, above all else, you must ensure that some of your projects finish.

### On long lived teams

- Sustained productivity comes from high performing teams. Be weary of disassembling a high performing team.
- Rather, preserve the team and move scope and projects between teams
- This avoids re-gelling costs, and preserves system behaviour
- If a team has 'too much slack', incrementally move responsibility to them
- Another approach is loaning out an individual or two to an area that needs help. Emphasis on them retaining identity of their actual team.

> most teams have dependencies on other teams... you can often slow a team down by 
> shifting resources to it, because doing so creates new upstream constraints.

### During periods of high growth

- Alternate between periods of rapid hiring and periods of consolidation & gelling.

### Succession planning

- At some point, you may find that your rate of learning has trailed.
- This is when you can start looking for your next role

> Succession planning is thinking through how the organization would function without you, documenting those gaps, and starting to fill them in.

---

# Tools

## Intro to systems thinking

Systems are combinations of stocks and flows:

- Stocks: accumulations of resources.
- Flows: streams that make stocks increase (inflows) or decrease (outflows).

You can model the DORA metrics using stocks and flows. The metrics being Delivery lead time, change failure rate, time to recovery, and deployment frequency.

- Pull requests (stock) are converted into ready commits based on our code review rate (flow).

- Ready commits (stock) convert into deployed commits at deploy rate (flow).

- Deployed commits (stock) convert into incidents at defect rate (flow).

- Incidents (stock) are remediated into reverted commits at recovery rate (flow).
- Reverted commits are debugged into new pull requests at debug rate.
  - tbh I don't like the stock "reverted commits". I prefer fix foward as a default, revert only when absolutely necessary - depending on time crunch, serverity, and complexity of the issue.
  - This means I read reverted commits as **patch commits**
  - In contrast, there's an SRE lesson I was taught recently by [Dmitriy Ryaboy](https://www.youtube.com/watch?v=xAzb7Gtu2a8): in the time of crisis, it's 
  not a good idea to try and understand deeply **why** things are broken before you fix. Just rollback/revert so you can restore service, then figure things out later.
  Succintly said, "First restore the service, then fix the problem."

  # On Product Management
Interesting to see a lot of Will's remarks relate to [the lessons about product management from Brian Holt](/pm-holt).

This sub-topic can be found [on his site](https://lethain.com/intro-product-management/).

Will loosely groups product management activities into exploration, selection, & validation.

> Product management is an iterative elimination tournament, with each round consisting of problem discovery, problem selection, and solution validation

### Problem discovery
- Surprisingly, this is a commonly skipped stage.
  - Which can lead to inertia-led local optimization.

### Problem selection

I like this thought exercise

> Consider different timeframes... What would you do if your company was going to run out of money in six months? What if there were no external factors forcing you to show results until two years out? Five years out?

### Solution validation
- As you try to learn from others that have walked a similar path:
> A mild caveat: it’s better to rely on people you have some connection to instead of on conference talks and such, since there is a surprisingly large amount of misinformation out there.

- Try to find the cheapest way to validate

# Visions & strategies
> Strategies are grounded documents which explain the trade-offs and actions that will be taken to address a specific challenge. Visions are aspirational documents that enable individuals who don’t work closely together to make decisions that fit together cleanly.

Strategy docs:
- A good one has these sections: diagnosis, policies, & actions.
- The diagnosis is a theory describing the challenge at hand. It calls out the factors and constraints that define the challenge, and at its core is a very thorough problem statement
- Policies define the general approach you'll take, and are often trade-offs between competing goals
  - When you read bad guiding policies, you think, “so what?” because its found a way to justify entrenching the status quo.
- Apply your guiding policies to get your actions.
  - When you read good, coherent actions, you think, "This is going to be uncomfortable, but I think it can work." When you read bad ones, you think, "Ah, we got afraid of the consequences, and we aren’t really changing anything."

> People sometimes describe strategy as artful or sophisticated, but I’ve found that the hardest part of writing a good strategy is pretty mundane. You must be honest about the constraints that are making the challenge difficult, which almost always include people and organizational aspects that are uncomfortable to acknowledge

Vision docs:
- If strategies describe the harsh trade-offs to overcome a particular challenge, visions describe a future in which those trade-offs are no longer mutually-exclusive.
- Visions should be detailed, but the details are used to illustrate the dream vividly, not to prescriptively constrain its possibilities.
- Remember to refresh these periodically. Once a year at least.


Also see:
- [Good strategy, Bad strategy](https://jlzych.com/2018/06/27/notes-from-good-strategy-bad-strategy/). This book's one's been on my reading list for a while.
- [Writing strategies & visions](https://lethain.com/strategies-visions)
