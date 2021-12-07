---
title: "Pnpm Experiments"
date: 2021-12-07T21:51:44+02:00
description: A little handy tool for running scripts in your monorepo
tags: [til, pnpm, monorepo]
---

# where
- [pnpm website](https://pnpm.io/)

# why
- saves disk space
- **recursive** - now [this](https://pnpm.io/cli/recursive) is the bad boy that makes it handy for our monorepo set up.
  - makes installation of packages easier - one command, one terminal
  - makes running of dev servers easier - one command, one terminal
- [pnpm motivation](https://pnpm.io/motivation)

## dcx gotcha
- node_modules for `shared/storybook` have to be installed 'manually', using `npm`. 
  - I suspect this is because of the aliasing in the folder?