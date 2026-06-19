---
title: "namespaces demo"
date: 2024-09-01
description: "Process namespace isolation demonstration using unshare"
tags: ["docker", "namespaces", "demo"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=namespaces%20demo']
---

# namespaces demo

```bash
# Create process namespace isolation
sudo unshare --pid --fork --mount-proc chroot /tmp/jail /bin/bash

# Now ps aux only shows processes in this namespace
ps aux

# In another terminal, you can still see this process
ps aux | grep bash
```