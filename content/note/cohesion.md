---
title: "Cohesion & Complexity"
date: 2023-07-20T05:53:41+02:00
description: WIP - publishing for early feedback😛
tags: [tactical, psychology, design, dx, architecture, complexity]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Cohesion%20%26%20Complexity']
---

# High Cohesion
>
> [A module with high cohesion contains elements that are tightly related to each other and united in their purpose. For example, all the methods within a User class should represent the user behavior.](https://www.baeldung.com/cs/cohesion-vs-coupling)

## React example

A folder structure that encourages high cohesion in a react codebase can look like this:
![](/images/fs.png)

This is just one example. The idea is to make it easy to see what's going on at a glance, and reduce the surface area for changes.

# Low Cohesion
>
> Low cohesion is [when things that belong together aren’t together](https://frontendatscale.com).

Low cohesion is a form of complexity in a codebase.
Complexity contributes to the total amount of [cognitive load](/clt) needed to achieve a goal in a system. It is good for business to reduce complexity as much as you can.

This note attempts to help you identify areas of low cohesion, and tactics to improve those areas.

# What can low cohesion look like

# Tactics to improve on cohesiveness

- Small incremental changes. This can be done by following the camp site rule. Leave any code you touch a little bit better than you found it. I have a note on more [refactoring tactics](/refactoring) you can apply.
- Keep code as close as possible to where it's being used. Better explained by [Josh Comeau](https://www.joshwcomeau.com/react/file-structure/), and also [Swizec](https://swizec.com/blog/if-it-works-together-it-lives-together/)
- Only abstract as far as you need, for right now's needs. It's good to keep future design in mind, but don't make stuff so abstract that someone joining your project today with no context suffers productivity

## Dogmatic code has an influence on cohesion

Libraries and languages will have their default and recommended ways of organising code. From folder structure, to file and module structure etc. I am generally for the idea of writing dogmatic code, it's especially helpful when working in teams, as it reduces the cost of onboarding new engineers.

With that said, each project is unique. [Tyler](https://www.tylerpillay.co.za/) gives a good summary
> I think documentation goes a long way here, for example the coding standards we had for Go were very different at Sigma compared to checkers. Whether it’s dogmatic or not, as long as the people in an organisation agree on the standards then it’s a good practice but this should be driven by what’s actually considered dogmatic

# Related Reading

- [Delightful React File/Directory Structure](https://www.joshwcomeau.com/react/file-structure/)
- [Cognitive Load Theory](/clt)
- [Podcast Notes: Software Design with John Ousterhout](/software-design) - This is ultimately
- [Projects over categories](https://podcasts.apple.com/za/podcast/the-building-a-second-brain-podcast/id1504494402?i=1000469472525) - This podcast applies to writers
- [The Law of Leaky abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)
- [If it works together it lives together](https://swizec.com/blog/if-it-works-together-it-lives-together/)
- [Coupling and cohesion](https://www.geeksforgeeks.org/software-engineering-coupling-and-cohesion/)
{{<youtube dP8NmcEkxJI>}}
{{<youtube oejXFgvAwTA>}}
