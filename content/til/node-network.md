---
title: "TIL: How to fix Node Network timeouts"
date: 2024-03-23T18:26:48+02:00
description: All network requests spawned by any node process were hanging unless I connected to a VPN. Took some time to fix it 
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Node+Network']
---

Node network requests were only going through if I connected to a VPN.
- This meant nothing was was coming through from the npm registry, eg `npm i` or `bun install` weren't working.
- I also had some processes in the node app that were making network requests and those were hanging and timing out too.
- Worth noting I had this issue on a Mac.

## The fix
- Renewing DHCP lease on my local network
- Flushing my DNS Cache: Sometimes DNS cache issues can cause network problems.
run `sudo killall -HUP mDNSResponder`

## Edit: a few moments later...
I realized the fix above didn't work.
The issue persisted for another day or so, but eventually fixed itself and has been fine for 3 weeks. Weird.