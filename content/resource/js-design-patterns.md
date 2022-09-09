---
title: "Resource: A Tour of Javascript & React Design Patterns"
date: 2022-09-01T17:32:33+02:00
description: 
tags: [resource]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Resource%3A%20A%20Tour%20of%20Javascript%20%26%20React%20Design%20Patterns']
---

# Singleton Pattern
- [Stackblitz](https://stackblitz.com/edit/node-uyz4xp?file=index.js)

```js
class DBConnection {
  constructor(uri) {
    if (instance) {
      throw new Error('This item already exists')
    }
    this.uri = uri;
    instance = this
    
  }

  connect() {
    console.log(`DB ${this.uri} has been connected!`);
  }

  disconnect() {
    console.log('DB disconnected');
  }
}

const connection = new Object.freeze( DBConnection('mongodb://...'));
export default connection

```

## The Code above can also be written directly as an object

```js

```

##  Proxy Pattern

### Useful use cases
- The intercepting nature of using javascript's built in Proxy Object, means a solid use case for them is validation.
  - Remember you don't have typescript at runtime, lol. This is a good way to get some of those type safety benefits, in the form of input validation.
- Also makes it easy to log things, when getting or setting values. Interesting to think of right now, with observability being a recurring topic of discussion lately.