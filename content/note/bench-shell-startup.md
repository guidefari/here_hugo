---
title: "Benchmarking Shell Startup Latency"
date: 2026-04-03T16:46:17+02:00
description: I tracked shell startup lag to Kiro's login-shell hooks and moved them behind an on-demand wrapper.
tags: [zsh]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=Benchmarking+Shell+Startup",
  ]
---

## Context

I spend a lot of time in the terminal. It's a scratchpad for me.
At the time of writing, I have 57 tmux panes spread across 14 sessions. I start and stop A LOT of shells.

After installing the `kiro-cli`, my shell felt rather sluggish: new tabs were not immediately ready to use, and the delay showed up in both normal terminal windows and tmux.

## What I measured

Before any changes, `zsh -i -c exit` was roughly `0.29s` warm and `0.43s` cold.
`zsh -l -i -c exit` sat around `0.31s`.

## What happened?

Kiro injected shell hooks into both `.zshrc` and `.zprofile`.

After gating those hooks, login-shell startup dropped to about `0.04-0.07s` from `0.29-0.43s`.

## What I changed

- Removed Kiro hooks from shell startup.
- Moved Kiro integration behind an on-demand `kiro-cli()` shell wrapper.
- Swapped the prompt to `starship`. Unnecessary in hindsight, but whatever. I've been wanting to try something other than `omz`.

## After

Current warm timings are roughly `0.05s-0.06s` for both interactive and login shells, with the first shell in a batch sometimes landing around `0.17s-0.19s`.

## Benchmark timeline

| Step                           | Timing                                                             |
| ------------------------------ | ------------------------------------------------------------------ |
| Baseline                       | ~`0.36s`                                                           |
| Remove OMZ                     | `0.21s` faster for normal, non-login shells                        |
| Move Kiro hooks out of startup | faster by `0.02s-0.04s` for normal shells, `0.24s` on login shells |

`compinit` was first optimized by using `compinit -C` with `~/.zcompdump` and compiling that cache with `zcompile`, but I removed that change later because it was not worth the extra maintenance.

I also tried lazy-loading Bun and terraform completion, but I removed that too for the same reason.

## Takeaway

Interesting reminder about `.zprofile` and `zsh` hooks.
