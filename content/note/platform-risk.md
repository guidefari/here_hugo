---
title: "Platform Risk"
date: 2023-06-15T22:10:11+02:00
description: Something to think about when engineering solutions.
tags: [strategy, risk, devops]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Platform%20Risk']
---

## What is Platform Risk
> [Platform risk arises when you build your business or side hustle on top of an existing platform in order to leverage on its existing services and users.](https://www.startupillustrated.com/Archive/Platform-Risk)

As explained by Startup Illustrated the risks fall into 2 categories:
1. Platform moderation
2. Platform existence.

## Why now
An app I like recently got priced out of the API it builds on top of ([Apollo](https://apolloapp.io/))

[Twitter](https://www.wired.co.uk/article/twitter-data-api-prices-out-nearly-everyone) & [Reddit](https://arstechnica.com/gadgets/2023/06/reddits-new-api-pricing-will-kill-off-apollo-on-june-30/) are just 2 recent examples of companies that have priced out 3rd party apps from their API's. Watching all of this has resulted in me thinking a bit more about the topic.

## Some heuristics
Assume any products or services you're building on top of can & will cease to exist. How exposed is your product to those pieces failing? How easy is migration? What impacts your core service provision?

Some platforms with risk exposure when building & delivering a product:
- Hosting infrastructure
- Version Control systems (github goes down & you can't ship changes)
- 3rd party API's in your product
- Internal communication tools

All of these are subject to platform risk. You can't de-risk yourself 100% & that's not worth attempting. Identify your [core domain](https://levelup.gitconnected.com/domain-and-core-domain-in-ddd-c49733fa8c74), and de-risk that as much as possible.

> [Startups can usually only do one thing well at a time.](https://medium.com/lightspeed-venture-partners/startups-can-only-do-one-thing-well-at-a-time-f2a4228f2323)

Content creators also face platform risk when it comes to distribution of content, but that's another post, I digress..

## Example of my platform Risk
Spotify is my main tool for curation, I have hundreds of playlists on there, and about 9 750 liked songs at the time of writing.
Music disappears off Spotify a lot of the time, which means I'm at risk of my beloved collection eroding over time.

A big chunk of the experience on [goosebumps.fm](https://goosebumps.fm) is reliant on the Spotify API, & I don't like that.

A few mitigation strategies:
- I'm recording and hosting more of my own mp3's in the form of DJ mixes & podcasts, as opposed to track previews powered by the Spotify API.
- Using more than one music streaming service (I don't keep secondary accounts active all year)
- My favourite: building an offline collection of lossless music, via [bandcamp](https://bandcamp.com)

## Cloud Computing vendor lock in
- Pay attention to egress fees and proprietary tech

# Related reading
- [Why it’s OK for startups to have platform risk](https://medium.com/lightspeed-venture-partners/why-its-ok-for-startups-to-have-platform-risk-a3d70866cf13)
- [IndieWeb](https://indieweb.org/) - promoting independent & distributed ownership of intellectual property
- [Killed By Google](https://killedbygoogle.com/)
- [ServerlessHorrors](https://serverlesshorrors.com/)
- [Retro on cloudstrike outage](/crowdstrike)
- [Google VMware + UniSuper outage](https://cloud.google.com/blog/products/infrastructure/details-of-google-cloud-gcve-incident)

{{<youtube 3GOAUyipnM4>}}

{{<youtube 4Wa5DivljOM>}}

