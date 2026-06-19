---
title: "chroot demo"
date: 2024-09-01
description: "Hands-on demonstration of chroot for process isolation"
tags: ["docker", "chroot", "demo"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=chroot%20demo']
---

# chroot demo

```bash
# Create a minimal environment
mkdir /tmp/jail
mkdir /tmp/jail/{bin,lib,lib64}

# Copy essential binaries
cp /bin/bash /tmp/jail/bin/
cp /bin/ls /tmp/jail/bin/
cp /bin/ps /tmp/jail/bin/

# Copy required libraries
ldd /bin/bash | grep -o '/lib[^ ]*' | xargs -I {} cp {} /tmp/jail/lib/

# Enter the chroot
sudo chroot /tmp/jail /bin/bash

# Inside chroot, try:
ps aux  # You'll see all processes (not isolated!)
```


A longer example of that that grep & xargs pipe operation is doing

```bash
ldd /bin/bash

# this will list the dependencies, copy all the thingies that have paths

cp /lib/aarch64-linux-gnu/libtinfo.so.6 /lib/aarch64-linux-gnu/libc.so.6 /lib/ld-linux-aarch64.so.1 /my-new-root/lib

```

## References
- https://containers-v2.holt.courses/lessons/crafting-containers-by-hand/chroot