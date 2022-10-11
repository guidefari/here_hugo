---
title: "Team Topologies"
date: 2022-10-11T08:18:49+02:00
description: 
tags: [leadership, devops]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---

This topic has really been of interest lately. Need to capture the learnings somewhere.

# Videos
- Youtube watch later & coding stuffs playlist has some videos

## ING Bank
- {{<youtube X3AHdo34gWM>}}
This video is stories from Dutch [ING Bank](https://www.ing.com/Home.htm). While the topic is focused on team topologies, it also touches on what the expectations of the [company](https://www.ing.com/Home.htm)'s internal dev platform are.

- They moved to microsquads, teams of 4 people, that are put together to take care of the most important problem for them, & the company right now.
- Once they're done with the task, they deallocate themselves and reassign to the next streams of work, that are of high value right now.
- Because of the ephemeral nature of the teams, they can't afford to have developers solve common problems all the time, think **auth, event streams (Kafka bus), DBs, analytics, frontend base components, product pricing platform**. 
- Solving and provisioning all the above, is where the **Platform** comes in. Microteams should be able to self-provision the internal capabilities they need.
- I imagine this sort of environment is where private on premises cloud is a good fit too.
- Microteams align well with product thinking.

# Books
- Accelerate
- The Phoenix project
- The Devops handbook 
- Shape Up - Similar to ING Bank, Basecamp follows a microteam approach. 1 or 2 devs, 1 designer, 6 weeks on a task. Slightly smaller than the 4 seen at ING, but built on similar principles of tackling an important business value stream, in a time boxed manner. 
- Would be cool to learn more about how AWS teams are structured.
  - In the one video, I learned about someone from AWS saying the more people they add to the company, the faster (and better?) they seem to be building software

# Misc notes
- Beyond a certain size, adding more people to a team will not make it more effective. 
