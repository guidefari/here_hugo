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

### Side note

- This topic exposed to me the idea of [two-tier on call support](/two-tier-on-call).
  - Betterstack also has some [on call strategies](https://betterstack.com/community/guides/incident-management/on-call-templates/) to look at.

## Keeping your teams high performing

- When chatting about growing an org, we reach for hiring too often
-

## The Four states of a team

A team's state exists on a continuum

- Falling behind: is the backlog getting bigger each week?
- Treading water: critical work gets done, but we can't pay down technical debt or begin new projects
- Repaying debt: there's a snowball effect to this one. "Each piece of debt you repay leads to more time to repay more debt
- Innovating: tech debt is sustainably low, team's mostly focused on satisfying new user needs

### On moving teams from one continuum to the other

- Consolidate your efforts, focus on one team at a time!
  I like this framing:

> Many folks try to move all teams at the same time, peanut buttering their limited resources, but resist that indecision-framed-as-fairness: it’s not a fair outcome if no one gets anything.

- **When falling behind**, hire & provide tactical support until they're treading water.
  - Also set expectations with users.
  - Avoid getting resources from within the company. By nature, it's impossible for this kind of discussion to not become political
- **When treading water**, [consolidate team efforts](/morale), finish more things, [limit WIP](/wip-limits).
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
