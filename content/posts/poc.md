---
title: "on Proof of Concepts"
date: 2022-04-18T11:52:16+02:00
description: Some thoughts, explanations, retro, & opinions on PoCs.
tldr: It’s a software development testing methodology.
tags: [retro, notes, culture]
---

# Intro & Context
I've had the pleasure of spending the last 5+ weeks, doing PoC & research work with [Neil](https://www.linkedin.com/in/nicolaas-swart-43018549/). The thing we've been trying to do, is simplify frontend integration, and by extension, state management too. 

Simplify refers to making the code easier & quicker to write, read, understand, & test.

## What is a PoC

> It’s a software development testing methodology.
> [src](https://www.netguru.com/blog/proof-of-concept-in-software-development)

I love this concise definition. At it's core, that's really what a PoC is. 

## When is it appropriate to conduct a PoC
Testing a theory, potential solutions, validating assumptions, & many other scenario's are appropriate to use a proof of concept as a testing strategy.

> Measure twice, cut once

## Reducing risk
Bringing failure closer to the beginning of a thing, before you invest too much resources in it, only to realise later that whatever solution has been chosen is incompatible.

> Fail fast, fail often

I think PoC'ing comes from a [similar school of thought](https://www.arrkgroup.com/thought-leadership/fail-fast-fail-often-explained/) as the quote above. PoC is a tool that you can use to fail fast, and adjust before proceeding.

## Things to keep in mind when PoC'ing

* There are many reasons why you may want to do a proof of concept in the first place, examples include: 
    * how can this PoC deliver business value. related to what's the root problem we're trying to solve?
    * what is the definition of success, or the intended outcome?
    * what do we hope to learn?
    * what resources have we got at our disposal?
    * what is a reasonable timeframe for this PoC work?

## Documentation
I would strongly recommend documenting these questions & answers. As with any good documentation, one key thing here is to keep in mind the intended audience of that PoC documentation. That's relatively easy to answer, just figure out which stakeholders would be interested in the outcome of your PoC and write for them.

#### Other artifacts you can include in your PoC Documentation

* General findings
* Pros & cons
* Concerns
* Resources & references
* Code snippets
* Demo videos
* Design diagrams


### On code quality
I think on most occasions, your PoC code doesn't have to be production grade. Feel free to cut some corners and leave some code smells in, as long as you're aware of them, and communicate them if need be. PoC is usually still exploratory stage of development, so it's okay to limit time and effort invested where you can.

> Make it work, make it right, make it fast

# Conclusion
How it's conducted is ultimately very contextual, and therefore can look pretty different from PoC to PoC, but I hope this post has shed some light on what it is, and the heuristics you can use to your favour when thinking of how to apply PoCs to your work.