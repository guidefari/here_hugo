---
title: "AWS Networking Refresher"
date: 2023-02-01T20:03:52+02:00
description: Polishing up my knowledge on how networking is structured in AWS
tags: [aws, networking, cloud]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS%20Networking%20Refresher']
---

## Also see

- [VPC basics]({{<ref vpc>}})
- [Route tables](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)
- [ELB notes]({{<ref elb>}})

## [Basic Web Application architecture](https://d1.awsstatic.com/architecture-diagrams/ArchitectureDiagrams/web-application-architecture-on-aws-ra.pdf?did=wp_card&trk=wp_card)

![](https://res.cloudinary.com/hokaspokas/image/upload/v1675588184/here-hugo/Screenshot_2023-02-05_at_11.03.47_mdkoly.png)

- VPC -> Region
- Subnets -> AZ
- [More AWS architecure diagrams](https://aws.amazon.com/architecture/reference-architecture-diagrams/)

# [Security groups vs NACL](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html#VPC_Security_Comparison)

- "NACLs keep unwanted traffic out of the subnet, and security groups keep unwanted traffic out of an EC2 instance or AWS service."
- NACLs are **stateless**, meaning you have to configure outbound & inbound rules
  - In contrary to **stateful** security groups. These monitor outbound traffic, and what goes out, is allowed to come back in.
  - [lovely stackoverflow](https://stackoverflow.com/a/53625507) explaining what stateful means in this context.
- NACLs have an implicit deny

## Helpful podcasts

### First podcast

This one goes over the services and explains their use cases
{{<spotify episode 4BarELKtUVRHt7SEC14jpy>}}

### Second podcast

This one discusses real life problems that are trying to be solved.

cross region routing, transit gateways, VPNs, storage gateway, and direct connect, to name a few :)
{{<spotify episode 6511caZKP8eeHgD701rEZA>}}
