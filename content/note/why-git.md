---
title: "Why Use Git?"
date: 2024-12-24T11:59:59+02:00
description: Capturing notes on a recurring conversation with friends 
tags: [git]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Why+Git']
---

## Version control
Version control gives you some essential capabilities around your codebases & files. 
The basic idea is "a server somewhere that has a copy of the code you're working on".

A few examples of the capabilities git provides:

- Collaborating: Hosting the code on a remote server allows multiple people to work on one project at the same time
- Backup & Redundancy of your code
- Application deployment: Hosting your code on a server somewhere allows you to run automations on it.


## Workflow I recommend
- Top Level folder: Create a folder where all your code will live. 
  - Make it a place that's easy to get to from the terminal. eg `~/code`, `~/projects` `~/source`
  - the folder `~/` === `/Users/guide/` or `/Users/[your username]`
- Each project exists in it's own subfolder
  - `~/code/project#1`
  - `~/code/project#2`
  - `~/code/scraping-project` etc
- Each of these folders is a git repository.
- Start committing early & often, from the get go.
- Use descriptive commit messages

## Concepts to be aware of
- `repository` - if a folder has the hidden sub-directory `.git`, it's likely a [git repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository).


```
project-root/
├── .git/
│   ├── objects/
│   ├── refs/
│   └── config
│
├── src/
│   ├── components/
│   └── utils/
│
├── tests/
│
└── README.md
```


- `git clone` - creates a local copy of the code from the remote server.
- `git push` - pushes the committed state on my local machine to the server
- `git pull` - pulls to my local machine the known latest commits/changes from the server
- [branches](https://think-like-a-git.net/sections/experimenting-with-git/branches-as-savepoints.html)
- merging


## Learning resources
- [Hackthedegree - The only cheatsheet a Git beginner needs!_](https://hackerbytes.hackthedegree.com/26/rapid-tutorial/git/the-only-cheatsheet-a-git-beginner-needs)
- [boot.dev 4 hour git video](https://www.youtube.com/watch?v=rH3zE7VlIMs) by [ThePrimeagen](https://www.boot.dev/teachers/the-primeagen)
- [think like a git](https://think-like-a-git.net/) from start to finish - When you have a few weeks/months of experience with git, I'd recommend.
  - Misc: [Graph theory](https://think-like-a-git.net/sections/graph-theory.html)
- [my notes on git](/tags/git)