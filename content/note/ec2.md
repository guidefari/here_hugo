---
title: "AWS EC2 Basics"
date: 2023-01-04T11:37:10+02:00
description: Compute service.
tags: [aws, ec2]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---

- Basic compute solution for AWS. runtimes, OS's
- IAAS, gives you access to instances. you manage from the OS upwards
- Private service by default
- Uses VPC networking
- AZ resilient. Instance fails if AZ fails
- Can use local on-host storage, or Elastic Block Store (Network storage)

## Instance lifecycle

- **Running** - using CPU, memory, network, & storage
- **Stopped** - no CPU, memory, or network resources being used. Only storage
- **Terminated** - can't reverse this.
- can go from running to stopped & vice versa

# Amazon Machine Image (AMI)

# Connecting to EC2

- Windows uses RDP - **Port 3389**
- Linux uses SSH - **Port 22** - using key pairs
