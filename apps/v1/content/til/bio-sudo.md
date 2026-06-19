---
title: "How to use your fingerprint as sudo password on Mac"
date: 2024-09-05T04:48:21+02:00
description: Found this on twitter a while ago. I always have to login to twitter when I'm setting it up on a new laptop, lol.
tags: [til, dx]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Fingerprint+as+Sudo+Password+On+Mac']
---

## Open the file
```sh
sudo nvim /etc/pam.d/sudo
```
- You can't write to this file without sudo permissions.

## Add this line to the top of the file
```sh
auth sufficient pam_tid.so
```

## [Creds](https://x.com/kdrag0n/status/1693326279674630176)
