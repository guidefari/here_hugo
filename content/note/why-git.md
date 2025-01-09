---
title: "Why Git? How to git?"
date: 2024-12-24T11:59:59+02:00
description: Capturing notes on a recurring conversation with friends 
tags: [git]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Why+Git']
---

## Version control
Version control gives you some essential capabilities around your codebases & files. 
The basic idea is "a server somewhere that has a copy of the code you're working on".

Where the "versioning" comes in: you can create snapshots of what your codebase looks like at anytime by using [commits](https://www.freecodecamp.org/news/git-commit-command-explained/). 

You can easily traverse and retrieve these commits, our point in time snapshots.

## More capabilities that git provides:

- Collaborating: Hosting the code on a remote server allows multiple people to work on one project at the same time. A core git concept here is [branches](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell).
- Backup & Redundancy of your code
- [Application deployment](/ci-cd): Keeping your code on a server somewhere allows you to run automations on it.

## More git concepts to be aware of
- [`git clone`](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) - creates a local copy of the code from the remote server.
- `git push` - pushes the committed state on my local machine to the server
- `git pull` - pulls & copies to my local machine the latest commits from the server
  - related is `git fetch` - fetches the latest commits onto my local machine, but won't overwrite the files
- [branches](https://think-like-a-git.net/sections/experimenting-with-git/branches-as-savepoints.html)
- merging
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


## The git workflow I recommend
- Top Level folder: Create a folder where all your code will live. 
  - Make it a place that's easy to get to from the terminal. eg `~/code`, `~/projects` `~/source`
  - the folder `~/` is `/Users/guide/` or `/Users/[your username]`
- Each project exists in it's own subfolder
  - `~/code/project#1`
  - `~/code/project#2`
  - `~/code/scraping-project` etc
- Each of these folders is a git repository.
- Start committing early & often, from the get go.
- Use descriptive commit messages

## Learning resources
- [What is git](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F#what_is_git_section)
- [Hackthedegree - The only cheatsheet a Git beginner needs!_](https://hackerbytes.hackthedegree.com/26/rapid-tutorial/git/the-only-cheatsheet-a-git-beginner-needs)
- [boot.dev 4 hour git video](https://www.youtube.com/watch?v=rH3zE7VlIMs) by [ThePrimeagen](https://www.boot.dev/teachers/the-primeagen)
- [think like a git](https://think-like-a-git.net/) from start to finish - When you have a few weeks/months of experience with git, I'd recommend.
  - Misc: [Graph theory](https://think-like-a-git.net/sections/graph-theory.html)
- [my notes on git](/tags/git)