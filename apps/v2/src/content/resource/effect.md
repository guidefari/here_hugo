---
title: "Learning Effect"
date: 2026-06-20T10:00:00+02:00
layout: "effect-course"
description: "A crash course through Effect — videos, podcasts, docs, and repos that helped me learn it, in the order I'd take them."
tags: [effect]
noindex: false
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Learning%20Effect"]
intro: |
  A path through the resources that helped me learn Effect. The order is roughly
  the order I'd take them in, but every section is independent — jump to whatever
  fits where you are.
first_taste:
  caption: "This is the idea. The rest of the page is everything I read or watched to actually understand it."
  language: "ts"
stations:
  - number: "00"
    title: "Orient"
    blurb: "What Effect is, in plain language."
    items:
      - type: article
        title: "effect.website"
        source: "Effectful"
        url: "https://effect.website/"
        note: "The landing page. The before/after code sample alone is the reason to keep going."
      - type: video
        title: "Effect: Next-Generation TypeScript"
        source: "Effect"
        url: "https://effect.website/"
        note: "The intro video on the landing page. Sets the tone in three minutes."

  - number: "01"
    title: "Watch & listen"
    blurb: "The long-form stuff. Put it on in the background."
    items:
      - type: podcast
        title: "Cause & Effect"
        source: "Hosted by Johannes Schickling"
        url: "https://effect.website/podcast/"
        note: "Long-form conversations with teams using Effect in production. Start at episode 1 or jump to whichever company interests you."
      - type: video
        title: "Effect Office Hours"
        source: "Hosted by Kit Langton & Maxwell Brown"
        url: "https://www.youtube.com/playlist?list=PLDf3uQLaK2B_0hEiHT82cv-DotrtD6Bhi"
        note: "Live, weekly-ish. Q&A from the community, deep dives on specific patterns, and a real-time read on what's happening in the Effect world."
      - type: video
        title: "TypeScript's Error Handling Problem"
        source: "Matt Pocock"
        url: "https://www.youtube.com/watch?v=S2GChOwivwQ"
        note: "Why typed errors are a real thing, not just functional-programmer cosplay."
      - type: video
        title: "Vibe Engineering Effect Apps"
        source: "Michael Arnaldi"
        url: "/media/michael-arnaldi-vibe-engineering-effect-apps/"
        note: "On using Effect as the substrate for AI-engineered code. I took notes on it — linked above."

  - number: "02"
    title: "Learn the core"
    blurb: "The handful of patterns you need before writing real code."
    items:
      - type: doc
        title: "Quickstart"
        source: "effect.website"
        url: "https://effect.website/docs/quickstart"
      - type: code
        title: "effect-smol (read the source)"
        source: "github.com/Effect-TS/effect-smol"
        url: "https://github.com/Effect-TS/effect-smol"
        note: "The repo IS the docs. Skim the source before reaching for the website."
      - type: link
        title: "effect.solutions"
        url: "https://effect.solutions/"
        note: "Community directory of patterns and snippets."
      - type: link
        title: "effect.institute"
        url: "https://effect.institute/"
        note: "Paid, structured course if you want a guided path."
      - type: course
        title: "Effect Beginner's Complete Getting Started"
        source: "once.dev"
        url: "https://once.dev/course/effect-beginners-complete-getting-started"
        note: "Free video course that walks through the fundamentals."

  - number: "03"
    title: "Build something"
    blurb: "Pick a project. Replace one layer at a time. See what breaks."
    items:
      - type: note
        title: "Effect-ts, in practice"
        source: "My note"
        url: "/effective/"
        note: "My long-form take. DI, errors, the runtime, observability — with code."
      - type: code
        title: "invoicing"
        source: "github.com/guidefari/invoicing"
        url: "https://github.com/guidefari/invoicing"
        note: "The app I keep referencing. Same workflow, swap the layer, prod and test."
      - type: code
        title: "gbfm (apps/vps)"
        source: "github.com/guidefari/gbfm"
        url: "https://github.com/guidefari/gbfm"
        note: "The production app I work on. Effect everywhere — HTTP, cron, OTel."

  - number: "04"
    title: "Go deeper"
    blurb: "Once you're writing it daily, the next layer unlocks."
    items:
      - type: article
        title: "The one weird git trick that makes coding agents more effect-ive"
        source: "Maxwell Brown"
        url: "https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/"
        note: "Clone the Effect repo into your project so AI agents read the real source."
      - type: note
        title: "Exhaustive Pattern Matching"
        source: "My note"
        url: "/exhaustive/"
        note: "Why exhaustive handling matters, especially with LLMs in the loop."
      - type: note
        title: "OpenCode References: Just Clone the Repo"
        source: "My note"
        url: "/media/opencode-references-just-clone-repo/"
        note: "OpenCode 1.17.3 adds first-party support for referencing other repos. Effect is the example."
reference_repos:
  - name: "invoicing"
    url: "https://github.com/guidefari/invoicing"
    blurb: "My reference Effect app. Service + Layer + runtime, prod and test."
  - name: "gbfm (apps/vps)"
    url: "https://github.com/guidefari/gbfm"
    blurb: "The production app I work on. Effect everywhere — HTTP, cron, OTel."
  - name: "opensound"
    url: "https://opensound.dev"
    blurb: "My open source music library tooling. The first real Effect project I shipped."
  - name: "pokemon-app"
    url: "https://github.com/guidefari/pokemon-app"
    blurb: "Thanda's app. A small, clean Effect codebase to read end-to-end."
  - name: "effect-monorepo"
    url: "https://github.com/lucas-barake/effect-monorepo"
    blurb: "Reference monorepo structure with Effect."
  - name: "effect-utils"
    url: "https://github.com/overengineeringstudio/effect-utils"
    blurb: "A bag of Effect utility patterns."
channels:
  - name: "effect.website"
    url: "https://effect.website/"
    blurb: "Docs, blog, podcast, playground. The home base."
  - name: "@effectts (YouTube)"
    url: "https://www.youtube.com/@EffectTS"
    blurb: "Conference talks, deep dives, office hours."
  - name: "Cause & Effect podcast"
    url: "https://effect.website/podcast/"
    blurb: "Hosted by Johannes Schickling."
  - name: "github.com/Effect-TS/effect-smol"
    url: "https://github.com/Effect-TS/effect-smol"
    blurb: "The new, faster Effect. The source is the docs."
  - name: "effect.solutions"
    url: "https://effect.solutions/"
    blurb: "Community pattern directory."
  - name: "effect.institute"
    url: "https://effect.institute/"
    blurb: "Paid guided course."
---

A crash course through Effect, in the order I'd take it. Start at the top, jump to whatever fits where you are, or [browse everything I've written on the topic](/tags/effect/).

The full design lives in the next-gen version of this site. In the meantime, here are the links:

- [effect.website](https://effect.website/) — the home base
- [@effectts on YouTube](https://www.youtube.com/@EffectTS) — talks, deep dives
- [Cause & Effect podcast](https://effect.website/podcast/) — hosted by Johannes Schickling
- [effect-smol on GitHub](https://github.com/Effect-TS/effect-smol) — read the source
- [effect.solutions](https://effect.solutions/) — community pattern directory
- [effect.institute](https://effect.institute/) — paid guided course


