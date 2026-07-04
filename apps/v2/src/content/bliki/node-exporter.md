---
title: "Prometheus Node Exporter"
date: 2026-07-04T10:00:00+02:00
description: the standard Prometheus exporter for host-level hardware and OS metrics
tags: [observability, prometheus]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Prometheus%20Node%20Exporter']
---


The default Prometheus exporter for *host* metrics. Run it on every machine you want to monitor, point Prometheus at it, get CPU, memory, disk, network, filesystem, and kernel stats for free.

[GitHub](https://github.com/prometheus/node_exporter) · [Docs](https://prometheus.io/docs/guides/node-exporter/)

## What it exposes

The full [list](https://github.com/prometheus/node_exporter#enabled-by-default) is long. The categories that matter for most services (USE method):

- **CPU**: `node_cpu_seconds_total`, `node_load1/5/15`
- **Memory**: `node_memory_MemTotal_bytes`, `node_memory_MemAvailable_bytes`
- **Disk**: `node_disk_io_now`, `node_filesystem_avail_bytes`
- **Network**: `node_network_receive_bytes_total`, `node_network_transmit_bytes_total`
- **Kernel**: `node_vmstat_*`, `node_uname_info`
- **Filesystem**: `node_filesystem_files`, `node_filefd_*`

## How to run it

Three common shapes:

- **Bare metal / VM**: systemd service, started on boot, scrapes `localhost:9100/metrics`
- **Docker compose**: one container per host, network mode `host` so it can see the host's filesystem and network
- **Kubernetes**: [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) so one pod runs on every node

Compose example (used in the [linko](https://github.com/guidefari/boot_dev_observability) repo alongside the app's `/metrics`):

```yaml
node-exporter:
  image: prom/node-exporter:latest
  network_mode: host
  pid: host
  volumes:
    - /proc:/host/proc:ro
    - /sys:/host/sys:ro
    - /:/rootfs:ro
  command:
    - '--path.procfs=/host/proc'
    - '--path.sysfs=/host/sys'
    - '--path.rootfs=/rootfs'
    - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
```

`network_mode: host` + the `/proc` and `/sys` mounts are the important bits. Without them the exporter only sees its own container, which is useless for host metrics.

## Scrape config

Tell Prometheus to scrape it:

```yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

In the [Boot.dev metrics note](/bootdev-observability-metrics/), the same compose file runs Prometheus, the app, and node-exporter together.

## What to alert on

The standard alerts from the USE method:

| Signal | Alert |
| --- | --- |
| `up == 0` | Host is down |
| `predict_linear(node_filesystem_avail[6h], 24*3600) < 0` | Disk will fill in 24h |
| `node_load5 > N` (N = cores * 1.5) | CPU is over-saturated |
| `node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.1` | Memory pressure |

Same pattern as [Boot.dev alerts](/bootdev-observability-alerts/), but at the host layer.

## When to use something else

Node Exporter is for Linux hosts. For other targets:

- **Windows**: [windows_exporter](https://github.com/prometheus-community/windows_exporter)
- **Containers / k8s pods**: [cAdvisor](https://github.com/google/cadvisor), built into kubelet
- **NVIDIA GPUs**: [dcgm-exporter](https://github.com/NVIDIA/dcgm-exporter)
- **Network gear**: [snmp_exporter](https://github.com/prometheus/snmp_exporter)
- **Anything else**: most things have a community exporter on the [Prometheus exporters page](https://prometheus.io/docs/instrumenting/exporters/)
