---
title: "Pulse"
date: 2026-02-14T02:04:04+02:00
description: a CLI tool to check on all your git repos at once
tags: [go, cli]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Pulse"]
---

My brain runs an "out of sight, out of mind" policy. I come back to my laptop after a day or two away and genuinely can't remember what state things are in. Which repos have uncommitted work? Did I push that branch? What was I even working on last two nights ago?

When juggling a dozen or more repos, that mental overhead adds up fast. I set out to build a little tool to help me visualise local repo state.

## What it does

Pulse recursively scans a directory tree, finds every git repo, and prints a status table.

```bash
./pulse --path ~/source --depth 3
```

Key things it surfaces:

- **Clean/dirty status** with changed file counts
- **Ahead/behind remote** — unpushed (↑) and unpulled (↓) commits vs origin
- **Ghost detection** — repos inactive for 6+ months get flagged with a 👻
- **Detail mode** (`--detail`) — shows recent commits and lines changed per repo
- **Non-git detection** — flags directories sitting alongside repos that aren't git-tracked
- **JSON output** (`--format json`) — pipe to `jq` or feed to other tools. I figure this can be useful when I'm ready to go web.

## Some technical bits

Written in Go. Directory traversal uses [godirwalk](https://github.com/karrick/godirwalk) (faster than `filepath.Walk`, allegedly.), and repos are analyzed in parallel through a worker pool.

A basic scan felt like it was taking too long, 20+ seconds. Which straight away was unacceptable for a small util meant to give me a quick glance. I added timing logs, and chose to go with [OpenTelemetry](https://opentelemetry.io/) . run with `--time` and you get a waterfall timeline showing where time is being spent.

That's how I discovered that [go-git](https://github.com/go-git/go-git)'s worktree status was the bottleneck. The OTel waterfall made it obvious. Swapping that one operation to shell out to `git status --porcelain` instead gave a 10-20x speedup, while keeping go-git for everything else (branch info, commit history, remote status).

I initially instrumented the timing manually, before going the OTel route.

## Screenshots

{{< figure src="https://d20tmfka7s58bt.cloudfront.net/pulse/basic-scan.png" caption="Basic scan — repo name, status, last active, branch, ahead/behind, and 7-day activity sparkline" >}}

{{< figure src="https://d20tmfka7s58bt.cloudfront.net/pulse/detail.png" caption="Detail mode (`--detail`) — recent commits per repo with lines added/removed" >}}

{{< figure src="https://d20tmfka7s58bt.cloudfront.net/pulse/timed.png" caption="Performance breakdown (`--time`) — OTel waterfall timeline and per-repo span tree" >}}

No LLMs were harmed in the building of this project 💀

## Links

- [GitHub repo](https://github.com/guidefari/pulse)
