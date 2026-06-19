---
title: "AWS Batch"
date: 2023-02-25T10:57:43+02:00
description: Some services and workflows that help with Batch processing in AWS.
tags: [aws, ml]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS%20Batch']
---

# AWS Batch

- Fully managed services
- Allows you to schedule & run batch jobs on AWS compute (EC2, EKS, Fargate, Spot or On-Demand instances too)
- Containers & ML workloads (what's the difference)

# AWS EMR (Elastic Map Reduce)

- [Managed cluster platform that simplifies running big data frameworks.](https://youtu.be/jylp2atrZjc)
  - eg Apache Hadoop
  - Apache Spark
- Has different types of file systems
  - Hadoop Distributed File System (HDFS)
  - EMR File System - uses HDFS, or S3 as the file system in your cluster
  - Local disk

## When would I use EMR over Batch?
