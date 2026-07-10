---
title: "Learning Effect"
date: 2026-06-20T10:00:00+02:00
layout: "effect-course"
description: "A crash course through Effect: videos, podcasts, docs, and repos that helped me learn it, in the order I'd take them."
featured: true
tags: [effect]
noindex: false
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Learning%20Effect"]
intro: |
  A path through the resources that helped me learn Effect. The order is roughly
  the order I'd take them in, but every section is independent: jump to whatever
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
        note: "The landing page. The before/after code sample alone is the reason to keep going. There's also a 3-min intro video on the page that sets the tone."
        thumbnail: "https://website-landing-seven.vercel.app/opengraph-image.jpg?6fada1acf1f76e7e"
      - type: video
        title: "Effect 3.0: Production-Grade TypeScript"
        source: "Effect"
        url: "https://www.youtube.com/watch?v=ViSiXfBKElQ"
        note: "A broad overview of Effect as a production TypeScript toolkit."

  - number: "01"
    title: "Watch & listen"
    blurb: "The long-form stuff. Put it on in the background."
    items:
      - type: podcast
        title: "Cause & Effect"
        source: "Hosted by Johannes Schickling"
        url: "https://effect.website/podcast/"
        note: "Long-form conversations with teams using Effect in production. Start at episode 1 or jump to whichever company interests you."
        thumbnail: "https://img.youtube.com/vi/-mL7VVvkLGM/hqdefault.jpg"
      - type: video
        title: "Effect Office Hours"
        source: "Hosted by Kit Langton & Maxwell Brown"
        url: "https://www.youtube.com/playlist?list=PLDf3uQLaK2B_0hEiHT82cv-DotrtD6Bhi"
        note: "Live, weekly-ish. Q&A from the community, deep dives on specific patterns, and a real-time read on what's happening in the Effect world."
        thumbnail: "https://i.ytimg.com/vi/7xvcl2Pfp9A/hqdefault.jpg"
      - type: video
        title: "TypeScript's Error Handling Problem"
        source: "Matt Pocock"
        url: "https://www.youtube.com/watch?v=S2GChOwivwQ"
        note: "Why typed errors are a real thing, not just functional-programmer cosplay."
      - type: video
        title: "Vibe Engineering Effect Apps"
        source: "Michael Arnaldi"
        url: "/media/michael-arnaldi-vibe-engineering-effect-apps/"
        note: "On using Effect as the substrate for AI-engineered code. I took notes on it, linked above."
        thumbnail: "https://i.ytimg.com/vi/Wmp2Tku2PrI/hqdefault.jpg"
      - type: video
        title: "The Simple Secret Behind Effect's Power"
        source: "Kit Langton"
        url: "https://www.youtube.com/watch?v=F5aWLtEdNjE"
        note: "A clear explanation of what makes Effect different."
      - type: video
        title: "Effect is hard, but you REALLY need to try it"
        source: "Ben Davis"
        url: "https://www.youtube.com/watch?v=Enh5hD__hnQ"
        note: "Honest take on the learning curve and why it's worth it."
      - type: video
        title: "You really need to try Effect ft. Ethan Niser"
        source: "Ben Davis"
        url: "https://www.youtube.com/watch?v=S1YKKpLR7XI"
        note: "Conversation on getting started with Effect in practice."
      - type: video
        title: "Effect: the Good Parts, \"use workflow\", and Vercel Domains"
        source: "swyx (with Dillon Mulroy)"
        url: "https://www.youtube.com/watch?v=VR_MQH3opc8"
        note: "Dillon Mulroy on the parts of Effect he actually reaches for."
      - type: video
        title: "#116 Infrastructure as Effects with Sam Goodwin"
        source: "Happy Path Programming"
        url: "https://www.youtube.com/watch?v=YEn4A7XxgF4"
        note: "Using Effect for infrastructure concerns."
      - type: video
        title: "Stop agent slop with Effect"
        source: "Mattia Manzati (Effect Milan 2026)"
        url: "https://www.youtube.com/watch?v=88XERFAibQc"
        note: "Using Effect to constrain and validate AI-generated code."
      - type: video
        title: "Structured Concurrency: The hidden power behind Effect"
        source: "Antoine Coulon (Effect Days 2025)"
        url: "https://www.youtube.com/watch?v=do5KCcCgS18"
        note: "Why structured concurrency matters and how Effect implements it."
      - type: video
        title: "Effect at OpenCode"
        source: "Dax Raad (Effect Miami 2026)"
        url: "/media/effect-at-opencode/"
        note: "Dax walks through the OpenCode codebase showing Schema, Services, PubSub, Telemetry, and HTTP patterns. I took notes on it, linked above."
        thumbnail: "https://i.ytimg.com/vi/hY279-A2fC4/hqdefault.jpg"

  - number: "02"
    title: "Learn the core"
    blurb: "The handful of patterns you need before writing real code."
    items:
      - type: doc
        title: "Quickstart"
        source: "effect.website"
        url: "https://effect.website/docs/quickstart"
        thumbnail: "https://effect.website/open-graph/docs/getting-started/installation.png"
      - type: code
        title: "effect-smol (read the source)"
        source: "github.com/Effect-TS/effect-smol"
        url: "https://github.com/Effect-TS/effect-smol"
        note: "The repo IS the docs. Skim the source before reaching for the website."
        thumbnail: "https://opengraph.githubassets.com/1/Effect-TS/effect-smol"
      - type: link
        title: "effect.solutions"
        url: "https://effect.solutions/"
        note: "Community directory of patterns and snippets."
        thumbnail: "https://www.effect.solutions/og/home.png"
      - type: link
        title: "effect.institute"
        url: "https://effect.institute/"
        note: "Paid, structured course if you want a guided path."
        thumbnail: "https://www.effect.institute/og/home.png"
      - type: course
        title: "Effect Beginner's Complete Getting Started"
        source: "typeonce.dev"
        url: "https://typeonce.dev/course/effect-beginners-complete-getting-started"
        note: "Free text course that walks through the fundamentals."
        thumbnail: "https://www.typeonce.dev/static/images/course/effect-beginners-complete-getting-started.webp"

  - number: "03"
    title: "Build something"
    blurb: "Pick a project. Replace one layer at a time. See what breaks."
    items:
      - type: note
        title: "Effect-ts, in practice"
        source: "My note"
        url: "/effective/"
        note: "My long-form take. DI, errors, the runtime, observability, with code."
        thumbnail: "https://images-here-hugo.vercel.app/api/og-image?title=Effect-ts%2C%20in%20practice"
      - type: code
        title: "invoicing"
        source: "github.com/guidefari/invoicing"
        url: "https://github.com/guidefari/invoicing"
        note: "The app I keep referencing. Same workflow, swap the layer, prod and test."
        thumbnail: "https://opengraph.githubassets.com/1/guidefari/invoicing"
      - type: code
        title: "gbfm (apps/vps)"
        source: "github.com/guidefari/gbfm"
        url: "https://github.com/guidefari/gbfm"
        note: "The production app I work on. Effect everywhere: HTTP, cron, OTel."
        thumbnail: "https://opengraph.githubassets.com/1/guidefari/gbfm"

  - number: "04"
    title: "Go deeper"
    blurb: "Once you're writing it daily, the next layer unlocks."
    items:
      - type: article
        title: "The one weird git trick that makes coding agents more effect-ive"
        source: "Maxwell Brown"
        url: "https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/"
        note: "Clone the Effect repo into your project so AI agents read the real source."
        thumbnail: "https://effect.website/open-graph/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive.png"
      - type: note
        title: "Exhaustive Pattern Matching"
        source: "My note"
        url: "/exhaustive/"
        note: "Why exhaustive handling matters, especially with LLMs in the loop."
        thumbnail: "https://images-here-hugo.vercel.app/api/og-image?title=Exhaustive%20Pattern%20Matching"
      - type: note
        title: "OpenCode References: Just Clone the Repo"
        source: "My note"
        url: "/opencode-references/"
        note: "OpenCode 1.17.3 adds first-party support for referencing other repos. Effect is the example."
        thumbnail: "https://images-here-hugo.vercel.app/api/og-image?title=OpenCode%20References%3A%20Just%20Clone%20the%20Repo"
reference_repos:
  - name: "invoicing"
    url: "https://github.com/guidefari/invoicing"
    blurb: "My reference Effect app. Service + Layer + runtime, prod and test."
    thumbnail: "https://opengraph.githubassets.com/1/guidefari/invoicing"
  - name: "gbfm (apps/vps)"
    url: "https://github.com/guidefari/gbfm"
    blurb: "The production app I work on. Effect everywhere: HTTP, cron, OTel."
    thumbnail: "https://opengraph.githubassets.com/1/guidefari/gbfm"
  - name: "opensound"
    url: "https://opensound.dev"
    blurb: "My open source music library tooling. The first real Effect project I shipped."
    thumbnail: "https://images-here-hugo.vercel.app/api/og-image?title=opensound"
  - name: "pokemon-app"
    url: "https://github.com/guidefari/pokemon-app"
    blurb: "Thanda's app. A small, clean Effect codebase to read end-to-end."
    thumbnail: "https://opengraph.githubassets.com/1/guidefari/pokemon-app"
  - name: "effect-monorepo"
    url: "https://github.com/lucas-barake/effect-monorepo"
    blurb: "Reference monorepo structure with Effect."
    thumbnail: "https://opengraph.githubassets.com/1/lucas-barake/effect-monorepo"
  - name: "effect-utils"
    url: "https://github.com/overengineeringstudio/effect-utils"
    blurb: "A bag of Effect utility patterns."
    thumbnail: "https://opengraph.githubassets.com/1/overengineeringstudio/effect-utils"
channels:
  - name: "effect.website"
    url: "https://effect.website/"
    blurb: "Docs, blog, podcast, playground. The home base."
    thumbnail: "https://website-landing-seven.vercel.app/opengraph-image.jpg?6fada1acf1f76e7e"
  - name: "@effectts (YouTube)"
    url: "https://www.youtube.com/@EffectTS"
    blurb: "Conference talks, deep dives, office hours."
    thumbnail: "https://images-here-hugo.vercel.app/api/og-image?title=%40effectts%20YouTube"
  - name: "Cause & Effect podcast"
    url: "https://effect.website/podcast/"
    blurb: "Hosted by Johannes Schickling."
    thumbnail: "https://img.youtube.com/vi/-mL7VVvkLGM/hqdefault.jpg"
  - name: "github.com/Effect-TS/effect-smol"
    url: "https://github.com/Effect-TS/effect-smol"
    blurb: "The new, faster Effect. The source is the docs."
    thumbnail: "https://opengraph.githubassets.com/1/Effect-TS/effect-smol"
  - name: "effect.solutions"
    url: "https://effect.solutions/"
    blurb: "Community pattern directory."
    thumbnail: "https://www.effect.solutions/og/home.png"
  - name: "effect.institute"
    url: "https://effect.institute/"
    blurb: "Paid guided course."
    thumbnail: "https://www.effect.institute/og/home.png"
---

A crash course through Effect, in the order I'd take it. Start at the top, jump to whatever fits where you are, or [browse everything I've written on the topic](/tags/effect/).

The full design lives in the next-gen version of this site. In the meantime, here are the links:

- [effect.website](https://effect.website/): the home base
- [@effectts on YouTube](https://www.youtube.com/@EffectTS): talks, deep dives
- [Cause & Effect podcast](https://effect.website/podcast/): hosted by Johannes Schickling
- [effect-smol on GitHub](https://github.com/Effect-TS/effect-smol): read the source
- [effect.solutions](https://effect.solutions/): community pattern directory
- [effect.institute](https://effect.institute/): paid guided course
