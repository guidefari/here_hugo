---
title: "TIL: Transitive Deps"
date: 2025-10-26T07:13:47+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, security]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Transitive+Dependencies']
---

I'm fascinated by dependency resolution in npm, probably a result of all the emotional damage it's caused me over the years.

> [A transitive dependency npm refers to a package that your project relies on indirectly, through another package you’ve explicitly installed.](https://ones.com/blog/understanding-transitive-dependencies-npm-simplifying-nodejs-project/)
## Why they caught my eye
[Isolated installs](https://bun.com/docs/pm/isolated-installs), highlighted in [bun 1.3's release notes](https://bun.com/blog/bun-v1.3#isolated-installs-are-now-the-default-for-workspaces). I noticed some of my builds were failing after I updated my bun binary. Bun stopped supporting transitive dependencies by default, and what that meant is that in my monorepo, some apps and internal packages were making use of npm packages that were installed elsewhere, and happened to be in `node_modules` as a result, hence working locally.

This forced me to [explicitly define npm packages that I was using in each app](https://github.com/guidefari/gbfm/commit/5271c9ff0315fb9b3b1266f38f668b240c9b8dba). The big pro for me is this:
> ensures reproducible, deterministic builds.

## Addressing security concerns
- [Securing Transitive Dependencies in End-of-Life Software: A Guide](https://www.herodevs.com/blog-posts/securing-transitive-dependencies-in-end-of-life-software-a-guide) by Edward Ezekiel 
- [Understanding Transitive Dependencies in npm: Simplifying Your Node.js Project](https://ones.com/blog/understanding-transitive-dependencies-npm-simplifying-nodejs-project/) by [Evan Brooks](https://ones.com/blog/author/plg-seo-en/) for [ONES.com Blog](https://ones.com/blog/)
- [Risks of Transitive Dependencies in Node.js](https://medium.com/node-js-cybersecurity/risks-of-transitive-dependencies-in-node-js-2683b16f3089) by [Sergey Egorenkov](https://medium.com/@egorenkovserg?source=post_page---byline--2683b16f3089---------------------------------------)
