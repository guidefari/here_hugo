---
title: "Zero Defect Strategy"
date: 2024-10-02T19:39:23+02:00
description: At any given time, the highest priority is to eliminate bugs before writing any new code.
tags: [strategy]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Zero+Defect+Strategy']
---

Popularised by Microsoft, the idea is simple: **At any given time, the highest priority is to eliminate bugs before writing any new code**.

## Philosophy & history (according to me 👀)
"Stop the line" taken from Toyota's production line system is related the zero defect strategy in my opinion

> Autonomation, or its Japanese name Jidoka, means that work is organized so that the slightest abnormality is immediately detected, work stops, and the cause of the problem is remedied before work resumes. 

> [The only way to handle issues in a continuous improvement environment is to see each issue as an opportunity for improvement, and a stepping stone for sustainable growth.](https://blog.planview.com/stop-the-line-how-lean-principles-safeguard-quality/)


## More practial tips

- Automated pipelines are your friend.
  - Make sure you can build, static analysis, type checking, tests etc at each merge or pull request for your trunk branch
- My friends have also suggested pre-commit hooks. But I'm not a fan, I commit early & often, pre-commit hooks can feel like death by thousand cuts in a big codebase😬

## Related reading
- [The Joel Test: 12 Steps to Better Code](https://readwise.io/reader/shared/01gv5748ynxtnb274mmwa0500t/) - This has great words on the ideas behind zero defects
- [Fail fast](https://en.wikipedia.org/wiki/Fail-fast_system)