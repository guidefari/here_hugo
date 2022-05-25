---
title: "TIL: Vscode Workspace settings"
date: 2022-05-25T02:52:40+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til]
---

# VS code workspace settings

I was wondering wtf was making my `formatOnSave` settings not apply to this one specific codebase. 
Turns out me from 10 months ago ran this command:

```bash
touch .vscode/settings.json
```

and put this in it: 

```json
{
  "workbench.colorCustomizations": {
    "titleBar.activeForeground": "#000",
    "titleBar.inactiveForeground": "#000000CC",
    "titleBar.activeBackground": "#649664CC",
    "titleBar.inactiveBackground": "#649664"
  },
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.formatOnSave": false
  },
  "eslint.alwaysShowStatus": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "cSpell.ignoreWords": [
    "authenticateditem"
  ]
}
```

### why I had this file in the first place

I was probably actively developing multiple projects at the time, and needed a way to tell the VS code windows at a glance. But I copied over some unwanted configs too, if you look closely at the config, you’ll see that `formatOnSave` is turned off for for `.js` & `.jsx`

```json
"[javascript]": {
    "editor.formatOnSave": false
  },

"[javascriptreact]": {
    "editor.formatOnSave": false
  },
```

### Don’t blindly copy pasta

I can tell you with 100% confidence, a few hours after writing this heading, I blindly copy pasted some bash commands😂smh