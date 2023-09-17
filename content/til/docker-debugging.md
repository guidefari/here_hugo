---
title: "TIL: Docker Debugging"
date: 2023-09-12T03:39:03+02:00
description: I can't believe how much I suffered trying to find out IP addresses and such inside my docker containers😂
tags: [til, docker, networking, go]
images:
  ["https://images-here-hugo.vercel.app/api/og-image?title=Docker+Debugging"]
---

I can't believe how much I suffered trying to find out IP addresses & such
inside my docker containers😂 - there's no `ipconfig` or `ifconfig` in there.

I'm still trying to get two containers playing well together, using docker
compose. Hopefully will come right soon.

Anyway, onto what we actually learnt while browsing _the youtubes_

---

- `docker inspect [container-id OR name]` - Came in very handy when I was trying to figure out the network configs, and why things weren't playing nice
- [docker volumes](https://youtu.be/OrQLrqQm4M0?si=JeEHEWiQJqzcCdGh) - Learning about persistent data in docker. And how/where your host machine shares it
- `docker logs -f [container-id OR name]` - Was super handy when trying to figure out error messages from the db container while trying to set up a connection from the app.
- `docker system prune --force --volumes` - I'm yet to learn *exactly* what this does


## Dockerfile
- [Dockerfile basics](https://www.youtube.com/watch?v=rI6mrsjFHII)
- [exposing docker ports](https://www.youtube.com/watch?v=DuRNjGpQlxM&t=1s). What's the difference between these two configs?
```yml
    ports:
      - "4000:4000"
    expose:
      - "4000"
```