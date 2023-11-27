---
title: "TIL: Cognitive Complexity"
date: 2023-11-27T18:43:32+02:00
description: Refactor this function to reduce its Cognitive Complexity
tags: [til, design]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Cognitive+Complexity']
---

I saw some nested if statements somewhere in the codebase, and [sonarlint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode) said
`Refactor this function to reduce its Cognitive Complexity from 17 to the 15 allowed. [+8 locations]sonarlint(typescript:S3776)`

Naturally, looked into it a bit more, and here's some stuff I found, figure it may be of interest to others.
* [stack overflow](https://stackoverflow.com/questions/62815733/refactor-this-method-to-reduce-its-cognitive-complexity-from-21-to-the-15-allowe)
* [Ann Campbell cognitive complexity whitepaper](https://www.sonarsource.com/docs/CognitiveComplexity.pdf)
* [Google search](https://www.google.com/search?q=Refactor%20this%20function%20to%20reduce%20its%20Cognitive%20Complexity%20from%2017%20to%20the%2015%20allowed.%20%5B+8%20locations%5Dsonarlint%28typescript:S3776%29)

It’s nice to have the word for this, because every time I see deeply nested flow control statements, my gut feel is usually “this is hard to read/understand” - usually because it’s challenging to visualise all the possible states that the piece of code could be in.

# From Armand
#### Instead of doing:
```ts
let descriptiveReason = ""
switch(reason) {
  case "something":
    descriptiveReason = "It was something"
    break;
  case "something_else":
    descriptiveReason = "It was something else"
    break;
  default:
    descriptiveReason = "It was nothing"
}

```


#### Do:
```ts
const descriptors = {
  "something": "It was something",
  "something_else": "It was something else",
  "nothing": "It was nothing"
}

let descriptiveReason = descriptors[reason || "nothing"]
```
