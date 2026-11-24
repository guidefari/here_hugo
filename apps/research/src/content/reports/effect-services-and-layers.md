---
title: "Thinking in contracts with Effect services and layers"
description: "An agent-written explainer on contracts, implementations, and composing program dependencies with Effect services and layers."
date: "2026-11-12"
tags: ["effect","architecture"]
draft: false
---

> Archived agent-written working material, not a finished article in Guide's voice. Original explanations and sources are preserved; claims have not been freshly verified for this import.

One thing I like about Effect is how it encourages me to think about the contract first and the implementation later.

Sam Goodwin, the creator of [Alchemy](https://alchemy.run/), highlighted the power of layers in his [conversation with Joel Hooks, *Fork Every Business: Sam Goodwin on Alchemy, Effect and AI*](https://www.youtube.com/watch?v=JcY0th6QuMg). They talk about layers as more than a useful feature of Effect: that same shape of composing dependencies and implementations underpins Alchemy's approach to infrastructure. It helped put words to something I like about working with Effect.

Say part of your program needs to send an email. What does it need to know? Probably who to send it to, what to send, and what can go wrong. It doesn't need to know which email provider you're using or how that provider's API works.

That's the distinction behind services and layers:

- **A service defines a contract:** the operations a part of your program offers, including their inputs, results, and possible failures.
- **A layer supplies an implementation:** it builds the service, using whatever dependencies it needs.

The code that needs to send an email asks for the service. A layer supplies an implementation backed by your email provider. For a test, you could supply one that records the emails instead of sending them.

<figure class="diagram" aria-labelledby="effect-contract-caption">
<p class="diagram-title">One contract, two implementations</p>
<div class="d-stacks" style="--d-cols: 2">
<p class="d-band"><b>Code that sends an email</b>Asks for the email service. Never imports a provider.</p>
<p class="d-band-edge" aria-hidden="true">↓ depends on</p>
<p class="d-band is-strong">Email service contract: who to send to, what to send, what can go wrong</p>
<p class="d-band-edge" aria-hidden="true">↑ supplied by a layer</p>
<ol class="d-stack" aria-label="Production layer">
<li class="d-stack-name">Production layer</li>
<li>Sends through your email provider's API</li>
</ol>
<ol class="d-stack" aria-label="Test layer">
<li class="d-stack-name">Test layer</li>
<li>Records emails instead of sending them</li>
</ol>
</div>
<figcaption id="effect-contract-caption">The calling code is the same in both cases. Swapping the layer changes the implementation without touching the code that depends on the contract, as long as the replacement honours it.</figcaption>
</figure>

I covered the mechanics in [Effect-ts, in practice](https://guidefari.com/effective/), where the same invoicing workflow uses different database layers in production and tests.

## Thinking about the boundaries

What I find useful isn't just being able to swap implementations. It's that defining the contract makes me think about encapsulation: what should this part of the program expose, and what should stay hidden inside it?

I can think about what the email service does before getting caught up in how a particular provider works. The rest of the program can depend on that contract rather than the provider's details.

There's a real example in my [Goosebumps.fm email note](https://guidefari.com/gbfm-cloudflare-email/): the Worker supplies an `EmailTransport`, while template builders and product services never import Cloudflare types.

## Seeing how the program fits together

Services describe the capabilities the program needs. Layers describe how to supply those capabilities and connect their dependencies.

That helps me keep a higher-level view of the architecture: what the pieces are, what each one needs, how they compose, and which implementations I can replace without changing the code that uses them, as long as the replacement honours the same contract.

You don't need Effect to write software this way. I like that Effect encourages it as part of the normal workflow.

## Related notes

- [The Worker database layer in Goosebumps.fm](https://guidefari.com/gbfm-worker-database-layer/): how the application layer connects database, email, storage, and other dependencies.
- [Effect at OpenCode](https://guidefari.com/media/effect-at-opencode/): notes on Dax Raad's talk, including service boundaries and swappable implementations.
- [Learning Effect](https://guidefari.com/effect/): the resources that helped me learn it.
