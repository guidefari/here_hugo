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

## Related reading

- <https://labs.iximiuz.com/roadmaps/docker>
