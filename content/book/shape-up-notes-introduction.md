---
date: "2020-12-02"
tags: [agile]
title: "Introduction to Shape Up"
summary: "Ryan Singer shares how the Basecamp team builds software"
---


---

1. Shape Up notes - introduction (You're here)
2. [Shape Up - The shaping process]({{<ref shape-up-notes-shaping>}})
3. [Shape Up - writing the pitch]({{<ref shape-up-notes-writing-pitch>}})


---

Get the PDF for free [here](https://basecamp.com/shapeup). Before reading the book, I listened to the Full Stack Radio [episode](http://www.fullstackradio.com/131), where Adam had a chat with Ryan(the author of Shape up) about the main ideas of shape up, which I felt was a great introduction.

I highlighted a decent chunk while reading the book. It's mostly those ideas I'll be interrogating.

## glossary
### Appetite
The amount of time we want to spend on a project, as opposed to
an estimate.

### Bet
The decision to commit a team to a project for one cycle with no interruptions and an expectation to finish.

### Pitch
A document that presents a shaped project idea for consideration at the betting table.

### Shape
Make an abstract project idea more concrete by defining key elements of the solution before betting on it.

### Team Topologies
They follow a microteam approach. When implementing:
- 1 or 2 devs
- 1 designer

When shaping, things are a little different. It's usually an async process, carried out by the more senior team members, eg just Jason & DHH. <br> 
This is because decisions at this stage will have downstream implications on the future of the product

## summary
> This book is a guide to how we do product development at Basecamp. It’s also a toolbox full of techniques that you can apply in your own way to your own process.

The book is split into 3 parts
1. Shaping - "the pre-work we do on projects before we consider them ready to schedule."
2. Betting - "how we choose among the pitched projects and decide what to do six weeks at a time."
3. Building - " the expectations we place on the teams and the special practices they use to discover what to do."

# six-week cycles
The basecamp team works in 6 week cycles, Ryan describes it as:
> long enough to build something meaningful start-to-finish and short enough that everyone can feel the deadline looming from the start, so they use the time wisely

A lot of autonomy is given to the teams (usually a designer or two, and one programmer). More on that later, but while we're here, another excerpt: 
> We don’t count hours or question how individual days are spent. We don’t have daily meetings. We don’t rethink our roadmap every two weeks
> .
> .
> Then we commit the six weeks and leave the team alone to get it done.

Imagine giving work to teams without the adequate direction though, recipe for disaster.
That's where shaping the work comes in

# Shaping the work
Shaping is done by a small senior group, that works in parallel to the cycle teams (designer(s) + programmer). 
> They define the key elements of a solution before we consider a project ready to bet on.

To expand on autonomy given to the cycle teams: 
> Projects are defined at the right level of abstraction: concrete enough that the teams know what to do, yet abstract enough that they have room to work out the interesting details themselves.


### appetite
It is during shaping, where the appetite is zoomed in on, as opposed to estimates.
1. " Instead of asking how much time it will take to do some work, we ask: How much time do we want to spend? "
2. " How much is this idea worth? "

The task of shaping, can then be described as:
> narrowing down the problem and designing the outline of a solution that fits within the constraints of our appetite.

# Risk
> This book is about the risk of getting stuck, the risk of getting bogged down with last quarter’s work, wasting time on unexpected problems, and not being free to do what you want to do tomorrow.

I can definitely relate to the feeling of a never ending task list, that sometimes slows down work that needs to be done right now.

### risk reduction method 1
> We reduce risk in the **shaping** process by solving open questions
before we commit the project to a time box.
 
A team doesn't get a project with rabbit holes, unanswered questions, or " tangled interdependencies "
Ryan expands on the topic of interdependencies a lot more in the [podcast](http://www.fullstackradio.com/131). 
These can really slow development down, it's essentially the pieces(anything from third party APIs to internal tooling from another team) that need to come together to provide a solution.

### risk reduction method 2
> If a project runs over(the **6 week cycle**), by default it doesn’t get an extension.

> This “circuit breaker” ensures that we don’t invest multiples of the original appetite on a concept that needs rethinking first

### risk reduction method 3
> And lastly we reduce risk in the building process by integrating design and programming early.

---

## Further reading
1. [Shape Up vs Scrum: 6 Months to 6 Weeks – How We Cut Our Dev Cycle 75% | Process Street](https://www.process.st/shape-up/) - does a great job at comparing the two frameworks, and is an excellent summary of the concepts introduced in Shape up.