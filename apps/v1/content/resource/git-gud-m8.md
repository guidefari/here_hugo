---
title: "Resource: Git Gud M8"
date: 2025-10-10T09:27:56+02:00
description: 
tags: [git]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Git+Gud+M8']
---

Problem: I want to be authenticated to multiple git profiles on one machine.

## Solution
- Sort out ssh keys for both profiles
- The folder structure on my machine looks like this
```
~
└── source/
    ├── corporate/
    └── oss/
```

- And my global gitconfig looks like this. I keep other shared git configs in here ofc.

```
[includeIf "gitdir:~/source/corporate/**"]
    path = ~/.gitconfig-work

[includeIf "gitdir:~/source/oss/**"]
    path = ~/.gitconfig-oss
```

- then the respective git config files specify the name and email as per
```
[user]
  name = guide-oss
  email = guide@ossftw.com

```