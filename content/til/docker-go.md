---
title: "TIL: Docker Go"
date: 2023-09-25T05:11:01+02:00
description: Docker networking, containerising a Go application, the difference between expose and ports in docker compose.
tags: [til, docker, go, dx]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Docker+Go']
---

## Context
I've been following along the book [Let's go by Alex Edwards](https://lets-go.alexedwards.net/),
and the Go application we're building needs a [mysql db](https://www.mysql.com/). I want to keep the project
in a ready to deploy state at all times, so I was very against the idea of installing mysql locally.

Also wanted to separate the application & db layer, for independent scalability.

# Solutions

## Docker Compose
The simplest way I could think to solve this was docker compose with two services

```yml
version: "3.9"
services:
  db:
    image: mysql:5.7
    container_name: mysql
    restart: always
    environment:
      HOST: 127.0.0.1
      MYSQL_DATABASE: "snippetbox"
      MYSQL_USER: ""
      MYSQL_PASSWORD: ""
      MYSQL_ROOT_PASSWORD: ""
    ports:
      - "3306:3306"
    expose:
      - "3306"
    volumes:
      - "./.mysql-data/db:/var/lib/mysql"
    networks:
      - my-network

  app:
    build:
      dockerfile: Dockerfile
      context: .
      target: dev
    environment:
      HOST: 127.0.0.1
    ports:
      - "4000:4000"
    expose:
      - "4000"
    volumes:
      - ./:/app/
    depends_on:
      - db
    networks:
      - my-network

networks:
  my-network:
    driver: bridge
```
- note I put both services in the same network, creatively named `my-network`
> [In the Docker Compose ecosystem, the ‘expose’ configuration serves to make a specific port accessible to other services within the same network](https://ioflood.com/blog/docker-compose-ports-vs-expose-explained/#:~:text=In%20the%20Docker%20Compose%20ecosystem,communication%20line%20among%20the%20containers.)

> **Ports** propels the reach of your Docker containers to the host machine and beyond, whereas **expose** retains the communication within the Docker network.

I was wondering what the difference between `expose` & `ports` is. Finally learnt


## Go Live reloading

A little [dx](/tags/dx) improvement for the application, is a way to refresh the application whenever I edit & save a file. That's where [air comes in, with "live reload for Go apps"](https://github.com/cosmtrek/air)

```Dockerfile
FROM golang:1.21 as base

FROM base as dev

RUN go install github.com/cosmtrek/air@latest

WORKDIR /app/
CMD ["air"]

```

## Related Reading
- [Develop a Go app with Docker compose](https://firehydrant.com/blog/develop-a-go-app-with-docker-compose/)