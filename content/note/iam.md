---
title: "AWS notes: IAM"
date: 2022-10-11T07:42:20+02:00
description: IAM provides Identity for anything requiring long term AWS access. Humans, services, or applications (these are referred to as principals).
tags: [aws, iam]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS%20notes%3A%20IAM']
---

- [IAM docs](https://aws.amazon.com/iam/getting-started/)

## IAM basics

- IAM provides Identity for anything requiring long term AWS access. Humans, services, or applications (these are referred to as **principals**).
- Authentication is done via **User & Password**, or **Access keys**
- IAM allows us to practice **Principle of least privilege**. Meaning an IAM account starts with no access to any AWS resources
- It is a globally resilient service. Exists securely in all AWS regions
- Each AWS account has its own instance of IAM, that is fully trusted by the account, the same way the root user is.
- IAM admin user is what's used to create the other identities
- ARN - Amazon Resource Name uniquely identify resources in an AWS account
- **5 000 IAM users per account** - Identity Federation or IAM roles fixes this
- External accounts/identities cannot be directly used to access AWS resources

### The 3 different types of Identity objects IAM can create

1. **Users**: **Humans** or **applications** that need access to the AWS account
2. **Groups**: **Collections** of **related users**
3. **Roles**: Can be used by **AWS services**, or **granting external access** to your AWS account

### IAM policy aka Policy Document

- Objects that can be used to allow or deny access to AWS services. You attach these to users, groups, or roles for them to take effect.

```json

{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Sid":"statement1",
         "Effect":"Allow",
         "Action":[
            "s3:*"
         ],
         "Resource":[
            "arn:aws:s3:::*"
         ]
       },
       {
         "Effect": "Deny",
         "Action": "s3:*",
         "Resource": [
           "arn:aws:s3:::catgifs", "arn:aws:s3:::catgifs/*"
         ]
       }
    ]
}
```

## Priority of Effects

Helpful to remember when looking at overlapping rules on the IAM policies.

1. Explicit Deny
2. Explicit Allow
3. Default Deny (Implicit)

## Inline vs Managed Policies

- Inline policies belong & are attached to one user/group, while managed policies are 'reusable'
- AWS managed policy
- Custom policy

## IAM User vs IAM Role

- IAM is long term identity
- IAM role is for short term identity

## IAM Groups

- IAM user can be a member of 10 groups max
- You can add IAM users to groups, and add permissions to Groups
- Groups are not a real identity. They can't be referenced as a **principal** in a policy.

# IAM Roles

- Good for granting temporary access to AWS resources
  - When you assume a role, you get temporary security credentials - these are created by STS, & are similar to an access token
- Only after a role is assigned to an AWS identity (user or group) is the policy attached to the role, which can be assumed by the principal.
- Trust Policy is required when dealing with Roles. It's assigned to the identity who can assume the role
{{<youtube UOWx-dy9Q9c>}}

---

- Because roles are real identities, they can be referenced from resources policies

## Good use cases for roles

- AWS services
