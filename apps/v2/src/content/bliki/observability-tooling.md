---
title: "Observability Tooling Canon"
date: 2026-06-27T10:00:00+02:00
description: "the big pieces: OTel, Prometheus, Grafana, LGTM, ELK, what an exporter is, who does what"
tags: [observability, canon]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Observability%20Tooling%20Canon']
---

# Observability tooling

The reference for *what the tools are and what they do*. For the practical Go/Effect side, see the [Boot.dev course notes](/bootdev-observability/) and the [Effect logger multi-writer note](/effect-logger-multiwriter/).

# The mental model

Three signals: **logs**, **metrics**, **traces**. For each signal, three jobs:

1. **Produce**: your app emits the data
2. **Store**: something holds onto it and lets you query it
3. **View**: dashboards, alerts, ad-hoc queries

Most "stacks" are three tools, one per job, that wire together. Different vendors draw the lines differently.

# The three signals

- **Logs**: timestamped event records, structured fields, severity. Best for "what happened" in one place at one time.
- **Metrics**: aggregate measurements over time (counters, gauges, histograms). Best for "how is the system doing" and alerting.
- **Traces**: per-request execution paths, spans with parent/child relationships. Best for "where did the time go" inside one request.

# The vendors and stacks

## OpenTelemetry (OTel)

The instrumentation *standard*. Vendor-neutral API + SDK + wire protocol (OTLP). You instrument your code once against the OTel SDK, then point the exporter at whatever backend you want (Jaeger, Tempo, Honeycomb, Datadog, your own). CNCF graduated.

Covers all three signals. Originated as a merger of OpenTracing and OpenCensus around 2019. If you're starting a new project and want to avoid lock-in, instrument with OTel.

## Prometheus

A pull-based **metrics** database. Your app exposes `/metrics`, Prometheus scrapes it on a schedule, stores the data, and you query with PromQL. Four core types: `Counter`, `Gauge`, `Histogram`, `Summary`. Originated at SoundCloud, CNCF graduated, the de facto standard for self-hosted metrics.

Prometheus does *not* do logs or traces. For those you pair it with something else.

## Grafana

The visualization layer. Plugs into Prometheus, Loki, Tempo, Elasticsearch, Datadog, CloudWatch, ~30 other backends. Where you build the dashboards. Has its own alerting engine now (Grafana alerts) but most stacks still route through Alertmanager.

## LGTM stack (Grafana Labs)

The modern, cloud-native, "all Grafana Labs" answer. One tool per job:

- **L**oki: logs ("Prometheus for logs", label-based, cheap, no full-text index)
- **G**rafana: viz and alerts
- **T**empo: traces (object-storage backed, cheap to run, easy to scale)
- **M**imir: metrics (Prometheus-compatible, but multi-tenant, long-term storage, horizontally scaled)

You can substitute vanilla Prometheus for Mimir if you're small. The [Boot.dev course](/bootdev-observability-metrics/) used Prometheus + Grafana, no Loki or Tempo.

## ELK stack (Elastic)

The older stack, dominated the 2010s. Still everywhere in enterprises:

- **E**lasticsearch: search index / document store
- **L**ogstash: ingestion pipeline (or Beats, the lighter shippers)
- **K**ibana: viz

Originally logs only. Elasticsearch has grown into a general-purpose search engine, and people shove vectors, documents, time series, and logs through it. More powerful for ad-hoc log search than Loki, more expensive to operate. The "Java shop" stack of the 2010s, still the default in any organization that bought Elastic licenses.

## Jaeger

CNCF traces, originally Uber. The default "where do I point my OTel exporter" answer before Tempo. Has a UI similar to Tempo's. Still widely deployed, especially in k8s shops. If you see "Jaeger" mentioned in old blog posts, it's basically the same role Tempo plays today.

## Datadog / Honeycomb / New Relic

SaaS all-in-ones. Logs + metrics + traces + alerting + APM in one bill. The argument *for* them: you don't operate the storage layer. The argument *against*: the bill is terrifying, and the lock-in is real. Honeycomb is traces-first (great for debugging, less for top-line metrics). Datadog is everything-but-the-kitchen-sink. New Relic is the old guard, pivoted to a similar model.

## Splunk

Enterprise logs. The original "ship logs to a giant index" company. Expensive, ubiquitous in big enterprise, mostly logs and security analytics (SIEM). You'll encounter it in finance and government. If you're at a startup in 2026, you probably don't want it.

# Key concepts

## Exporter

A component that ships data from your process (or from a Collector) to a backend. OTel has exporters for Jaeger, OTLP, Zipkin, Prometheus, and more. The term also applies to *Prometheus exporters*: small programs that expose `/metrics` for a third-party system (Node Exporter for host metrics, postgres_exporter for Postgres, the JMX exporter for JVM apps).

In linko, [`main.go:93-108`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/main.go#L93-L108) wires up the OTLP gRPC exporter. Prometheus doesn't need an exporter in your app, it scrapes your `/metrics` endpoint directly.

## Pull vs push

- **Pull** (Prometheus, some loggers): a central system reaches out and asks for data. Easy to reason about ("who's failing to scrape is failing to monitor"). Hard to scale to short-lived processes.
- **Push** (most SaaS, most tracing): your app sends data to the backend. Better for batch jobs and short-lived processes. Easier to scale.

## Sampling (traces especially)

You don't keep 100% of spans. Two strategies:

- **Head-based**: decide at span start whether to keep it. Cheap, loses errors you'd want to see.
- **Tail-based**: buffer the full trace, decide after you see the outcome. Better for catching errors, more expensive.

Common default: 100% of error traces, 1-5% of success.

## Cardinality (metrics)

The number of unique time series. `http_requests_total{path="/users/123", user_id="alice"}` is *way* more expensive than `http_requests_total{path="/users/:id", status="200"}`. Watch the labels. Almost never good label values: `user_id`, `request_id`, `email`, `url` (full URL), `trace_id`. Good label values: `status`, `method`, bounded enums, low-cardinality paths.

## Agent / Collector

A process between your app and the backend. Batches, transforms, routes, retries. Examples: OTel Collector, Fluent Bit, Vector, Promtail. Reach for these when you have many apps and want to centralize auth, sampling, and redaction in one place rather than in every service.

# How to pick (very opinionated)

- **New project, want to avoid lock-in, will run it yourself:** OTel for instrumentation, Prometheus + Grafana for metrics, Loki or just JSON-to-S3 for logs, Tempo for traces, Grafana for viz. That's the LGTM stack. It scales to a Series B.
- **Don't want to operate storage, money is no object:** Datadog or New Relic. Pay the bill, ship features.
- **At a company that already has Splunk/ELK:** use what they have. Don't fight internal IT.
- **Just need logs and metrics, small scale:** Prometheus + Grafana + JSON-to-disk. Skip the rest.

# Takeaway

- Three signals: logs, metrics, traces. Each has its own storage and viz layer.
- OTel is the *instrumentation* standard. Pick any backend.
- Prometheus is the default for metrics. ELK is the default for logs (in older shops). Tempo/Jaeger for traces.
- LGTM is the modern cloud-native answer to ELK. Pick Prometheus + Mimir, Loki, Tempo, Grafana.
- Datadog / Honeycomb / New Relic are the "we don't want to operate this" answer. The bill is the trade-off.
- The terms: **exporter** ships data out, **agent/collector** sits between app and backend, **sampling** controls trace volume, **cardinality** is the metrics gotcha to watch.

# Related

- [Boot.dev: Foundations](/bootdev-observability-foundations/): slog, multi-handler, the Go side
- [Effect Logger Multi-Writer](/effect-logger-multiwriter/): Logger.zip and Logger.layer, the TS side
- [Boot.dev: Metrics](/bootdev-observability-metrics/): Prometheus in depth
- [Boot.dev: Tracing](/bootdev-observability-tracing/): OTel in depth
- [Boot.dev: Alerts](/bootdev-observability-alerts/): what to do with all this data
