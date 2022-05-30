---
title: "TIL: Some Docker & Linux"
date: 2022-05-25T07:16:55+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Some%20Docker%20%26%20Linux']
---


## My Linux & docker background
I've been setting up my dev environment on a Linux machine, and I'm a relative noob to Linux, I know enough to get shit done, but given the option, I'd rather Windows or Mac. Basically here because I have no option. Same with containers/docker, I've been pretty much staying away from those unless I had no option.

I had a very good primers though, did a little bit of [Linux Essentials certification](https://learning.lpi.org/en/learning-materials/010-160/) sometime in 2015/16, thanks to [Kapil](https://www.linkedin.com/in/kapil-narotam-848330178/).

I followed that up with [Brian Holt's Complete Intro to Containers (feat. Docker)](https://frontendmasters.com/courses/complete-intro-containers/). Check out [Brian Holt](https://frontendmasters.com/teachers/brian-holt/) & [Jem Young on Frontendmasters](https://frontendmasters.com/courses/fullstack-v2/) if you're a frontender trying to learn more Linux & backend - they've been good to me.

# Docker

### Docker Compose
- Makes it easy to get your multiple container application going.
- Works in all environments, staging, development, production, testing, & CI.
- You define your application in a `docker-compose.yml` file.
- `docker compose up` will start & run your application
  - you can also specify the services you want to run, just pass them as extra arguments like so: `docker compose up service1 service2`

### [Docker system prune](https://docs.docker.com/engine/reference/commandline/system_prune/)
> Remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes.

Okay but how does it determine what's unused?

---

# Linux

## Graphics - Wayland & X
I'm running the [latest Ubuntu LTS (22.04)](https://ubuntu.com/download/desktop). Now, this uses a 3D graphics rendering engine to power your UI, and that's called [Wayland](https://wiki.ubuntu.com/Wayland). In the past, Ubuntu used X, which is a 2D engine.

Wayland seems to be powering Ubuntu by default, but Ubuntu still ships with X, for backwards compatibility, and as a fallback.

**The problem:**
I installed a Slack & Edge (via their debian packages) and they just wouldn't launch.

**The fix:**
Disabling wayland & switching to X did the trick. They've been launching fine since. And I haven't felr like I'm losing out on anything around the rest of the UI.


## User Groups
User groups are a way of managing permissions. The most useful usecase I've seen for them is the following scenario:

Single dev on a machine, there's certain tasks I'm guaranteed to do everytime I'm on the machine, such as running docker containers.
Docker commands need root permission, so you have to `sudo docker ...` everytime you're doing anything docker related, which can be a waste of time.

If you add your user to the docker group (created automatically, when you install docker), you won't have to `sudo` anymore. Handy trick I was first taught by [Brian Holt](https://frontendmasters.com/courses/complete-intro-containers/).

Linode has [beautiful docs on User Groups](https://www.linode.com/docs/guides/linux-users-and-groups/), good reference.

## Systemd
Low level util that does a lot of stuff, seems best suited to long running processes

> systemd is a Linux initialization system and service manager that includes features like on-demand starting of daemons, mount and automount point maintenance, snapshot support, and processes tracking using Linux control groups.

> systemd not only manages system initialization, but also provides alternatives for other well known utilities, like cron and syslog.

Again, [Linode docs for reference](https://www.linode.com/docs/guides/what-is-systemd/)