---
title: "Why Effect Beats Vanilla TypeScript for Production Code"
date: 2026-06-23T00:00:00-04:00
description: "Dillon Mulroy, Mattia, and Max on why Effect is often superior to standard TypeScript for production-grade software, and how to convince your team to adopt it."
media_type: youtube
media_url: https://www.youtube.com/watch?v=HOIolmTVtbo
youtube_id: HOIolmTVtbo
creator: Effect
tags: [media, video, effect, typescript, software, adoption, ai, agents, workflow]
images: ['https://i.ytimg.com/vi/HOIolmTVtbo/hqdefault.jpg']
---

In this episode of *Effect Office Hours*, *Dillon Mulroy*, *Mattia*, and *Max* discuss why *Effect* is often superior to standard *TypeScript* for production-grade software and offer strategies for team adoption.

---

## Benefits of Adopting Effect over Vanilla TypeScript

The speakers highlight several key architectural advantages of *Effect*:

- **Comprehensive features.** *Effect* provides built-in tools that are difficult or messy to implement manually in *TypeScript*, such as **built-in interruption**, **telemetry** (OpenTelemetry), and advanced **type-safe error handling** [[8:21](https://www.youtube.com/watch?v=HOIolmTVtbo&t=501s), [1:00:22](https://www.youtube.com/watch?v=HOIolmTVtbo&t=3622s)].
- **Errors as values.** By encoding errors into the type system, you gain domain-specific knowledge about how your program fails, rather than relying on standard `try/catch` blocks which do not provide visibility at the type level [[1:07:27](https://www.youtube.com/watch?v=HOIolmTVtbo&t=4047s)].
- **Explicitness and type safety.** *Effect* makes the entire "world" of a program (success types, failure types, and requirements) encoded in the type system. This structure is highly beneficial for **AI-assisted coding**, as AI models perform significantly better with explicit, strictly typed codebases compared to loose *TypeScript* [[20:46](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1246s), [1:07:47](https://www.youtube.com/watch?v=HOIolmTVtbo&t=4067s)].
- **Superior primitives.** Standard *JavaScript* promises are not lazy and lack built-in cancellation, whereas *Effect* primitives allow for describing complex, cancellable computations that are more robust [[1:01:07](https://www.youtube.com/watch?v=HOIolmTVtbo&t=3667s)].

## How to Convince Your Team to Adopt Effect

The panel shares a pragmatic, incremental approach to gaining buy-in from skeptical team members:

1. **Solve a concrete problem.** Do not pitch *Effect* as a cool, shiny tool. Instead, identify a persistent, painful issue in your current application (e.g., an unstable endpoint, a complex race condition, or poor observability) and use *Effect* to solve that specific problem. It is much easier to sell a solution to a real pain point than a technology for its own sake [[8:35](https://www.youtube.com/watch?v=HOIolmTVtbo&t=515s), [23:53](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1433s)].
2. **Start small.** *Effect* is incrementally adoptable. Refactor only a small, problematic slice of your codebase. If it works, it creates a precedent; if it doesn't, it is inexpensive to remove [[10:24](https://www.youtube.com/watch?v=HOIolmTVtbo&t=624s), [23:56](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1436s)].
3. **Use AI for learning.** Because *Effect* is highly structured, you can point AI agents at the library or a copy of your codebase to help generate code, teach specific patterns, or act as an "oracle." This makes the learning curve significantly less daunting [[26:37](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1597s)].
4. **Leverage success stories.** Refer to successful migrations in the ecosystem, such as *OpenCode*'s transition to *Effect*, which turned previous skeptics into advocates [[12:56](https://www.youtube.com/watch?v=HOIolmTVtbo&t=776s), [22:18](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1338s)].

## Dillon Mulroy on Effect and Agentic Coding

*Dillon Mulroy* joined the stream at [[17:47](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1067s)] to discuss a variety of topics alongside *Mattia* and *Max*, focusing heavily on the intersection of *Effect* and **agentic coding**. Here are the noteworthy points and topics discussed during his time on the stream:

- **AI-assisted development and flow state.** *Dillon* and the team discussed the struggle of achieving a true "flow state" while working with AI agents. They noted that the current tooling feels more oriented toward generating code rather than managing it, leading to a shift in the engineer's role toward being a reviewer and project manager. *Dillon* expressed frustration at the repetitive nature of correcting AI-generated code (e.g., overly defensive coding, unnecessary helper functions) [[24:43](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1483s), [44:15](https://www.youtube.com/watch?v=HOIolmTVtbo&t=2655s)].
- **The "gardening" workflow.** *Dillon* described his personal workflow of spending a few days shipping features with AI agents (reaching about 85% quality) and then dedicating "janitor days" or "gardener days" to clean up, refactor, and remove bloat from the codebase [[45:49](https://www.youtube.com/watch?v=HOIolmTVtbo&t=2749s)].
- **Systems architecture vs. coding.** They touched on how the level of abstraction for engineers is rising. Much of the focus has shifted from writing low-level implementation to systems architecture, data indexing, and service layer design, problems that remain challenging even when assisted by AI [[39:26](https://www.youtube.com/watch?v=HOIolmTVtbo&t=2366s)].
- **Adoption at scale.** *Dillon* reflected on his experience selling *Effect* at both *Vercel* and *Cloudflare*. He emphasized that adoption was significantly easier at *Cloudflare* because a substantial portion of the team was already "Effect-pilled" or understood its value, making it less of a struggle than it was at his previous company [[23:03](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1383s)].
- **Technical context.** *Dillon* highlighted the necessity of providing context to AI agents. He keeps copies of reference documentation and codebases (like *libgit2* for his work on *Artifacts*) to guide the AI, noting that this is a critical strategy to improve result quality [[25:52](https://www.youtube.com/watch?v=HOIolmTVtbo&t=1552s)].
- **Future of tooling.** They collectively agreed that the current developer experience for AI agents needs to evolve. We need the next generation of tooling to help coordinate multiple agents and enforce better guardrails, moving beyond simple code generation [[38:55](https://www.youtube.com/watch?v=HOIolmTVtbo&t=2335s)].

### Progressive rendering over 3D printing

*Dax* described a shift in his development process when using AI agents, comparing it to **progressive rendering** rather than 3D printing [[47:28](https://www.youtube.com/watch?v=HOIolmTVtbo&t=2848s)]:

> "Finally found the right metaphor for the shift in how I use open code. I used to treat it like 3D printing where you build it layer by layer and commit each piece as you go, but now it feels more like a progressive rendering where you start with like a really blurry version and then you keep making full passes over it to sharpen the shape."
>
> [Dax (@thdxr)](https://x.com/thdxr/status/2053564545000407053)

This sentiment was shared by *Dillon* and *Mattia* during the stream, as they also emphasized the importance of making iterative, refined passes over AI-generated code to achieve high-quality production results [[48:11](https://www.youtube.com/watch?v=HOIolmTVtbo&t=2891s), [50:59](https://www.youtube.com/watch?v=HOIolmTVtbo&t=3059s)].

## Discipline Doesn't Scale

The central theme in *Dillon Mulroy*'s recent engineering philosophy is that **discipline doesn't scale**, particularly as it relates to managing the speed and volume of code generated by AI agents.

*Dillon* argues that at an organizational level, you cannot rely on the willpower or manual discipline of engineers to maintain high standards of code hygiene, such as proper error handling.

- **Error handling at scale (React Miami).** Expecting developers to remember to implement proper `try/catch` logic across a large codebase is a recipe for failure. Instead, software should be architected, using tools like *Effect* or explicit `Result` types, to make correct error handling the path of least resistance. Discipline is human, but systems should be enforced by the type system.
- **AI and scale (Chats with Kent C. Dodds).** With AI agents capable of shipping massive amounts of code overnight, human review processes break down. If you rely on humans to "be disciplined" to catch bugs in massive AI-generated diffs, you will eventually fail. Instead, you must build **robust foundational primitives** and **tight feedback loops** where engineers directly feel user pain, making "pain painful," which forces systemic improvements rather than relying on individual effort.

### Referenced resources

- **React Miami 2025 talk:** "Throw Try/Catch in the 🗑️". Advocating for "Errors as Values" to move away from implicit, unhandled exceptions.
- **Chats with Kent C. Dodds:** "Foundations, feedback, and agents: Dillon Mulroy on product at Cloudflare" (Season 7, April 2026). Discussing how to build sustainable software systems in the age of agentic coding.

### On the same theme

> "It always had shared ownership, and once you get to a certain scale, shared ownership is no ownership"
>
> [My note on X](https://x.com/guidefari/status/2056674887897375223), May 19 2026
