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