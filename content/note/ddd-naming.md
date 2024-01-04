---
title: "Domain Driven Design and naming"
date: 2023-04-17T11:45:55+02:00
description: Musings on what Domain Driven Design taught me about naming variables, methods etc in my code.
tags: [design, ddd, playbook]
aliases: [dddn]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Domain%20Driven%20Design%20and%20naming']
---

# Ubiquitous Language
A big idea in Domain Driven Design (DDD) is [ubiquitous language](/ubiquitous-language).
The books have entire chapters on the topic, but I'll try to summarise it and it's benefits below.

**Definition**:
A shared language for use by domain experts and developers, that is used to express your business' scenarios or model.

# Some Benefits

- Reduces [cognitive load](/cognitive-load-theory), simplifies communication across stake holders from all areas (Domain Experts & developers). This is a case of reducing **Extraneous (irrelevant) Load**, because fewer 'translations' & clarifications need to be made when communicating.
- Eliminates inaccuracies and contradictions when communicating in [cross-functional teams (very common way of operating)](/team-topologies).

# Actionable items
- Try and name your functions and variables using ubiquitous language.
- Even if you're not in an environment that explicitly uses DDD, you can introduce Ubiquitous Language:
  - Start a shared document, with the language you commonly use on your project, to make sure everyone's on the same page


# Related reading
- best place to start is [Vaughn Vernon's](https://vaughnvernon.com/) [Domain Driven Design Distilled](https://kalele.io/books/)
- [Martin Fowler - UbiquitousLanguage](https://martinfowler.com/bliki/UbiquitousLanguage.html)
- [Developing the ubiquitous language](https://thedomaindrivendesign.io/developing-the-ubiquitous-language/)
- [Baking Domain Concepts Into Code - Paul Rayner - DDD Europe 2023](https://www.youtube.com/watch?v=o_vAjX2vHu8)
- [Naming in DDD - Sepehr Namdar & Khaled Souf - DDD EU 2022](https://www.youtube.com/watch?v=KHgftXIlGsY)
