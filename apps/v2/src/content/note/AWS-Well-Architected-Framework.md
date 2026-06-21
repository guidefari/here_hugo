---
title: "AWS Well Architected Framework"
date: 2022-02-14T09:30:16+02:00
description: Some notes from the Well-Architected Framework whitepaper
tags: [notes, aws, backend, cloud]
---

- **[Home Page](https://aws.amazon.com/architecture/well-architected/)**

# The pillars
of what you expected from a well put together & modern cloud environment.

1. Operational Excellence
1. Security
1. Reliability
1. Performance efficiency
1. Cost Optimization
1. Sustainability

> When architecting workloads, you make trade-offs between pillars based on your business context.

> Security and operational excellence are generally not traded-off against the other pillars.

## General Design Principles
these are the points that stuck out for one reason or another:

- Drive architectures using data: see how your architecture decisions affect your workload(s).
- Improve through game days: "Test how your architecture and processes perform by regularly scheduling game days to simulate events in production".

---

# Operational Excellence
> The ability to support development & run workloads effectively, gain insight into their operation... continuously improve process & procedures to **deliver business value**

## Design Principles
- **Perform operations as code:** think along the lines of IaC. I've spent some time reading into the why & the how of it. reduce human error, automate away the stuff that machines are good at, as humans, focus on the 'creative' elements of delivering value.
- **Make frequent, small, reversible changes:** without affecting customers when possible.
- **Refine operations procedures frequently**
- **Anticipate failure:** test your failure scenarios & validate their impact.
- **Learn from all operational failures**

## Best practices
- Organization 
- Prepare
- Operate
- Evolve

#### side note - [AWS leadership principles](https://www.amazon.jobs/en/principles)

---

- [bookmark](https://docs.aws.amazon.com/wellarchitected/latest/framework/sec-security.html)