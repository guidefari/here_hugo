---
title: "Course Notes: AWS Solutions Architect Cantrill"
date: 2022-07-04T09:18:48+02:00
description: Some notes from the learn with Cantrill course
tags: [resource, aws, notes]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Course%20Notes%3A%20AWS%20Solutions%20Architect%20Cantrill']
---

## AWS Accounts
- All IAM accounts start with no access
  - for access to billing: **as a root user** you need to [explicitly allow IAM permission](https://aws.amazon.com/premiumsupport/knowledge-center/iam-billing-access/).
- AWS organisations & multiple account management - a thing that'll be taught later in the course.

### Gmail Catch-all address (dynamic alias)
You'll need to create multiple AWS accounts, General (Management), Prod, Testing etc. Simple way to do this is using Gmail's catch all. 

Meaning if your address is `dude@gmail.com`, you can use `dude+AWSManagement@gmail.com` , `dude+AWSProd@gmail.com` and whatever else, and still have them all refer to the single Gmail account.

## IAM basics
IAM allows us to practice **Principle of least privilege**

- It is a globally resilient service. Exists securely in all AWS regions
- Each AWS account has its own instance of IAM, that is fully trusted by the account, the same way the root user is.
- IAM admin user is what's used to create the other identities

### The 3 different types of Identity objects IAM can create
1. **Users**: **Humans** or **applications** that need access to the AWS account 
2. **Groups**: **Collections** of **related users**
3. **Roles**: Can be used by **AWS services**, or **granting external access** to your AWS account

### IAM policy aka Policy Document
Objects that can be used to allow or deny access to AWS services. You attach these to users, groups, or roles for them to take effect.