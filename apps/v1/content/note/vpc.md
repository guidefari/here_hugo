---
title: "AWS VPC basics"
date: 2023-01-04T11:07:52+02:00
description: Networking services
tags: [aws, cloud, vpc]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS%20VPC%20basics']
---

- VPC's are regionally resilient
- min CIDR -> /28 -> 16 IP addresses
- Max CIDR -> /16 -> 65 536 IP addresses

# Default VPC

- One Default VPC per region. Can be deleted
- CIDR range always the same: **172.31.0.0/16**
- There's one subnet per Availability Zone in a region. Virginia has 6, while Cape Town has 3.

# Custom VPC

- By default, these are isolated & private

# Some VPC components

- Internet Gateways
- Route tables
- NACL
- Security Groups
