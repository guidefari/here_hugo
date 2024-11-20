---
title: "Nextgoose -> gbfm"
date: 2024-09-16T20:37:16+02:00
description: Moving goosebumps from Vercel to SST
tags: [infra, sst]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Gbfm+Sst"]
---

# The next iteration of goosebumps is here

- All in the same [repo](https://github.com/guidefari/gbfm), so you can check the [closed PRs](https://github.com/guidefari/gbfm/pulls?q=is:pr+is:closed).
- Learnt [some painful lessons](/sst-ci).
- Still the same app, for now. Going for feature parity with before
- Decision was based on lots of nits, & long term strategy alike
- Still on AWS, except I've replaced Vercel with SST
  - I like that all my infra is defined by code, I don't have to go to a UI to do stuff
  - I have more direct control over infra
  - Direct access to resources created & used via my AWS console
  - SST deploys to my AWS account. & I want to continue to practice how to operate within AWS, lest I put [my cert](https://www.credly.com/badges/9342a916-83b2-489e-969a-aa43af8a0c77) to waste💀
- For context, I spent a few weeks [exploring CI/CD options](/ci-cd)
  - I went to extremes, felt the pain points on either side, and have landed somewhere in the middle ?
  - Or rather, have become more aware of the trade-offs, which gives me better grounding in whatever decision I commit to.
- With this monorepo setup, I can quickly spin up an app,
  and deploy it to a subdomain,
  all the CDN & traffic control stuff with cloudflare is already in place
- I also moved from NextJS to Vite
  - This is related to me seeking a better separation of concerns.
    I want a thin presentation layer, and want the ability to be able to switch out frontends as time goes.
  - Keeping an eye out for opportunities to move logic out of react, and into framework agnostic JS. State management comes to mind
  - I didn't like that my application logic was becoming tied to a VC funded framework😬
  - E.G, the thought making a mobile client for goosebumps that's powered by a nextjs & vercel backend felt offish.
- [SST is open source](https://github.com/sst/ion), and built on an [open source IaC provider, Pulumi](https://pulumi.com/). Anytime I really screwed something up, I could read the implementation to figure a way out of the mess.
  - There's also an active github community ([issues](https://github.com/sst/ion/issues), [PR's](https://github.com/sst/ion/pulls))
  - Active [discord](https://sst.dev/discord)
  - So there's always help.
- A good way to learn new tech is to rebuild an app you've built before. I'm definitely leaning into that over here.
