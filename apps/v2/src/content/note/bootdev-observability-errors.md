---
title: "Error Handling & Logging"
date: 2026-06-27T10:00:00+02:00
description: log-and-rethrow, %w wrapping, the single-log-site rule
tags: [observability, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Error%20Handling%20%26%20Logging']
series: bootdev-observability
series_order: 4
---


## The rule

**Handle an error once.** Either log it *or* return it, not both. "Log-and-rethrow" in exception languages, "return wrapped, log at the layer with the most context" in Go.

## How

- Wrap with `fmt.Errorf("...: %w", err)`. `%w` preserves the original error so `errors.Is` and `errors.As` still work.
- Add context at each layer: `fmt.Errorf("failed to shorten url: %w", err)` at the handler, `fmt.Errorf("destination unreachable: %w", err)` at the outbound HTTP call.
- Lowest layer returns. Highest layer logs once, with all the context from the chain.

If both layers log, error rate doubles for every error, log volume balloons, and you can't tell from a log search which was "the real one." Picking a single log site is what makes alerting on error rate accurate.

In linko: every handler follows this. See [`handlers.go:62-69`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L62-L69) for the `shorten_link` handler, wraps the destination-check error and the store error with `%w`, returns a 4xx/5xx via `httpError`, logs nothing in the handler. Compare [`destination.go:14-26`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/destination.go#L14-L26) for the outbound-call wrapping.

## Stack traces

`slog` doesn't capture stack traces, but `pkg/errors` does. `pkgerrors.WithStack(err)` gives you a `StackTrace()` method. The linko logger detects that interface in `replaceAttr` and emits the trace under a `stack_trace` key.

In linko: [`internal/logging/logger.go:126-131`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L126-L131), when an error implements `StackTrace()`, it's formatted and added automatically. So [`auth.go:38`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/auth.go#L38) wrapping with `pkgerrors.WithStack` pays off in the log shape.

## Error grouping

If the error is a multi-error (`errors.Join` or anything with `Unwrap() []error`), the logger expands it into an `errors` group of numbered sub-errors. In linko: [`internal/logging/logger.go:94-100`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L94-L100). One log line, every error from the join visible, nothing duplicated.
