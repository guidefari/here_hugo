---
title: "Skill Atrophy"
date: 2026-04-29T23:47:24+02:00
featured: true
description: A few sources on fighting AI related skill atrophy.
tags: ["ai"]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Skill+Atrophy"]
---

### Sources

- [Avoiding Skill Atrophy in the Age of AI](https://addyo.substack.com/p/avoiding-skill-atrophy-in-the-age), Addy Osmani. The most direct engineering-oriented piece here. Useful for concrete countermeasures: attempt the problem yourself first, review AI output like a teammate's code, use AI to explain instead of only generate, and keep track of recurring AI assists as a map of skill gaps.
- [How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills), Anthropic. The strongest empirical source. Developers using AI in a learning task scored lower afterward, with the biggest gap on debugging questions. The interesting nuance is that the better outcomes came from people who used AI to build comprehension, not just finish the task.
- [From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI](https://arxiv.org/abs/2603.22106), Margaret-Anne Storey. Extends the problem from individual skill atrophy to team-level debt. I pulled that thread into [Three kinds of debt](/three-debts).
- [Cognitive Habits](https://x.com/zehf/status/2031433558959554974), Zeh Fernandes. Short but useful framing: some tasks matter less for what they produce than for what happens to you while doing them. This is the center of the note.
- [How to Stop AI from Killing Your Critical Thinking](https://www.youtube.com/watch?v=3lPnN8omdPA), Advait Sarkar. Useful companion piece shared by Dandre on cognitive offloading and critical thinking.

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/3lPnN8omdPA" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

### Contrast source

- [We mourn our craft](https://nolanlawson.com/2026/02/07/we-mourn-our-craft/), Nolan Lawson. Not exactly a skill-atrophy argument, but more of a grief essay about the transition away from hand-coded software.
  Lawson argues that AI-assisted engineering may be inevitable, which makes abstinence an incomplete answer. The harder question is what parts of craft we deliberately preserve.

### Supporting sources

- [Why Engineers Need To Write](https://www.developing.dev/p/why-engineers-need-to-write), Ryan Peterman. Writing is treated as a mechanism for thinking, not merely communication. This supports the argument that fully outsourcing design docs, notes, and explanations can remove the part of the work where understanding gets formed.
- [The Surprising Reason Writing Remains Essential in an AI-Driven World](https://fs.blog/why-write/), Farnam Street. General but directly relevant. Writing exposes what you do not understand and helps build deep fluency. Tools can write for you, but they cannot make you understand for you.
- [The Bet On Juniors Just Got Better](https://tidyfirst.substack.com/p/the-bet-on-juniors-just-got-better), Kent Beck. Useful counterpoint. AI can accelerate learning if juniors are managed for learning rather than production. The tool can be an endlessly patient tutor, but it will not automatically create learning opportunities.
- [Three reasons a liberal arts degree helped me succeed in tech](https://martinfowler.com/articles/2023-liberal-arts.html), Sannie Lee. Adjacent, but helpful. Critical thinking, clear writing, and source evaluation become more valuable when AI can generate plausible output cheaply.

## Emerging themes across the sources

### What atrophies

- Debugging skill
- Independent problem formulation
- System-level reasoning
- Memory and recall for frequently used concepts
- [Writing](/tags/writing) as thinking
- Shared team understanding of why the system works the way it does

### What seems to cause the atrophy

- Delegating before attempting
- Accepting plausible output without scrutiny
- Using AI for completion speed on learning tasks
- Removing productive friction entirely
- Failing to externalize intent and rationale
- Treating generated artifacts as if they equal understanding

### What counters it

- Protect some manual work on purpose
- Use AI in comprehension mode, not just generation mode
- Ask follow-up why/how/what-are-the-tradeoffs questions
- Keep writing, summarizing, and explaining in your own words
- Review generated output as if you own it forever
- Build team practices that spread understanding, not just code
- Capture intent in specs, notes, ADRs, and tests

## What I want to explore a bit more

- what skills are actually worth protecting
- team and organizational countermeasures
