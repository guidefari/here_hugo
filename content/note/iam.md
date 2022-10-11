---
title: "AWS notes: IAM"
date: 2022-10-11T07:42:20+02:00
description: AWS Identity & Access Management notes 
tags: [aws]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---

- [IAM docs](https://aws.amazon.com/iam/getting-started/)

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