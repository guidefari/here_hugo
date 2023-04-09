---
title: "Book Notes: Refactoring UI"
date: 2020-09-24
description: "highlights, quotes, & other interesting bits from Refactoring UI"
tags: [book, notes, design]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---


## Refactoring UI
I read this book about a week ago, and made a few quick notes as I was going through it. I'll attempt to expand on a couple of the notes if necessary. The book's [website](https://refactoringui.com/) also has some interesting bits.

- on font color, pick a dark and two greys. ie primary, secondary, tertiary. Remember, grey looks weird if the background is coloured. Elaborated on point 2 of [this](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886) article.
- instead of using grey text on colored background, use a new color that's based on the background color. explained further in the next point
> Making the text closer to the background color is what actually helps create hierarchy, not making it light grey. - Steve Schoger
- two font weights for UI is enough. I'm pretty sure most of my earlier projects used more than two font weights, hehe awkward.
- use font size as last resort, when trying to establish hierarchy - Also spoken about in the article above, it's the first point mentioned.
- ditch hex for hsl. taking the use case above as an example, use the same hue and adjust saturation and lightness until I find my 'grey' replacement color.
- when designing buttons: primary, secondary, tertiary.
- align font to baseline not center, most notably if you're using different font sizes close to each other.