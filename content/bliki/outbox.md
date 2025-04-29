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

## Misc notes
- Having a complementary inbox on the consumer side feels like overkill for me 👀
- A reliable message queue can simplify the implementation. SQS & Redis come to mind

## Example 
- [ ] When you have a moment, create a demo repo.

- Order service
  - Outbox
- Relay service
  - Polls the outbox table. looks for unsent messages, send them out, mark them as such
- Async job service
- Shared postgres db

## Videos

The video below is what introduced me to the terminology:
{{<youtube 7Js-4GuNogM>}}

Other videos from my watch later:

{{<youtube tQw99alEVHo>}}

{{<youtube 5YLpjPmsPCA>}}
