---
title: "Pid1"
date: 2025-09-27T09:54:28+02:00
description: 
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Pid1']
---

While learning about `CMD` vs `ENTRYPOINT` patterns in Dockerfile, the importance of process ID 1 was highlighted.
Turns out, PID 1 has got some special responsibilities. 
This note focuses on the responsibilities & implications inside containers, let's get it.

## What is PID 1
- the first process

## 1. Signal Handling and Propagation

- **Orphaned Process Management**: When parent processes die, their children are "adopted" by PID 1
- **Signal Propagation**: Expected to forward signals to child processes
- **Default Behavior**: Unlike regular processes, PID 1 does not terminate on signals like SIGTERM by default - it must explicitly handle them

## 2. Zombie Process Reaping

- **Zombie Processes**: When a process ends, it becomes a "zombie" until its parent collects its exit status
- **Cleanup Duty**: PID 1 is responsible for "reaping" zombie processes when their original parents terminate
- **Resource Management**: Without proper reaping, zombie processes accumulate and consume system resources

## 3. Container Lifecycle Management

- **Container Termination**: The container lives as long as PID 1 is running
- **Exit Codes**: The exit code of PID 1 becomes the exit code of the container
- **Graceful Shutdown**: Should coordinate proper shutdown of all container services

## 4. Init System Responsibilities

In traditional Linux systems, PID 1 is the init system (like systemd), which handles:
- System initialization
- Service management
- System shutdown sequence

In containers, these responsibilities are simplified but still include managing processes and handling clean shutdowns.

## Practical Implications in Docker

Using shell form:
```dockerfile
CMD npm start
```

The shell becomes PID 1, but:
- Most shells don't properly forward signals to child processes
- They don't typically handle zombie process reaping
- When the shell receives SIGTERM, it doesn't pass it to your application

Using exec form:
```dockerfile
CMD ["npm", "start"]
```

Your application becomes PID 1, so:
- It directly receives shutdown signals
- It's responsible for its own graceful termination
- It should properly handle zombie processes if it spawns child processes

This is why specialized minimal init systems like `tini` or `dumb-init` are sometimes used as PID 1 in containers to handle these responsibilities correctly.