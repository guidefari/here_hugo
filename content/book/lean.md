---
title: "Implementing Lean Software Development"
date: 2023-10-03T08:18:18+02:00
description: Book Notes
tags: [process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Implementing+Lean']
---

### Get the book
- [Implementing Lean Software Development: From Concept to Cash](https://www.oreilly.com/library/view/implementing-lean-software/0321437381/)


## Queueing theory
Speaking to the impact of WIP limits.

> Variation is often dealt with by reducing the size of batches moving through the system

> For example, many stores have check-out lanes for "10 items or less"
> to reduce the variation in checkout time for that line

## Utilization and its impact on efficiency

## Value Stream Mapping
I think a lot about how outcome/output is measured in software teams,
especially around the contrast of measuring individual output vs team output
and how that connects to the **flow of value through a system** that I've heard about from time and time again from these sources:
[successful teams are organised around flow. Flow of information, flow of requirements, flow of value from concept to customer. You want to design your information structures in a way that facilitates the flow of information & value](https://www.guidefari.com/tt-jl/)- **James Lewis**
* Accelerate book & stuff from the SPACE framework
* [Team Topologies](https://itrevolution.com/product/team-topologies/)' chapter on team first thinking
* [Dan North on Value Stream mapping](/dn-flow)

* helps break down what's happening around lead time. identifies the amount of time that a unit of work spends 'waiting to be picked up', vs 'being done' (the value adding activity)
  * why lead time is a useful metric
  * DORA & accelerate
  * in software, work sitting in a queue, or WIP state, is liked to inventory in the manufacturing process
* how queuing theory fits in