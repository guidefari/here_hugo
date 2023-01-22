---
title: "AWS"
date: 2021-11-29T09:11:21+02:00
description: Top level AWS notes & resources. Mostly focused on Solutions Architect Associate
tags: [aws, backend, resource]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=AWS']
---

# Resources

- [All AWS notes]({{<ref "/tags/aws">}})
- [Cantrill SAA-C03 notes]({{<ref aws-sa-cantrill>}})

#### could use

- [the freecodecamp video](https://youtu.be/Ia-UEYYR44s)
- [syllabus](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf),
- a reference book, a good [certification guide](https://www.informit.com/store/aws-certified-solutions-architect-associate-saa-c02-9780137325214).
- then do practice questions/exams at the end of it, till I'm confident enough to take the actual exam.
- make sure to do labs for each topic.
- [flash cards with practice questions](https://quizlet.com/144321056/aws-certified-solutions-architect-associate-practice-questions-flash-cards/)

### resources

{{<youtube nt1-ZIX_s5U>}}

- [AWS Educate](https://aws.amazon.com/education/awseducate/)
- [AWS solutions architect homepage](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
  - [ ] Review the solution architecture [exam blueprint](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)
  - [ ] [Sample questions](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf)
- [a cloud guru](https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c02-4KYV)
- [tutorialsdojo](https://portal.tutorialsdojo.com/courses/aws-certified-solutions-architect-associate-exam-video-course/)
- [exampro](https://www.exampro.co/aws-exam-solutions-architect-associate): I think most of this course is on freecodecamp youtube.
- [practice tests udemy](https://www.udemy.com/course/aws-certified-solutions-architect-associate-amazon-practice-exams-saa-c02/)
- [more practice exams](https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate/?couponCode=FEB_22_GET_STARTED)
- [well architected white paper](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) - **a must read**, apparently
{{<youtube Ia-UEYYR44s>}}

## Helpful youtube playlist

{{<youtube 10JKpg-eqZU>}}

## SNS & SQS

{{<youtube c_WNBmEc6EE>}}

## DynamoDB

> The main reason for using a single table in DynamoDB is to retrieve multiple, heterogenous item types using a single request.
> [src](https://www.alexdebrie.com/posts/dynamodb-single-table/)

- {{<youtube KYy8X8t4MB8>}}
- **GSI**: Global Secondary Indexes. A way to further partition your data, to make for more efficient queries. [docs here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html). Useful as your access patterns get more complex.
- **Index Overloading:**
- **RCU**: Read Capacity Units
- **WCU**: Write Capacity Units
  - [Read/Write Capacity docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html)

#### The downsides of single table design

Taken from the [source](https://www.alexdebrie.com/posts/dynamodb-single-table/) of the quote above.

1. It can be **difficult to add new access patterns**
1. **Difficulty of analytics**

#### to read

- [ ] [NoSQL Design for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html#bp-general-nosql-design-concepts) - docs from AWS
- [x] [Faux-SQL or NoSQL? Examining four DynamoDB Patterns in Serverless Applications](https://www.alexdebrie.com/posts/dynamodb-patterns-serverless/#faux-sql)

### Cloudfront

- Regional edge cache

## DevOps

> DevOps is the combination of **cultural philosophies**, practices, and tools that increases an organization’s ability to **deliver applications and services at high velocity**: evolving and improving products at a faster pace than organizations using **traditional software development and infrastructure management processes**. This speed enables organizations to better serve their customers and compete more effectively in the market.
> [src](https://aws.amazon.com/education/awseducate/)

### Blue/Green deployment

Can also be referred to as `A/B deployment` where two identical hardware environments, where 1 remains idle, & the other is active & serving end users.

- [ ] How can this be achieved on AWS?

#### Questions to answer from the labs

- what is continuous delivery & its benefits
- CodeCommit & MFA
- IAM - need to do a deep dive on this
