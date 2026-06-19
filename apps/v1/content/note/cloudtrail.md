---
title: "AWS Cloudtrail"
date: 2023-01-16T08:08:23+02:00
description: Actions taken by a user, role, or an AWS service are recorded as events in CloudTrail. Events include actions taken in the AWS Management Console, AWS Command Line Interface, and AWS SDKs and APIs.
tags: [aws, cloudtrail]
images: ['https://images-here-hugo.vercel.app/api/og-image?title%3DAWS%20Cloudtrail']
---

- CloudTrail logs calls between AWS services
- **governance, compliance, operational auditing, and risk auditing** are keywords relating to CloudTrail
- When you need to know who to blame think CloudTrail
- CloudTrail by default logs event data for the past 90s days via Event History
- To track beyond 90 days you need to create Trail
- To ensure logs have not been tampered with you need to turn on Log File Validation option
- CloudTrail logs can be encrypted using KMS (Key Management Service) - **a key costs $1**
- CloudTrail can be set to log across all AWS accounts in an Organization and all regions in an account.
- CloudTrail logs can be streamed to CloudWatch logs
- Trails are outputted to an S3 bucket that you specify
- CloudTrail logs two kinds of events: **Management Events and Data Events**
  - Management events log management operations eg. AttachRolePolicy
  - Data Events log data operations for resources (S3, Lambda) eg. GetObject, DeleteObject, and PutObject. Data Events are disabled by default when creating a Trail.
- Trail logs in S3 can be analyzed using Athena
