---
title: "Resource: Tmux + General terminal"
date: 2022-08-16T07:13:57+02:00
description: Need somewhere to capture my common tmux workflows
tags: [resource]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Resource%3A%20Tmux']
---

# Key Concepts
- `Prefix`: keypress combination you need to hit to get tmux's attention. This can be reconfigured to match preference
- Vertical split: `prefix + %`
- Move around panes `prefix + ->` or `<-`
- Attach to existing session: `tmux attach-session -t {session_id}`
- [vim]({{<ref vim>}})
- Panes
- Sessions

## Move around windows
- Create new Window: `prefix + c`
- Move to next Window: `prefix + n`
- Move to previous Window: `prefix + a`
- You can also use window number to jump to a specific window. this is where renaming windows is helpful. `prefix + 0`
- Close window: `prefix + &`
