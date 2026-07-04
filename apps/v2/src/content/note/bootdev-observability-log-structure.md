---
title: "Log Structure & Context"
date: 2026-06-27T10:00:00+02:00
description: structured logs, slog groups, request + user + instance context, request-logging middleware
tags: [observability, slog, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Log%20Structure%20%26%20Context']
series: bootdev-observability
series_order: 2
---


What goes in a log line and how to make sure the right fields are there without having to remember.

## Structured logging

- Consistent shape, typically key-value pairs
- Doesn't have to be JSON, but JSON is the standard (ELK, Loki, CloudWatch parse it natively)
- In Go, `slog` is structured by default. Every attribute (`slog.String`, `slog.Int`, `slog.Duration`) becomes a typed key

## Slog groups

Group related attributes under one key. Produces nested JSON or dotted text keys, both queryable.

```go
logger.Info("user logged in",
    slog.Group("artist",
        slog.String("name", "Thebe Kgositsile"),
        slog.String("stage_name", "Earl Sweatshirt"),
        slog.String("group", "Odd Future"),
    ),
)
```

Use it for errors. Group message, type, and stack trace under one `error` key. In linko: [`internal/logging/logger.go:89-102`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/internal/logging/logger.go#L89-L102), every error log is grouped into `{message, stack_trace, ...extra_attrs}`.

## What context every log needs

- **Machine**, host, container, pod
- **Request**, request ID
- **User**, when authenticated
- **Service**, which service in the monorepo

## Propagating context

- **Intra-process**, `context.Context` for request-scoped values, request-scoped `*slog.Logger` derived from the root via `.With(...)`. In linko: [`middleware.go:20`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L20) and [`middleware.go:30-33`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L30-L33) define a `LogContext` struct that travels on the request context.
- **Inter-process**, propagate a request ID across services via headers. In linko: [`middleware.go:51-60`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L51-L60), generates or accepts `X-Request-ID`, sets it on the response.

See [Correlated logging](/correlated-logging/) for the full pattern, including Sentry, trace IDs, and frontend/backend join.

## Instance context

Bind once at startup, attach to every log: `env`, `hostname`, `git_sha` + `build_time` (see [Foundations](/bootdev-observability-foundations/) for the binding pattern). In linko: [`main.go:63-68`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/main.go#L63-L68).

For desktop/mobile: also OS, time zone, library versions.

## Request logging middleware

The cleanest way to log requests in an HTTP service. One middleware that:

- Records start time
- Wraps the response writer to capture status + bytes
- Calls `next.ServeHTTP`
- Emits one structured `Served request` log with method, path, status, duration, request_id, user (if any), error (if any)

In linko: [`middleware.go:118-150`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L118-L150). IP redaction ([`middleware.go:160-171`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L160-L171)) means `/24` only, no full client IP.
