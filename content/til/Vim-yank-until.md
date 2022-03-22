---
title: "Vim - How to Change, Yank, or Delete Until"
date: 2022-03-22T21:17:07+02:00
description: I've been learning vim for some weeks now, & while editing some text, I thought "hey, how do I delete all this text before the comma?"
tldr: I learnt some new vim ninja moves, how to yank, change, or delete until a thing.
tags: [til, vim]
---

## The sentence I was trying to edit...

> This is the stuff I want to delete, the text this side of the comma stays safe.

## The commands
```
"d" "/" "," "<Enter>"
```

{{<giphy 5wWf7H89PisM6An8UAU>}}
### Let me break it down
This is how it sounds in my head: 
> Delete until you find the comma

Here's the beauty of it, that comma can be replaced by a full string, so this is powerful pair of command & motion.


## Composing commands & motions
Is starting to feel more intuitive :)

## Source of the magic
- [Stack exchange](https://unix.stackexchange.com/questions/571489/vim-how-to-yank-util-phrase)