---
title: "Code should communicate intent"
date: 2024-03-19T06:50:23+02:00
description: It's one thing to write code that does the thing. It's another to write code that tells the reader what it's doing
tags: [design, dx, refactoring, process]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Code%20should%20communicate%20intent']
---
### Acknowledgements
Props to [Ibra](https://ibrathesheriff.com) & [Tyler](https://www.tylerpillay.co.za/) for being my sounding board and first editors for this one 👊🏽


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

Simplifying all of this **reduces the cost of maintaining the codebase**. An example from Ibra: 

```python
item = 6

# Bad
if item in [1, 2, 3, 4, 5]:
  return True
else:
  return False

# Good
arraySize = 5
for num in range(1, arraySize + 1):
  if item == num:
    return True
return False
```
To change the second snippet to an array that looks like `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, I just change `arraySize` to 10

# How it can be done
- **Descriptive naming**. Well named types, interfaces, variables, & functions.
- As a continuous effort. [Comprehension refactoring](https://martinfowler.com/articles/workflowsOfRefactoring/#comprehension) is a tactic I'd recommend in your day to day workflow.
  - [Ping pong pair programming](/pppp) is a good way to build comprehension refactoring into your workflow. Fresh eyes on the code every few hours. I've enjoyed this in the past.
- **Tests**
	- These are a good opportunity to give someone the model to reason about the domain being tested
	- > For tests to drive development they must do more than just test that code performs its required functionality: they must clearly express that required functionality to the reader. **Nat Pryce & Steve Freeman - Are your tests really driving your development?**
	- this video does a really good job at illustrating how tests can be used to communicate intent. {{<youtube MWsk1h8pv2Q>}}
- **Patterns**
	- Every codebase has some established patterns. Most times, the sensible thing to do is to lean into the pattern
	- This reduces cognitive load on future maintainers
	- **File Structure**: A general rule of thumb - [code that works together lives together](https://swizec.com/blog/if-it-works-together-it-lives-together/).

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
## Good & Bad varies as context changes
Gauging what good looks like will be subjective.

A few questions that can help you ground your reasoning:
- Programming language & framework of choice. What are the dogmas & known patterns? Tyler pointed out how single variable names in small, well scoped functions are a norm in Go.
- Areas of expertise of everyone contributing to the codebase. A team of exclusively frontend devs is different to frontend + fullstack, or frontend + majority backend
- Purpose of the code: is it a throw-away PoC or the foundation of a feature
# Related reading
- [Sandro Maglione on Complexity at Scale](https://www.sandromaglione.com/articles/scale-complexity-in-software-applications)
- [If it works together it lives together](https://swizec.com/blog/if-it-works-together-it-lives-together/)
- [Delightful react folder structure](https://www.joshwcomeau.com/react/file-structure/)
- [My notes on cohesion](/cohesion)