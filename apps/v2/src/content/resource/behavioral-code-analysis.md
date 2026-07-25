---
title: "Behavioral Code Analysis - Adam Tornhill"
date: 2026-07-23T20:40:00+02:00
description: Adam Tornhill's material on behavioral code analysis, forensic techniques applied to codebases
tags: [software-design, code-quality, technical-debt]
tldr: Curated collection of Adam Tornhill's books, talks, tools, and workshops on using version-control data and forensic psychology to understand codebases.
---

# Books

- [Your Code as a Crime Scene (2nd Edition, 2024)](https://pragprog.com/titles/atcrime2/your-code-as-a-crime-scene-second-edition/) - Applies forensic psychology techniques to codebases: hotspot analysis, temporal coupling, geographic profiling of commits
- [Software Design X-Rays (2018)](https://pragprog.com/titles/atevol/software-design-x-rays/) - Prioritizing technical debt using behavioral data, identifying architectural issues, connecting code quality to business outcomes

# Key Concepts

- **Hotspot analysis**: Files that change frequently AND have high complexity = biggest risks
- **Temporal coupling**: Files that always change together reveal hidden dependencies
- **Code churn + complexity**: Predicting where bugs will emerge
- **Organizational analysis**: Mapping team structure to code ownership, finding coordination bottlenecks
- **Change frequency vs. code age**: Identifying code that should be stable but isn't

# Free Tools

- [code-maat](https://github.com/adamtornhill/code-maat) - Open source CLI tool (Clojure/Java) that mines version-control data for all the analyses in the books
- [maat-scripts](https://github.com/adamtornhill/maat-scripts) - Python scripts to post-process and visualize code-maat output (teaching-oriented)

# Talks & Podcasts

- "Treat Your Code as a Crime Scene" - GOTO 2016 (YouTube), also presented at SREcon 2024
- [Software Engineering Radio Episode 554](https://se-radio.net/2023/03/episode-554-adam-tornhill-on-behavioral-code-analysis/) - Full interview on behavioral code analysis
- "Prioritizing Technical Debt as if Time and Money Matters" - Philly ETE 2021
- "The Critical Safeguards for AI-Assisted Coding" - Analyzing 100K+ AI-driven refactorings from real codebases
- [CodeScene thought leadership talks](https://codescene.com/resources/tutorials/thought-leadership)

# Commercial Tool

- [CodeScene](https://codescene.com) - Productized version of all these ideas. Has a free community edition.

# Workshop

- [Fix Technical Debt with Behavioural Code Analysis](https://ddd.academy/code-as-a-crime-scene-adam-tornhill/) - DDD Academy

# Starting Point

The 2nd edition of "Your Code as a Crime Scene" is the most comprehensive single resource. The GOTO 2016 talk on YouTube is a solid free appetizer to see if the ideas resonate before committing to the book.
