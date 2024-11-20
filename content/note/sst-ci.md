---
title: "SST CI deployments with a custom domain name"
date: 2024-09-07T10:37:10+02:00
description: Going from deploying to prod via my laptop, to github actions.
tags: [infra, sst]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=SST+CI']
---

I've made this mistake twice now. This note & video as an attempt to stop a third time.
And in case it does happen again, I'm aware of the key resolution steps.
`sst remove` wasn't even working at some point😂 that's when I had to resort to manually deleting resources, which is generally frowned upon.

{{<youtube 1fBs-EZ04n8>}}

## Overview of the fix
* Changed the web resource name, so I could generate new assets.
* Also [changed](https://github.com/guidefari/gbfm/commit/7e5af1a2bf0819af6ace9a7f8ae104543a36ead3) the sst deployment [stages](https://sst.dev/docs/workflow/#stage).
* Deleted cloudflare DNS records
* Deleted AWS cloud front distributions
    * I should probably delete the S3 buckets too, LOL
* Deleted origin access control rules
    - The [Discord server](https://sst.dev/discord) helped with this one 

## [SST Discord](https://sst.dev/discord)
Very useful resource. For the most part, searching for your error message in the Discord
will show you at least one other person who's had the same issue, and what they tried.

---

# Related Reading
- [Reading list #4](https://open.substack.com/pub/guidefari/p/reading-list-4?r=n4azl&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true) has context on what terminal is.
## Github discussion
- [Fails to create DNS records with wildcard alias on CloudFlare (Error: Component names must be unique.)](https://github.com/sst/ion/issues/289)