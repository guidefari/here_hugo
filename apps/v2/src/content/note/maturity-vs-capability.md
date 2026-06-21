---
title: "Accelerate notes cont. : Maturity vs Capabilities model"
date: 2024-12-24T12:52:28+02:00
tags: [book, leadership, devops]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Maturity+vs+Capability']
---

While re-reading, I felt like this topic was introduced in a bit of a confusing way for me. 

This note captures & groups together what I find myself citing from the topic.

## Context
Maturity/Capability are mental models. They are also operational models. They include frameworks and heuristics used for decision making around engineering projects.

Just to be clear

 ❌ Maturity model = bad
 
✅ Capabilities model = good

# 1. Maturity Model
- Fixed mindset, focused on getting to a mature state then declaring yourself "done" with a journey.
  - It usually sounds like "we've achieved CI/CD & don't plan in investing in that again"
  - Same energy as the guy who says "I finished FIFA" or other sports games💀
- Very prescriptive & linear: 
  - Every team's told to use the exactly sets of technologies and process. 
  - There's tradeoffs here, giving teams absolute freedom can very quickly become inefficient. Defining [sensible defaults](https://www.youtube.com/watch?v=kg7NPJ7SdsQ) is a good place to start.

## 1a. Vanity metrics
Measuring vanity metrics tends to be common when operating in a maturity models environment.

- Lines of code
- Velocity: Originally intended as a capacity planning tool, this is often used as a productivity measure
- Utilization: Similar to velocity, this is viewed as a proxy for productivity. I have [a note about not assigning your teams to full capacity](/slack).

# Capabilities Model
- Focuses on measuring key outcomes
- Multi-dimensional and dynamic
- Continually improve on process
- Measures the impact of capabilities on DORA/SPACE metrics. Non-exhaustive list:
  - Delivery lead time
  - Deployment frequency
  - [MTTR](/mttr)
  - Change failure rate
- In appendix A of the book is a list of 24 capabilities that drive improvements in software delivery. Categorised as:
1. Continuous delivery
1. Architecture
1. Product & Process
1. Lean management & monitoring
1. Cultural

A few examples of the capabilities:
  - Version control
  - [WIP limits](/wip-limits)
  - Working in small batches


> The most innovative companies and highest-performing organizations are always striving to be better and never consider themselves “mature” or “done” with their improvement or transformation journey

