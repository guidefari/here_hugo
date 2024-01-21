---
title: "Book Notes: Tidy First"
date: 2024-01-04T23:05:19+02:00
description: "highlights, quotes, & other interesting bits from Tidy First"
tags: [book, notes, design, refactoring]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Tidy+First']
---

We'll start by exploring a few tactics that can help you tidy up your codebase.

# Naming Variables & Constants
Names can go a long way in reducing cognitive load, by expressing 
the intent of a symbol

> In this tidying you are taking your hard-won
> understanding and putting it back into the code. This sets you up to
> change either one of those expressions more easily (because now they are
> separated), and to read them more quickly next time the code needs to
> change.

Pretty sure I've heard Martin Fowler say this too. [Comprehension refactoring](/refactoring).

Closely related to **explaining constants**

> Create a symbolic constant. Replace uses of the literal constant with the symbol.

# Keep tidying & Behaviour changes separate
Makes things easy to review later.
This separation can be done at a commit, & branch level.

# Chunk statements
> This one wins the prize for simplest tidying. You’re reading a big chunk
> of code and you realize, “Oh, this part does this and then that part
> does that.” Put a blank line between the parts.

This one reminds me of one of the funniest, but valid comment I saw on
a PR once:
> Your code is breathing too much

Pretty sure this was Niel😂 He was referring to too many empty lines
in between stuff in the function body. So there's obviously a balance to strike here, when chunking statements.

# Lots of little pieces
Another vector you gotta balance, is when deciding the size of things,
and where to draw boundaries & split stuff up. How you split things up is 
also important for [cohesion](/cohesion), folder structure, collocating related bits.

Remember:
> The biggest cost of code is the cost of reading and understanding it, not the cost of writing it.

# On Deciding when to tidy
> Just being able to identify that a tidying applies and applying it
> doesn’t mean you’ve mastered tidying. The title of this book is Tidy
> First?, with emphasis on the question mark. I wanted to acknowledge
> that just because you can tidy doesn’t mean you should tidy.

When looking at tidying up in relation to behaviour change,
you have the choices to tidy first, after, later, & never.

## Never
> it’s rare that code truly never needs to have its behavior changed. However, it does happen. For truly static systems, “If it ain’t broke, don’t fix it” reasonably applies.

## Later
> The mythological status of tidying later is used as justification for tidying too much now, whether that is before or after

> What would you do if you temporarily, provisionally believed that there
> was enough time to do your work? You might make a list of messes to tidy
> later
> Then later, rather than jumping feverishly to the next feature to implement, you might glance at your Fun List and think, “I have an hour. I don’t want to start something big. Why don’t I take a crack at item 4?” And then you might.
> That’s tidying later. It can happen. Try it. Then it will happen.

### Using 'refactoring later' for energy management
> Software development is a human
> process. We are humans with human needs. Sometimes I just don’t have the
> energy to tackle a new feature, but I want to work. Picking an item off
> the Fun List and tidying it brings me joy. Don’t underestimate how much
> better you are as a programmer when you’re happy

This last one resonates. I've said a few times, I've grown to enjoy
refactoring.
![](https://d20tmfka7s58bt.cloudfront.net/refactoring-tweet.png)

## After
Sometimes, hindsight is the best teacher for how you could have tidied something.
After the behaviour change, you start to see how things could have been structured in a way that simplified the behaviour change.

If you're likely to touch that area of code again in the near future, it's a good idea to consider investing in tidying up. Soon after has the added advantage of "I have the context loaded in my memory right now".

A vector to consider is "how long will the tidying take, when compared to behaviour change?". If you spent an hour on logic, an hour cleaning up is fair game, however if tidying will take a week after an hour of logic, that goes to **the fun list**.
So you want
> The cost of tidying to roughly be in proportion to the cost of 
> behaviour changes

## First
> In general, bias toward tidying first, but be wary of tidying becoming an end in itself.

> The tidyings I’ve cataloged are tiny precisely so you don’t have to think too hard about applying them.

Simple rules of thumb on when it's appropriate to tidy first:
- If you know what to tidy and how
- It'll pay off immediately (improved comprehension, or cheaper behaviour change)

# Economics
This was my favourite part of the book.

## A dollar today > A dollar tomorrow

> In the scope of this book, the time value of money encourages tidy after
> over tidy first. If we can implement a behavior change that makes us
> money now and tidy after, we make money sooner and spend money later.

> As noted earlier, sometimes tidying first means the total cost of tidying
> first + behavior change is less than the cost of the behavior change
> without tidying. Always tidy first in such a case.

## Options vs Cashflows
> Discounted cash flow tells us to make money sooner with greater likelihood and spend money later with less likelihood. Don’t tidy first. That’s spending money sooner and earning money later.

> Options tell us to spend money now to make more money later (even if we don’t currently know exactly how). Absolutely tidy first (when it creates options).

To reiterate, the tidy first formula:
> cost(tidying) + cost(behavior change after tidying) < cost(behavior change without tidying)

When there's a series of related behaviour changes:
> You might still want to tidy first, even though short-term economics discourage you. You may be implementing a series of behavior changes, all of which benefit from the tidying. Amortizing the cost of the tidying across all the changes might make sense, even discounting the cash flows.

On managing energy & emotions again:
> Or, since software design is an exercise in human relationships and
> we’re talking about our relationship with ourself at the scale of
> tidying, you might tidy first just because it makes the subsequent
> behavior changes more pleasant. A little bit of this “tidying as
> self-care” is justified. Just recognize that you are going counter to
> your economic incentives.

# Trap door vs Reversible decisions
Having an appreciation of this has improved my decision making speed.
It's easier to determine how much time is appropriate to spend pondering on a thing.

> In general, we should treat reversible decisions differently than
> irreversible decisions. There’s great value in reviewing, double-checking,
> triple-checking irreversible decisions.


## Reversible decisions

> Most software design decisions are easily reversible.

> Because there is so little value to avoiding mistakes, we shouldn’t invest much in doing so.

Valid because mistakes are guaranteed as you're learning.

> Code review processes (which I’ve promised multiple times to trash, but
> now is not the time) don’t distinguish between reversible and irreversible
> changes. We end up making the same investment with radically different
> payoff profiles. What a waste.

# Irreversible/trap door decisions
> “extract as a service” tends to be a big deal and hard to undo. Think about it some more, for example by actually implementing a prototype first.

> *this makes* “extract as a service” reversible, at least for a while. If we get halfway into it and realize this is one of those services that really could have been a SQL query (thanks, Josh Wills), then we can change it without too much fuss.

> Another scenario where reversible design decisions become irreversible
> is when the decision propagates throughout the code base.

I've experienced this one a few times, and it's scary. When people copy/paste your experimental code, and the WIP pattern now exists in many places😅