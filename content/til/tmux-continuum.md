---
title: "TIL: Tmux Continuum"
date: 2026-06-16T23:54:27+02:00
description: Automatic tmux session save and restore via tmux-continuum, paired with tmux-resurrect
tags: [til, tmux, productivity]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Tmux+Continuum']
---

[tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) auto-saves your tmux environment every 15 minutes via [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect). If your machine restarts, you get every session, window, pane, working directory, and running program back with `<prefix> + R`.


Key binds with my config (prefix is `C-Space`):
- `<prefix> + S` -- save manually
- `<prefix> + R` -- restore from last save

---

not sure I got back every running program the first time I tried resurrect.
the only program that got restored was `nvim`
