---
title: "npm maintainer tweet links"
description: "An annotated source guide from the Cloudflare and npm research pack, checked on 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","sources"]
draft: false
parent: "cloudflare-npm"
---

Checked November 8, 2026. The seven posts in the first three sections were fetched from their original X URLs. Dates are those displayed by X; the displayed timezone was not identified.

## Michael Arnaldi

- **September 21, 2026:** [“If this keeps going we will move off of npm to our own registry”](https://x.com/MichaelArnaldi/status/2101859863831753093). The same post names `pkg.effect.website` and says “we don’t want to do that but this is becoming a liability”.
- **October 5, 2026:** [“If npm doesn’t solve their crappy publish pipeline by end of year we will fork into our own managed registry. Enough is enough”](https://x.com/MichaelArnaldi/status/2107013857281532174).
- **October 11, 2026:** [“@Microsoft does anyone work on NPM? It’s crazy how bad it is.”](https://x.com/MichaelArnaldi/status/2109188075197005891). This quotes Lorenz's 20-hour validation complaint below.

The September 21 registry post is **not** the exact link for “We are again blocked by npm”. Search results mixed those texts; fetching the original confirmed the distinction.

## Sebastian Lorenz, @thefubhy

- **October 5, 2026:** [Offer to help npm, or fork](https://x.com/thefubhy/status/2107015257214632030): “If the npm team wants to work with us on this we are more than happy to provide the necessary feedback & guidance on what's missing or simply broken ... But otherwise there's really no other option than to fork at this point.” This quotes Arnaldi's October 5 post.
- **October 11, 2026:** [“The latest version of ‘effect’ (v4.0.3) has been stuck in npm’s cursed validation pipeline for 20 hours once again. This is crazy.”](https://x.com/thefubhy/status/2109152523684565153). This quotes his earlier offer to help or fork. The X post says **20 hours**, not the 22 hours reported in his separate GitHub comment.

## Sam Goodwin, @samgoodwin89

- **August 6, 2026:** [Trusted-publishing criticism and “NPM is a failing mess”](https://x.com/samgoodwin89/status/2085278917825552412): “This is so anti-competitive. If you're not one of the big 3 CI platforms, you can't publish trusted NPM packages. NPM is a failing mess. Time to drop it, honestly. Moves slow and everything is implemented poorly.” These are Goodwin's assessments, not independently established findings.
- **October 6, 2026:** [Registry-package offer](https://x.com/samgoodwin89/status/2107354395411361792): “We have a NPM registry published as a NPM package for when you're ready to rage quit.” It links to [`@alchemy.run/pkg`](https://www.npmjs.com/package/@alchemy.run/pkg), and the fetched title identifies Arnaldi as the reply recipient.

## Theo: already identified originals

These links were verified in the earlier research notes, not re-fetched in this pass. All are dated October 16, 2026 in those notes.

- [“npm fucked up our release.”](https://x.com/theo/status/2110937542141059454)
- [“Normally I would try to help them fix things. I’ve tried for almost a decade.”](https://x.com/theo/status/2110937874384511156)
- [“Actual garbage package registry holy shit”](https://x.com/theo/status/2110969594416615575)
- [“None of those are package registries”](https://x.com/theo/status/2110970338511405078)

## Still unresolved

No verified exact status URL was recovered for:

- Arnaldi's “We are again blocked by npm” complaint about rollback, metrics and trusted publishing. Search snippets support the beginning of that wording, but show conflicting September 20/21 labels. Neither the exact original nor its date is verified.
- Arnaldi's later security/scrutiny/metrics discussion and zero-dependency-core statement.
- Goodwin's “if (npm does not fix) is dead code. New registry guaranteed.”
- Goodwin's “Looking forward to that. I’ll follow. NPM is abandonware.”
- Separate Goodwin posts about delays or throttling beyond the verified CI-provider complaint above.
- Devin Jameson's Foldkit release tagline about everyone's favorite JavaScript registry.

These are unresolved searches, not findings that the statements never existed. The verified threats are intentions, not proof that a migration or replacement registry shipped.

Full evidence and search-index caveats: [citation ledger](/reports/cloudflare-npm/sources/maintainer-tweet-links/).
