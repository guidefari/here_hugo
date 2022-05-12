---
title: "Integration resources"
date: 2022-05-12T08:54:29+02:00
description: Mixed bag of articles, blog posts, videos, docs.
tags: [resource, aws]
tldr: Some of the stuff I'll share is the kind of thing Platform would be responsible for, but I think it'll help to have an appreciation of their workflows & responsibility.
---
### Get an AWS account
I definitely recommend you create a personal AWS account, that way you can properly follow along with the tutorials & quickly prototype/test your own ideas, without being coupled to the backend team. Set aside approx 30 minutes to create & have your account fully functional.

### Big picture
Amplify is only part of the picture, having an appreciation of what it's using under the hood will go a long way. Includes, but not limited to:
- Appsync
- Cognito
- DynamoDB

That's why I've included re

# Courses
- [Paulo Dichone - AppSync & Amplify with React & GraphQL](https://www.udemy.com/course/aws-appsync-amplify-with-react-graphql-course/) - Highly recommend you do the graphql portion of the course too. Even if you did the Wes Bos GraphQL course, this one is a bit more bare bones & has more of a focus on the fundamentals.

# Videos
Our most used video resource was Nader Dabit, and they were pretty helpful & to the point.

{{<youtube wH-UnQy1ltM>}}
{{<youtube p7mwQaGo6P0>}}
{{<youtube bQ1Giqn5G38>}}
{{<youtube _9DFFg-pNss>}}
{{<youtube CeeoFqE2OU0>}}
{{<youtube y7AesEGIRYM>}}

### Youtube playlist with AWS stuff

{{<youtubepl PLy64tqMRKcJS0Leght0C-pkZmhNci0QTh>}}

# Blogs & articles
- [Appsync, Apollo, & react](https://gyandeeps.com/aws-appsync-graphql/)
- [Highly Functional Offline Applications using Apollo Client](https://codeburst.io/highly-functional-offline-applications-using-apollo-client-12885bd5f335)
- [Appsync subscriptions with Apollo client](https://stackoverflow.com/questions/52960709/how-to-use-apollo-client-with-appsync)
  - [Appsync SDK](https://github.com/awslabs/aws-mobile-appsync-sdk-js) - Start here, when you want to implement subscriptions
  - [Apollo Subscription docs](https://www.apollographql.com/docs/react/data/subscriptions/) - Good supporting docs. Implementation here is different, but good to keep in mind

# Other useful bits around the site
- [My notes from the Paulo Dichone course]({{<ref aws-amplify-appsync-react-notes>}})
- [Everything tagged AWS]({{<ref "/tags/aws">}})