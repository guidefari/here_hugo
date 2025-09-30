---
title: "Top level Presentation doc"
date: 2024-09-01
description: "Understanding container fundamentals: chroot, namespaces, cgroups, and container daemons"
tags: ["docker", "containers", "fundamentals"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Shipping%20mates%3A%20Docker%20in%20depth']
---

---
## Topics we're going to cover today
- Crafting containers by hand
- slim containers
- multi-stage, layers, and all the fun stuff
  - helping with container size, and security by minimising the attack surface of what you ship to prod
- The anatomy of a dockerfile

---
## Things I'd have liked to cover, but ran out of prep time for
- local development (docker compose)
- basic networking 
  - port forwarding
  - bringing up containers within the same network
  - communication across those different containers

---

# Crafting containers by hand
- A container is like 3 things ducktaped together, **chroot**, **namespaces**, & **cgroups**

---

### chroot (jailed process) 
- changes the apparent root directory for a running process and its children. After the chroot operation, the process cannot access files outside the designated directory tree.
- demonstrate the limitations of chroot alone, using ps and kill another chroot’s process

---

### namespaces
- Lowkey a core concept of how the linux kernel is built. All about security & resource management
- in a chroot environment, you can see processes outside of it, like other chroot environments (using `ps aux` for example)
  - lol, you can run `kill` on a process that exists in another chroot.
- namespaces allw you to hide processes from other processes (unix time sharing namespace, there’s other kinds)
- `unshare`

---

### cgroups
- Used for resource allocation (CPU, RAM, bandwidth?) 

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

## Related reading
- https://labs.iximiuz.com/roadmaps/docker




