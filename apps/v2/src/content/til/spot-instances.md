---
title: "TIL: Spot Instances"
date: 2025-11-10T07:31:44+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, aws]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Spot+Instances']
---

## Where this started
Back in Jan '25, Dax from SST uploaded a video about spot instances. He explained the economics behind them, their advantages, and their tradeoffs.

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/2RrAZiTZoeA" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

To sum it up, spot instances are a way to purchase unused server capacity at a discount.
This can be significantly cheaper than on-demand instances, but they come with the risk of being terminated at any time.

For web services or other workloads that are delivered via rolling deployments, you have to handle the case of graceful shutdowns and moving to new containers in any case. So this shouldn't be a dealbreaker.

## Event Bridge notification
aws will send a message to event bridge when you’ve got two minutes until they take the node. This is when you stop sending new traffic to the node so it can gracefully shutdown, then reroute traffic.

It's also on you to make sure your application can process those requests within the 2 minute window.

## In Production
Fast forward a few months later to the AWS summit, I learnt of a Fintech product in South Africa that uses Spot Instances as their main compute in production.
[Karpenter](https://karpenter.sh/) is a big component in their orchestration toolbox, helping them seamlessly stay on top of swapping spot instances in and out.

## Contrast: On Demand instances
On demand instances let you pay for the time you use a machine, can be started and stopped at any time, and your cloud provider won't terminate them.


## Related reading
[EC2 Instance Purchasing Options Overview](https://www.youtube.com/watch?v=wNDOErA8WTY)

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/wNDOErA8WTY" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
