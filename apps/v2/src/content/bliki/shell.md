---
title: "What Is a Shell?"
date: 2026-08-16T12:45:00+02:00
description: A shell reads commands, starts programs, and connects them together.
tags: [unix, terminals]
---

A **shell** is a program that lets you control a Unix system by typing commands. Common shells include [Bash](https://www.gnu.org/software/bash/), [Zsh](https://zsh.sourceforge.io/), [Fish](https://fishshell.com/), and [Dash](https://wiki.archlinux.org/title/Dash).

When you open a terminal, you usually see a terminal emulator running a shell:

```text
terminal emulator → PTY → shell → programs
```

The terminal emulator draws the screen and sends your keystrokes. The [PTY](/pty/) gives the shell a terminal-shaped connection. The shell reads your command, starts the requested program, and prints the result.

## A shell reads commands

When you type:

```sh
ls -la
```

the shell:

1. reads the line;
2. splits it into a command and arguments;
3. finds the `ls` program;
4. starts it as a child process;
5. waits for it to finish;
6. prints another prompt.

The shell does not usually implement `ls` itself. It starts the `ls` program and connects that program to the terminal.

## A shell connects programs

The shell also provides syntax for composing programs:

```sh
cat access.log | grep 500 > errors.txt
```

Here the shell:

- starts `cat` and `grep`;
- connects `cat`'s output to `grep`'s input with a pipe;
- writes `grep`'s output to `errors.txt`;
- manages the whole pipeline as one [job](/bliki/jobs/).

This is why small Unix programs can do useful work together. The shell acts as the glue between them.

## Shell features

A shell commonly provides:

- **commands**, such as `cd`, `export`, and `alias`;
- **program launching**, such as `git status`;
- **pipes**, using `|`;
- **redirection**, using `<`, `>`, and `>>`;
- **variables**, such as `$HOME`;
- **globbing**, such as `*.log`;
- **conditionals and loops**;
- **scripts**, which are saved sequences of shell commands;
- **job control**, including `&`, `fg`, `bg`, and `Ctrl-Z`.

Some commands are **builtins**. `cd` is the classic example. A child process cannot change the shell's current directory, so the shell must implement `cd` itself.

Other commands are separate executable files. You can often find one with:

```sh
command -v git
```

## Shell versus terminal

These are different programs:

- the **terminal emulator** displays text and sends input;
- the **PTY** provides the terminal-shaped connection;
- the **shell** reads commands and starts programs;
- the **program** does the work requested by the command.

For example, when you run `vim` in a terminal, `vim` is not part of the shell. The shell starts it, and the PTY connects it to the terminal emulator.

A shell is therefore best understood as a command interpreter and process launcher. It is the layer that turns typed text into running programs and connected streams.
