---
title: "Vibe Engineering Effect Apps - Michael Arnaldi"
date: 2026-05-15T00:00:00-04:00
description: "Michael Arnaldi on building Effect apps in the AI engineering era."
media_type: youtube
media_url: https://youtu.be/Wmp2Tku2PrI?si=8wI1I7JQBMli2iAm
youtube_id: Wmp2Tku2PrI
creator: Michael Arnaldi
tags: [media, video, effect, software]
images: ["https://i.ytimg.com/vi/Wmp2Tku2PrI/hqdefault.jpg"]
---

## 1. Core Philosophy: "Just Clone the F\*\*\*ing Repo"

The central theme is that LLMs perform best when they have direct access to source code rather than relying on their outdated training data or external documentation.

- **[00:06:01](https://youtu.be/Wmp2Tku2PrI?t=361)** – Discussion on how LLMs treat knowledge. They don't learn continuously; their training is a snapshot.
- **[00:13:02](https://youtu.be/Wmp2Tku2PrI?t=782)** – Why library code in `node_modules` is de-optimized for AI agents. Agents are trained to focus on your "own" code, so masquerading a library as local code improves AI performance.
- **[00:35:27](https://youtu.be/Wmp2Tku2PrI?t=2127)** – Demonstration of adding the Effect codebase as a **git subtree** into a `./repos` folder.

---

## 2. Best Practices: The AI Orchestration Loop

Arnaldi demonstrates "Spec-Driven Development" designed to provide "back-pressure" on the AI.

### The Research Phase

Instead of asking the AI to "write an API," he follows this workflow:

1. **Explore:** Tell the AI to read the cloned library source code.
2. **Patterns:** Ask the AI to extract "best practices" and save them to a `.patterns/` directory (e.g., `patterns/http-api.md`).
3. **Reference:** Create an `agents.md` file that tells the AI to use these specific patterns as the "truth" for the project.

### Technical Guardrails

- **Zero Tolerance Diagnostics ([00:30:53](https://youtu.be/Wmp2Tku2PrI?t=1853)):** Setting all TypeScript diagnostics to **Error** in the `tsconfig`. This creates a feedback loop where the AI cannot submit code with even minor warnings.
- **Context Management ([00:43:05](https://youtu.be/Wmp2Tku2PrI?t=2585)):** Restarting the context window frequently. This prevents the AI from getting confused by previous mistakes or "hallucination drift."

---

## 3. The "Accountability" Repo & Guardrails

At **[00:38:15](https://youtu.be/Wmp2Tku2PrI?t=2295)**, Michael discusses his private **Accountability** repository, which contains his personal setup for "babysitting" AI agents.

- **Custom ESLint Rules ([00:39:12](https://youtu.be/Wmp2Tku2PrI?t=2352)):** He uses these to prohibit the AI from taking shortcuts.
- **Banning Type Casting ([00:39:20](https://youtu.be/Wmp2Tku2PrI?t=2360)):** He bans the usage of `as any`, `as unknown`, and `as`. He shares that when he banned `as any`, the AI tried to "cheat" by using `as never as X`.
- **Branded Types ([01:13:19](https://youtu.be/Wmp2Tku2PrI?t=4399)):** He forces the AI to use branded types for identifiers (e.g., `UserId` vs `ProductId`) to prevent the agent from accidentally swapping one string ID for another.

---

## 4. Technical Setup: TSGO & Effect

- **TSGO (TypeScript-Go) ([00:20:41](https://youtu.be/Wmp2Tku2PrI?t=1241)):** Using the Go-based TypeScript compiler for high-performance type checking.
- **Native Preview LSP ([00:25:11](https://youtu.be/Wmp2Tku2PrI?t=1511)):** Setting up VS Code to use the Native Preview LSP for instant feedback.
- **Effect SQL & Persistence ([00:57:02](https://youtu.be/Wmp2Tku2PrI?t=3422)):** Demonstrating how to use the Effect SQL library by having the AI research the source code to find the proper migration patterns.

---

## 5. Resilience: Workflows & Clustering

- **[01:40:41](https://youtu.be/Wmp2Tku2PrI?t=6041)** – **The AI Latency Problem:** Because AI processes are long-running (often taking 30–60 seconds), the risk of a server failing mid-process is high.
- **The Solution:** Using **Effect Cluster/Workflows** to ensure that if a server crashes while the AI is "thinking," the process is automatically resumed on another node without losing state.

## Related reading

- [Maxwell Brown's note on the repo cloning workflow](https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/)
