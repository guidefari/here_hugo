---
title: "What is a PTY?"
date: 2026-08-06T00:19:49+02:00
description: A pseudo-terminal lets a program behave as though it is connected to a real terminal.
tags: [unix, terminals]
---

A **PTY** (pseudo-terminal) is the small Unix primitive underneath an interactive terminal session. If you know [tmux](https://github.com/tmux/tmux/wiki), [mprocs](https://github.com/pvolok/mprocs), or [herdr.dev](https://herdr.dev/), it is useful to think of a PTY as the wiring that lets those tools host programs that believe they are talking to a real terminal.

## The short version

A PTY is a pair of connected virtual devices:

- the **master** side is controlled by a terminal emulator, multiplexer, or other terminal software;
- the **slave** side looks like a real terminal to a shell or program.

```text
keyboard → terminal emulator → PTY master ⇄ PTY slave → shell
```

The [shell](/bliki/shell/) and programs running inside it do not need to know that the terminal is virtual. They read input from the slave and write output to it. Terminal software reads that output from the master and renders it for you.

This is different from an ordinary [Unix pipe](https://man7.org/linux/man-pages/man2/pipe.2.html). A pipe moves bytes. A PTY also carries the rules and signals that make a terminal feel like a terminal: [window size](https://man7.org/linux/man-pages/man4/tty_ioctl.4.html), raw and canonical input modes, [job control](https://man7.org/linux/man-pages/man2/setpgid.2.html), interrupt keys such as `Ctrl-C`, and the terminal's identity. [Jobs and job control](/bliki/jobs/) are the shell's way of managing commands that share the terminal.

That extra behaviour is why interactive programs such as `vim`, `top`, `ssh`, and shells work properly in a PTY but often behave strangely when their input or output is redirected to a plain pipe.

## How this maps to tools you know

If you use **tmux**, the useful distinction is:

- tmux is the long-lived **session and multiplexer**. It owns windows and panes, remembers them after your client disconnects, and decides which pane receives your keystrokes.
- each pane normally has its own PTY. The shell in the pane sees the PTY slave; tmux reads and writes through the corresponding master.

```text
terminal emulator
        │
        ▼
      tmux client ── tmux server
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
              PTY pair            PTY pair
                 │                   │
               zsh                 nvim
```

**mprocs** is closer to a process dashboard: it starts several commands, gives each one a view, and lets you switch between them. To make those commands interactive, it also needs terminal-like connections. The PTY is the boundary that makes a process such as a dev server, REPL, or test runner act as though a person launched it in a terminal.

**herdr.dev** is a useful modern framing because coding agents are terminal users too. An agent may start a shell, run a command, inspect output, resize its view, interrupt a stuck process, or keep a process alive while it does other work. A PTY gives the agent the same interface a human gets, instead of reducing the program to a stream of piped bytes.

So, in one sentence:

> tmux manages terminal sessions, mprocs manages multiple processes, and a PTY gives each interactive process a terminal-shaped interface.

## Why terminal software needs PTYs

A terminal emulator is not the shell. It draws characters, interprets [ANSI escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code), sends keystrokes, and connects to a PTY. The shell is just another process on the other side.

Terminal software in general, including multiplexers, IDE terminals, web terminals, remote shells, CI tools, and coding-agent runtimes, usually needs to:

1. create a PTY and start a child process attached to its slave side;
2. copy input from a user or client into the master;
3. read output and terminal-control sequences from the master;
4. forward resize events, usually through `SIGWINCH`;
5. keep the child connected when the human-facing client changes or disconnects;
6. pass through interrupts and other job-control behaviour correctly.

The PTY does not render text and it does not manage sessions. It is the contract between those responsibilities. That contract is what lets the same shell run inside a local terminal, a tmux pane, an editor panel, a browser terminal, or an agent runtime without changing the shell itself.

## A concrete mental model

When you type `vim` in a tmux pane, the path is roughly:

```text
keystroke
  → terminal emulator
  → tmux client/server
  → PTY master
  → PTY slave
  → vim

vim's output
  → PTY slave
  → PTY master
  → tmux
  → terminal emulator
  → pixels
```

The names are simpler than they sound. The kernel creates two ends of the connection. Terminal software uses the **master** end. The child process, usually a shell, uses the **slave** end as its standard input, output, and error. There is no second visible terminal: the slave is just the child's terminal-shaped file descriptor.

For a lower-level view, see [`openpty(3)`](https://man7.org/linux/man-pages/man3/openpty.3.html), [`forkpty(3)`](https://man7.org/linux/man-pages/man3/forkpty.3.html), and the [Linux TTY documentation](https://docs.kernel.org/driver-api/tty/index.html).

