---
title: "TIL: Docker Debugging"
date: 2023-09-12T03:39:03+02:00
description: I can't believe how much I suffered trying to find out IP addresses and such inside my docker containers😂
tags: [til, docker, networking]
images:
  ["https://images-here-hugo.vercel.app/api/og-image?title=Docker+Debugging"]
---

I can't believe how much I suffered trying to find out IP addresses & such
inside my docker containers😂 - there's no `ipconfig` or `ifconfig` in there.

I'm still trying to get two containers playing well together, using docker
compose. Hopefully will come right soon.

Anyway, onto what we actually learnt while browsing _the youtubes_

---

- `docker inspect [container-id]``
- docker volumes
- pulling docker images
- `docker logs -f``
- `docker system prune --force --volumes``


## Dockerfile
exposing docker ports. What's the difference between these two configs?
```yml
    ports:
      - "4000:4000"
    expose:
      - "4000"
```

# Todo
- [ ] link to the YT videos