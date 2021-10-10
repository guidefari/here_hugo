---
date: "2020-10-13"
tags: ["TIL"]
title: "TIL(Tuesday 13 October 2020)"
summary: "Some code snippets"
---
Twitter can be really useful at times, it's where I found [this article](https://blog.bhanuteja.dev/epic-react-javascript-you-need-to-know-for-react), titled **Javascript You Need To Know For React**.

## Shorthand property names
```js
const id = 2
const name = 'Bhanu'
const count = 2

const user = {
    id,
    blogs: count,
    name,
}
```
I've seen & used this in the wild, just didn't know what it was.

## Optional Chaining
> Consider the expression `a?.b.`
> This expression evaluates to `a.b` if a is not `null` and not `undefined`, otherwise, it evaluates to `undefined`
> You can even chain this multiple times like `a?.b?.c`
> - [Bhanu Teja Pachipulusu](https://twitter.com/pbteja1998)

## Nullish Coalescing Operator
> Consider the expression `a ?? b`. This evaluates to `b` if `a` is `null` or `undefined`, otherwise, it evaluates to `a`
> - [Bhanu Teja Pachipulusu](https://twitter.com/pbteja1998)

Another one I've seen & used in the wild, with no idea what it was.

## Array.prototype.reduce()
> The array reduce method reduces the array of values into a single value. It executes the callback function for each value of the array.
> - [Bhanu Teja Pachipulusu](https://twitter.com/pbteja1998)

```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

### JavaScript Modules and how to effectively work with Export Import
Well written [article](https://blog.greenroots.info/javascript-modules-and-how-to-effectively-work-with-export-import-cka7t5z6s01irx9s16st6j51j) by [Tapas Adhikary](https://twitter.com/tapasadhikary). Concise.
