---
title: "Feature Flags"
date: 2023-04-06T20:07:54+02:00
description: Some things to think about when considering feature flags
tags: [podcast, qa, process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Feature%20Flags']
---


{{<spotify episode 2mZdnfsze7VKwNUv9R5ZZ0 >}}

## Little bit of history
- Feature flags have been in use since the 90s, in complex large scale systems
  - They were implemented at compile time, meaning to toggle them, they had to recompile & release software afresh
- Early 2000s introduced the runtime feature flags, which are much more common today

## Misc & benefits
- feature flags can exist on the frontend, and backend
  - they're mostly seen on the frontend though
- from a QA perspective, feature flags can be used to **mitigate risk**, especially when introducing new flows into a product
  - achieved by allowing **gradual release**of new features
  - **limits blast radius** when releasing to prod
- feature flags in your E2E tests - this is a consideration you have to keep in mind
- they can increase speed of delivery
- improved collaboration between engineering, product, & QA
  - they are usually owned & managed by product. but anybody can do anything, meaning dev & QA can also get involved
- Use them judiciously, don't just put everything behind feature flags
  - eg with API's, it can be more appropriate to opt for versioning, rather than feature flags
- Make sure all relevant stakeholders are aware of feature flags in use, and who they impact

## Cons
- increased complexity, potential maintenance of two versions of code

## Lifecycle of a feature flag
> How do you go from **this is a feature flag** -> **this is now part of the software**

1. Start with a clear plan
  - specific use case
  - type of feature flag
  - steps required to manage the feature flag
2. Clean up those flags, when adoption of a feature is 80-100%, that's around the time to remove them from your codebase
3. Have a review process on a regular cadence for feature flags
4. Set expiration dates for feature flags at creation time.
5. Collect metrics in your observability tools. This is for whatever is important to you, time to first interactive, time spent on pages etc.
   - [Related reading on the topic of metrics](https://readwise.io/reader/shared/01gx3xxjdqd4dn0kftwb323pv3).

### Related reading
- https://engineering.atspotify.com/2020/10/spotifys-new-experimentation-platform-part-1/
- https://www.split.io/guides/feature-flags/
- [What Are Vanity Metrics and How to Stop Using Them](https://readwise.io/reader/shared/01gx3xxjdqd4dn0kftwb323pv3)