---
title: "Cutting goosebumps.fm's cold load time"
date: 2026-07-10T22:20:00+02:00
description: TTFB went from 1.33s to ~40ms by killing a redundant AWS CloudFront hop and edge-caching HTML on Cloudflare Workers instead.
tags: [performance, cloudflare, aws, sst]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Cutting+goosebumps.fm%27s+cold+load+time']
---

Public log of load-time work on [goosebumps.fm](https://goosebumps.fm). Numbers are measured against production, not staging or local — cold Lighthouse runs and direct `curl` timing against the live domain. The exact commands are in a separate note: [measuring TTFB, cache headers, and Lighthouse from the CLI](/note/goosebumps-fm-perf-measurement-scripts).

## Timeline

### Bundle size cut, 45% smaller entry

Homepage entry bundle cut by 45%. Cold LCP improved from **1.8s to a claimed 1.0s** in that round's testing.

### Edge caching + lazy dialogs

A follow-up cold Lighthouse run against production came back at **1.9s LCP** — worse than the 1.0s the earlier round claimed, so there was more room. Two problems, fixed together, then a third change landed alongside them.

**1. `index.html` wasn't cached at the edge.**

It was served `Cache-Control: max-age=0, no-cache, no-store, must-revalidate` — the framework default for HTML. Cloudflare was proxying in front of the old CloudFront setup, and both layers respect standard [`Cache-Control` semantics](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control), so `no-store` told both of them never to cache the document at edge. Every visitor, on every request, paid a full round-trip to origin just to get the HTML shell before the browser could start parsing anything. Measured directly against prod before the fix:

```
run 1 (cold): TTFB 1.33s   x-cache: RefreshHit from cloudfront
run 2 (warm): TTFB 0.06s   x-cache: Hit from cloudfront
run 3 (warm): TTFB 0.06s   x-cache: Hit from cloudfront
```

Lighthouse's `server-response-time` audit independently flagged **829ms** on the root document, with ~729ms of possible savings.

Fix: give HTML a 60-second edge TTL instead of `no-store`. Hashed JS/CSS assets were already correctly set to a 1-year immutable cache — no change needed there.

**2. Two closed-by-default dialogs were loaded eagerly on every route.**

The homepage's `<head>` carried 23 `<link rel="modulepreload">` tags. The browser fetched, parsed, and compiled all 23 chunks at high priority on every route load — home included — even though most of that code belonged to UI that wasn't visible yet.

The root route statically imported an auth-prompt dialog and a welcome modal, both closed by default (one opens only via a store flag; the other opens only for signed-in users who haven't seen it, 500ms after mount). Because the router treats anything statically reachable from the root route as always-needed, both components — plus the toast, icon, and auth-client code they pulled in — were forced into the eager preload graph instead of loading on demand.

Fix: lazy-load both behind `React.lazy()` + `Suspense`, the same pattern already used elsewhere in the app for a queue sidebar. The auth dialog now ships as its own 4.88 kB chunk instead of being folded into the main bundle.

**3. Migrated the static site off AWS (S3 + CloudFront) onto Cloudflare Workers.**

DNS for goosebumps.fm already lived on Cloudflare with the proxy on, so CloudFront was a second CDN sitting *behind* the edge that was already terminating traffic — a redundant hop, and a second place cache headers had to be reasoned about. That redundancy is what made problem #1 more complicated than it should have been.

Replaced [`sst.aws.StaticSite`](https://sst.dev/docs/component/aws/static-site/) with [`sst.cloudflare.StaticSiteV2`](https://github.com/sst/sst/blob/v4.15.2/platform/src/components/cloudflare/static-site-v2.ts) — SST's [current recommended pattern](https://github.com/sst/sst/blob/v4.15.2/examples/cloudflare-vite/sst.config.ts) for a Vite SPA on Cloudflare. This removes the S3 bucket, CloudFront distribution, and ACM certificate entirely; the site now serves directly from a Cloudflare Worker with [native static-assets](https://developers.cloudflare.com/workers/static-assets/headers/), one hop instead of two.

Cache behavior had to move with it — Cloudflare's static-assets binding defaults every file, including hashed JS/CSS, to `max-age=0, must-revalidate`, and there's no SST-level `fileOptions` equivalent for it (confirmed by reading [the router worker source](https://github.com/sst/sst/blob/v4.15.2/platform/functions/cf-static-site-router-worker-experimental/index.ts) — it just delegates straight to the native assets binding). Replaced the old cache config with a Cloudflare-native [`_headers` file](https://developers.cloudflare.com/pages/configuration/headers/) that reproduces the same policy: 1-year immutable for hashed assets and fonts, 60s revalidate for HTML.

One rollout wrinkle: Cloudflare's `_headers` glob for `*.html` matches `/index.html` directly but not the bare root path `/`, even though the site serves `/` by internally rewriting to `index.html`. Root was briefly falling through to the platform default (`max-age=0`) until a follow-up fix added an explicit `/` rule.

There was also a real state-drift wrinkle worth noting for anyone doing this same migration. The first deploy attempt failed outright:

```
[ERROR] PUT "https://api.cloudflare.com/client/v4/accounts/.../workers/domains": 409 Conflict
"message": "Hostname 'www.goosebumps.fm' already has externally managed DNS records (A, CNAME, etc). Delete them first or try a different hostname."
```

This is documented, not a fluke: [Cloudflare's Custom Domains docs](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) state plainly that "you cannot create a Custom Domain on a hostname with an existing CNAME DNS record," and their own migration guidance is to delete the old CNAME first. Custom Domains manage DNS *for* you — that's the whole feature — so it refuses to attach on top of a record it doesn't own, rather than silently overwriting it. The old `aws.StaticSite`'s CNAME (pointing at the CloudFront distribution) was exactly that kind of pre-existing record, so it had to go before the new Worker could claim the hostname.

Deleting it by hand, out-of-band from Pulumi, created a second problem: Pulumi's own state still thought it owned that DNS record, so the very next deploy tried to delete it *again* and got a 404 instead — the resource it expected to tear down was already gone. `sst deploy` has a `--stage` companion, `sst refresh`, built for exactly this class of problem: it reconciles Pulumi's state against what's actually live in the provider before computing a diff, so it stops trying to act on resources that no longer exist. One `sst refresh` and the deploy went through clean.

Verifying both the DNS cleanup and the final Custom Domain binding was done directly against the Cloudflare API — commands in the [companion scripts note](/note/goosebumps-fm-perf-measurement-scripts).

## Results

Measured against production after all three changes shipped:

- **TTFB (root):** 1.33s cold / 60ms warm → **~40ms, consistently**
- **Root document server-response-time:** 829ms → **20ms**
- **Root `cache-control`:** `no-store` → `public, max-age=60, must-revalidate`
- **Hosting:** AWS S3 + CloudFront behind Cloudflare → Cloudflare Workers, single hop
- **Lighthouse performance score:** **88-93** across a 3-run range
- **LCP:** 1.9s cold baseline that motivated this work → **~1.7-2.0s**

The TTFB and server-response-time wins are large and consistent — moving off a double-CDN setup with a `no-store` root document onto a single-hop Cloudflare Worker with a 60s edge cache removed almost the entire origin round-trip. LCP improvement is real but noisier across runs and didn't reach the 1.0s figure the earlier bundle-size round had claimed; that number likely reflected a single favorable run rather than a stable baseline. Next step, if LCP is worth chasing further, is a proper multi-run trace to find what's actually gating the largest paint now that server latency is no longer the obvious bottleneck.

## Known remaining limits

A nav component rendered on every route calls a session hook for real auth state — not incidental bloat — and keeps pulling in auth-client chunks eagerly. Shrinking that further means swapping to a lighter session-check-only client path, a separate and bigger effort than this round.

## References

- [MDN: `Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) — the header semantics both CDN layers were respecting (correctly) when `no-store` blocked all edge caching
- [SST docs: `aws.StaticSite`](https://sst.dev/docs/component/aws/static-site/) — the component being migrated away from
- [SST source: `cloudflare.StaticSiteV2`](https://sst.dev/docs/component/cloudflare/static-site-v2/) - the component being migrated to
- [SST example: `cloudflare-vite`](https://github.com/sst/sst/blob/v4.15.2/examples/cloudflare-vite/sst.config.ts) — SST's own reference config for this exact setup
- [SST source: static-site router worker](https://github.com/sst/sst/blob/v4.15.2/platform/functions/cf-static-site-router-worker-experimental/index.ts) — confirms there's no `fileOptions`-equivalent cache config on the Cloudflare side
- [Cloudflare docs: Workers static assets headers](https://developers.cloudflare.com/workers/static-assets/headers/) — default cache behavior and the `_headers` override mechanism
- [Cloudflare docs: `_headers` file](https://developers.cloudflare.com/pages/configuration/headers/) — syntax reference for the override file actually used
- [Cloudflare docs: Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) — states directly that you can't attach a Custom Domain over an existing CNAME, and documents deleting the old record first as the fix
