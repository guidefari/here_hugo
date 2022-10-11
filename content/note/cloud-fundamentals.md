---
title: "Cloud Fundamentals"
date: 2022-10-11T07:42:35+02:00
description: 
tags: [aws]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Cloud%20Fundamentals']
---

# Characteristics of the cloud
According to NIST:
- **On-demand self-service:** Can provision capabilities as needed, **without needing human interaction**
- **Broad Network Access:** Available over the **network** and accessed through **standard mechanisms** (like http)
- **Resource Pooling:** No control or knowledge of the **exact location** of the resources. Resources are **pooled** to serve multiple consumers using a **multi-tenant model**
- **Rapid Elasticity:** Capabilities can be **elastically provisioned** and **released** rapidly, to keep up with demand.
- **Measured Service:** Resource usage can be **monitored, controlled, reported, & BILLED**
- 

This section was summarised by [Adrian Cantrill]({{<ref aws-sa-cantrill>}})

# Cloud service models
- IAAS - You consume the OS
- PAAS - You consume the runtime
- SAAS - You consume the application

# Private Cloud On-Premises
I recently learnt that a hybrid cloud is more like:
- AWS Outposts
- Google Anthos
Private on prem isn't just bare metal servers, it has to meet the characteristics that describe the public cloud as seen above

- Azure has really [good docs](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-a-private-cloud/) on this topic

Sometimes referred to as **internal** or **corporate cloud**.

## Case study
- I've typically only seen such solutions in highly regulated environments
- [banking]({{<ref "team-topologies#ing-bank">}}), health data, insurance