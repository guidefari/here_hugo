---
date: "2020-09-23"
tags: ["web", "git"]
title: "Git Shit Done"
description: "Git commands that I always have to google"
---

the rest of the cheatsheet can be found [here](https://guide-cheatsheet.netlify.app/). Forked from [Scott Spence](https://scottspence.com/posts) :).

# delete branch
#### delete branch locally

`git branch -d localBranchName`

#### delete branch remotely

`git push origin --delete remoteBranchName`

[source](https://www.freecodecamp.org/news/how-to-delete-a-git-branch-both-locally-and-remotely/)


# Add files to last commit

```bash
# make your change
git add . # or add individual files
git commit --amend --no-edit
# now your last commit contains that change!
# WARNING: never amend public commits
```
[src](https://ohshitgit.com/)

# Undo last commit (on local & remote)

```bash
git reset --hard HEAD^
git push -f
```

`HEAD^` means one revision back (this is the local step) then you
force push to origin. without the force flag, you'll get an error from
git - telling you about the one incoming change from remote, which
you're trying to remove:)
[src](https://stackoverflow.com/questions/4647301/rolling-back-local-and-remote-git-repository-by-1-commit)

# Create a local branch and push it to GitHub

Want to make your feature branch and get it on GitHub?

Make your branch first then:

```bash
git push --set-upstream origin <branch-you-just-created>
```