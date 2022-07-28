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
