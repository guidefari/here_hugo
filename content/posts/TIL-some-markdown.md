---
title: "TIL Some Markdown"
date: 2021-10-12T09:06:49+02:00
tags: [til, markdown, nextjs, firebase]
description: some new tricks learnt from Wes Bos' Mastering Markdown
---

# text decoration
- you can use underscore `_` for __bold__ & _italics_

# links

## make a link clickable
- if you just have a link like `https://goosebumps.co.zw`, angle brackets `< >` wrapped around the link can make it clickable.
  - like so <https://goosebumps.co.zw>
  - (seems like Hugo automatically makes a link clickable, I typed https://goosebumps.co.zw with no angle brackets here & it's already clickable.)

## add title tag to a link
the second parameter after the link is a title
- [goosebumps](https://goosebumps.co.zw "well well well, how the turn tables....")

## what if you have a super long link?
you can do [this][1] 
- this is a more _variable_ like format

# lists

## ordered lists
the numbers used on your ordered list don't actually have to be incremental.
1. hey
1. still 1
1. another one
2. this is a two
92. this is a 92

# code blocks
## diff

```diff
var x = 100
- var y = 200
+ var y = 201
```

# tables

|heading one|heading 2|
|:----------|:---------:|
|row 1|column 2 - center aligned|
|row 2 - left aligned|column 2|

# cloud firestore
trying to change `Cloud Firestore` rules from [Brave Browser][brave] will result in error `Error saving rules - An unknown error occurred
`. Using chrome fixes this error

## links from the web
- add [sass support][sass] to nextjs


[1]: https://tomcritchlow.com/2019/09/23/workshops/
[sass]: https://nextjs.org/docs/basic-features/built-in-css-support#sass-support
[brave]: https://brave.com/