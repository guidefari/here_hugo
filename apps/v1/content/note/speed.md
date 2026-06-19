---
title: "On Speed at all cost"
date: 2024-11-07T19:26:29+02:00
description: Working theory, observations, and stuff I've read
tags: [strategy]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Speed+At+All+Cost']
---

## Context
The style of this note is similar to "[conversations with X](https://cutlefish.substack.com/p/the-x-files-6557-of-2024-edition)".

> “X” is not one person—because I’ve had these conversations many times (with slight variations). I’ve also had friends recount these conversations many, many times.

# What is speed at all cost?
Willing to bet $3 that every software practitioner has been on a project where some form of this conversation takes place

- **X**: We need xyz feature done, when can it be done by?
- **Dev**: Hm, likely 2.5 weeks, worst case scenario, 4 weeks.
- **X**: Why so long? we have max 1.5 weeks for this, should ideally be done in a week so we can test etc.
- **Dev**: We didn't account for `x`, so there's clean up to be done before starting with `y`.
It's also likely this feature will grow into `z`, so it's probably a good idea to design and build a solid foundation.
- **X**: Yeah, no. Figure out a way to get it done in a week, thanks! Go team!

In short, speed at all cost encapsulates the mindset of delivering product, even if it comes at the cost of technical integrity.

# Speed at all cost is a viable strategy
As with most things, "it depends". I think there are scenarios that require this operation mode,
as well as scenarios where you can use it to your advantage.

You just can't do it passively. Not if you want sustainable & repeatable wins.

## In some business cases, there's no option but to operate in this mode
- Early stage product without PMF/revenue yet
- Quick PoC to close a critical sale
- Time sensitive feature for marketing campaigns

All of this said, keep [minimum lovable product](/minimum-lovable-product) in mind.

## Honour your commitment to 'clean up time'
This helps keep morale in a healthy state. It saps at operators' morale to perpetually have to ship work below their quality standards

Regularly schedule in time for clean up time. The cadence is context dependent, but an example I like is 6 week sprint, 2 week cool-down

> [Once a six week cycle is over, we take one or two weeks off of scheduled projects so everyone can roam independently, fix up something, pick up a pet project, reflect, and generally wind down prior to starting the next six week cycle. Ample time for context switching. We also use this time to firm up ideas that we’ll be tackling next cycle.](https://3.basecamp-help.com/article/35-the-six-week-cycle)

##  How it can be actively managed: picking appropriate refactoring strategies
- Encourage refactoring on the move
- Explore debt payback strategies [here](/refactoring), [here](/tags/refactoring), and [here](/tidy-first).
- If you're shipping less than ideal code due to time constraints, do so with a migration strategy in mind.
  - I think this also results in you writing more 'portable software'

> There's nothing more permanent than a temporary solution

## Migrations are inevitable
A recent lesson that's been front of mind, ["migrations in software projects are inevitable"](/migrations).
With this in mind, you can plan your migrations ahead of time.

> if it's not documented, you don't have technical debt; you have something much worse

## Conflating speed at all cost with being agile
A pretty common excuse for perpetually operating in this mode is "but that's what being agile is all about".

> [Names matter. Agile is popular because the word Agile has connotations of speed, and that is genuinely as sophisticated as many people are when designing their entire company's culture. Sprints are popular because the word Sprint has connotations of speed.](https://ludic.mataroa.blog/blog/tossed-salads-and-scrumbled-eggs/)


# Related reading
- [12 Signs you're working in a feature factory](https://cutle.fish/blog/12-signs-youre-working-in-a-feature-factory) 
  - John Cutler [revisits the post above, 3 years later](https://amplitude.com/blog/12-signs-youre-working-in-a-feature-factory-3-years-later).
- [Falling into a feature factory](https://runthebusiness.substack.com/p/falling-into-a-feature-factory)

- [Things I Learnt The Hard Way - Nothing More Permanent Than A Temporary Solution](https://blog.juliobiason.me/books/things-i-learnt/permanent-solution/)
- Shape up - [Six-week cycles](https://basecamp.com/shapeup/2.2-chapter-08#six-week-cycles)
- [On assigning your team to full capacity](/slack)
- [Limit WIP](/wip-limits)
- [Debt relief for product teams](https://runthebusiness.substack.com/p/debt-relief-for-product-teams)
