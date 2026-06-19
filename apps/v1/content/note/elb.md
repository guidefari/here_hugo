---
title: "AWS Elastic Load Balancer"
date: 2023-02-05T14:13:59+02:00
description: Let's learn how to balance this load, shall we
tags: [aws, networking]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS%20Elastic%20Load%20Balancer']
---
Distributes incoming traffic across multiple targets, such as

- EC2 instances
- Containers
- IP addresses
- Lambda functions

- Must have at least 2 AZ's to make use of it.
- Sticky sessions
**X-forwarded-For (XFF) header**
![illustration of XFF header in use](https://res.cloudinary.com/hokaspokas/image/upload/v1675598882/here-hugo/IMG_D2500E7C87DA-1_wdgo1c.jpg)

- With regard to ELB health checks, when an instance is considered unhealthy, ELB doesn't terminate it, it merely redirects the traffic to healthy instances.
- Cross Zone load balancing - only available for ALB & CLB.
  - I wonder, why doesn't it work for network load balancer?
- ELB's cannot go cross region. one per region
- ALB is good for web applications
- NLB is good for high throughput, eg video games

#### 3 Types of load balancer

1. Application Load Balancer (HTTP(s)). Params you can apply rules on:
   - host header
   - source ID
   - path
   - http headers
   - http header method
   - query string
2. Network Load Balancer (TCP/UDP)
3. Classic Load balancer - this bad boy's considered legacy now.

