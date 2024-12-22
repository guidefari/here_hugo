---
title: "GUI and CLI"
date: 2024-12-22T09:02:45+02:00
description: Graphics user interfaces and Command line interfaces have quite a bit in common.
tags: [ux, design, cli]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Gui+Tui']
---

## Glossary
- GUI: Graphics User interface
- CLI: Command Line interface
- TUI: Terminal User interface
  - eg [yazi](https://yazi-rs.github.io/), [lazygit](https://github.com/jesseduffield/lazygit), [terminal.shop](https://www.terminal.shop/), [vim](https://www.lazyvim.org/)

I will use CLI & TUI interchangeably.

## Context
A good experience when interacting with a GUI has a few things in common with a good experience in the terminal.

The intersection is [ux](/tags/ux).

# The similarities
- Follow conventions. Your users likely have common usage patterns that their muscle memory know to look out for
  - Maintain common keyboard shortcuts
  - CLI: maintain common flags/arguments eg `man` page, or `--help` `-h`
- [Provide user feedback](https://clig.dev/#saying-just-enough) when doing stuff in the background.
- Easy discoverability
  - CLI's achieve this via comprehensive text, suggesting commands & subcommands, and providing examples of common stuff.
  - `jq` and `git` are good examples of this.
- If you're performing destructive actions, or [state changes on the machine, inform the user](https://clig.dev/#output).

- This is true for both GUI & CLI apps:
> By default, don't output to the user information that's only understandable by creators of the software.
> Catch errors & rewrite them for humans.

- UX copy is important
  - CLI: When designing commands, subcommands, flags & arguments
  - CLI: Don't use ambiguous or similarly named commands
  - [There's lots of writing on UX copy](https://www.nngroup.com/articles/ux-writing-study-guide/) in the world of GUI apps.

## Related reading
Been enjoying nerding out on this topic a bit. Here's a few interesting links I've found so far:

- [Rules that terminal programs "follow"](https://jvns.ca/blog/2024/11/26/terminal-rules/) : that's where I learnt that `ctrl + w` will delete the last word 🤯
- [Command Line Interface Guidelines](https://clig.dev/): A great read. Would absolutely recommend putting aside an hour or two for this.
- [12 Factor CLI apps](https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46): I haven't read this yet, merely skimmed it. It was cited a few times in [Command Line Interface Guidelines](https://clig.dev/).
- [User experience, CLIs, and breaking the world](https://uxdesign.cc/user-experience-clis-and-breaking-the-world-baed8709244f): Another one I have't read yet
- [How we sold coffee from the terminal](https://www.youtube.com/watch?v=POlZS8PcyZw)
- Dax [tweeted a bunch of stuff](https://www.google.com/search?q=site:twitter.com+thdxr+multiplexer) while building sst's multiplexer terminal ui.