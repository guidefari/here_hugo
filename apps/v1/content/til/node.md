---
title: "TIL some Node"
date: 2023-06-16T23:24:57+02:00
description: Async event loop vs concurrency (threading)
tags: [resource, node]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%20some%20Node']
---

# Takeaways
## Asnyc Event loop vs Conurrency via threads
- Async event loop is good for high throughput, low latency I/O bound tasks. UI programming is a good example of this
- Concurrency via threads more efficient for CPU bound tasks

# Src
- [Digging into Node.js by Kyle Simpson](https://frontendmasters.com/courses/digging-into-node/)

# Related reading
Classic resource on how the JS event loop works. I'm overdue to rewatch this😉
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/8aGhZQkoFbQ" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
