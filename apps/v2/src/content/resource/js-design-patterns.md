---
title: "Resource: A Tour of Javascript & React Design Patterns"
date: 2022-09-01T17:32:33+02:00
description: 
tags: [resource]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Resource%3A%20A%20Tour%20of%20Javascript%20%26%20React%20Design%20Patterns']
---

# Links
- [Frontend masters](https://frontendmasters.com/courses/tour-js-patterns/)
- [Course notes](https://javascriptpatterns.vercel.app/patterns)

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

## Singleton can also be written directly as an object

```js
let counter = 0;

export default Object.freeze({
  getCount: () => counter,
  increment: () => ++counter,
  decrement: () => --counter,
});
```

#  Proxy Pattern

```ts
import { isValidEmail, isAllLetters } from './validator.js';

const user = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  age: 42,
  email: 'john@doe.com',
};

const userProxy = new Proxy(user, {
  get: (obj, prop) => {
    return `${new Date()} | The value of ${prop} is ${Reflect.get(obj, prop)}`;
  },
  set: (obj, prop, value) => {
    if (prop === 'email') {
      if (!isValidEmail(value)) {
        console.log('Please provide a valid email.');
        return false;
      }
    }

    if (prop === 'username') {
      if (value.length < 3) {
        throw new Error('Please use a longer username.');
      } else if (!isAllLetters(value)) {
        throw new Error('You can only use letters');
      }
    }

    if (prop === 'age') {
      if (typeof value !== 'number') {
        throw new Error('Please provide a valid age.');
      }

      if (value < 18) {
        throw 'User cannot be younger than 18.';
      }
    }

    return Reflect.set(obj, prop, value);
  },
});

```

### Useful use cases
- The intercepting nature of using javascript's built in Proxy Object, means a solid use case for them is validation.
  - Remember you don't have typescript at runtime, lol. This is a good way to get some of those type safety benefits, in the form of input validation.
- Also makes it easy to log things, when getting or setting values. Interesting to think of right now, with observability being a recurring topic of discussion lately.

# React Custom hooks
using hooks to share some stateful logic

```jsx
export default function useListings() {
  const [listings, setListings] = React.useState(null);

  React.useEffect(() => {
    fetch('https://house-lydiahallie.vercel.app/api/listings')
      .then((res) => res.json())
      .then((res) => setListings(res.listings));
  }, []);

  return listings;
}

```