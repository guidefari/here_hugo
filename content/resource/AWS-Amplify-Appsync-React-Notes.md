---
title: "AWS Amplify Appsync React Notes"
date: 2022-03-10T11:34:39+02:00
description: Some notes from udemy course "AWS AppSync & Amplify with React & GraphQL"
tags: [aws, backend, course, notes, nextjs, resource]
---

# [Link](https://www.udemy.com/course/aws-appsync-amplify-with-react-graphql-course/) to the course
- **Disclaimer, most of these notes will be direct quotes from Paulo Dichone, the course instructor**
- The final [repo](https://github.com/pdichone/amplify-appsync-blog-course), for reference along the way.
- [my repo](https://github.com/txndai/amplify-course)
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
- [Appsync](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html)

## Wed 16 March 2022
- Made Appsync API using AWS console

> the resolver is the entity between the schema, & the datasource.
- worth remembering that you can use multiple AWS datasources with Appsync.
- App sync resolvers make use of `Velocity Template Language (VTL)` - just an FYI, not that it's been learnt in this course:)
- Used [`Amplify CLI`](https://docs.amplify.aws/cli/) to create A `GraphQL` api (accessible via [AppSync](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html)), that makes use of [DynamoDB](https://aws.amazon.com/dynamodb/).

## Thur 17 March 2022
- Query data in Nextjs app using an `Amplify` generated Graphql query, and `API` imported from `Amplify`

```js
import { API } from "aws-amplify"
import { listPosts } from "../src/graphql/queries.ts"

async function fetchPosts() {
const postData = await API.graphql({
    query: listPosts,
})

setPosts(postData.data.listPosts.items)
}

```
This is how easy it is to get data into your app when you use Amplify:)

### Auth with Cognito
 ```bash
amplify add auth
```

- Updated the API to have Public & Private access, using Cognito user pool for auth.

```bash
amplify update api
```
- What our schema now looks like, with the auth (`@auth(...)) directive specifying that an owner has full access to `Posts`, and the `public` can only `read`.
```graphql
type Post @model 
@auth(
  rules: [
    {allow: owner, ownerField: "username"},
    {allow: public, operations: [read]}
  ]
){
  id: ID!
  title: String!
  content: String!
  username: String 
  coverImage: String
}
```

### Saving images with S3
```bash
amplify add storage
amplify add hosting
``` 

### Mock API
- [docs](https://docs.amplify.aws/cli/usage/mock/)
>In order to quickly test and debug without pushing all changes in your project to the cloud, Amplify supports Local Mocking and Testing for certain categories including API (AWS AppSync), Storage (Amazon DynamoDB and Amazon S3), and Functions (AWS Lambda).

- Big big time saver:)

## AppSync subsciptions
- Some real time goodness. Be weary of this as it is expensive on memory. don't use it where it's not necessary
- [docs](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html) - what does amplify datastore version of this look like?

```graphql
type Subscription {
  newOnCreatePost: Post @aws_subscribe(mutations: ["createPost"])
  #newOnUpdatedPost: Post @aws_subscribe(mutations: ["updatePost"])
}
```