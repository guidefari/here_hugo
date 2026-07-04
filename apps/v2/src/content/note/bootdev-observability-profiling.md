---
title: "Profiling"
date: 2026-06-27T10:00:00+02:00
description: pprof in prod, profile-driven dev, the five profile types
tags: [observability, pprof, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Observability%20%E2%80%94%20Profiling']
series: bootdev-observability
series_order: 7
---


When metrics tell you "this is slow" and traces tell you "this span is slow", profiling tells you *why*: which functions, lines, or call paths are eating the cycles. Deepest layer, most expensive to use, reserve for when you have a specific question.

## The five profile types

| Profile | Tells you |
| --- | --- |
| **CPU** | Where execution time is spent |
| **Heap (memory)** | Where memory is allocated and held |
| **Goroutine** | Concurrency bugs, leaks, blocked goroutines |
| **Block** | Where code is waiting on something |
| **Execution trace** | Detailed timeline of one execution flow |

## When to profile

Don't run a profiler to "see what's slow", that's premature optimization. Wait until you're asking a specific question:

- *Why is this operation slow?*
- *Why is the process running out of memory?*
- *Why is this thing stuck?*

This is profile-driven development: a profile in response to a hypothesis, not a fishing expedition.

## Go's two main tools

- `runtime/pprof`, for profiling a *running* Go application. Expose it over HTTP, or write to a file on a signal.
- `testing` benchmarks, for profiling specific functions in micro-benchmarks.

## pprof over HTTP in linko

Standard pattern: mount `net/http/pprof` on a debug-only route, behind auth. In linko: [`server.go:49-50`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/server.go#L49-L50), both `/debug/pprof/` and `/debug/pprof/profile` are auth-gated.

Artifacts captured in the repo (local-only, gitignored):

- `cpu.pprof.txt`, CPU profile captured against the running server
- `memory.pprof.txt`, heap profile
- `memory.svg`, flame graph of the heap

## Using the artifacts

```bash
# Interactive REPL on a CPU profile
go tool pprof cpu.prof

# Web UI (the default is what you want)
go tool pprof -http=:8080 cpu.prof

# Top functions by allocation
go tool pprof -top -alloc_objects memory.prof
```

Web UI is the easiest entry point: flame graph + source map. Drill into the function eating the time, look at the call stack, you've usually found your culprit.

## PGO

[Profile-Guided Optimization](https://go.dev/doc/pgo) is a compiler technique: feed a profile from a representative run back into `go build`, and the compiler uses it for better inlining and devirtualization decisions. The one case where profiling *is* a build-time optimization, not a runtime investigation.
