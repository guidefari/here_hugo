---
date: "2020-12-12"
tags: ["TIL", "notes"]
title: "TIL(Friday 12 Dec 2020)"
summary: "Some notes from Andy"
---
# Old code
```jsx
{characters.map((character) => {
	<h4>{character.name}</h4>
})}
```
This didn't render the JSX elements

# Fix from Andy
```jsx
{characters.map((character) => {
	return (
		<h4 key={character.name}>{character.name}</h4>
	)
})}
```
This one is rendering and working just fine

# another suggestion from Andy
```jsx
{characters.map((character) => <h4 key={character.name}>{character.name}</h4>)}
```

# This should also work
[source for the next code blocks](https://jaketrent.com/post/javascript-arrow-function-return-rules/#:~:text=For%20an%20arrow%20function%20to,code%20without%20a%20resulting%20value.)
```js
const implicit = () => 'awesome'
implicit()    // returns 'awesome'
```
>This also works if the function body is defined on multiple lines.
```js
const implicit = () =>
  'awesome'
  
implicit()    // returns 'awesome'
```

By this logic, using multiline return in my initial jsx code blocks, I can write that little block like this with no issue: 
```jsx
{characters.map((character) => 
	<h4 key={character.name}>
		{character.name}
	</h4>
)}
```
`status` - confirmed, it works. This multiline implicit return is also seen on some [react documentation](https://reactjs.org/docs/lists-and-keys.html#keys).
# What I'm used to
```jsx
{characters.map((character) => (
		<h4 key={character.name}>{character.name}</h4>
))}
```
This one is also rendering and working just fine.

# Return statement

> When a `return` statement is used in a function body, the execution of the function is stopped. - [source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return)
> If the value is omitted, undefined is returned instead.

### Interrupt a function
> A function immediately stops at the point where return is called.

# .map()
The map() function expects a callback as the argument and executes it once for each element in the array.

from the callback parameters, you can access:
1. current element
2. current index
3. the array itself

```js
const num = [3, 8, 11, 7, 5];

const num2x = num.map((n) => n * 2);

console.log(num2x); // [6, 16, 22, 14, 10]
```

# Arrow function
[source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

`(a, b) => a + b + 100;` - displayed here is implicit return

> if the body requires additional lines of processing, you'll need to re-introduce brackets PLUS the "return" (arrow functions do not magically guess what or when you want to "return"):

```js
(a, b) => {
  let chuck = 42;
  return a + b + chuck;
}
```