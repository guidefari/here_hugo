---
title: "Observability Foundations"
date: 2026-06-27T10:00:00+02:00
description: slog, the multiwriter trick, why you need a close function, build info on every log
tags: [observability, slog, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Observability%20Foundations']
series: bootdev-observability
series_order: 1
---


Go primitives that make observability work.

## What observability is

The ability to understand what a system is doing from outside it. Four signals:

- **Logs**, timestamped event records (what happened, where, at what level)
- **Metrics**, aggregate measurements over time (rate, errors, duration)
- **Traces**, per-request execution paths (where time went, where it failed)
- **Alerts**, when a signal crosses a threshold (wake someone up)

If you only have one, it's logs. If you have two, add metrics.

## Go's logging surface

- `log` stdlib is fine for CLI, lacks structure and level control
- `log/slog` (Go 1.21+) is the default for services
  - JSON handler in prod
  - text/tint handler in dev
  - `slog.New(slog.NewMultiHandler(handlers...))` to run both at once
- Log to `os.Stderr`, never `os.Stdout` (mixing logs into stdout breaks pipelines)

## Multi-handler

One logger, multiple destinations. Debug `tint` to stderr for humans, JSON to a rotated file for aggregation.

In linko: [`internal/logging/logger.go:32-75`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L32-L75).

TS equivalent: [Effect Logger Multi-Writer](/effect-logger-multiwriter/). `Logger.zip` ≈ `MultiHandler`, `Logger.layer([...])` is the array form, `Effect.acquireRelease` in a `Layer` is the close-function pattern.

## Lifecycle logs

- Info log at boot
- Info log at shutdown

In linko: [`server.go:62`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/server.go#L62), [`server.go:70`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/server.go#L70).

## Close function

If you buffer, write to a file, or send to a network, you have a resource to flush before exit.

Pattern:

- `Initialize` returns `(logger, closeFunc, err)`
- `closeFunc` is [`defer`'d](/go-defer/) immediately on successful init
- `closeFunc` returns an `error`: closing can fail in ways you need to know about (full disk, closed socket, truncated file). Silent failure loses the tail of your logs at exactly the moment you need them most
- `closeFunc` collects errors from every sub-closer with `errors.Join` and returns the joined result, so the caller sees every failure, not just the first

In linko: [`internal/logging/logger.go:66-72`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L66-L72), `errors.Join` over all closers. Wired in [`main.go:57-61`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/main.go#L57-L61).

## Build info

- `git_sha`, `build_time`, `env`, `hostname` on the root logger via `logger.With(...)`
- Binds once, every subsequent log carries them
- `GitSHA` and `BuildTime` from [`internal/build/build.go`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/build/build.go) (set via `-ldflags`)

In linko: [`main.go:63-68`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/main.go#L63-L68).
