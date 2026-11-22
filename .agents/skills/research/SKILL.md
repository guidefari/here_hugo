---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** — official docs, source code, specs, first-party APIs — not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.

## Visual explanations

For research-site reports, load the `show-me` skill and use it to explain the
central mechanism visually. Choose the smallest useful view: a call tree, flow,
comparison, or focused HTML figure. Keep the visual next to the explanation,
preserve important qualifications, and match the site's theme and mobile layout.
Prefer text diagrams or native HTML figures unless the site supports the chosen
diagram renderer. Do not publish an unrendered Mermaid fence as a finished visual.
Use sanitized examples; local security details and secrets stay out of public
reports and diagrams.
