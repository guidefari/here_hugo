---
title: "Log Quality & Hygiene"
date: 2026-06-27T10:00:00+02:00
description: one log per event, redact at the logger not in your head, log levels that mean something
tags: [observability, slog, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Log%20Quality%20%26%20Hygiene']
series: bootdev-observability
series_order: 3
---


## One log per event

If a single user action produces three log lines, you have two redundant logs. Pick the layer with the most context and log there. Play-by-play logs inside a function are basically a hand-rolled trace, and a bad one. That's the trace's job.

In linko: [`middleware.go:147`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L147) emits one `Served request` log per request. Handlers log one info on the happy path ([`handlers.go:71`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L71)), one error on the failure path, never both.

## No redundant logs

Anti-pattern:

```
time=... level=DEBUG msg="Calling getUserFromDB"
time=... level=DEBUG msg="Entering getUserFromDB"
```

Two lines, one event. Drop the first. "Entering" logs at the function boundary (reusable across callers, survives renames); "Calling" logs at the call site (coupled to one caller, breaks if the function is renamed). Log at the boundary.

Trickier: nested functions that both log the same error. Fix by returning the error with `pkgerrors.WithStack` and logging once at the layer with the most context. In linko, `validatePassword` returns errors without logging ([`auth.go:55-66`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/auth.go#L55-L66)), and the middleware logs once with the user attached ([`auth.go:39-41`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/auth.go#L39-L41)).

## Redaction at the logger

> "Discipline doesn't scale": you cannot rely on every developer to remember to redact `password`, `apikey`, `secret`, `pin`, `creditcardno`, etc. Push the redaction into the logger.

`slog` has a `ReplaceAttr` callback on every handler. Match on key name, replace the value with `[REDACTED]`. Also redact embedded URL passwords (`https://user:pass@host`) because someone will eventually log a request URL.

In linko: [`internal/logging/logger.go:82-104`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L82-L104), `replaceAttr` runs on every attribute. Sensitive keys are listed in [`logger.go:20`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L20) (note `user` is on the list, so `"user", username` accidentally gets redacted). URL passwords stripped in [`logger.go:106-117`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L106-L117).

## Log levels

Four are enough:

- **Debug**, detailed troubleshooting, off in prod
- **Info**, normal system events (*"server started"*, *"shortened URL X"*)
- **Warn**, often unnecessary; if nothing's broken and nothing requires action, it's noise
- **Error**, system-level problem that someone should look at

A user entering the wrong password is **not** an error. It's expected input. Logging it at `Error` corrupts error-rate metrics and pages on-call for nothing.

## Output formats

- **JSON** in prod. Universal. ELK, Loki, CloudWatch all parse it.
- **Text/tint** in dev. Color, human-readable, fast to scan.

In linko: stderr gets a `tint` text handler at debug level ([`logger.go:42-47`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L42-L47)), the optional log file gets JSON at info level ([`logger.go:58-62`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L58-L62)).

## Filesystem logging

Useful when logs must survive a crashed process, or when shipping to a central store. Use a rotating writer (`lumberjack` in Go) so a runaway process can't fill the disk.

In linko: [`logger.go:49-64`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L49-L64), 1MB rotation, 3 backups, 28-day retention, gzip compression.

SST uses the same pattern. Where I first ran into it, on my first feature in that codebase, and the rotation kept a long-running local dev session from filling the disk.

## Buffered logging

Writing to a file per log line is slow (each is a syscall). Wrap the file writer in `bufio.Writer` for batched writes. Must flush before exit or lose the tail. This is a WAL without the crash-recovery machinery.

## Encrypted logs (rare)

If you genuinely must log something sensitive and can't anonymize, encrypt it at the source with PKI and decrypt in your log viewer. Don't roll your own. Default answer is "redact at the logger and don't log the secret"; encryption is the fallback.
