---
title: "Tracing"
date: 2026-06-27T10:00:00+02:00
description: opentelemetry, spans where they matter, distributed context
tags: [observability, otel, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Observability%20%E2%80%94%20Tracing']
series: bootdev-observability
series_order: 6
---


Metrics tell you *something* is slow. Logs tell you *one* of the things that happened. Traces tell you *the whole story of one request*: every span, every duration, every parent-child relationship, often across services. When logs and metrics aren't enough, you reach for traces.

## OpenTelemetry

Two tools matter: [OpenTelemetry](https://opentelemetry.io/) (the instrumentation API and SDK) and [Jaeger](https://www.jaegertracing.io/) (a popular backend to view the traces). OTel is the one that matters for the code you write. It ships exporters for Jaeger, Tempo, Honeycomb, Datadog, and most others.

For local dev, [motel](https://github.com/kitlangton/motel) is a local OTel ingest + TUI viewer. Point your app's OTLP exporter at `http://127.0.0.1:27686/v1/traces` and inspect traces from the terminal, no Docker, no cloud account. Stores to a local SQLite, ships an agent skill so Claude Code / Cursor know how to query it.

## Init pattern

At process start:

- Create an OTLP exporter
- Create a `TracerProvider` with the exporter and a resource (service name, version, env)
- Register it globally via `otel.SetTracerProvider`
- Get a tracer for your service: `otel.Tracer("boot.dev/linko")`
- Defer a `tp.Shutdown` so spans flush before exit

In linko, the whole thing is a function called from `main`:

```go
// main.go
func initTracing(ctx context.Context) (func(context.Context) error, error) {
    exp, err := otlptracegrpc.New(ctx)
    if err != nil {
        return nil, err
    }

    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exp,
            sdktrace.WithBatchTimeout(2*time.Second),
        ),
        sdktrace.WithResource(resource.Default()),
    )

    otel.SetTracerProvider(tp)
    tracer = otel.Tracer("boot.dev/linko")
    return tp.Shutdown, nil
}
```

The gRPC exporter is `otlptracegrpc.New(ctx)`. `WithBatchTimeout(2*time.Second)` is a tradeoff: shorter = less loss on crash, longer = fewer network round-trips.

## Adding spans

Minimum useful set: a span on every HTTP handler. One per request, named after the handler, started from the request's `context.Context` so it auto-becomes a child of any incoming trace.

In linko: every handler in [`handlers.go`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go) starts with `_, span := tracer.Start(r.Context(), "handler.X")` and `defer span.End()`. See lines [29](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L29), [37](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L37), [44](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L44), [78](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L78), [105](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L105), [120](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/handlers.go#L120).

Trap: adding a span to every function makes traces noisy and high-overhead fast. Add spans at *meaningful* boundaries: handler, outbound call, expensive inner operation, not at every helper. Spans ≠ logs. If you're tempted to log the same info at the same place you span, you're doing it twice.

## Distributed trace context

If you start spans from the request context, child spans automatically get the right parent. And when you make an *outbound* call, the trace context propagates across the wire as headers (`traceparent`).

To make this work in Go:

- **Wrap the server** so incoming headers are extracted into a parent span: `otelhttp.NewHandler(handler, "http.server")` in [`server.go:30`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/server.go#L30)
- **Use the request context in outbound calls** and wrap the HTTP client: in [`destination.go:14-19`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/destination.go#L14-L19) the destination check uses `http.NewRequestWithContext` and `http.DefaultClient`. The full OTel pattern uses `otelhttp.NewTransport` to inject headers, but even just passing the context gives the spans their correct parent.

See [Correlated logging](/correlated-logging/) for how trace IDs + request IDs + Sentry scopes stitch the whole story together.
