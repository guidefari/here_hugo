---
title: "Outbox - A system design pattern"
date: 2025-04-22T06:14:25+02:00
tags: [architecture]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Outbox']
---

## Core elements of the outbox pattern
- Outbox table. We write to this within the same transaction that creates/emits the root event in a system
- Downstream relay service. This polls the outbox tables it's subscribed to, and propagates the event to relevant parts of the system
  - Such as async processes. When these ack receipt and success, the outbox table's status column is updated to something that represents `Processed`
  - The relay service can have retry mechanisms in place, to ensure messages get delivered downstream

## Benefits
- More resilience against transmission failures. This pattern *guarantees delivery*
- Improved UX for user facing actions. A user won't have to wait for all your system's *background* tasks to complete before getting some sort of feedback

## Misc notes
- Having a complementary inbox on the consumer side feels like overkill for me 👀
- A reliable message queue can simplify the implementation. SQS & Redis come to mind

## Example 
- ✅ When you have a moment, create a [demo repo](https://github.com/guidefari/outbox).
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/qBCIrzJCICE" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>


- Order service
  - Outbox
- Relay service
  - Polls the outbox table. looks for unsent messages, send them out, mark them as such
- Async job service
- Shared postgres db

## Videos

The video below is what introduced me to the terminology:
<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/7Js-4GuNogM" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

Other videos from my watch later:

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/tQw99alEVHo" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

<div class="relative w-full my-6 overflow-hidden border rounded-sm border-text/20 bg-black" style="aspect-ratio: 16 / 9;"><iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/5YLpjPmsPCA" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
