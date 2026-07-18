---
title: "Tailscale uptime monitor with push notifications"
date: 2026-07-18T14:00:00+02:00
description: A version-controlled systemd timer that pings a machine on my tailnet and pushes an ntfy.sh notification when it goes down or comes back up.
tags: [linux, infra, monitoring, playbook]
draft: true
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Tailscale%20uptime%20monitor%20with%20push%20notifications']
---

Wanted a phone alert when `devbox` drops off my tailnet, instead of noticing hours later. Two decisions mattered more than the code.

## Not Claude Code's cron

Claude Code can schedule a recurring prompt, but that only fires while a session is idle and auto-expires after 7 days. Fine for a one-off reminder, wrong tool for something that's supposed to run forever. Went with a per-user [systemd](/systemd) timer instead — same reasoning as the devbox note: [`systemd`](/systemd) is what makes a process come back after logout or reboot, `tmux` just lets you reattach to one that's still running.

The gap: user services normally die when you log out. `loginctl enable-linger <user>` fixes that — it tells systemd to keep your user services running with no session attached at all.

## Not raw shell commands either

First instinct was to just `mkdir`/`systemctl enable` my way to a working timer. Repeatable and inspectable beats "I definitely remember what I ran" the next time a machine needs the same setup, so it's a small git repo instead: script, one config file per monitored machine, systemd unit *templates* (`uptime-monitor@.service` / `.timer`), and an idempotent `install.sh` that symlinks them into `~/.config/systemd/user` and enables a timer per `targets/*.conf`. Adding a second machine is a new config file plus a re-run, not remembering the systemctl incantations again.

## The check itself

```bash
if timeout 10 tailscale ping --c 1 "$TARGET_HOST" >/dev/null 2>&1; then
  NEW_STATE="up"
else
  NEW_STATE="down"
fi
```

`tailscale ping` is enough — reachability on the tailnet, not a specific service. State is cached in a file per target, and a push only fires on a transition (`up`→`down` or back), not on every 2-minute tick — otherwise "it's down" becomes background noise within the hour.

Push notifications go through [ntfy.sh](https://ntfy.sh): a topic name is the whole auth model — no account, `curl -d "message" ntfy.sh/<topic>`, subscribe from the phone app. That also makes the topic name the one thing worth treating as a secret: anyone who has it can read or post to it, so it's a random suffix, not `devbox-alerts`.

Related: [MTTR > MTBF](/mttr) is the underlying argument for bothering with this at all — a failure you're not notified about might as well not have a monitor.
