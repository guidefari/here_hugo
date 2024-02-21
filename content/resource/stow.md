---
title: "Version Controlled dotfiles"
date: 2024-02-20T19:01:08+02:00
description: Shout out GNU stow.
tags: [resource, bash]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Stow']
---

[Dotfiles](https://dotfiles.io/) are useful for all kinds of config on your machine.

At some point, I spent so much time editing my dotfiles to personalise my [terminal](/pde).
Inevitably, one has to change machines. Imagine having to lose all those hours of sweat, tears, & effort. Could never be me.

### Enter [GNU stow](https://www.gnu.org/software/stow/) + a git repository

Stow allows you to keep one directory as the source of truth for all your dotfiles,
meaning you can version control that stuff easy.

You then use sub-directories to manage the different types of config files,
in my case `nvim, tmux, zsh, tmuxifier`

## How I stow
Stow relies on how you organise the contents of your sub-directories,
Then places those dotfiles where they belong in the home directory,
as [symlinks](https://en.wikipedia.org/wiki/Symbolic_link). 

To illustrate, let's look at my `zsh` & `tmux` configs:

`~/dotfiles/zsh/.zshrc`
- If I run `stow zsh` in the `~/dotfiles` directory, the symlink is created at `~/.zshrc`

`~/dotfiles/tmux/.tmux.conf`
- If I run `stow tmux` in the `~/dotfiles` directory, the symlink is created at `~/.tmux.conf`

Also worth mentioning, your `dotfiles` directory has to be in the home directory for this to work, 
ie `~/dotfiles`. Stow places the symlinks in the parent directory of where you run the command from.

## Tracking stable configs
Another thing I like about stow + git -> I can keep track of the last stable version of any config,
which gives me more confidence to experiment and change things around.

## How to set it up
{{<youtube y6XCebnB9gs>}}

{{<youtube MJBVA4LeJKA>}}

## Acknowledgements
- [ThePrimeagen taught me about stow](https://frontendmasters.com/courses/developer-productivity/dotfiles-management/).