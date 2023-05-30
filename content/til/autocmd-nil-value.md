---
title: fix for - attempt to call local autocmd (a nil value)
date: 2023-05-30T14:56:05+02:00
description: An error I faced while trying to get my nvchad editor running
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---
 
 I faced exactly the same error as seen [here](https://www.reddit.com/r/neovim/comments/v9nh4u/comment/ibxjjtt/). Here it is in full:

 ```bash
Error detected while processing /home/*********/.config/nvim/init.lua:

E5113: Error while calling lua chunk: /home/*********/.config/nvim/lua/core/init

.lua:6: attempt to call local 'autocmd' (a nil value)

stack traceback:

/home/*********/.config/nvim/lua/core/init.lua:6: in main chunk

[C]: in function 'require'

/home/*********/.config/nvim/init.lua:7: in main chunk

Press ENTER or type command to continue
 ```

# Scenario
- A debian distro
- Attempting to install & run [NvChad](https://nvchad.com/)
- NvChad has a few simple pre-requisites: certain type of font, neovim (hint, this is where the issue was)
- Font was installed properly, I love [Jetbrains Mono](https://www.programmingfonts.org/#jetbrainsmono), so I went with that as per.
- nvim however, was `version 0.6.*`, installed via `apt`. NvChad's lua files need `nvim 0.9.*`

# Solution
- The fix was [installing nvim directly from the repo using curl](https://github.com/neovim/neovim/wiki/Installing-Neovim#linux). It's distributed as an `AppImage ("universal" Linux package)` which promise to run on most linux systems.
