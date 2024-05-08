---
title: "TIL: Sentry"
date: 2024-05-06T07:49:40+02:00
description: I set up Sentry on goosebumps. 
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Sentry']
---

- [PR](https://github.com/guidefari/nextgoose/pull/26) that adds Sentry to [goosebumps](https://goosebumps.fm/).
- [Spans](https://docs.sentry.io/platforms/javascript/performance/instrumentation/custom-instrumentation/#start-span) - 
Useful for measuring the time specific actions take.
- [Breadcrumb](https://docs.sentry.io/platforms/javascript/enriching-events/breadcrumbs) - 
 These are a way to leave clues behind, prior to an exception. Anything you think will be helpful 
 when you need to investigate an exception, put it here.
- [Capture Exception](https://docs.sentry.io/platforms/javascript/usage/#capturing-errors) -
 Perhaps the most important thing for me. or anyone else using Sentry for that matter

From JD:
- [Scopes](https://docs.sentry.io/platforms/javascript/enriching-events/scopes/)
- [Transaction name](https://docs.sentry.io/platforms/javascript/enriching-events/transaction-name/)
- [Tags](https://docs.sentry.io/platforms/javascript/enriching-events/tags/)
