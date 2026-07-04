---
title: "Metrics"
date: 2026-06-27T10:00:00+02:00
description: RED vs USE, the http counter, prometheus, grafana
tags: [observability, prometheus, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Observability%20%E2%80%94%20Metrics']
series: bootdev-observability
series_order: 5
---


Logs answer "what happened to this one request". Metrics answer "how is the system doing *in aggregate* and how is that changing over time".

## Two methods

- **RED** (Rate, Errors, Duration), for *services that handle requests*
- **USE** (Utilization, Saturation, Errors), for *finite resources* (CPU, memory, disk, file descriptors, goroutines, DB pool)

If you only have time for one in a service, it's RED. If you only have time for one on a host, it's USE.

Business metrics (signups, churn, share-clicks) are a third category. They live in your warehouse, not [Prometheus](https://prometheus.io/docs/introduction/overview/). Different consumers, freshness, stakes.

## The must-have

The single most useful counter for any web service: a count of HTTP requests broken down by **method**, **path**, and **status**. Everything else (error rates, latency percentiles, top endpoints) is derived from this.

In linko: [`middleware.go:22-28`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L22-L28) declares it as a [`CounterVec`](https://github.com/prometheus/client_golang), and [`middleware.go:72-85`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/middleware.go#L72-L85) increments it via a `statusRecorder` that wraps the response writer.

## Prometheus is pull-based

Prometheus is a *database for metrics*, not a push endpoint. Your app exposes `/metrics`, Prometheus scrapes it on a schedule, stores the data, you query with PromQL. The app does not "send to" Prometheus.

To get data in you need two things:

- **A scrape target**, a `/metrics` endpoint, or a host with Node Exporter running, or a Pushgateway for batch jobs
- **A scrape config**, the `prometheus.yml` that tells Prometheus where to scrape and how often

In linko: [`server.go:47`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/server.go#L47) exposes `/metrics` via `promhttp.Handler()`, and [`prometheus.yml`](https://github.com/guidefari/boot_dev_observability/blob/2a2abf491311b6cd72c2c58b6bf57863012ce0ed/prometheus.yml) tells the Prometheus container where to find it. Node Exporter is in the same compose file for host metrics, see the [Node Exporter bliki](/node-exporter/) for the full setup. See the Prometheus [configuration reference](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) for the full scrape config options.

## Build info as a label

Tie every metric to the build that produced it. `git_sha` as a label means a "regression in error rate" query can immediately show which build introduced it. In linko this lives next to the logger's `With(...)` (see [Foundations](/bootdev-observability-foundations/)), same `GitSHA` and `BuildTime` variables, two different consumers. See the Prometheus [data model](https://prometheus.io/docs/concepts/data_model/) docs for the full label-naming rules and gotchas.

## Visualizing

[Grafana](https://grafana.com/) on top of Prometheus for the dashboards. Two patterns:

- **Line chart** for things-over-time (error rate, request rate, latency p95)
- **Bar chart** for things-across-categories (HTTP status code distribution)

The "Status Code Bars" lesson makes this concrete: a bar chart grouped by status code is a faster read of "is this healthy" than a line chart of the same data.
