---
title: "Two Tier on Call"
date: 2024-08-17T12:22:05+02:00
tags: [sre, devops, process]
images:
  ["https://images-here-hugo.vercel.app/api/og-image?title=Two+Tier+on+Call"]
---

The idea is simple, have a primary respondent, and a secondary respondent.

## Primary

- First point of contact
- We expect immediate response
- We expect full ownership of incidents to be taken

## Secondary

- Backup, in case primary contact is unable to respond
- If the primary doesn't acknowledge an issue within specified timeframe, secondary kicks in
- If the load on primary is too much, they step in

### Misc

- Make sure to clearly define escalation policies
