---
title: "Personal Development Environment"
date: 2023-05-31T05:18:59+02:00
description: My personalised IDE setup
tags: [resource]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=Personal+Development+Environment",
  ]
aliases: [vim, tmux]
---

# Why

- Putting together these bells & whistles teaches me how different programming languages work, how other people build and distribute software. A world that's slightly different from my day job in web dev. So there's learning interest
- An environment where vim motions are a first class citizen

# Tools

- nvim - used nvchad as base config
- lua is the scripting language used to config & setup the neovim env
- tmux for session management
- lazy git
- mason

# todo

- tmux resurrect
- ensure I'm well setup for react & typescript

# Tmux notes

{{<youtube DzNmUNvnB04>}}

## Key Concepts

- `Prefix`: keypress combination you need to hit to get tmux's attention. This can be reconfigured to match preference
- Vertical split: `prefix + %`
- Move around panes `prefix + ->` or `<-`
- Attach to existing session: `tmux attach-session -t {session_id}`
- [vim]({{<ref vim>}})
- Panes
- Sessions

## Move around windows

- Create new Window: `prefix + c`
- Move to next Window: `prefix + n`
- Move to previous Window: `prefix + a`
- You can also use window number to jump to a specific window. this is where renaming windows is helpful. `prefix + 0`
- Close window: `prefix + &`

## tmuxifier

- `tmuxifier s here_hugo` - to load a session

---

# Vim notes

## links

- [4 week plan to master vim](https://peterxjang.com/blog/how-to-learn-vim-a-four-week-plan.html)
- [Cheatsteet](https://vimsheet.com/)

## videos

{{<youtube wlR5gYd6um0>}}
{{<youtube H3o4l4GVLW0>}}

## note to self

**how to highlight**:

- `v` is visual mode
- `Shift v` is visual line mode.

- there's 3 options to **exit insert mode**, `<esc>`, `Ctrl + C`, and `Ctrl + [`
- `w` & `b` are compadres
- use these keys, plus the movements & yankind & pasting stuff I've learnt till they feel like second nature.

### new commands

{{<youtube gSHf_b6AWKc>}}

- `a` puts you into insert mode, think of it as 'append after where I am'.
- `Shift + i` will take you to the beginning of a line
- `Shift + a` will take you to the end of a line
- `/` puts you into search mode, use `n` & `Shift + n` to get around
- 🤯 `*` will automatically take you to the next occurence of a word.`#` does the opposite. also, you can use `n` or `Shift + n` to go through your search.
- `$` takes you to end of line.
- `y s a {` - allows you to **surround** **around** `{`

### misc

- groovebox colorscheme for vim
- maybe start to keep my dotfiles in one place? or continue with configs first till it feels comfy
- [vim-galor](https://github.com/mhinz/vim-galore)(repo) - All things vim. maybe a good starting point when setting up neovim again?

### configure nvim, packer, lua

plus [nightfox](https://github.com/EdenEast/nightfox.nvim) theme.
{{<youtube qb6fPgZMRF4>}}

- Make sure to `PackerSync` after copying configs from git or the other machine:)
- [Vim bootstrap](https://vim-bootstrap.com/) - a way to generate a `.vimrc`. This is an alternative to lua, useful if you want to keep things super simple.
- [vimcolorschemes](https://vimcolorschemes.com/)

### Navigating around a file

- `Shift + G` - Takes you to end of file
- `:!rm %` - to delete the current file. as seen https://stackoverflow.com/questions/16678661/how-can-i-delete-the-current-file-in-vim
