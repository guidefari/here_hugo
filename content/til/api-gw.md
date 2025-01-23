---
title: "TIL: API Gateway and CORS preflight request"
date: 2025-01-22T22:23:38+02:00
description: api.example.com can be more expensive than example.com/api 👀
tags: [til, aws]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=API+Gateway+Preflight']
---

> [Every time the browser makes a cross-origin request, it first makes a preflight request to make sure it can actually send the request. Since API Gateway charges per request, you’re billed for both the preflight and the main request.](https://x.com/theburningmonk/status/1877632427679432957)

> [Even if your API is hosted on a subdomain, e.g. http://api.example.com, the browser still sees it as a cross-origin request from http://example.com. You should move the API to http://example.com/api instead. By hosting under the same domain, you eliminate the need for preflight requests altogether.](https://x.com/theburningmonk/status/1877632427679432957)

I don't use API Gateway, but this was interesting to know. I use Lambda Function URLs

## Source
- Subscribe to Yan Cui's newsletter - [The Burning Monk](https://theburningmonk.com/subscribe/)