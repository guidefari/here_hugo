---
title: "Alerts"
date: 2026-06-27T10:00:00+02:00
description: actionable rules, sane thresholds, what not to alert on
tags: [observability, prometheus, go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Observability%20%E2%80%94%20Alerts']
series: bootdev-observability
series_order: 8
---


The "wake someone up" layer. Done well, alerts make incidents shorter. Done badly, they create a second job for whoever's on call.

## Two rules

- **Every alert must be actionable.** If a rule fires, an operator should know there's a system issue worth investigating. "This is interesting" is not a reason to page.
- **Sane thresholds.** A rule should fire only when a bad condition is sustained long enough to matter. Short self-healing spikes (deploy blips, GC pauses) shouldn't page.

## The first cut

- **Alert on 500-spikes.** Real incidents show up in error rates first.
- **Do not alert on user mistakes.** Bad credentials, 404s on bad URLs, validation errors, these are *expected* user behavior, not system health. Alerting on them corrupts your error rate and pages for nothing.
- **Alert on saturation.** Disk filling, memory climbing, queue depth growing. A 5-minute heads-up prevents a 3am outage.

## Lifecycle of a Prometheus rule

`Inactive` → `Pending` → `Firing`. The `for` clause prevents the deploy-blip problem: the rule has to be true for the configured duration before it pages. Use it.

## Same metrics system

Don't run a separate alerting tool if you can avoid it. If your dashboards are Grafana on Prometheus, your alerts should be Prometheus alerting rules delivered to Alertmanager and routed to PagerDuty/Slack. One tool, one source of truth, one query language.

## Alert fatigue

An alert that fires constantly gets ignored. That's worse than no alert: when the real incident happens, on-call is already conditioned to dismiss. Fix is boring, hard work: every alert gets a review every quarter. Is it still firing for the right reason? Is the threshold still right? Is anyone acting on it? If not, delete it.

## What to alert on

| Signal | Why |
| --- | --- |
| `rate(http_requests_total{status=~"5.."}[5m]) > X` | Real error rate spike |
| `up == 0` for a target | Target is down |
| `predict_linear(node_filesystem_avail[6h], 24*3600) < 0` | Disk will fill in 24h |
| `process_resident_memory_bytes > X` | Memory leak or growth |

What *not* to alert on: any single 500, any 404, GC pause duration, individual slow requests. Those belong in dashboards, not pages.
