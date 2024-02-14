---
title: "MTTR > MTBF"
date: 2022-11-25T08:01:50+02:00
description: Optimising Mean Time To Recovery is more important than trying to minimise Mean Time Between Failures.
tags: [monitoring, devops, cloud, process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=MTTR%20%3E%20MTBF']
---

To paraphrase John Allspaw:

> it’s more important to have good monitoring of your system, so that you are aware when an error occurs and therefore act on it. A lot of systems fail without the relevant parties ever being aware that something's wrong.

- The MTTR > MTBF idea is true for most types of failures.
- The more complex a system is, the more difficult it is to predict failures, making it more important to be notified of failures, & recover quickly from there
- Worth noting, MTTR is one of the key metrics used in State of Devops reports, & the book [Accelerate]({{<ref accelerate>}}), when measuring some stats from high performing vs low performing teams.

{{<youtube 5AGEv0sAw6g>}}

## Other takeaways from the Infrastructure As Code video

- Immuatble server, rebuilt on each config change. Less likely to have a snowflake server if you keep on rebuilding it.
  - A **snowflake server** is one that people avoid touching, in fear of messing things up.
  - What we're after is a **phoenix server**, one you can confidently destroy & rebuild. It allows you to lean into the strengths of deploying in the cloud. Create & destroy as you need, as opposed to long lived servers that are never rebuilt.
- No ssh'ing into the server to change configs
- small changes rather than batches: results in less errors, easier rollback, less risk
- Keep services available continuously. No going down for maintenance
  - Blue green deployment
