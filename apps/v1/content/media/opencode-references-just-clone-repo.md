---
title: "OpenCode References: Just Clone the Repo"
date: 2026-06-16T14:23:14+02:00
description: "OpenCode 1.17.3 adds first-party support for referencing other git repos and local folders, directly enabling the 'just clone the repo' workflow from Michael Arnaldi's talk."
media_type: link
media_url: https://x.com/thdxr/status/2064785435239276761
creator: dax
images: ['https://images-here-hugo.vercel.app/api/og-image?title=OpenCode+References%3A+Just+Clone+the+Repo']
tags: [media, opencode, ai, effect, git]
---

OpenCode 1.17.3 can reference other git repos or local folders:

```
references: {
    "effect": "github.com/Effect-TS/effect-smol"
}
```

This gives the agent full access to the codebase, directly enabling the "just clone the fucking repo" philosophy from [Michael Arnaldi's talk on vibe engineering](/media/michael-arnaldi-vibe-engineering-effect-apps/).

Related: [OpenCode References Documentation](https://opencode.ai/docs/references/)
