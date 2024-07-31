---
title: "On Change Advisory Boards"
date: 2024-07-31T06:10:00+02:00
description: Excerpts from the devops book, Accelerate
tags: [process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=On+Change+Advisory+Boards']
---

This topic repeatedly comes up with the homies. I want to collect all my excerpts & notes in one place, ie here.

## From Accelerate
From what I can tell, these conclusions are coming from [primary research](https://www.scribbr.com/methodology/primary-research/).

> In large organizations, we often see change management processes that take days or weeks, 
> requiring each change to be reviewed by a change advisory board (CAB) external to the team
> in addition to team-level reviews, such as a formal code review process.

> We found that external approvals were negatively correlated with lead time, deployment frequency, and restore time, and had no correlation with change fail rate. In short, approval by an external body (such as a manager or CAB) simply doesn’t work to increase the stability of production systems, measured by the time to restore service and change fail rate. However, it certainly slows things down. It is, in fact, worse than having no change approval process at all.

## Recommended approach
- Lightweight peer-approval process
  - Pair Programming
  - Intra-team code reviews
- Deployment pipeline to catch & reject bad changes
- Having sensible-defaults defined can also be useful here.