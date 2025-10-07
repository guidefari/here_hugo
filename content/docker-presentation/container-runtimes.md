---
title: "Container Runtimes"
date: 2025-10-08T01:42:31+02:00
description: 
tags: [docker]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Container+Runtimes']
---

This video prompted this note.

{{<youtube DzAco4Aq3mw>}}

---

- Kubernetes uses containerd as its container runtime
- Docker too, uses containerd
- Running `Docker build` constructs an [OCI](https://opencontainers.org/) artifact, also known as an image.
- Any OCI compliant runtime can execute or run OCI images
- Under the hood, containerd uses `runc`, which is the reference implementation of the OCI runtime spec. many others use this
- `crun` is a faster and lighter alternative to runc, written in C.

---

# Container Daemon

A container daemon is a background process that manages the lifecycle of containers on a system. It's responsible for creating, running, monitoring, stopping, and destroying containers.

Unlike a simple chroot which just changes the apparent root directory for a process, container daemons provide much more comprehensive isolation and resource management capabilities:

---

## Key Functions of Container Daemons

- **Container lifecycle management**: Creating, starting, stopping, and removing containers
- **Image management**: Pulling, storing, and managing container images
- **Networking**: Setting up network namespaces, virtual interfaces, and routing for containers
- **Storage**: Managing filesystem layers, volumes, and persistent storage
- **Resource constraints**: Enforcing CPU, memory, and I/O limits using cgroups
- **Security isolation**: Utilizing Linux namespaces, capabilities, and seccomp filters

---

## Common Container Daemons

- **dockerd**: The Docker daemon (used by Docker)
- **containerd**: A lightweight container runtime (used by Docker, Kubernetes)
- **crio**: Container Runtime Interface for OCI (used by Kubernetes)
and some I havent heard of before
- **runc**: Low-level container runtime (used by many higher-level daemons)
- **systemd-nspawn**: Container tool that's part of systemd

These daemons provide much stronger isolation than a simple chroot by leveraging Linux kernel features like namespaces, cgroups, and capabilities to create more complete containerization.
