---
date: "2020-09-25"
tags: ["TIL"]
title: "Finishing up Javascript 30"
description: "An attempt to make a habit of finishing courses. A few notes on interesting bits & stuff thought's I'd love to bookmark"
---
# Array Cardio Day 2
### 1. Array.prototype.some()

   Is at least one item true

```js
    const isAdult = people.some(function goes here)
```
### 2. Array.prototype.every()

   Is every item returning a true condition?

```js
   const isAdult = people.every(function goes here)
```
   very similar to Array.prototype.some

### 3. Array.prototype.find()

>Find is like filter, but instead returns just the one you are looking for - Wes Bos

```js
   const comment = comments.find(comment => comment.id === 123438)
```

### 4. Array.prototype.findIndex()

   ```js
   comments.findIndex(comment =>comment.id === 823423)
   ```
   
   This one especially helps when it's time to delete, as you need the index of an item in an array if you want to delete it.
   
   To delete:
   ```js
   comments.splice(index, 1)
   ``` 
admittedly, this was my first encounter with 'splice'

## Spread operator
I've been meaning to read into the spread operator, here's a simple illustration of how one would use it:

```js
const numbers = [1, 2, 3];

console.log(sum(...numbers));
// expected output: 6
```

> Spread syntax (...) allows an iterable such as an array expression or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected - MDN

# Must know Dev Tools tricks
**Code Snippets**

```js
// Grouping together
    dogs.forEach(dog => {
      console.groupCollapsed(`${dog.name}`);
      console.log(`This is ${dog.name}`);
      console.log(`${dog.name} is ${dog.age} years old`);
      console.log(`${dog.name} is ${dog.age * 7} dog years old`);
      console.groupEnd(`${dog.name}`);
    });

```

```js
 // timing
    console.time('fetching data');
    fetch('https://api.github.com/users/wesbos')
      .then(data => data.json())
      .then(data => {
        console.timeEnd('fetching data');
        //nice trick to use with asynchronous data
        console.log(data);
      });
```

```js
// counting

    console.count('Wes');
    console.count('Wes');
    console.count('Steve');
    console.count('Steve');
    console.count('Wes');
```

# Custom HTML5 player

```js
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
```
note on the function: if `mousedown` is true, it moves on to the other end of the operator. the logic being executed here is basically:
```js
progress.addEventListener('mousemove', (e) => mousedown ? scrub(e) : false);
```

That's all for now :)

# Event capture, Propagation, Bubbling and once

Capture -> Target -> Bubble

The capture is top down, while bubbling is the opposite. 

`e.stopPropagation()` stops the event from bubbling up.

## once

```js
button.addEventListener('click', () => {
    console.log('Click!!!');
  }, {
    once: true
  });
```

unbinds the event listener after the first event (the click in this case). In other words, as implied, it only runs once.
