---
title: "Jobs and Job Control"
date: 2026-08-16T12:30:00+02:00
description: How a Unix shell manages commands in the foreground and background.
tags: [unix, terminals]
---

A **job** is a command that your [shell](/bliki/shell/) is managing. It may be one process:

```sh
vim notes.txt
```

or a pipeline containing several processes:

```sh
cat access.log | grep 500 | less
```

The shell treats that whole pipeline as one job.

## Foreground and background

A foreground job owns the terminal. When you run:

```sh
vim notes.txt
```

your keystrokes go to `vim`. The shell waits for `vim` to finish before showing another prompt.

Add `&` to start a background job:

```sh
npm run dev &
```

The shell starts the command, but gives you a new prompt immediately. You can see the jobs it knows about with:

```sh
jobs
```

A typical result looks like this:

```text
[1]-  Running    npm run dev &
[2]+  Stopped    vim notes.txt
```

The numbers are shell job IDs. `%1` means “job 1”; it is not the same thing as process ID 1.

## Stopping and resuming jobs

These keys send signals to the foreground job:

- `Ctrl-C` sends `SIGINT`, asking the job to stop;
- `Ctrl-Z` sends `SIGTSTP`, stopping the job without ending it.

After `Ctrl-Z`, the shell gets control of the terminal back. You can resume the stopped job in the background:

```sh
bg %2
```

or bring it back to the foreground:

```sh
fg %2
```

## Why PTYs matter

The shell and its commands share a [PTY](/pty/). The PTY keeps track of which process group currently owns the terminal. The shell gives that ownership to a foreground job, then takes it back when the job exits or stops.

That is how `Ctrl-C` reaches `vim` or `npm` instead of the shell, and how the shell knows when it is safe to print the next prompt.

So:

- a **process** is one running program;
- a **pipeline** is several processes connected together;
- a **job** is the shell's name for one command or pipeline;
- **job control** is the shell's system for moving jobs between the foreground and background, stopping them, and resuming them.
