---
title: "Resource: Docker"
date: 2022-07-28T13:55:56+02:00
description: Some docker resources
tags: [resource, docker, linux, bash]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Resource%3A%20Docker']
---

# Links
- [Pass host system env vars to docker processes](https://www.howtogeek.com/devops/how-to-pass-environment-variables-to-docker-containers)

```bash
// set variable
export POSTGRES_PASSWORD='password'

// use it later
docker run -e POSTGRES_PASSWORD -e POSTGRES_USER ...
 ```

# Logs
```bash
  docker logs infrastructure-rabbitmq-1
#   or
  docker logs d3387e01e7cd
```

# List containers
```bash
docker ps
# or
docker container ls -a
```

# Remove specific container
```bash
docker rm d3387e01e7cd
```
- `docker stop` also works with **container id**

# Get into container shell/terminal
```bash
docker exec [container-id or name] [shell - can be bash or ash]
```

# Common flags

- `-it` is short for interactive

# Misc
- Alpine is like a bare bones linux
- `docker image prune` will clear up a bunch of space for you. But you'd have to rebuild images & such.

**TIL: difference between attach & exec**:
> - `attach` isn't for running an extra thing in a container, it's for attaching to the running process.
> - `docker exec` is specifically for running new things in a already started container, be it a shell or some other process.
> [src](https://stackoverflow.com/questions/30960686/difference-between-docker-attach-and-docker-exec)

- [This](https://iximiuz.com/en/posts/containers-101-attach-vs-exec/) could make for a good read