---
title: "Graphql Fundamentals Notes"
date: 2022-03-10T13:13:17+02:00
description: 
tags: [graphql, backend, notes]
---

# Links
- [Course](https://www.udemy.com/course/aws-appsync-amplify-with-react-graphql-course/)
- [my repo](https://github.com/txndai/graphql-fundamentals)

## What's happening in `index.js` ?

```js
const express = require("express")
const { graphqlHTTP } = require("express-graphql")

const schema = require("./schema/schema")
const app = express()

// express-graphql middlewear
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
)

app.listen(4000, () => {
  console.log("lift off")
})

```

- Meaning you can access the Graphiql UI @`localhost:4000/graphql`

### Root query in `schema.js`
- your entry point when querying a graph. this is where the traversal starts.

## Types
- **Scalar types:** Single data type, similar to what primitives would be, in other languages. String, int, Float, Bool, ID

#### example: User Type
```js
// Create types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Is a human being. or is it?",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return _.filter(postsData, { userId: parent.id })
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return _.filter(hobbiesData, { userId: parent.id })
      },
    },
  }),
})
```
- Note that the fields `posts` & `hobbies` have hand-written resolvers
- the underscore `_` is lodash
- UserType fields makes use of scalar types on the id, name, age, & profession.

- **Non-nullable Types:**

```js
    comment: { type: new GraphQLNonNull(GraphQLString) },
```

- **Object Types:** 
    - Do you notice the relational aspect of it? the `type` used for posts is defined elsewhere, but refered to by this line `type: new GraphQLList(PostType)` 

```js
    hobbies: {
        type: new GraphQLList(HobbyType),
        resolve(parent, args) {
        return _.filter(hobbiesData, { userId: parent.id })
        },
    },
```

## What mutations look like
- These also exist in `schema.js`
- Exported alongside the `RootQuery`


### Mutation object snippet

```js
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        let user = {
          name: args.name,
          age: args.age,
          profession: args.profession,
        }

        return user
      },
    },
  }
})
```
- All mutation definitions live in a single `Mutation` object, specifically under the `fields` key.

```js
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
```
