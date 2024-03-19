---
title: "Code should communicate intent"
date: 2024-03-19T06:50:23+02:00
description: It's one thing to write code that does the thing. It's another to write code that tells the reader what it's doing
tags: [design, dx]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Code%20should%20communicate%20intent']
---

It's one thing to write code that does the thing.
It's another to write **code that tells the reader what it's doing** - which I think can hint at why it's doing what it's doing?

I like to think of this as **code that communicates intent.**

This is a common scenario - getting into your own codebase after a few weeks and wondering "wtf is going on over here?". We're trying to reduce the intensity of that feeling as much as possible.

# The Value of communicating intent
I've heard "A mark of good code is how easy it is to change".
A common thread I've noticed about code that's easy to change is that it communicates its intent clearly. You can **quickly** identify where your changes go in.

Code that communicates intent helps the reader to build mental models to reason about the logic in front of them.
This can give you more **confidence** in the changes that you make

Code that communicates intent simplifies:
- modifying functionality
- debugging
- collaboration 
- onboarding

Simplifying all of this **reduces the cost of maintaining the codebase**.

# How it can be done
- Descriptive naming. Well named types, interfaces, variables, & functions.
- As a continuous effort. [Comprehension refactoring](https://martinfowler.com/articles/workflowsOfRefactoring/#comprehension) is a tactic I'd recommend in your day to day workflow.
- Tests
	- These are a good opportunity to give someone the model to reason about the domain being tested
	- > For tests to drive development they must do more than just test that code performs its required functionality: they must clearly express that required functionality to the reader. **Nat Pryce & Steve Freeman - Are your tests really driving your development?**
	- this video does a really good job at illustrating how tests can be used to communicate intent. {{<youtube MWsk1h8pv2Q>}}

# Examples

### Bad
```ts
// ambiguous-ish function name
function calcRect(l: number, w: number): number {
    return l * w;
}

// single letter variable names
const l = 5;
const w = 10;
const a = calcRect(l, w);
```

{{< rawhtml >}} 

<video width=100% controls >
    <source src="https://d20tmfka7s58bt.cloudfront.net/memes/brotha-ew.mp4" >
    Your browser does not support the video tag.  
</video>

{{< /rawhtml >}}

---

### Good
```ts
// Descriptive naming
function calculateAreaOfRectangle(length: number, width: number): number {
    return length * width;
}

const rectangleLength = 5;
const rectangleWidth = 10;
const area = calculateAreaOfRectangle(rectangleLength, rectangleWidth);

```