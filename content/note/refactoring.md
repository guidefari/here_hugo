---
title: "On Refactoring"
date: 2023-04-10T23:36:28+02:00
description: Some musings & observations on refactoring
tags: [process, resource, dx, architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=On%20Refactoring']
---

### Refactoring, Maintenance, Tech Debt

How you refer to this will differ from team to team, and context - but the general idea is the same thing. This is a resource of actionable insights from various sources, hopefully working as a starting point when this topic comes up during your retros. Think of this as a map, or collection of mental models.

> The longer we put off maintenance work, the less smooth and effortless feature development will be.
> 
> 
> [Rather than sweep all of those tasks under a rug called “tech debt” and then occasionally ask for time to deal with it as one unit, we can track what specific elements of the system force feature development to take longer, measure them in terms of the amount of developer effort that they require, and then negotiate their completion as individual tasks with attractive outcomes for developer capacity.](https://readwise.io/reader/shared/01gtfph72hmfn4y73wsbk4pr0k)
> 

> When you make architecture someone else's job and scrap the expectation that it's a core skill, you get weaker engineers & worse systems." - this part resonated with me very much.
> 
> 
> [You can also replace "architecture" with "security", "testing" or various others.](https://readwise.io/reader/shared/01gv4fga0fc1a1ks8e4skcbp0f)
> 
- Maintenance work fits in here too.
- The other side of "Engineers must write maintainable code" is **actually maintaining the code**. This skill is slightly different from writing code
- Martin Fowler's "Workflows of refactoring" presentation and book offer a plethora of tactics you can apply to your day-to-day work.

# Martin Fowler - Workflows of Refactoring

{{<youtube vqEg37e4Mkw>}}

- [Slide deck](https://www.martinfowler.com/articles/workflowsOfRefactoring/)

**key takeaways:**

- "What cap am I wearing right now?" - is a question I ask myself every day at work. When programming, it helps me figure out if I'm quickly trying to get an idea out of my head and quickly get something working, or shaping the code to become more resilient and maintainable by future engineers.
- camp site rule - Leave code a little better than you found it. This is a form of **litter-pickup refactoring**
- When you encounter a tricky part of the codebase that you first have to spend a bunch of time reading before contributing to, transfer that volatile knowledge from your working memory, back into the code itself. Help communicate intent better. This is a form of **comprehension refactoring**
- Often you start working on adding new functionality and you realize the existing structures don't play well with what you're about to do.
  - this is where **preparatory refactoring** comes in. Make it easier to add future work
- **Planned refactoring** - The most common workflow, using refactoring stories. Big/long term migrations

# Invest in good types & tests

- This allows for fearless refactoring
- Everytime I convert a JS file to TS, I learn so much about the domain knowledge. Typescript really helps to communicate intent & contracts between entities
    - This becomes very useful in a big codebase, where you could find yourself regularly exploring areas of the codebase for the first time

# [Microsoft's zero defect methodology](https://readwise.io/reader/shared/01gv5748ynxtnb274mmwa0500t)

> **zero defects** meant that at any given time, the highest priority is to eliminate bugs before writing any new code.
> 

### Reasoning behind this approach

1. The longer a bug exists, the costlier (in time & money) it becomes to fix
2. It's easier to predict how long it'll take to write new code than to fix an existing bug. It could take 3 days to track it down, or it could take 2 minutes. you don't really know till you start
    
    > What this means is that if you have a schedule with a lot of bugs remaining to be fixed, the schedule is unreliable. But if you’ve fixed all the known bugs, and all that’s left is new code, then your schedule will be stunningly more accurate.
    > 
3. Another great thing about keeping the bug count at zero is that you can respond much faster to competition. Some programmers think of this as keeping the product ready to ship at all times.

## Example refactoring workflow. Used when building a new feature

- Add feature, Refactor. You can only wear one of these caps at a time.
- Working this way encourages focus, minimises things you’re working on at once.
- When writing code, it sometimes can be more efficient to just get the idea out of your brain’s working memory, into some representation of code
    - that means you don’t have to be strict about your naming, efficiency, readability etc. Just focus on getting the idea out of your head
    - the next cycle is cleaning up any bits you’ve just added
- how often you toggle between these two caps can be done depends on the complexity of the project/task/scope
    - I can switch back and forth every 30 - 40 minutes all the way up to days in each mode
    
    ![Untitled](https://res.cloudinary.com/hokaspokas/image/upload/v1681162730/here-hugo/ref_n85xf4.jpg)
    

# Related reading

- [Stop saying “technical debt”](https://readwise.io/reader/shared/01gtfph72hmfn4y73wsbk4pr0k) by [Chelsea Troy](https://stackoverflow.blog/author/chelsea-troy/)
- [Refactoring (Book) - Martin Fowler](https://www.oreilly.com/library/view/refactoring-improving-the/9780134757681/)
- [Tailscale](https://tailscale.com/) CEO [shares some thoughts about tech-debt](https://apenwarr.ca/log/?m=202306) - this article does a great job at explaining how to think about tech-debt, drawing many parallels from financial debt to help drive the point home! 