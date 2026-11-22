---
title: "npm metrics and maintainer frustration sources"
description: "An annotated source guide from the Cloudflare and npm research pack, checked on 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","sources"]
draft: false
parent: "cloudflare-npm"
---

Checked November 8, 2026. Editorial source guide, not an adoption census. Full evidence and caveats: [metrics and frustration research](/reports/cloudflare-npm/sources/npm-metrics-general-frustrations/).

## What can the article say about npm metrics?

### Takeaway

Separate three claims: downloads are not people; downloads can be manipulated; the statistics API has specific missing-looking days. Each has evidence, but none means npm stopped serving packages or most downloads are fake.

### Cited Findings

| Claim and article-safe wording | Original source and status | What it does not show |
| --- | --- | --- |
| “npm's published counting explanation includes automated tarball deliveries, not just humans installing packages.” | [npm, July 22, 2014](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html), historical official definition, still linked by [current API documentation](https://github.com/npm/registry/blob/main/docs/download-counts.md). | Today's exact filtering implementation, bot percentage, or a valid 2026 baseline of 50 downloads/day. |
| “The public API provides download totals rather than deduplicated users or businesses.” | [Official API specification](https://github.com/npm/registry/blob/main/docs/download-counts.md), current published contract. Standard queries max 18 months each; historical data starts January 10, 2015; seven-day per-version counts. | An 18-month total retention limit. Historical data can be queried in smaller windows. |
| “Local cache reuse and upstream mirror fetching change the relationship between installs and counted deliveries.” | [Official explanation](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html); [cache docs](https://github.com/npm/cli/blob/latest/docs/lib/content/commands/npm-cache.md); [crawler policy](https://docs.npmjs.com/policies/crawlers/). | Every end-user mirror hit being counted by npm, or every npm install generating a new delivery. Metadata replication is not itself a tarball download. |
| “A developer demonstrated artificial download inflation in 2021.” | [Andy Richardson, March 9, 2021](https://dev.to/andyrichardsonn/how-i-exploited-npm-downloads-and-why-you-shouldn-t-trust-them-4bme), original experiment account and public implementation. | Manipulation prevalence or universal current behavior. Do not run its scripts. |
| “Tenable reported in May 2026 that repeated tarball fetching and version-triggered bot traffic inflated test-package counters.” | [Ron Popov/Tenable, May 28, 2026](https://www.tenable.com/blog/how-cyberattackers-inflate-malicious-package-npm-download-counts), first-party experiments: reported 17,000 artificial downloads in about an hour, plus three publication tests averaging roughly 136-158 downloads/version. | Independent reproduction here, a universal bot baseline, organic victims, or proof all abuse controls are absent. |
| “Academic research warns that software-popularity incentives can be gamed.” | [Swierzy et al., arXiv v2, May 20, 2026](https://arxiv.org/html/2505.05897v2), analysis plus 71,710 teaRank-related sybil packages. | 71,710 download-spoofing packages. That result concerns dependency-graph manipulation, not missing statistics. |
| “Library-wide package sums are not distinct adoption counts.” | [Tanner Linsley/TanStack, displayed December 2, 2025](https://tanstack.com/blog/npm-stats-the-right-way), maintainer explicitly acknowledges possible overlap among core/addon/legacy deliveries. | Unique users, customer organizations, or revenue. Beware its date/percentage/example-code inconsistencies; prefer its aggregation caveat over numerical claims. |

### Inferences

- These are weak standalone trust/adoption signals, not necessarily worthless distribution metrics. Counting CI under a disclosed definition is not the same failure as dropping days. [Official explanation](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html); [2026 experiments](https://www.tenable.com/blog/how-cyberattackers-inflate-malicious-package-npm-download-counts).

### Gaps

- The old [npm/download-counts code](https://github.com/npm/download-counts) explicitly is no longer the production service. Do not cite it as proof of current filtering behavior.
- No representative fake-download fraction, CI fraction, downloads-to-businesses conversion, or broad maintainer sentiment trend is established.

## What happened to the recent weekly drops?

### Takeaway

The October report is credible and partly reproducible, but one of its missing dates now has data. Say precisely what was reported and what remains observable, rather than repeating “four days permanently lost.”

### Cited Findings

- **Original report:** [ragojose, October 22, 2026](https://github.com/orgs/community/discussions/210931) reports zero API counts on October 6, 13, 14, and 15 across four packages. Thread fetched November 8 remains Unanswered, with community corroboration and an automated acknowledgement, not a staff diagnosis.
- **Read-only checks November 8:** [React API](https://api.npmjs.org/downloads/range/2026-10-05:2026-10-16/react) and [TypeScript API](https://api.npmjs.org/downloads/range/2026-10-05:2026-10-16/typescript) both return zeros on October 6, 14, and 15, amid tens of millions on neighboring days. October 13 now returns **41,665,004 React** and **67,398,040 TypeScript** downloads. This is a meaningful correction to the original report.
- **Article-safe sentence:** “In October, developers reported missing download statistics across major packages. A November 8 check still showed anomalous zero days for React and TypeScript, although one date in the original complaint had since acquired nonzero data.” [Report](https://github.com/orgs/community/discussions/210931); [React output](https://api.npmjs.org/downloads/range/2026-10-05:2026-10-16/react); [TypeScript output](https://api.npmjs.org/downloads/range/2026-10-05:2026-10-16/typescript).
- **Official-response boundary:** no statistics-specific match found in titles/update bodies of the [official latest-50 incident feed](https://status.npmjs.org/api/v2/incidents.json), whose fetched entries span June 2024 to November 2026. [Status API documentation](https://status.npmjs.org/api) limits that feed to 50. Safe: “No substantive official explanation was found in the checked thread or status feed.” Unsafe: “npm has never acknowledged the problem.”

### Inferences

- Common zero days suggest incomplete statistics; they do not independently identify an internal pipeline fault or establish an installation outage. [React API](https://api.npmjs.org/downloads/range/2026-10-05:2026-10-16/react); [TypeScript API](https://api.npmjs.org/downloads/range/2026-10-05:2026-10-16/typescript).

### Gaps

- No official root cause, completeness guarantee, date of backfill, or permanently lost-log conclusion recovered. Community extensions that estimate replacements are not official recovered data.
- Exact original for Michael Arnaldi's “reliable metrics and trusted publishing” wording remains missing. Do not reuse the misattributed September 21 URL: [that actual post](https://x.com/MichaelArnaldi/status/2101859863831753093) is a conditional registry-migration threat, not that quotation. Existing citation ledger remains authoritative for its fetched text.

## Which broader frustrations are worth citing?

### Takeaway

Use two grounded additional examples: name reclamation constraints and a paid-package billing/support complaint. Both are individual reports with explicit limits, not proof of universal neglect.

### Cited Findings

| Claim and article-safe wording | Original evidence | Limits and official response |
| --- | --- | --- |
| “npm's current name policy leaves little room for on-demand reclamation of inactive names.” | [Official namespace policy](https://docs.npmjs.com/policies/disputes/): first-come, no on-demand squatting resolution, formal trademark/IP route. [calebcgates, April 13, 2026](https://github.com/orgs/community/discussions/192413) reports unsuccessful attempts to reclaim nark; [acdvs, May 31](https://github.com/orgs/community/discussions/192413#discussioncomment-17125845) adds a similar contactability complaint. | Official policy corroborates the constraint, not the user's private correspondence, zero real users, or transfer safety. Generic bot acknowledgement only visible. Paid orgs may have invisible private packages and are not treated as squatted. |
| “A paid-package user reported waiting over a week for support while billing-related access failures blocked pipelines.” | [peaseBenjamin, September 24, 2026](https://github.com/orgs/community/discussions/208726); [September 25 followup](https://github.com/orgs/community/discussions/208726#discussioncomment-18600314) says no nonautomated reply for over a week. Other users report payment difficulties in the thread. | Reported account-specific experience, not confirmed systemic billing fault. [Accepted answer](https://github.com/orgs/community/discussions/208726#discussioncomment-18597906) is a community user's explanation, not demonstrated staff diagnosis or confirmed restoration. No current resolution verified. |
| “Changing registries does not necessarily solve package-manager client behavior.” | [Yarn maintainer Maël Nison, March 9, 2021](https://dev.to/andyrichardsonn/how-i-exploited-npm-downloads-and-why-you-shouldn-t-trust-them-4bme#comment-1c917), corrects an assumption that Yarn downloads were excluded: registry became a CNAME in 2017. [Richardson acknowledges correction](https://dev.to/andyrichardsonn/how-i-exploited-npm-downloads-and-why-you-shouldn-t-trust-them-4bme#comment-1c91f). | Historical factual correction supporting a conceptual distinction, not a 2026 networking audit or verified peer-dependency bug. Do not blame registry infrastructure for every resolver conflict. |

### Inferences

- Ownership stability protects existing consumers, while reducing name reuse. Both the current policy and the complaint should be presented, rather than treating reclamation as cost-free. [Policy](https://docs.npmjs.com/policies/disputes/); [complaint acknowledging transfer risk](https://github.com/orgs/community/discussions/192413).
- A replacement registry still needs credible support, namespace rules, and honest metrics. These sources motivate product questions; they do not establish a particular replacement solves them. [Name policy](https://docs.npmjs.com/policies/disputes/); [support complaint](https://github.com/orgs/community/discussions/208726); [download definition](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html).

### Gaps

- No representative evidence for a growing ecosystem-wide frustration trend, broad account-recovery failures, or a general support SLA failure was established. Avoid a long list of unverified complaint snippets.
