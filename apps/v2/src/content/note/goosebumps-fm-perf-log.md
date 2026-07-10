---
title: "Cutting goosebumps.fm's cold load time"
date: 2026-07-10T22:20:00+02:00
description: TTFB went from 1.33s to ~40ms by moving goosebumps.fm off CloudFront and edge-caching HTML on Cloudflare Workers.
tags: [performance, cloudflare, aws, sst]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Cutting+goosebumps.fm%27s+cold+load+time']
---

Public log of load-time work on [goosebumps.fm](https://goosebumps.fm).

- Measured against production, not staging or local.
- Based on cold Lighthouse runs and direct `curl` timing against the live domain.
- The exact commands live in [Scripts: measuring TTFB, cache headers, and Lighthouse from the CLI](/goosebumps-fm-perf-measurement-scripts/).

## Timeline

### Bundle size cut

- Homepage entry bundle cut by 45%.
- Claimed cold LCP improvement in that round: 1.8s -> 1.0s.
- A later cold production Lighthouse run still showed 1.9s LCP, so more work was needed.

### Edge caching + lazy dialogs

- Problem 1: `index.html` was not cached at the edge.
- It was served with `Cache-Control: max-age=0, no-cache, no-store, must-revalidate`.
- Cloudflare and CloudFront both respected that, so every request hit origin for HTML.

Before the fix:

```text
run 1 (cold): TTFB 1.33s   x-cache: RefreshHit from cloudfront
run 2 (warm): TTFB 0.06s   x-cache: Hit from cloudfront
run 3 (warm): TTFB 0.06s   x-cache: Hit from cloudfront
```

- Lighthouse `server-response-time`: 829ms, with ~729ms possible savings.
- Fix: set HTML to a 60-second edge TTL.
- The main fix was HTML caching, the hashed assets were not the bottleneck here.

- Problem 2: two closed-by-default dialogs were loaded eagerly on every route.
- The homepage `<head>` had 23 `<link rel="modulepreload">` tags.
- The root route statically imported:
  - auth-prompt dialog
  - welcome modal
- Both were closed by default, but still landed in the eager preload graph.
- Fix: lazy-load both with `React.lazy()` + `Suspense`.
- The auth dialog now ships as its own 4.88 kB chunk.

### Hosting migration

- Moved the static site from AWS S3 + CloudFront to Cloudflare Workers.
- DNS already lived on Cloudflare, so CloudFront was a redundant hop behind the edge.
- Replaced `sst.aws.StaticSite` with `sst.cloudflare.StaticSiteV2`.
- That removed the S3 bucket, CloudFront distribution, and ACM certificate.
- The site now serves directly from a Cloudflare Worker with native static assets.

- Cloudflare static-assets defaults every file, including hashed JS/CSS, to `max-age=0, must-revalidate`.
- Added a Cloudflare-native `_headers` file for:
  - 1-year immutable hashed assets and fonts
  - 60s revalidate for HTML

- Rollout wrinkle: `*.html` matched `/index.html` but not bare `/`.
- Fixed by adding an explicit `/` rule.

- First deploy failed with a 409 on Workers custom domain setup:
  - hostname already had externally managed DNS records
  - the old `aws.StaticSite` CNAME had to be removed first
- Deleting the CNAME by hand caused Pulumi drift, so the next deploy hit a 404.
- `sst refresh` reconciled state and the deploy succeeded.
- DNS cleanup and the final Custom Domain binding were verified directly against the Cloudflare API.
- The exact commands are in the scripts note.

## Results

- TTFB (root): 1.33s cold / 60ms warm -> ~40ms consistently
- Root `server-response-time`: 829ms -> 20ms
- Root `cache-control`: `no-store` -> `public, max-age=60, must-revalidate`
- Hosting: AWS S3 + CloudFront behind Cloudflare -> Cloudflare Workers, single hop
- Lighthouse performance score: 88-93 across 3 runs
- LCP: 1.9s cold baseline -> ~1.7-2.0s

- The TTFB and server-response-time wins were large and consistent.
- LCP stayed noisier across runs and did not confirm the earlier 1.0s claim.
- Next step, if LCP is worth chasing further, is a proper multi-run trace to find the current paint bottleneck.

## Known limits

- A nav component rendered on every route still pulls in auth-client chunks because it calls a real session hook.
- Shrinking that further would need a lighter session-check-only client path.

## References

- [MDN: `Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [SST docs: `aws.StaticSite`](https://sst.dev/docs/component/aws/static-site/)
- [SST docs: `cloudflare.StaticSiteV2`](https://sst.dev/docs/component/cloudflare/static-site-v2/)
- [SST example: `cloudflare-vite`](https://github.com/sst/sst/blob/v4.15.2/examples/cloudflare-vite/sst.config.ts)
- [SST source: static-site router worker](https://github.com/sst/sst/blob/v4.15.2/platform/functions/cf-static-site-router-worker-experimental/index.ts)
- [Cloudflare docs: Workers static assets headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Cloudflare docs: `_headers` file](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare docs: Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
