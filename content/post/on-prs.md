---
title: "Pull Requests & WIP"
date: 2022-11-14T10:09:59+02:00
description: I often open Pull Requests immediately when I start on a task.
tags: [agile]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Pull%20Requests%20%26%20WIP']
---

I often open Pull Requests immediately when I start on a task. this allows for:

- pipeline to write on each commit
- immutable build & url/live environment for each commit (true with github + vercel or netlify)

#### every couple of commits, I glance at the pull request on github or bitbucket:

- check pipelines to see if tests are passing
- the separate environment means I can review my code as I go. imagine this, I open that PR first thing in the morning after having worked on it the day before, I have a fresh & well rested mind, and often pick up mistakes & do immediate refactors, or finish off that thing I was lazy to do yesterday.
- It allows for code review as I go. Workmates can pop in as I’m doing my work, leave suggestions & questions, making it more collaborative, and can exposes cases I wouldn’t have considered. Asynchronous pair programming, essentially - useful in a distributed team

## Reduces Risk
- As collaboration & reviews with peers can happen early & often, you're less likely to sink tens of hours into work that'll be undone at review time

# related reading
This note was prompted by an [article](https://martinfowler.com/articles/ship-show-ask.html) by [Rouan Wilsenach](https://www.rouanw.com/)