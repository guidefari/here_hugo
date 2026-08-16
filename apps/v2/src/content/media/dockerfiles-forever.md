---
title: "Give Me 15 Minutes and I'll Fix Your Dockerfiles Forever"
date: 2026-07-18T00:00:00+02:00
description: "Practical Dockerfile improvements from DevOps Toolbox."
media_type: youtube
media_url: https://youtu.be/aZ_y2M2OuEA
youtube_id: aZ_y2M2OuEA
creator: DevOps Toolbox
tags: [docker, devops, containers]
images: ["https://media.guidefari.com/media-covers/dockerfiles-forever.jpg"]
---

The useful Dockerfile rules from this video:

## Prefer slim over Alpine by default

Alpine uses musl libc, while many native dependencies expect glibc. That can turn a small image into a slow source build. Use a slim image unless Alpine's trade-offs are intentional.

```diff
- FROM python:3.11-alpine
+ FROM python:3.11-slim
```

## Keep dependency layers cacheable

Copy manifests, install dependencies, then copy application code. A source change should not invalidate the dependency layer.

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]
```

## Use `.dockerignore`

Keep `COPY . .` readable and exclude local files from the build context:

```text
node_modules
.git
*.log
dist
```

## Build in one stage, run in another

For compiled applications, leave the compiler toolchain out of production. Copy only the artifact into a minimal runtime image.

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp main.go

FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/myapp /myapp
CMD ["/myapp"]
```

## Pin base-image digests

Tags are mutable. Inspect the image with `docker buildx imagetools inspect` and pin the resulting digest when reproducibility matters.

```dockerfile
FROM node:26-slim@sha256:<digest>
```

## Treat process boundaries as a design choice

One process per container is a useful default for orchestration, not a law. For a small deployment, a process manager such as Supervisor can keep an app server and reverse proxy together. For Kubernetes-scale services, separate containers are usually simpler to operate.

## Check your Dockerfiles

`d-roast` is a Rust utility that flags common problems such as `npm install` instead of `npm ci` and missing `.dockerignore` rules.

Source: [Give me 15 minutes and I'll Fix Your Dockerfiles Forever](https://youtu.be/aZ_y2M2OuEA)
