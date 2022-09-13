---
title: "Update a single Ubuntu/Linux package"
date: 2022-09-13T07:00:52+02:00
description: Getting tired of always having to google how to do this, and I just haven't committed it to memory yet.
tags: [linux]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Update%20a%20single%20Ubuntu%2FLinux%20package']
---

```bash
sudo apt update

sudo apt --only-upgrade install code
```

# list packages installaed apt
In case you need to confirm package name before updating

```bash
apt list --installed
```