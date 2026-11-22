---
title: "Industry interest and domain-backed package ownership"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## What did the original posts actually support?

### Takeaway
Originals fetched November 8, 2026 establish interest in npm alternatives, including DNS-backed namespaces, not endorsement of Cloudflare. Dates below are X's displayed dates; its fetched pages do not label the timezone. Research base: local commit `307a204a751e14c8f710759e7846bbf48eb4595d`; web documents are live, not commit-pinned.

### Cited Findings
- **October 5, 2026, 7:43 AM, Michael Arnaldi:** “If npm doesn’t solve their crappy publish pipeline by end of year we will fork into our own managed registry. Enough is enough”. Conditional threat, not launch. [Original](https://x.com/MichaelArnaldi/status/2107013857281532174).
- **October 5, 8:05 AM, Rhys:** “im fine with this, just give me a prompt for my agent to use and i'll use it hell swap over today for all i care”. Willingness to switch in Arnaldi's registry discussion. [Original](https://x.com/RhysSullivan/status/2107019309050720557).
- **October 6, 6:16 AM, Sam Goodwin:** “We have a NPM registry published as a NPM package for when you're ready to rage quit.” Links `@alchemy.run/pkg`; an offer, not a migration. [Original](https://x.com/samgoodwin89/status/2107354395411361792).
- **October 6, 6:54 AM, Arnaldi:** “If I rage quit I will build a full ecosystem platform lol”. [Recovered original](https://x.com/MichaelArnaldi/status/2107363945317036362).
- **October 6, 7:19 AM, Goodwin:** “Looking forward to that. I'll follow. NPM is abandonware.” Interest in Arnaldi's platform; “abandonware” is Goodwin's opinion. [Recovered original](https://x.com/samgoodwin89/status/2107370166552260614).
- **October 16, 3:39 AM, Rhys:** “DNS as ownership / @ protocol for package names pretty please lets people own their registries, also probably something with git hashes for versions so you install a specific hash rather than version”. Explicit design request replying to Theo. [Original](https://x.com/RhysSullivan/status/2110938722133016603).
- **October 16, 3:47 AM, Theo:** “Roughly the plan. Let’s catch up soon :)”. Broad agreement, not a specification. [Recovered original](https://x.com/theo/status/2110940552397308325).
- **October 16, 2:38 PM, Matteo Collina:** “let’s chat soon ;)”. Conversational interest addressed to Theo, not endorsement of a specific architecture. [Original](https://x.com/matteocollina/status/2111104610421350408).
- Rhys's linked earlier proposal is **October 6**, displayed **last edited 5:41 AM**: “Currently leaning DNS as ownership, ie if you set a DNS record on vercel​.com you own the Vercel namespace”. He also calls it “too much friction”, suggests `@community/{package}` and company-email signup. His “90%” is an unsupported estimate, not measured adoption evidence. [Original](https://x.com/RhysSullivan/status/2107345481374515405).

### Inferences
- Safest synthesis: several named developers discussed alternatives and lowering migration friction. None of these fetched statements names Cloudflare. [Rhys](https://x.com/RhysSullivan/status/2110938722133016603); [Matteo](https://x.com/matteocollina/status/2111104610421350408).

### Gaps
- Screenshot statements are valid supplied evidence, now independently linked above. Screenshot pixels were not available in this subtask. Existing `maintainer-tweet-links.md` remains untouched; its unresolved Goodwin quotation is resolved here.
- X exposes reply recipients, not full parent chains. Thread mirrors supplied discovery/context, followed by original fetches: [Arnaldi thread](https://nitter.gq/MichaelArnaldi/status/2107013857281532174), [Goodwin thread](https://nitter.gq/samgoodwin89/status/2107354395411361792), [Rhys thread](https://nitter.gq/RhysSullivan/status/2110938722133016603), [Matteo thread](https://nitter.gq/matteocollina/status/2111104610421350408). Matteo appears under Theo's [follow-up](https://x.com/theo/status/2110937874384511156), Rhys under his [initial complaint](https://x.com/theo/status/2110937542141059454).

## Which real systems support the analogy?

### Takeaway
AT Protocol separates a mutable domain handle from persistent identity. Go already uses domain-based module discovery. Neither establishes a deployed JavaScript registry matching this proposal.

### Cited Findings
- AT handles resolve through `_atproto.<handle>` TXT `did=...` or HTTPS `/.well-known/atproto-did`; both directions must match the DID document. DNSSEC is not required. DNS is preferred on conflict. [Official handle specification, fetched November 8](https://atproto.com/specs/handle).
- DIDs supply canonical identity and service discovery; `did:web` cannot recover from domain loss. Do not promise every DID survives domain takeover. [Identity guide](https://atproto.com/guides/identity); [DID specification](https://atproto.com/specs/did).
- Go discovers repositories through HTTPS `?go-get=1` and `go-import` metadata; checksums are a separate integrity layer. [Official modules reference, fetched November 8](https://go.dev/ref/mod#vcs-find).
- JSR documents globally unique registry scopes, admins/members and repository-linked CI publishing, not DNS-verified scopes. Provenance does not establish domain ownership. [Scopes](https://jsr.io/docs/scopes); [trust](https://jsr.io/docs/trust).
- James Snell's **June 21, 2026** [AT registry thought experiment](https://www.jasnell.me/posts/what-if-npm-ran-on-atproto) explicitly distinguishes sketches from implementation.

### Inferences
- Domains could offer portable namespaces and bootstrap delegated publisher authorization. Cloudflare could simplify setup but cannot uniquely provide domain verification. [Provider-neutral AT mechanism](https://atproto.com/specs/handle).

### Gaps
- No deployed implementation, benchmark or pinned upstream documentation commit was established.

## What security claims remain proposals?

### Takeaway
Domain control proves present naming authority, not safe code.

### Cited Findings
- AT documents caching, regional resolution and segmented-response concerns; HTTPS needs secure transport. [Handle specification](https://atproto.com/specs/handle).

### Inferences
- Design requirements, not current product features: expiry/takeover and DNS compromise handling; authenticated recovery/rename and key rotation; DNSSEC versus HTTPS trust policy; offline CI caches and freshness; private split-horizon rules; stable identity and artifact pins; provenance bound to authorized source and publisher. Domain verification alone settles none of these. [AT identity](https://atproto.com/guides/identity); [Go authentication](https://go.dev/ref/mod#authenticating); [Snell proposal](https://www.jasnell.me/posts/what-if-npm-ran-on-atproto).

### Gaps
- Registry protocol, delegation, dispute policy, migration tooling and Cloudflare product strategy remain unspecified.
