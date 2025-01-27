---
title: "Gbfm Migration"
date: 2025-01-13T06:50:39+02:00
description: 
tags: [strategy]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=gbfm+Migration']
---

No migration is real until there’s codenames. This initiative was a migration from `nextgoose` -> `gbfm`. 

Core idea was to move from NextJS & Vercel to AWS via SST. [The kickoff document is here](https://guidefari.com/gbfm-sst/).

## Why?
- Educational indulgence
- Learning how to manage my own infra
  - 2024 was big on [experimenting with CI/CD options](https://guidefari.com/ci-cd/), this was one such experiment
- 2024 was collectively a self-hosting era. This had me feeling like minimising 3rd party SaaS providers. Also influenced by Dax

## The big pieces
- Auth
  - Undocumented API’s at first
  - Breaking changes a few months later, with the introduction of OpenAuth
- Automated deployments
  - Started with deploying manually on laptop
  - Then GitHub actions
  - Then SST console
  - Back to Github actions
- Database (moving from MDX content that lives in git, to a DB somewhere)
  - Tried Drizzle & Postgres on a VPS, struggled with moving fast with that
  - Now using Dynamo
- API
  - I like the Hono
- Getting off NextJS, and moving to a more bare-bones meta framework
  - I went with Vite + tanstack router + tanstack query
  - Quickly learnt that you end up just building your own meta framework anyway, lol.
- Email
  - Getting my AWS SES out of Sandbox & into Production mode was an interesting experience
- Frontend
  - My only complaint right now is Tanstack query feels like it fetches too often. I have components in the loading state often
- Folder structure
  - I don’t like the folder structure I adopted for months. I feel like I just picked it up from SST docs, plus the terminal repo & Adam’s ProAWS repo too
  - For such a simple app, it felt like too big of a codebase. I’m actively trying to strip back now

# Open source experience
It was nice to explore undocumented API’s and undocumented IaC bugs, as those forced me to engage with the community on Github & discord. In some cases it forced me to read the source code to try and understand the source of my bugs.

That said, I lost a fair amount of time to this. If you need to quickly build a product or PoC and get stuff in the hands of users with little stress, you’re probably better served by using tried & tested, mature stuff. Like NextJS & Vercel. That stuff just works.

It wasn’t my first time learning that lesson, I went into this migration aware of that.

# Goals 
When I started this migration, I had a long weekend ahead of me, Friday, Saturday & Sunday. I was foolish enough to think that was all the time I needed. 🙂 

Going into this, I had a simple goal: **No breaking changes**. I didn’t quite meet that, the UI definitely regressed a bit.

# Grading
- Execution: Giving this one a solid 6.5/10
- Lessons learnt: 8/10

# Key takeaways 
> don’t go through a migration unless the return on investment is at least an order of magnitude
