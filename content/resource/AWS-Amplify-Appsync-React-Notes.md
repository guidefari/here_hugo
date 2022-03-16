---
title: "AWS Amplify Appsync React Notes"
date: 2022-03-10T11:34:39+02:00
description: Some notes from udemy course "AWS AppSync & Amplify with React & GraphQL"
tags: [aws, backend, course, notes, nextjs]
---

# [Link](https://www.udemy.com/course/aws-appsync-amplify-with-react-graphql-course/) to the course
- **Disclaimer, most of these notes will be direct quotes from Paulo Dichone, the course instructor**
- The final [repo](https://github.com/pdichone/amplify-appsync-blog-course), for reference along the way.
- [my repo]()
- [notes - graphql fundamentals]({{<ref graphql-fundamentals-notes>}})


# structure & goal of the course
- Fundamentals of Appsync & Amplify
- (Optional) Fundamentals of GraphQL - this is basically a course within a course, especially useful if you're new-ish to GraphQL
- Build a Frontend app using our Appsync backend API

## What is AppSync
- The glue that sits between all the AWS services & client apps. The facilitator.
- **nice to have: [mermaid](https://robb.sh/posts/how-to-use-mermaid-diagrams-in-hugo/) diagram to illsutrate the how the pieces play together**
#### Benefits of using it
* fast setup, & scale as needed
* real-time subscriptions (“for a real time driven application”) & offline access
* unified secured access
* as many data sources as we want

## What is amplify
* a library/framework that helps developers quickly configure, manage, & create apps with features for AWS cloud
* Has a CLI we can use for all this
    * the same things you can do with appsync console, you can also do with amplify cli, with a guided CLI flow. 
* has many modules we can use to speed up development:
    * Auth
    * Storage 
    * API - how to expose your data, via rest API or GraphQL
    * Caching 
    * UI components and more

# Useful docs
Don't you just love some helpful documentation?

- [Amplify](https://docs.amplify.aws/)
- Appsync

## Wed 16 March 2022
- Made Appsync API using AWS console

> the resolver is the entity between the schema, & the datasource.
- worth remembering that you can use multiple AWS datasources with Appsync.
- App sync resolvers make use of `Velocity Template Language (VTL)` - just an FYI, not that it's been learnt in this course:)