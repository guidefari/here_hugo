---
title: "Exploring CI/CD options"
date: 2024-06-28T11:38:54+02:00
description: With a focus on solo hackers' TS & Go projects.
tags: [cloud, aws, infra]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Exploring+CI+CD']
---

I've spent the last few weeks hammering away at side projects.
Truly became the meme ["when your side project sees you start another side project"](https://x.com/netcapgirl/status/1805349014474572230), LOL.
But, very worthwhile experiments, cause I've been learning a ton.

This note captures some observations, questions, motivations etc etc.

## High level requirements
- Ease of use, as close as possible to being the best in class experience for [DX](/tags/dx).
- Simple af, with a minimal set of 'external' dependencies. If I can just install one cli to get everything from dev, testing, and deployment, that'd be great.
- Minimal [platform risk](/platform-risk)

# Key take-aways
- If you're trying to get shit done, choose boring stuff
- Set up sane pipelines as close as possible to the start of a project. It becomes a chore the longer you put it off

# Vercel/Netlify
- Still the best for quick prototyping
- I've been defaulting to Vercel & NextJS for a while now, and mostly have no problems. It's a set & forget type thing
- Just keep an eye out
{{< figure src="https://d20tmfka7s58bt.cloudfront.net/bills.png" title="Many such cases" >}}
- General principle is these get super pricey at scale. Keep that in mind as you build your app & you should be fine

# [SST](https://sst.dev)
- Don't even remember how I found this at this point, probs while lurking on Twitter
- Great for Serverless Apps that leverage AWS & Cloudfare primitives
- DX still feels like it gets in your way a little bit, but may very well be a skill issue on my side
- Was great for learning more about how to dev & deploy on AWS, and has become much easier with more exposure
- [Ion](https://ion.sst.dev) offers a mental model that's easier to grok, at least that's how I felt
- Would not recommend for absolute beginners
{{<youtube 3dVEV-Qznq0>}} 

# Self Hosting
- VPS + Coolify is my fighter right now. It's an amazing combination
- Being closer to bare metal has meant back to Docker. I'm a little rusty, but it's great to be practicing again.
- CJ from Syntax has a [great series on self hosting](https://youtube.com/playlist?list=PLLnpHn493BHHAxTeLNUZEDLYc8uUwqGXa&si=difu2Ut0C4abwZSR). Shout out CJ🙌🏽
{{<youtube "playlist?list=PLLnpHn493BHHAxTeLNUZEDLYc8uUwqGXa">}}


# Pocketbase
- [Thanda](https://www.amajola.xyz/) & [Scott](https://youtu.be/Eg38JbgbttA?si=r9t_inYHmhkWFdgE) put me onto this.
- Still looking for an excuse to try it out. Will likely build out some [Goosebumps](https://goosebumps.fm) features on pocketbase.

# Open source & docs
- Lot's of 'bleeding edge' open source has gaps in docs. You will bump into issues that aren't documented, 
and that can be a little frustrating, but it's a great opportunity to interact with the community.

Github issues & discord really help plug these gaps. Most open source tools have a discord server.

# More IaC
## CDK 
- I used [CDK for a Go project](https://github.com/guidefari/goCDK), making use of lambda, api gateway, and dynamo
    - Relatively straightforward, but configuring the environment esp in Go, felt tedious, error prone, and clunky
    - Point above was a skill issue tbh. It's how I felt when I wrote it, but now, a few weeks later, I find Go a lot easier to read
- **Conclusion**: CDK for serverless AWS apps is a great pattern. I'll be tapping in again

## Terraform
- Tyler also put me on some stuff. Here's his process

> I'm using only Terraform this time to spin up the infra on AWS whereas before I was using Cloudformation for the lambdas & api gateway and Terraform for like AWS policies. 
> But basically write the code for the lambdas, when I push I've got Github actions setup to run the Terraform files which will build and zip the lambda functions and then deploy the code to the lambda 
> Think I've also figured out how to run things locally but either way deployments are quick so I can deploy and test the deployed endpoints without issue

## [Pulumi](https://www.pulumi.com/) 👀
- Dax & friends put me onto this one
- What I really like about SST ion is it seems you can extend the SST components using the underlying Pulumi primitives
- The SST codebase is also laid out really well, I had a few DNS bugs that I couldn't understand, so I read SST internals to see how it was implemented, vs how I was trying to use it.
It was definitely helpful for getting closer to the solution
- Keeping an eye out. Might explore later.

## Github actions
- Still incredibly powerful for setting up pipelines and housekeeping around your codebase
- Also learnt about [act](https://github.com/nektos/act).
- I generally run this on every push & pull request:
  - Can compile? and relevant static analysis
  - Tests
  - And if it's a push to the main or staging branch, I create a new build & deploy
- The short feedback loops are great, you catch issues early, while it's still fresh in memory. quicker resolution

## Biome replaces Prettier & ESlint
- In the interest of simplicity & reducing number of tools and configs, I've replaced Prettier & ESlint with Biome.
  - I've been keeping an eye on this project since Rome days, seeing more and more people adopt it has given me confidence to switch over.
  - And also the fact that it's been around for a while
- You should see some of the package.json diffs after people replace Prettier & ESlint with biome, lol. And the [performance](https://x.com/wojtekmaj91/status/1790846885332152538) tweets too.

# Organising project code
- My default right now is monorepos. I like co-locating related stuff
- And given that it's one man projects, I've had no scaling issues. MMV when teams are much bigger and push hella frequently

## Publishing packages made easier by [JSR](https://jsr.io/)
- I will probably explore sharing code across projects via shipping packages using JSR.
- I [published a module year ago](/npm-publish) at the time of writing, haven't really played around with it since, because of no practical use
- I like what JSR is doing to make publishing source a lot easier.
- Similar principles to how shadcn brings the source code directly into your codebase🔥
- Learn more about it's why:
{{<youtube dHfZiqVWVhk>}}