---
title: "Route 53 Basics"
date: 2023-01-06T13:08:58+02:00
description: Highly available DNS Service from AWS
tags: [route53, aws]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Route%2053%20Basics']
---

- IANA delegates organisations to take care of the different registries (`.net`, `.io`, `.com` etc)
  - PIR is responsible for `.org`
- IANA takes care of root DNS zone
- Global service, single database, Globally resilient
- Zone files are created by AWS when registering a domain, it's a database containing all the details about a domain
- A hosted zone hosts DNS records (within AWS) & can be public, or private (linked to one or more VPCs )
- Managed Name Servers
  - Name Servers are how DNS delegation works
  - CNames can only point to other hostnames, & not IP address. eg, ftp.example.com (CNAME) -> example.com (A record) -> IPv4 address

# Route 53 architecture

- How [Shuffle sharding]({{<ref Route-53-Shuffle-Sharding>}}) helps Route 53 achieve that 100% SLA
