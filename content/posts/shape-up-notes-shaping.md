---
date: "2020-12-08"
tags: ["notes"]
title: "Shape Up - The shaping process"
summary: "Summary of Part 1 of the book"
---
---

1. [Shape Up notes - introduction](shape-up-notes-introduction.md)
2. Shape Up - The shaping process (You're here)
3. [Shape Up - writing the pitch](https://goosebumps.co.zw//shape-up-notes-writing-pitch)

---

# Shaping
The language used in this book makes sort of forces you to become intentional & mindful about your actions. that's how I feel at least.
### Definition
> (to) Make an abstract project idea more concrete by defining key elements of the solution before betting on it.

This section starts by emphasizing the point that during shaping, it needs to be done at an **appropriate level of abstraction**, "not too vague, and not too concrete". 

This really resonates because you're giving the professional(designer/programmer) the space to do their job.

## Wireframes are too concrete
This is a point that I saw being driven home a few times as well.
> Over-specifying the design also leads to estimation errors. Counterintuitive as it may seem, the more specific the work is, the harder it can be to estimate. That’s because making the interface just so can require solving hidden complexities and implementation details that weren’t visible in the mockup.

How many times have you 'Figured out a solution in your head' and 'it should only take me 1 hour', only to learn that the real code equivalent of that mental solution has a few *gotcha's* and it'll take you half a day instead?


Troubles from giving a team some **wireframes**: 
> When the scope isn’t variable, the team can’t reconsider a design decision that is turning out to cost more than it’s worth.

## Words are too abstract
> Concerning estimation, under-specified projects naturally grow out of control because there’s no boundary to define what’s out of scope.

# Case study: The Dot Grid Calendar

### Property 1: It's rough
> Designers and programmers need room to apply their own judgement and expertise when they roll up their sleeves and discover all the real trade-offs that emerge

### Property 2: It’s solved
> Despite being rough and unfinished, shaped work has been thought through. All the main elements of the solution are there at the macro level and they connect together

### Property 3: It’s bounded
> Lastly, shaped work indicates what not to do.

## Who Shapes
> It(shaping) requires combining interface ideas with technical possibilities with business priorities.

> You don’t need to be a programmer to shape, but you need to be technically literate

> It’s also strategic work. Setting the appetite and coming up with a solution requires you to be critical about the problem.

# Appetite
The appetite (think 'how much time do we want to spend on this'), boils down to a phrase that's stuck with me, "Fixed time, variable scope"

> An appetite is completely different from an estimate. Estimates start with a design and end with a number. Appetites start with a number and end with a design. **We use the appetite as a creative constraint on the design process.**

I feel like this was one of the big paradigm shifts.

---

> There’s no absolute definition of “the best” solution. The best is relative to your constraints.

## Responding to raw ideas
fresh ideas aren't immediately put in a backlog. Instead, they're met with a 'Maybe someday' mindset. No need to have new and unshaped ideas added to your backlog, as that'll just hover over your head, and oftentimes as unecessary overhead.

To summarise, "we shouldn’t make a commitment that we don’t
yet understand"

the article [Options, not roadmaps](https://m.signalvnoise.com/options-not-roadmaps/) zeros in on that idea as well.

(for the first time in months, I haven't got anything in a backlog, I'll try and implement this approach & see how that goes)

## Boundaries in place
These are the three boundaries you need in place before you start to define the elements of a solution:

1. A Raw idea
2. An Appetite
3. Narrow problem definition

---
# Actions during shaping
Take the headings below as the timeline/points during the actual shaping process.
### From words to elements of software solution
I feel this is where shaping, as per the definition, actually starts.
At this stage: "Either we’re working alone or with a trusted partner who can keep pace with us. *Someone we can speak with in shorthand*"

## Prototyping
the prototyping techniques used at this stage are 
1. [Breadboarding](https://en.wikipedia.org/wiki/Breadboard)(technique borrowed from electrical engineering)
2. Fat Marker Sketches

These allow us "to stay on the right level of detail and capture our thoughts as they come"

### Breadboarding
In the context of writing software, this is what breadboarding would look like.

**Some basic things that are drawn**:
>1. Places: These are things you can navigate to, like
screens, dialogs, or menus that pop up.
>2. Affordances: These are things the user can act on, like buttons and fields. We consider interface copy to be an affordance, too. Reading it is an act that gives the user information for subsequent actions.
>3. Connection lines: These show how the affordances take the user from place to place.

This is when you can start to actively keeping in mind "**[[Shape up - Introduction#^437ceb|the right level of abstraction]]**"

From this, **"Elements are the output"**. At this point, you can get started with the **Fat Marker sketches**

## No Commitment yet
At this stage, "What we've done is added value to the raw idea by making it more actionable" -> what I typically refer to as 'research' before a project. 

**But** " Before we consider it safe to bet on, a shaped project should be as free of holes as possible." We have to iron out any potential interdependencies before moving forward. 

## Look for rabbit holes
> In this step, we slow down and look critically at what we came up with. Did we miss anything? Are we making technical assumptions that aren’t fair?

### Interdependencies
Potential risks & rabbit holes in a project (the book has a case study that illustrates how this would look - *Case study: Patching a hole*) are taken care of during the shaping phase. Again, we're still 'thinking the right level of abstraction' here.

> Next, when we write the pitch for this project, we’ll point out this specific “patch” as part of the concept. That way nobody down the line will get tripped up on it.

## Declare out of bounds
This makes me think about that section of the contract where you have to specify the scope of the project. A recent paradigm shift was learning to also 'explicitly mention what's **not** being done'. This was learnt from [Syntax fm - freelance client lifestyle](https://open.spotify.com/episode/6TpxTSziR1VNKbFY1vIrcH?si=i0_obeYwT6WU0ZmIP-OdYg) . 

Just as you declare `out of bounds` for a client upfront, expect to do the same for your own projects, during the shaping phase. 

## Cut Back
Is there anything you got excited about and added during the sketching/prototyping and isn't really necessary? This is the time to let go of it. 

(I'm purposefully avoiding reference to the 6 week cycle as that feels one too many notches up for me, at the moment) The purpose of cutting back is just a **scope hammering** practice, keeping in mind how long the cycle is.

## Present to technical experts
If you have any gaps that need filling, this is when you bring in domain experts to do help with the patching.

**When bringing in an expert:**
> Rather than writing up a document or creating a slideshow, invite them to a whiteboard and redraw the elements as you worked them out earlier, building up the concept from the beginning.

**After bringing in an expert:** 
> Depending on how the conversation goes, you may either have validated your approach or discovered some problems that send you back for another round of shaping


# Pitch
At this point, we're ready to move from a privately shaped idea, to the betting table. The **pitch** is the document that ties all the work done during shaping into a coherent presentation that people with less context can understand.