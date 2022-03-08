---
title: "Cypress Intercept"
date: 2022-03-07T10:34:44+02:00
description: Network request stubbing with Cypress 
tldr: Network request stubbing with Cypress 
tags: [til, testing]
---

Something I learnt whilst going through [Dan](https://github.com/Thunder-Chief)'s PR.

## Why Cypress Intercept?
It allows you to [stub network requests](https://www.cypress.io/blog/2020/11/24/introducing-cy-intercept-next-generation-network-stubbing-in-cypress-6-0/) while cypress testing.


## src
Cypress docs explain this so well, including scenarios where you might use this stuff, to really help illustrate how it can be useful. Definitely a worthy read.
- **Cypress Docs:**
  - [Network requests](https://docs.cypress.io/guides/guides/network-requests)
  - [Intercept](https://docs.cypress.io/api/commands/intercept)

- Also a good time to understand the difference between **stubbing** & **mocking**:
  - [Differences between Stubbing and Mocking](https://www.toolsqa.com/blogs/differences-between-stubbing-and-mocking/)
  - [Mocking and Stubbing with Cypress — Beginner to Advanced](https://medium.com/ecs-digital/mocking-and-stubbing-with-cypress-beginner-to-advanced-3d26bde2ebce)
  - [Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs) - Pointing out **behaviour verification** (which is used by mocks) vs **state verification** (used by stubs). Worth a re-read when I have time :)
