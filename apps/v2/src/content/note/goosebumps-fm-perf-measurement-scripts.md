---
title: "Scripts: measuring TTFB, cache headers, and Lighthouse from the CLI"
date: 2026-07-10T22:20:00+02:00
description: The exact curl and Lighthouse commands used to measure goosebumps.fm's cold load time, kept standalone so they're reusable on any other site.
tags: [performance, cloudflare, cli]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Measuring+TTFB+and+Cache+Headers']
---

Companion scripts for [Cutting goosebumps.fm's cold load time](/note/goosebumps-fm-perf-log). Nothing here is specific to that site — swap the URL and these work on anything.

## TTFB, repeated

Time to first byte across a few sequential requests, plus whether the CDN served from cache:

```bash
for i in 1 2 3; do
  curl -s -o /dev/null -w "run $i: TTFB=%{time_starttransfer}s total=%{time_total}s http=%{http_code} cf-cache=" https://example.com/
  curl -sI https://example.com/ | grep -i "cf-cache-status" | tr -d '\r'
done
```

`time_starttransfer` is curl's built-in TTFB metric — time from request start to the first byte of the response body. `cf-cache-status` (Cloudflare-specific header) tells you `HIT` vs `MISS` vs `RefreshHit`, which is the difference between "served from edge" and "origin round-trip happened."

## Cache-Control headers across asset types

Cache policy usually differs between the HTML document and hashed static assets, so check both instead of assuming one curl tells the whole story:

```bash
echo "-- root document --"
curl -sI https://example.com/ | grep -iE "cache-control|cf-cache-status|cf-ray"

echo "-- a hashed JS asset, discovered from the page itself --"
ASSET=$(curl -s https://example.com/ | grep -oE '/assets/index-[A-Za-z0-9]+\.js' | head -1)
curl -sI "https://example.com$ASSET" | grep -iE "cache-control|cf-cache-status"
```

Pulling the asset filename out of the live HTML (rather than hardcoding it) matters because content-hashed filenames change on every deploy — hardcode it once and the script silently checks a stale, 404ing URL forever.

## Lighthouse from the CLI, no UI

```bash
npx --yes lighthouse https://example.com \
  --output=json \
  --output-path=./lighthouse-result.json \
  --chrome-flags="--headless" \
  --only-categories=performance \
  --preset=desktop
```

Then pull just the numbers that matter instead of reading the full report:

```bash
python3 -c "
import json
d = json.load(open('lighthouse-result.json'))
print('Performance score:', d['categories']['performance']['score'] * 100)
a = d['audits']
for key in ['largest-contentful-paint', 'first-contentful-paint', 'speed-index',
            'total-blocking-time', 'cumulative-layout-shift', 'server-response-time',
            'unused-javascript']:
    print(f\"{key}: {a.get(key, {}).get('displayValue', 'n/a')}\")
"
```

**Run it more than once.** A single Lighthouse run is noisy — LCP in particular swung 1.7s-2.0s across three consecutive runs against the same unchanged page in this case. Report a range, not a single number, unless you've averaged several runs.

## Checking DNS records directly via the Cloudflare API

Useful when a CDN/DNS migration needs verifying beyond what a browser can tell you — e.g. confirming old records are actually gone, not just cached-as-gone in your local resolver:

```bash
ZONE_ID="your-zone-id"
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?per_page=100" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data['result']:
    if 'example.com' in r['name']:
        print(r['name'], r['type'], r.get('content', ''))
"
```

Zone ID comes from `GET /zones?name=example.com` against the same API if you don't already have it cached.

## Checking Workers Custom Domains (not regular DNS records)

If you're migrating onto Cloudflare Workers with a custom domain, the domain binding lives in a *separate* API from regular zone DNS records — `dns_records` won't show it:

```bash
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains" \
  | python3 -m json.tool | grep -B2 -A5 "example.com"
```

This is what actually confirms a Workers Custom Domain is live and pointed at the right script — `enabled: true` and the right `service` name.
