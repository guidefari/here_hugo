---
title: "How to Show 10 Million of Something"
date: 2025-07-04T00:00:00-04:00
description: "Christopher Ehrlich on techniques for rendering and interacting with very large collections in the browser."
media_type: youtube
media_url: https://www.youtube.com/watch?v=un3Lu3AKkto
youtube_id: un3Lu3AKkto
creator: React Vienna
tags: [media, video, react, performance, frontend]
images: ['https://i.ytimg.com/vi/un3Lu3AKkto/hqdefault.jpg']
---

Christopher Ehrlich's React Vienna talk on the practical UI and performance techniques behind showing millions of items without overwhelming the browser.

## Notes

- [00:00](https://www.youtube.com/watch?v=un3Lu3AKkto&t=0s) - Frames the talk around a specific kind of frontend performance: not initial page load or React render micro-optimizations, but long-running application sessions with huge interactive datasets.
- [01:00](https://www.youtube.com/watch?v=un3Lu3AKkto&t=60s) - Introduces the "why would you ever need this?" problem: browser UIs sometimes really do need to expose millions of rows, spans, or events, especially in observability products.
- [01:40](https://www.youtube.com/watch?v=un3Lu3AKkto&t=100s) - Uses Axiom's trace viewer as the motivating example. A trace is presented as a tree of spans that helps explain what happened during a request across many services.
- [03:15](https://www.youtube.com/watch?v=un3Lu3AKkto&t=195s) - First recommendation: avoid showing 10 million things if you can. Pagination, aggregation, server/database-side summarization, and renegotiating requirements should come before heroic UI work.
- [04:15](https://www.youtube.com/watch?v=un3Lu3AKkto&t=255s) - Measure before optimizing, and make local development representative of real user data volumes. Otherwise you optimize the wrong bottlenecks.
- [04:50](https://www.youtube.com/watch?v=un3Lu3AKkto&t=290s) - Explains how cheap span pricing led customers to use tracing data more like profiling data, producing much larger traces than the product originally expected.
- [05:35](https://www.youtube.com/watch?v=un3Lu3AKkto&t=335s) - Discusses why naive tree truncation does not solve the product problem. Loading only a few levels can hide the very latency or sequencing issue the trace viewer is meant to reveal.
- [06:30](https://www.youtube.com/watch?v=un3Lu3AKkto&t=390s) - The first scaling bottleneck was not React, but a Node backend-for-frontend layer. The fix was to skip the slow middle layer and query the faster Go/database backend more directly.
- [07:35](https://www.youtube.com/watch?v=un3Lu3AKkto&t=455s) - React-specific bottleneck: rendering millions of DOM nodes is a non-starter. Virtualization keeps the DOM small by only rendering visible rows.
- [08:00](https://www.youtube.com/watch?v=un3Lu3AKkto&t=480s) - Mentions virtualization libraries: `virtua` for easy setup and TanStack Virtual for more power with more configuration.
- [08:35](https://www.youtube.com/watch?v=un3Lu3AKkto&t=515s) - Virtualization alone is not enough if you still preprocess the full 10-million-item array before rendering. Avoid mapping, filtering, or transforming the whole dataset in React before it reaches the virtualizer.
- [09:15](https://www.youtube.com/watch?v=un3Lu3AKkto&t=555s) - Memory profiling showed the next wall: 8,000 spans could consume roughly 750 MB when stored as rich observable state.
- [09:45](https://www.youtube.com/watch?v=un3Lu3AKkto&t=585s) - MobX-style observable objects were too expensive at this scale because millions of spans with many attributes imply huge numbers of proxies.
- [10:15](https://www.youtube.com/watch?v=un3Lu3AKkto&t=615s) - They moved large trace data outside React state into plain JavaScript objects, then used a lightweight message-passing layer to request only the data the UI needed.
- [10:35](https://www.youtube.com/watch?v=un3Lu3AKkto&t=635s) - Lookup tables by span ID were faster than scanning arrays when the UI needed one specific span.
- [11:10](https://www.youtube.com/watch?v=un3Lu3AKkto&t=670s) - Reduced "skeleton" span objects became the default: enough fields to draw the tree and timing view, but not every attribute attached to every span.
- [11:40](https://www.youtube.com/watch?v=un3Lu3AKkto&t=700s) - Full span details are fetched lazily, including prefetch-on-hover so the details are likely ready by the time the user clicks.
- [12:10](https://www.youtube.com/watch?v=un3Lu3AKkto&t=730s) - For small traces, under about 5,000 spans, they still load the whole thing to preserve the better desktop-like experience.
- [13:00](https://www.youtube.com/watch?v=un3Lu3AKkto&t=780s) - Avoid temporary memory explosions. Mapping over 10 million elements briefly creates another large array, so transformations need to be streaming/incremental instead of duplicating the whole dataset.
- [13:35](https://www.youtube.com/watch?v=un3Lu3AKkto&t=815s) - Notes a JavaScript data-structure gotcha: `shift` and `unshift` are O(n). When possible, structure transformations around `pop` and `push` instead.
- [14:00](https://www.youtube.com/watch?v=un3Lu3AKkto&t=840s) - Network waterfalls become central. Long queueing means browser concurrency is saturated, long server time means backend work is slow, and long download time means the payload is too big.
- [14:40](https://www.youtube.com/watch?v=un3Lu3AKkto&t=880s) - Column-oriented payloads helped more than row-oriented JSON because repeated values compress better. This cut request sizes by roughly 30-50% depending on customer data shape.
- [16:00](https://www.youtube.com/watch?v=un3Lu3AKkto&t=960s) - Chunking needs to support parallel loading. Cursor designs that require each chunk to finish before the next can start leave too much latency on the table.
- [17:20](https://www.youtube.com/watch?v=un3Lu3AKkto&t=1040s) - Ends with the cultural point: performance work has to be rewarded. Many 10% improvements can compound into order-of-magnitude wins.
