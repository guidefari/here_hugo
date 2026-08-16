---
title: "What is a PTY?"
date: 2026-08-06T00:19:49+02:00
description: A pseudo-terminal lets a program behave as though it is connected to a real terminal.
tags: [unix, terminals]
---

A **PTY** (pseudo-terminal) is a pair of connected virtual devices:

- the **master** side is controlled by a terminal emulator or multiplexer;
- the **slave** side looks like a real terminal to a shell or program.

```text
keyboard → terminal emulator → PTY master ⇄ PTY slave → shell
```

Unlike ordinary pipes, a PTY provides terminal behaviour such as window dimensions, raw mode, job-control signals, and terminal identity. That is why interactive programs like shells, `vim`, and `top` behave correctly inside one.

A terminal multiplexer sits between your terminal and one or more PTYs: it forwards input, handles resize events, and renders each program's output.
