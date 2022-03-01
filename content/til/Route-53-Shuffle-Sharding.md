---
title: "How Route 53 uses Shuffle Sharding"
date: 2022-03-01T11:27:17+02:00
description: How Route 53 uses Shuffle Sharding to improve availability when assigning customers to virtual name servers.
tldr: How Route 53 uses Shuffle Sharding when assigning customers to virtual name servers.
tags: [til, backend, cloud, aws]
---

interesting [read](https://aws.amazon.com/builders-library/workload-isolation-using-shuffle-sharding/
) on how Route 53 uses shuffle sharding (when assigning customers to virtual name servers) as part of their efforts to achieve that 100% availability SLA

## src
Came across it while watching this video, which goes into detail on other methods used to achieve that 100% availability:
- {{<youtube E33dA6n9O7I>}}

