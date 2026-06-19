---
title: "TIL: Logs N Stuff"
date: 2022-07-08T10:01:01+02:00
description: Something I learnt today. Maybe more than one thing👾Linux infra & logging stuff
tags: [til, linux, logs, infra, cloud, git, backend]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Logs%20N%20Stuff']
---

## use `cat` to create and write into a file
```bash
cat > readme.txt
This is the readme.txt file.
look what you done
```
- press `ctrl + d` to save & exit

## Modifying folder `git config`
So, just som egeneral housekeeping, needed a the repo with this site to use my personal git details, and not the global ones. Had to [edit the repo's git config](https://stackoverflow.com/questions/8801729/is-it-possible-to-have-different-git-configuration-for-different-projects#:~:text=There%20are%203%20levels%20of,user%20and%20stored%20in%20~%2F.)
- `./git/config` - notice how this file has no extension

## Linux `envsubst` command & what you can use it for
> The envsubst program substitutes the values of environment variables.
> [src](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html)

## [Helm](https://helm.sh/) - Kubernetes package manager
- <div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/Zzwq9FmZdsU" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## Shifting left on security in the SDLC
- **SDLC** definitition: **S**oftware **D**evelopment **L**ife **C**ycle

<iframe src="https://open.spotify.com/embed/episode/7gik4siclkckQgxRN55XMs" width="100%" height="250" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify episode embed"></iframe>

<iframe src="https://open.spotify.com/embed/episode/6MFn3eoIKWlAc81OrETIPz" width="100%" height="250" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify episode embed"></iframe>



## logstash
A way to centralise, parse, transform logs from all sorts of places

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/gUJvP2OZENk" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/ipS2d7pDgqs" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

## [syslog](https://www.rsyslog.com/)
> Rsyslog is a syslog forwarding facility.

## Service Mesh
A way for services to communicate with each other.
- Service Mesh **sidecar proxies** are a thing. They're what hijack the requests coming in & out of the pod
> Service-to-service communication is what makes microservices possible.

> Dedicated infrastructure layer for service to service communication

- This layer comes with a bunch of features we can opt into, without having to write extra code. Features such as:
  - Auth between services
  - TLS & auto rotation of certificates
  - Metrics & logging: requests per second, latency, and more?
  - Retry logic
  - Auto backoff
- configured in a `yaml`file

### Check out
- Linkerd
- Istio

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/rVNPnHeGYBE" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>