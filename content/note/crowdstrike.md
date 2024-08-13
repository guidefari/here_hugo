---
title: "Retro: Crowdstrike outage"
date: 2024-07-28T11:30:20+02:00
description:
tags: [devops, retro]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Crowdstrike+Outage+Retro']
aliases: [clownstrike]
---

{{<youtube dGKIdGf_8J4>}}

## Bullet points from video

- There's no real financial or criminal consequences for outages like this
  - Stock market may or may not reflect such outages, but that's about it
  - **Mental note** to check out the aftermath of other _big_ outages in the past.
    - How are we defining big?

## Mitigation
Such risks can be handled at a software, deployment, and testing level.

- Canary deployments
- Staged rollouts
- Rollback strategy
- Separate high-risk operations into a separate process, that way your whole program doesn't crash
  - Related reading to the point above is an integration pattern: [Anti-corruption layer](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer).
- Sanity check files before you load them into your program. How this is done is very context dependent.
- Write integration tests that force errors, and make sure they're handled correctly
  - On my reading list, [Chaos Engineering](https://www.oreilly.com/library/view/chaos-engineering/9781492043850/)
  - Always assume that any part of your system can fail, make sure to engineer the rest of your system to 
  gracefully catch & handle that failure **when** it happens
- Forward logs to a central location, and monitor it
  - Make sure your code never silently fails.
    Log anything unexpected that happens on the critical path, then pay attention to it. Anonymise customer data ofc.
- As [mentioned by Gergely](https://newsletter.pragmaticengineer.com/p/the-biggest-ever-global-outage-lessons), dog-fooding + manual QA
- Quantify the impact of your company’s product crashing irrecoverably for a couple of hours.
This thought exercise can help identify how much you have to invest in your outage mitigation strategy.
- Treat config changes the same way you treat code changes.
  - Related reading Infrastructure as code

## Related reading

- [What can engineering leaders learn from one of the biggest IT disasters in history?](https://leaddev.com/process/5-lessons-crowdstrikes-global-outage)
