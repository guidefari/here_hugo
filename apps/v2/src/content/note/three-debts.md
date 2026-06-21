---
title: "Three kinds of debt"
date: 2026-04-30T00:31:29+02:00
featured: true
description: Technical debt, cognitive debt and a secret third thing...
tags: ["ai"]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=AI+Changes+the+Balance+of+Debt",
  ]
---

**Technical debt** is debt in the code. The structure works well enough for now, but it makes future change harder, riskier, or slower.

**Cognitive debt** is debt in the team's shared understanding. The code may work, but fewer people understand how it works, where the traps are, what tradeoffs shaped it, or how to change it safely.

**Intent debt** is debt in the recorded rationale. The team may know what the code does, but not why it does it that way. Goals, constraints, rejected alternatives, product context and integration assumptions are missing or stale.

AI is unusually good at producing more artifacts. It is less reliable at producing shared understanding. That asymmetry is the risk.

## The shift

Before AI, technical debt often accumulated because changing code was expensive. Now, a large part of that cleanup is cheaper.

A team can now create more code, more branches, more abstractions, more tests, and more product surface area in the same amount of calendar time.
The human processes around this also need to adapt, else the codebase may look healthier while the team's ability to reason about it gets worse.



<video width=42.0% controls class="mx-auto">
    <source src="https://d20tmfka7s58bt.cloudfront.net/cursor-credits.mp4" >
    Your browser does not support the video tag.  
</video>



## Understanding as a deliverable

"**Treat understanding as a deliverable**" means a change is not done just because the code compiles, tests pass, and the ticket moved to done.

It is done when the relevant people can explain the change, operate it, debug it, and safely extend it later.

In real life, that translates to practices like:

- Write the decision down when a decision matters. ADR's, lightweight docs committed alongside code, wiki entries.
- Pair or mob on unfamiliar areas so knowledge spreads while the work happens.
- Keep generated code small enough that a human can actually review it.
- You should be able to explain AI generated code as if you wrote it by hand.

## A useful test

For any meaningful AI-assisted change, ask:

- Who understands this now?
- Who can debug it when it fails?
- Where is the intent recorded?
- What would a new teammate need to know before changing it?
- Did AI help us learn the system, or only help us produce more system?

If the answers are weak, the team may have paid down technical debt while taking on cognitive or intent debt.

## Source

This framing comes from Margaret-Anne Storey's [From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI](https://arxiv.org/abs/2603.22106).
