---
title: "How to run a good incident review"
date: 2026-10-12
description: "A reading stub on incident reviews, learning without blame, and turning findings into useful reliability work."
tags: [note, process, reliability]
images: ['https://og.guidefari.com/og-image?title=How%20to%20run%20a%20good%20incident%20review']
---

Stub: collecting reading and questions for a fuller note.

A good incident review should help people understand what happened, what responders knew at the time, and what would make the system easier to operate next time. Not a search for someone to blame, or a meeting where someone reads a report aloud.

## Questions to work through

- What should we prepare before the meeting: customer impact, a timeline, evidence, and open questions?
- Who needs to be there, and how do we make room for different accounts of what happened?
- How do we discuss decisions using the information available at the time, rather than hindsight?
- How do we capture what went well, not just what failed?
- Which follow-up work is worth doing, who owns it, and how will we check whether it helped?
- When should we review several related incidents together instead of treating each one separately?

## Related notes on this blog

- [On Handling Incidents](/on-handling-incidents/): my earlier notes on blameless reviews, giving responders time to rest, and why one root cause isn't enough.
- [Retro: Crowdstrike outage](/crowdstrike/): deployment safeguards, rollback, and customer impact.
- [Alerts](/bootdev-observability-alerts/): actionable alerts and the cost of alert fatigue.
- [Two Tier on Call](/two-tier-on-call/): incident ownership, backup responders, and escalation.
- [Will Larson's An Elegant Puzzle](/elegant-puzzle/): related reading on engineering management and operational ownership.

## Will Larson

Start with the practical guide, then the broader incident-program discussion:

- [Incident Review](https://infraeng.dev/incident-review/): goals, anti-goals, facilitation, attendance, and how to tell whether reviews are useful.
- [Incident Review Template](https://infraeng.dev/incident-review-template/): Larson's page is itself a stub and points to PagerDuty's postmortem template as a starting point.
- [Incident response, programs and you(r startup)](https://lethain.com/incident-response-programs-and-your-startup/): how incident programs grow, why process compliance can displace learning, and how to prioritise reliability work across incidents.

## Charity Majors and Honeycomb

- Charity Majors, [On Call Shouldn't Suck: A Guide For Managers](https://charity.wtf/p/on-call-shouldnt-suck-a-guide-for-managers): companion reading on giving engineers time, tools, and support to improve reliability. Not an incident-review template.
- Emily Nakashima, [Incident Review: Meta-Review, August 2020](https://www.honeycomb.io/blog/incident-review-meta-review-august-2020): a concrete example of reviewing a cluster of incidents for shared patterns. Charity Majors suggested the meta-review; Nakashima wrote the account.
