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
- EC2 has a soft limit of 20 instances per region

## Instance lifecycle

- **Running** - using CPU, memory, network, & storage
- **Stopped** - no CPU, memory, or network resources being used. Only storage
- **Terminated** - can't reverse this.
- can go from running to stopped & vice versa

# Instance types

- On demand
- Reserved - these have a time commitment. gives 30-70% discount. Various payment options - no upfront, all upfront, partial upfront
- Spot - cheap, meant for short lived instances, few hours to a few days. they use bid pricing
- Dedicated - not sharing memory/cpu

# Amazon Machine Image (AMI)

# Connecting to EC2

- Windows uses RDP - **Port 3389**
- Linux uses SSH - **Port 22** - using key pairs

# Auto scaling groups

- They use launch configurations, these specify the usual EC2 launch stuff.
  - AMI + instance type
  - EC2 user data
  - EBS volumes
  - Security Groups
  - SSH keypair

- ASG is usually put behind a load balancer
- Can scale based on:
  - **cloudwatch alarms**
  - target average CPU usage
  - number of requests on the ELB per instance
  - average network in
  - average network out
  - custom metric, such as number of users connected to application
