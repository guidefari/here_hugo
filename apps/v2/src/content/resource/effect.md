---
title: "Learning Effect"
date: 2026-06-20T10:00:00+02:00
layout: "effect-course"
description: "A crash course through Effect: the videos, podcasts, docs, and repos that helped me learn it, grouped by what they're good for."
featured: true
tags: [effect]
noindex: false
images: ["https://og.guidefari.com/og-image?title=Learning%20Effect"]
intro: |
  The resources that helped me learn Effect, grouped by what they're good for.
  There's no set order: jump to whatever fits where you are.
first_taste:
  caption: "This is the idea. The rest of the page is everything I read or watched to actually understand it."
  language: "ts"
stations:
  - title: "Watch & listen"
    blurb: "The long-form stuff. Put it on in the background."
    items:
      - type: video
        title: "Effect 3.0: Production-Grade TypeScript"
        source: "Effect"
        url: "https://www.youtube.com/watch?v=ViSiXfBKElQ"
        note: "A broad overview of Effect as a production TypeScript toolkit. A good place to start."
      - type: podcast
        title: "Cause & Effect"
        source: "Hosted by Johannes Schickling"
        url: "https://effect.website/podcast/"
        note: "Long-form conversations with teams using Effect in production. Start at episode 1 or jump to whichever company interests you."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/02-img-youtube-com-vi-ml7vvvklgm-hqdefault-jpg.jpg"
      - type: video
        title: "Effect Office Hours"
        source: "Hosted by Kit Langton & Maxwell Brown"
        url: "https://www.youtube.com/playlist?list=PLDf3uQLaK2B_0hEiHT82cv-DotrtD6Bhi"
        note: "Live, weekly-ish. Q&A from the community, deep dives on specific patterns, and a real-time read on what's happening in the Effect world."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/03-i-ytimg-com-vi-7xvcl2pfp9a-hqdefault-jpg.jpg"
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
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/04-i-ytimg-com-vi-wmp2tku2pri-hqdefault-jpg.jpg"
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
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/05-i-ytimg-com-vi-hy279-a2fc4-hqdefault-jpg.jpg"

  - title: "Learn the core"
    blurb: "The handful of patterns you need before writing real code."
    items:
      - type: doc
        title: "Quickstart"
        source: "effect.website"
        url: "https://effect.website/docs/v4/getting-started/introduction"
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/06-effect-website-og-docs-v4-getting-started-introduction-png.png"
      - type: code
        title: "Effect (read the source)"
        source: "github.com/Effect-TS/effect"
        url: "https://github.com/Effect-TS/effect"
        note: "The repo IS the docs. Skim the source before reaching for the website."
      - type: link
        title: "effect.solutions"
        url: "https://effect.solutions/"
        note: "Community directory of patterns and snippets."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/08-www-effect-solutions-og-home-png.png"
      - type: link
        title: "effect.institute"
        url: "https://effect.institute/"
        note: "Paid, structured course if you want a guided path."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/09-www-effect-institute-og-home-png.png"
      - type: course
        title: "Effect Beginner's Complete Getting Started"
        source: "typeonce.dev"
        url: "https://typeonce.dev/course/effect-beginners-complete-getting-started"
        note: "Free text course that walks through the fundamentals."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/10-www-typeonce-dev-static-images-course-effect-beginners-complete-getting-started-webp.webp"

  - title: "Go deeper"
    blurb: "Longer reads and notes for once you're writing it daily. The repos to build against are in Reference."
    items:
      - type: note
        title: "Effect-ts, in practice"
        source: "My note"
        url: "/effective/"
        note: "My long-form take. DI, errors, the runtime, observability, with code."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/11-og-guidefari-com-og-image-title-effect-ts-2c-20in-20practice.png"
      - type: article
        title: "The one weird git trick that makes coding agents more effect-ive"
        source: "Maxwell Brown"
        url: "https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/"
        note: "Clone the Effect repo into your project so AI agents read the real source."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/14-effect-website-og-blog-the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive-png.png"
      - type: note
        title: "Exhaustive Pattern Matching"
        source: "My note"
        url: "/exhaustive/"
        note: "Why exhaustive handling matters, especially with LLMs in the loop."
        thumbnail: "https://media.guidefari.com/effect-course-thumbnails/15-og-guidefari-com-og-image-title-exhaustive-20pattern-20matching.png"
    cta:
      label: "view all effect content"
      url: "/tags/effect"
reference_repos:
  - name: "invoicing"
    url: "https://github.com/guidefari/invoicing"
    blurb: "My reference Effect app. Service + Layer + runtime, prod and test."
    thumbnail: "https://media.guidefari.com/effect-course-thumbnails/12-opengraph-githubassets-com-1-guidefari-invoicing.png"
  - name: "gbfm (apps/vps)"
    url: "https://github.com/guidefari/gbfm"
    blurb: "The production app I work on. Effect everywhere: HTTP, cron, OTel."
    thumbnail: "https://media.guidefari.com/effect-course-thumbnails/13-opengraph-githubassets-com-1-guidefari-gbfm.png"
  - name: "Effect Module of the Week examples"
    url: "https://github.com/guidefari/effect-module-of-the-week"
    blurb: "Runnable PersistedQueue, RcMap, and RcRef examples with short guides."
  - name: "efa-template"
    url: "https://github.com/guidefari/efa-template"
    blurb: "Effect 4 + Alchemy + Foldkit monorepo starter with an API and web app."
  - name: "opensound"
    url: "https://opensound.dev"
    blurb: "My open source music library tooling. The first real Effect project I shipped."
    thumbnail: "https://media.guidefari.com/effect-course-thumbnails/17-og-guidefari-com-og-image-title-opensound.png"
  - name: "pokemon-app"
    url: "https://github.com/guidefari/pokemon-app"
    blurb: "Thanda's app. A small, clean Effect codebase to read end-to-end."
    thumbnail: "https://media.guidefari.com/effect-course-thumbnails/18-opengraph-githubassets-com-1-guidefari-pokemon-app.png"
  - name: "effect-monorepo"
    url: "https://github.com/lucas-barake/effect-monorepo"
    blurb: "Reference monorepo structure with Effect."
    thumbnail: "https://media.guidefari.com/effect-course-thumbnails/19-opengraph-githubassets-com-1-lucas-barake-effect-monorepo.png"
  - name: "effect-utils"
    url: "https://github.com/overengineeringstudio/effect-utils"
    blurb: "A bag of Effect utility patterns."
    thumbnail: "https://media.guidefari.com/effect-course-thumbnails/20-opengraph-githubassets-com-1-overengineeringstudio-effect-utils.png"
  - name: "executor"
    url: "https://github.com/UsefulSoftwareCo/executor"
    blurb: "A production Effect codebase from Useful Software."
---

A crash course through Effect, grouped by what each resource is good for. Jump to whatever fits where you are, or [browse everything I've written on the topic](/tags/effect/).

The full design lives in the next-gen version of this site. In the meantime, here are the links:

- [effect.website](https://effect.website/): the home base
- [@effectts on YouTube](https://www.youtube.com/@EffectTS): talks, deep dives
- [Cause & Effect podcast](https://effect.website/podcast/): hosted by Johannes Schickling
- [Effect on GitHub](https://github.com/Effect-TS/effect): read the source
- [effect.solutions](https://effect.solutions/): community pattern directory
- [effect.institute](https://effect.institute/): paid guided course
