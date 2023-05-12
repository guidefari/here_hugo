---
title: "Resource: Tmux + General terminal"
date: 2022-08-16T07:13:57+02:00
description: Need somewhere to capture my common tmux workflows
tags: [resource]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Resource%3A%20Tmux']
---

# Key Concepts
- Leader key: the prefix of keypress combination you need to hit to get tmux's attention. This can be reconfigured to match preference
- Vertical split: `prefix + %`
- Create new Window: `prefix + c`
- Move to next Window: `prefix + n`
- Attach to existing session: `tmux attach-session -t {session_id}`
- [vim]({{<ref vim>}})