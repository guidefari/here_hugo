---
title: "The Actor Model"
date: 2026-03-15T00:00:00+02:00
description: "A guide to the actor model — independent entities communicating via messages, and how state machines fit in."
tags: [architecture, state-machines, concurrency, xstate]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=The+Actor+Model']
---

> "Think of everything in your app as just little entities talking to each other."
> — [David Khourshid (DavidKPiano)](https://twitter.com/davidkpiano)

The **actor model** is a mathematical model of concurrent computation introduced by [Carl Hewitt in 1973](https://en.wikipedia.org/wiki/Actor_model). The core idea: **everything is an actor**. Similar to how some OOP languages say "everything is an object", the actor model says every unit of computation is an independent entity that communicates only through messages.

It's a useful mental model for frontend too — the browser is already a distributed system. Components, routers, storage, network requests — they're all independent state sources that need to coordinate. The actor model gives you a vocabulary for that.

## What is an Actor?

An actor is an independent unit of computation that:
- Has its own **private, encapsulated state** (no one else can touch it directly)
- Has a **mailbox** — a queue of incoming messages/events
- Processes messages **one at a time, sequentially**
- Can **send messages** to other actors
- Can **create new actors**
- Can **update its own state** in response to messages

The key constraint: **no shared mutable state**. Actors never reach into each other's internals. All interaction is through message passing.

```
┌─────────────────────────────────────────────────────────┐
│                        Actor A                          │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Mailbox  │───▶│   Behavior   │───▶│    State     │  │
│  │ [msg, …] │    │  (process)   │    │  (private)   │  │
│  └──────────┘    └──────────────┘    └──────────────┘  │
│                         │                               │
│                   send message                          │
└─────────────────────────┼───────────────────────────────┘
                          ▼
                      Actor B's mailbox
```

## Actors vs Threads

With threads, concurrency is managed through shared memory + locks. This is notoriously error-prone (race conditions, deadlocks).

With actors, each actor runs its own isolated loop and you never share memory. Multiple actors can run **concurrently**, but each actor processes **one message at a time**. The runtime handles scheduling.

| | Threads | Actors |
|---|---|---|
| Shared state | Yes | No |
| Synchronisation | Locks/mutexes | Message passing |
| Concurrency | Hard to reason about | Composable |
| Failure isolation | Difficult | Natural |

## State Machines + Actors

State machines are a natural fit for defining actor behaviour. A state machine describes **what an actor does in response to events**, depending on what state it's currently in.

In [XState](https://github.com/statelyai/xstate), when you run a state machine, it becomes an actor:

```ts
import { createMachine, createActor } from 'xstate';

const trafficLightMachine = createMachine({
  id: 'trafficLight',
  initial: 'green',
  states: {
    green: {
      after: { 5000: 'yellow' }, // auto-transition after 5s
      on: { FORCE_STOP: 'red' }
    },
    yellow: {
      after: { 2000: 'red' }
    },
    red: {
      after: { 5000: 'green' }
    }
  }
});

// Running the machine creates an actor
const trafficLight = createActor(trafficLightMachine);
trafficLight.start();

trafficLight.subscribe(snapshot => {
  console.log(snapshot.value); // 'green', 'yellow', 'red'
});

// Send an event (message) to the actor
trafficLight.send({ type: 'FORCE_STOP' });
```

## State Machine Anatomy

A state machine has:
- **States** — the finite set of conditions something can be in
- **Events** — triggers that cause transitions
- **Transitions** — rules for moving between states
- **Actions** — side effects executed on enter/exit/transition
- **Guards** — conditions that must be true for a transition to occur

```
         SUBMIT                  SUCCESS
idle ──────────────▶ loading ──────────────▶ success
  ▲                     │
  │                     │ ERROR
  │                     ▼
  └──────────────── error
       RETRY
```

In code:

```ts
const fetchMachine = createMachine({
  id: 'fetch',
  initial: 'idle',
  context: { data: null, error: null },
  states: {
    idle: {
      on: { SUBMIT: 'loading' }
    },
    loading: {
      invoke: {
        src: 'fetchData',
        onDone: {
          target: 'success',
          actions: assign({ data: ({ event }) => event.output })
        },
        onError: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error })
        }
      }
    },
    success: { type: 'final' },
    error: {
      on: { RETRY: 'loading' }
    }
  }
});
```

## Actor-to-Actor Communication

Actors can spawn child actors and communicate with them. This is where it gets powerful — you can decompose complex logic into a hierarchy of collaborating actors:

```ts
import { createMachine, createActor, sendTo, spawn } from 'xstate';

const childMachine = createMachine({
  id: 'child',
  initial: 'idle',
  states: {
    idle: {
      on: { DO_WORK: 'working' }
    },
    working: {
      // ... does something, then notifies parent
      entry: sendTo(({ self }) => self._parent, { type: 'WORK_DONE' })
    }
  }
});

const parentMachine = createMachine({
  id: 'parent',
  initial: 'waiting',
  context: { childRef: null },
  states: {
    waiting: {
      entry: assign({
        childRef: ({ spawn }) => spawn(childMachine)
      }),
      on: {
        START: {
          actions: sendTo(({ context }) => context.childRef, { type: 'DO_WORK' })
        },
        WORK_DONE: 'done'
      }
    },
    done: {}
  }
});
```

## Real-World Actor Systems

The actor model isn't just a frontend thing. It underpins massive distributed systems:

- **Erlang/OTP** — the original industrial actor system, powers WhatsApp and Discord's backend
- **Akka** (Scala/Java) — actor framework for JVM services
- **XState** — actor-based state orchestration for JavaScript/TypeScript
- **Microsoft Orleans** — virtual actor model for .NET
- **Pykka** — Python actors

## Why It Matters

The actor model gives you:

1. **No shared state** → no race conditions by default
2. **Location transparency** → actors can be local or remote, the interface is the same
3. **Failure isolation** → one actor crashing doesn't cascade
4. **Natural scalability** → spin up more actors to handle more load
5. **Explicitness** → all state changes happen through messages, making behaviour auditable

> "An actor is the most primitive unit of computation. It's the 'atom' of concurrent computation."
> — [The Actor Model in 10 Minutes, brianstorti.com](https://www.brianstorti.com/the-actor-model/)

## When Not to Use It

The actor model adds overhead. Skip it when:
- Your problem is **inherently synchronous** and sequential
- **Message ordering** is critical (actors don't guarantee order by default)
- You're building simple request/response pipelines

## Sources

- [The actor model — Wikipedia](https://en.wikipedia.org/wiki/Actor_model)
- [What is the actor model? — Stately](https://stately.ai/docs/actor-model)
- [The Actor Model in 10 minutes — Brian Storti](https://www.brianstorti.com/the-actor-model/)
- [XState — statelyai/xstate on GitHub](https://github.com/statelyai/xstate)
- [How the Actor Model meets the needs of modern distributed systems — Akka](https://doc.akka.io/libraries/akka-core/current/typed/guide/actors-intro.html)
- [CSP vs Actor model for concurrency — DEV Community](https://dev.to/karanpratapsingh/csp-vs-actor-model-for-concurrency-1cpg)
- [David Khourshid (@DavidKPiano) on X](https://twitter.com/davidkpiano)
