---
title: "How Route 53 uses Shuffle Sharding"
date: 2022-03-01T11:27:17+02:00
description: How Route 53 uses Shuffle Sharding to improve availability when assigning customers to virtual name servers.
tldr: How Route 53 uses Shuffle Sharding when assigning customers to virtual name servers.
tags: [til, backend, cloud, aws, route53, architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=How%20Route%2053%20uses%20Shuffle%20Sharding']
---

interesting [read](https://aws.amazon.com/builders-library/workload-isolation-using-shuffle-sharding/
) on how Route 53 uses shuffle sharding (when assigning customers to virtual name servers) as part of their efforts to achieve that 100% availability SLA

## src

Came across it while watching this video, which goes into detail on other methods used to achieve that 100% availability:

- <div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/E33dA6n9O7I" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
