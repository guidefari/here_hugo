---
title: "Load Testing"
date: 2025-02-11T10:20:12+02:00
description: Some thoughts around how to handle load testing
tags: [devops]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Load+Testing']
---

## What is load testing
A type of performance testing where you see how a system behaves under **expected** and **peak** load.
Context matters, the intended use of your system & business context dictates how you'd model load expectations.

## Some metrics to consider measuring
- Response time
- Throughput
- Memory/CPU utilization
- Error rate at peak load
- Concurrent user load

## Before you begin load testing
Before you can start load testing, define production hardware constraints ahead of time. 
Establish what kind of memory, cpu, and network setup you have.

## When is it appropriate to start load testing

The 'shift left' principle applies here. As soon as you can. While developing & throughout the development cycle.
Memory profiling tools come in handy if you're going to do this on your dev machine.

One step closer to production is running these tests in a staging environment.

## Graceful degradation
Instead of complete/absolute failure of a system when it's overloaded, 
load testing can help you figure out ahead of time what graceful degradation can look like.

- In some cases the answer is throttling clients that are making requests to your system
- In some cases it's leaning real heavy on message queues
- In other cases it's appropriate to drop requests altogether