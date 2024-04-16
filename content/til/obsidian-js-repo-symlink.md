---
title: "TIL: Obsidian with symlink to a JS repo"
date: 2024-04-16T07:06:50+02:00
description: Something I learnt today. Maybe more than one thing👾
tags:
  - til
  - linux
  - obsidian
images:
  - https://images-here-hugo.vercel.app/api/og-image?title=Obsidian+Symlink
---
## Context
- All of my blogs store content in markdown
- Version controlled by git
- Static sites that are published on push to the main branch
- For the most part, I've been writing this content in VSCode
- The rest of my markdown notes currently live in Obsidian. 
	- Work notes
	- A Folder I exported from [Bear](https://bear.app/) after a year or so writing in there
	- Daily log
- Herein lies the problem, I want a unified writing experience. This reduces friction of writing, less switching around apps, and makes it easier to reference and cross pollinate thoughts across the different contexts.

## More context: What didn't work
I have an Obsidian folder that syncs to iCloud, that's where all the markdown lives. I tried adding 2 javascript repo's to this directory, and Obsidian broke while trying to index `node_modules`😂 really should have seen that coming a mile away.
I quickly deleted the folder and [reset my workspace](/obsidian-workspace-fix)

# Symlink to the rescue
Turns out an easy way to bring those markdown folders from the JS repos is to just symlink them in the iCloud directory that keeps all my Obsidian markdown.

```bash
cd directory_with_obsidian_content

ln -s ~/source/blogs/here_hugo/content here_hugo
```

