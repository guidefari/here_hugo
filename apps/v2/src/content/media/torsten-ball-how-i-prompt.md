---
title: "Torsten Ball: How I Prompt"
date: 2026-08-23T00:00:00+02:00
description: Notes on Torsten Ball's Laracon US talk on how he prompts coding agents while building Amp.
media_type: youtube
media_url: https://www.youtube.com/watch?v=HegqGzD-kvc
creator: Torsten Ball
youtube_id: HegqGzD-kvc
images: []
tags: [ai]
---

Talk from Torsten Ball (co-creator of [Amp](https://ampcode.com/)) at Laracon US, on how he prompts coding agents. 99% of Amp's code is AI-written, so this is a look at how that actually works day to day.

## the core mental model

- when you write a prompt, ask yourself: **how is the model supposed to know what I mean?**
- only a few sources inform how the model interprets your prompt:
  - training data (the internet, books, stack overflow)
  - the context window: system prompt, tool defs, skills, agents.md, conversation history, tool results, and your prompt
- if the info isn't in one of those places, the model won't know it. it won't ask "what bug?" like a human would, it'll just guess and say "you're absolutely right" then do something wrong
- the goal of all writing is to be understood. prompting is the same discipline as writing a good commit message, Slack message, or PR description: think about the reader, and what they're missing

## practical patterns

- **spell out what's in your head.** for a big feature, start with plain paragraphs describing the mechanism, point at the exact folders/files involved, then explicitly list constraints 
- **point at sources of information** instead of re-explaining them: existing files, docs, a Slack thread screenshot, a GitHub issue. let the agent read and synthesize instead of you transcribing
- **the "one-two punch"**: first ask the agent to *find and load* the relevant information (a file, an asset, a component) into context, then make the actual ask. two small prompts beat one prompt trying to hold everything (btw, why?)
- **screenshots are a cheap, high-density source of context.** ~90% of his prompts include one. use them to point at UI, point at a Slack conversation, or show "what good/broken looks like"
- **use "gold standard" reference implementations.** e.g. "investigate how queuing works in the CLI, it's the gold standard, now make the web version match it" gives the agent a concrete target instead of a vague "fix it"
- **let the agent close the loop itself**: "implement this fix and show me a screenshot of the storybook story" has verification folded into the same prompt

## pushing information into the codebase, not the prompt

- the best version of this: stop re-explaining things in prompts and put the knowledge in `agents.md` files scattered through the repo (root + nested per-directory)
- agents auto-load the nearest `agents.md` when they touch a directory, so it acts like a trail of breadcrumbs: "to start the dev server, use X", "storybook runs at this URL, check it like this". [progressive disclosure](https://docs.claude-mem.ai/progressive-disclosure) is a great way to manage context
- over time this means simple prompts 'just work', because the how-to lives in the codebase instead of your head
