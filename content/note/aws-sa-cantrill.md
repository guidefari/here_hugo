---
title: "Course Notes: AWS Solutions Architect Cantrill"
date: 2022-07-04T09:18:48+02:00
description: Some notes from the learn with Cantrill course
tags: [resource, aws, notes]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Course%20Notes%3A%20AWS%20Solutions%20Architect%20Cantrill']
---
# Links
- [Course](https://learn.cantrill.io/p/aws-certified-solutions-architect-associate-saa-c03)
- [Github Repo](https://github.com/acantril/aws-sa-associate-saac03)

## AWS Accounts
- All IAM accounts start with no access
  - for access to billing: **as a root user** you need to [explicitly allow IAM permission](https://aws.amazon.com/premiumsupport/knowledge-center/iam-billing-access/).
- AWS organisations & multiple account management - a thing that'll be taught later in the course.

### Gmail Catch-all address (dynamic alias)
You'll need to create multiple AWS accounts, General (Management), Prod, Testing etc. Simple way to do this is using Gmail's catch all. 

Meaning if your address is `dude@gmail.com`, you can use `dude+AWSManagement@gmail.com` , `dude+AWSProd@gmail.com` and whatever else, and still have them all refer to the single Gmail account.
