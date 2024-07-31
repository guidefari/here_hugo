---
title: "Lessons from the Crowdstrike outage"
date: 2024-07-28T11:30:20+02:00
description: 
tags: [devops]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Crowdstrike+Outage+Takeaways']
aliases: [clownstrike]
---

{{<youtube dGKIdGf_8J4>}}


## Bullet points from video
- There's no real financial or criminal consequences for outages like this
  - Stock market may or may not reflect such outages, but that's about it
  - **Mental note** to check out the aftermath of other *big* outages in the past.
    - How are we defining big?


## Mitigation
Can be handled at a software, deployment, and testing level.

- Canary deployments
- Staged rollouts
- Separate high-risk operations into a separate process, that way your whole program doesn't crash
- Sanity check files before you load them into your program. How this is done is very context dependent.
- Write integration tests that force errors, and make sure they're handled correctly
- Forward logs to a central location, and monitor it
  - Make sure your code never silently fails. 
  Log anything unexpected that happens on the critical path, then pay attention to it. Anonymise customer data ofc.
- As [mentioned by Gergely](https://newsletter.pragmaticengineer.com/p/the-biggest-ever-global-outage-lessons), dog-fooding + manual QA
- Quantify the impact of your company’s product crashing irrecoverably for a couple of hours
- Treat config changes the same way you treat code changes.
  - Related reading Infrastructure as code