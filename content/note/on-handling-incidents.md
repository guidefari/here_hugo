---
title: "On Handling Incidents"
date: 2023-12-04T08:55:02+02:00
description: A few things I’ve learnt about handling incidents. 
tags: [process, product, playbook]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=On+Handling+Incidents']
---

# Incidents are a byproduct of complex systems 
Organisations must adapt and sustain their ability to learn from incidents as they grow in complexity. This note touches on a few things I’ve learnt about handling incidents. 

# Post Mortem
Timing is key here. You don’t want to do these too quick after an incident as people are likely to still be in less than ideal moods. Give your team a bit of time to rest before going into these, likely to learn much more in that environment. 

Needless to say, post-mortems are not a witch-hunt, refrain from pointing fingers, address incidents as a socio-technical problem.

# Root Cause Analysis isn’t a golden egg
In a complex enough environment, with lots of dependencies, micro services, & process, it’s easy to use the 5 why’s and land on just **one of many** of the causes of an incident, and not truly learn everything you can from an incident. 

The problem is compounded by the [recency bias](https://en.wikipedia.org/wiki/Recency_bias) that comes into play when you’re analysing subsequent incidents, that display similar symptoms.

Root cause analysis assumes a straightforward relationship between causes and effects, which is not always the case in software development.

# Customer support
Have a customer support layer. How this can look depends on your specific situation’s needs. Email address, an actual phone number to call (dedicated support team or direct to developers), a slack or discord channel

Examples of customers you have to support:
- End users of a public product
- Developers (eg users of open source packages)
- Internal dev teams
# On Call Engineers are support
Mileage may vary here, but the idea is to allocate a percentage of your engineering team who’s main focus is triaging and responding to these incidents as the come in.

Switching context & energy from project mode to support can be a bit taxing, so I’d suggest having people hop between support and project mode at a slow cadence. I’d suggest at least a week dedicated to a single mode of work.

On call engineers act as a protection layer for those on project work. They take all the reactive work, and preserve focus for the team on project work.
# Triaging
The customer support layer is responsible for triaging. At this point, their responsibility is to gather as much information as possible about the issue at hand. Who it impacts, how to reproduce, figure out it’s priority, and propagating the information to relevant areas of the organisation.
# Related
- [Learning from Incidents • Andrew Hatch • YOW! 2019](https://www.youtube.com/watch?v=TIL6UP9K-L4)
- [Incident Review and Postmortem Best Practices - **Gergely Orosz**](https://newsletter.pragmaticengineer.com/p/incident-review-best-practices)
- [Reducing the burden of incident response on your teams](https://www.youtube.com/watch?v=_XT3AkDMVoY)
