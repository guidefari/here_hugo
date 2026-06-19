---
title: "Creating the environment: dockerception!"
date: 2024-09-01
description: "Running Docker inside Docker for development environments"
tags: ["docker"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Creating%20the%20environment%3A%20dockerception!']
---

All demos for this series were done inside a docker container. That's right, we hand built containers inside a container.

Jokes aside, this was mainly to keep my daily driver safe, because I know we'll be messing with cgroups and moving binaries around.


```bash
docker run -it --name docker-host --rm --privileged ubuntu:jammy
```

![](https://d20tmfka7s58bt.cloudfront.net/dockerception.jpg)