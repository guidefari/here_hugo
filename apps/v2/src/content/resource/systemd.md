---
title: "Resource: systemd"
date: 2026-07-18T00:00:00+02:00
description: What systemd and systemctl are, and how they help keep long-running devbox processes alive.
tags: [linux, infra]
---

`systemd` is the init system and service manager on most modern Linux distros. It is usually [PID 1](/docker-presentation/pid1), so it starts the machine, brings up services, and keeps them running.

`systemctl` is the CLI you use to manage `systemd` units.

What this gives you access to:

- services that start on boot
- restart policies for crashed processes
- timers instead of cron for scheduled jobs
- logs through `journalctl`
- user services, if you want per-user daemons

For a devbox, the useful bit is simple: put your process in a `.service` file, enable it, and `systemd` will start it after reboot.

That makes it a good fit for keeping a Claude session runner, a helper daemon, or any other always-on process alive even after the box reboots. [`tmux`](/tmux) helps with reattaching to a session, but `systemd` is what makes the process come back.

```ini
[Service]
ExecStart=/usr/local/bin/my-app
Restart=always
```

Then enable it with `systemctl enable --now my-app.service`.

If I need a process to survive reboots, `systemd` is usually the first thing to reach for.
