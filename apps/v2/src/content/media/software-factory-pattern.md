---
title: "So Every Company Is Building a Software Factory Now"
date: 2026-07-29T00:00:00+02:00
description: Jaymin West explains a six-part software factory model for scaling autonomous agentic development.
media_type: youtube
media_url: https://www.youtube.com/watch?v=lx0Eaane4Ng
youtube_id: lx0Eaane4Ng
creator: Jaymin West
images: ['https://i.ytimg.com/vi/lx0Eaane4Ng/hqdefault.jpg']
tags: [agents, architecture]
---

Jaymin West describes a "software factory" pattern for scaling autonomous agentic development. The core idea is to move from ad hoc prompting toward a structured system made of queues, control planes, sandboxes, review, and durable traces.

## Six Parts

1. **Work Queue System** [[02:59](https://www.youtube.com/watch?v=lx0Eaane4Ng&t=179s)] - Work arrives as issues. Agents are assigned directly to those issues instead of being driven only by prompt engineering.
2. **Control Plane Layer** [[03:29](https://www.youtube.com/watch?v=lx0Eaane4Ng&t=209s)] - The orchestrator that manages the queue, surfaces logs, and gives engineers visibility into failures and bottlenecks.
3. **Sandbox Environment** [[03:58](https://www.youtube.com/watch?v=lx0Eaane4Ng&t=238s)] - An isolated runtime for each task. Ephemeral machines, often Kubernetes-backed, are created for the work and destroyed after it finishes.
4. **Human Review Process** [[04:17](https://www.youtube.com/watch?v=lx0Eaane4Ng&t=257s)] - The output is still a pull request. Humans review and verify the result before it reaches mission-critical systems.

## Underneath Every Step

5. **Event Stream** [[05:30](https://www.youtube.com/watch?v=lx0Eaane4Ng&t=330s)] - A monitoring layer that captures agent activity and token flow for auditing, steering, and large-scale analysis.
6. **Durable Memory** [[06:07](https://www.youtube.com/watch?v=lx0Eaane4Ng&t=367s)] - Persistence lives in Git-tracked files, because the sandbox is ephemeral and the work needs a durable home after execution.

## Misc

- The queue, control plane, and event stream are the primitives I’m trying to figure out right now. Together, they shift the system from "ask the model something" to "run a bounded unit of work."
- The control plane matters as much as the agent. Without logs, traces, and state, you cannot tell whether failures are in the model, the tooling, or the infrastructure.
- The review step stays important. Automation changes the throughput, not the need for judgment.
