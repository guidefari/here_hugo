---
title: "Vim"
date: 2022-01-03T14:20:41+02:00
description: Useful vim resources 
tags: [vim, learning]
---

# links
- [4 week plan to master vim](https://peterxjang.com/blog/how-to-learn-vim-a-four-week-plan.html)
- [Cheatsteet](https://vimsheet.com/)


# videos
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


### Navigating around a file 
- `Shift + G` - Takes you to end of file