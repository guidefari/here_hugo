---
title: "npm publisher demographics and sustainable registry pricing"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

Research date: November 8, 2026. Research only. Existing research and the main article were not edited. General web search returned no results for multiple queries. Discovery therefore used official documentation, GitHub's public blog search API and small public npm API queries. This limits discovery completeness. No authentication, paid APIs, registry-wide scrape or bulk replication was performed. All modeled customer counts, conversions, prices and budgets below are assumptions unless explicitly identified as sourced list prices.

## 1. How many people and organizations publish, and what is actually measurable?

### Takeaway

Public npm APIs establish registry document counts and reported download volume, but do not establish a census of active publishing humans, companies or paying customers. A scope is not a company, a maintainer listing is not an active publisher, and a package count is not a version count. [Scopes](https://docs.npmjs.com/about-scopes/), [organization ownership](https://docs.npmjs.com/about-organization-scopes-and-packages/), [metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).

### Cited Findings

| Metric | Dated evidence | Meaning and limitation |
| --- | --- | --- |
| Historical public ecosystem | March 16, 2020: over 1.3 million packages, 75 billion downloads/month and contributions by “hundreds of thousands” of developers and maintainers | Historical marketing description, not a registered-user census or 30-day active-publisher count. [Acquisition announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/) |
| Current registry documents | November 8, 2026, approximately 08:32 UTC: `doc_count: 4580521`, `update_seq: 142968736`, engine `npm-replicate` | Public-visible replication document count. Not total public plus private packages, versions, people or publishing organizations. A sibling researcher observed 4,580,507 earlier that day; this is a moving counter, not a contradiction. [Replication root](https://replicate.npmjs.com/) |
| Reported downloads | October 9 through November 7, 2026 inclusive: 999,243,276,881 | Official API-reported all-packages downloads, not unique users, company downloads, installs, bytes, edge requests or billable origin reads. The response does not break out public versus private traffic. [Fixed-date API](https://api.npmjs.org/downloads/point/2026-10-09:2026-11-07), [API definition](https://github.com/npm/registry/blob/main/docs/download-counts.md) |
| Small named-package pilot | Same interval: 10 deliberately selected familiar packages sum to 17,544,302,838 downloads, about 1.756% of the reported aggregate | Arithmetic from one small bulk query, not a top-10 ranking or representative sample. No payer demographics can be inferred. [Pilot API](https://api.npmjs.org/downloads/point/2026-10-09:2026-11-07/react,lodash,typescript,express,debug,semver,chalk,ms,tslib,axios) |
| Scopes | Docs observed November 8, 2026, last edited October 23, 2023: both personal accounts and organizations receive scopes | Counting unique `@scope` prefixes cannot count unique organizations. Unscoped packages are public; private packages are scoped, but scoped does not mean private. [Scopes](https://docs.npmjs.com/about-scopes/) |
| Organization ownership | Docs observed November 8, 2026, last edited October 23, 2023: organizations can manage unscoped packages and packages in other scopes | Counting organization-looking prefixes misses some organization-managed packages. Legal companies can also operate multiple accounts or npm organizations. [Organization packages](https://docs.npmjs.com/about-organization-scopes-and-packages/) |
| Maintainer and publisher fields | Archived official specification: top-level `maintainers` is informational, not authoritative; version `_npmUser` describes the publishing account; `time` records version publication timestamps | These are different concepts. Authors/contributors are freeform, historically unvalidated fields. A username is not verified to be a unique human. [Metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md) |

Pilot detail, all for October 9 through November 7, 2026 inclusive: react 836,594,751; lodash 691,042,106; typescript 1,362,049,966; express 650,745,055; debug 3,138,033,227; semver 3,832,975,746; chalk 2,124,630,345; ms 2,431,966,787; tslib 1,990,207,490; axios 486,057,365. Source: [same bulk response](https://api.npmjs.org/downloads/point/2026-10-09:2026-11-07/react,lodash,typescript,express,debug,semver,chalk,ms,tslib,axios). The named set gives only a lower bound on the share attributable to any ten packages, conditional on aggregate/per-package comparability. It says nothing about the full concentration curve or enterprise share.

### Inferences

Suggested metric definitions for future measurement, not claims that these measurements exist:

1. **Registered accounts:** cumulative accounts created and accounts still existing, separately. Only npm can establish this accurately, including dormant/nonpublishing accounts, deletions and private-only users.
2. **Listed public maintainer accounts:** deduplicated usernames in current public metadata. Useful descriptive proxy, not authoritative permissions, activity or human identity.
3. **Observed active public publisher accounts:** distinct version `_npmUser.name` values with `time[version]` in an explicit 30-, 90- or 365-day window. Preserve missing identities, CI/trusted-publisher differences and suspicious automation as separate categories. Do not merge people by email or infer employer from email.
4. **Active public packages:** names with at least one newly published version in the window. Do not use metadata `modified`, which can change without a publication.
5. **Publishing organizations:** verified npm org IDs that own or manage packages with releases in the window. Public prefixes alone cannot establish this. Ask npm for an aggregated internal count, separating companies, foundations, projects and unclassified organizations where possible.
6. **Public release volume:** distinct `name@version` pairs and publication events, separately. A change-feed event may be a metadata/tag edit, deletion or repeated document update, not a new release. A snapshot counts surviving versions, not every historically published or removed version.

These distinctions follow from the [metadata fields](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md), [scope semantics](https://docs.npmjs.com/about-scopes/) and [2025 replication migration](https://github.com/orgs/community/discussions/152515).

Cheap, reproducible pilots, proposed rather than executed:

- Start with 100 explicitly listed public package names from several ecosystems. Fetch each full packument once, cap response size and total requests, and extract versions, timestamps and publisher usernames without retaining emails. Publish the package list and observation timestamp. This is a biased panel, not an extrapolatable publisher census. The 10-name download pilot above demonstrates a smaller query, not the full proposed protocol. [Metadata endpoint](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).
- For a bounded activity panel, request at most 100 recent change records, deduplicate IDs, fetch those packuments, then identify actual recent version timestamps. Report exact sequence boundaries and wall-clock window. Recent-change sampling overweights frequently updated packages and cannot estimate registry-wide active publishers without a known sampling design. Use current pagination, not old `include_docs`/continuous-feed examples. [Migration guide](https://github.com/orgs/community/discussions/152515).
- For concentration, use a fixed named set or a reproducibly defined public lockfile corpus. Query download totals for the identical dates and report sample share. A project's lockfile gives dependency use, not corporate payer identity or actual private CI request frequency. Bulk download queries support up to 128 unscoped packages according to the archived docs; test small queries before relying on historical limits. [Download API](https://github.com/npm/registry/blob/main/docs/download-counts.md).
- A complete public snapshot would require enumeration plus millions of metadata fetches, deletion handling and an agreed resource budget. Do not launch that here. A low-cost alternative is an existing legally reusable dated research snapshot, followed by a small current panel. Neither exposes private packages. [Replication migration](https://github.com/orgs/community/discussions/152515).
- Best decision input: request aggregated internal counts of registered/current accounts, publishing accounts and organizations over 30/90/365 days, public/private versions, paid seats, paid orgs, retention and revenue, with bot/service accounts separately defined. This is a recommended information request, not a discovered dataset.

### Gaps

- No verified current exact total of registered npm accounts, unique human maintainers, 30/90/365-day publishers, publishing npm organizations, legal companies or organization scopes was established.
- No verified current total version count or daily/monthly release count was established. `update_seq` is not that statistic.
- No verified public/private package, storage, release or download split was established. Public metadata cannot reveal private-only customers.
- No reliable current share of downloads by enterprise, authenticated organization, CI, mirrors, bots or individual developers was established. Anonymous consumption and intermediaries prevent deriving company counts from public downloads.
- No npm-specific paid-customer count, seat count, revenue, gross margin or profit disclosure was located. Search limitations mean absence here is not proof that no disclosure exists.

## 2. What do official registry prices and policies tell us?

### Takeaway

The clearest existing commercial pattern is free public distribution plus paid private collaboration and enterprise controls. npm's published seat price is low enough that meaningful revenue needs many paying seats; enterprise procurement can fund larger contracts without billing volunteer maintainers. [npm individual plan](https://docs.npmjs.com/upgrading-to-a-paid-user-account-plan/), [npm Teams](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan/), [JFrog pricing](https://jfrog.com/pricing/).

### Cited Findings

Prices below were observed November 8, 2026, in USD. These are public list prices or documented allowances, not observed realized revenue, negotiated enterprise prices or infrastructure costs.

| Service | Official offer observed | Commercial lesson |
| --- | --- | --- |
| npm individual paid plan, commonly called Pro | $7/month to install and publish private packages, equivalent to $84/year at 12 monthly payments. Documentation last edited October 23, 2023. [Docs](https://docs.npmjs.com/upgrading-to-a-paid-user-account-plan/) | Private collaboration is already monetized; public packages remain free. [About npm](https://docs.npmjs.com/about-npm/) |
| npm Teams | $7/member/month, including members whose teams lack access to private packages; $84/seat/year at 12 payments. Documentation last edited October 23, 2023. [Docs](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan/) | Seat billing can discourage inviting occasional contributors. Ten seats imply $840/year, not $84 per organization. |
| GitHub Packages | Public packages and inbound transfer free. Private Free account allowance: 500 MB storage and 1 GB monthly transfer; Pro/Team 2 GB and 10 GB; Enterprise Cloud 50 GB and 100 GB. Overage metered; Actions downloads authenticated with `GITHUB_TOKEN` have special free-transfer treatment. [Billing](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-packages/about-billing-for-github-packages) | Free public hosting plus private usage budgets and platform bundling. Do not generalize container-registry free storage/transfer to every private package format. |
| JFrog SaaS Pro | Page shows $150/month and a limited-time $50/month offer, 25 GB base consumption. Annualized $1,800 or $600 respectively if unchanged for 12 months, not a guaranteed annual quote. [Pricing](https://jfrog.com/pricing/) | Base subscription plus automatic additional usage, not a tax on every public publisher. |
| JFrog SaaS Enterprise X | Starting $950/month, 125 GB base consumption, 99.9% uptime and 24/7 SLA support; annualized $11,400 before extras. Enterprise+ custom pricing with 99.99% in-region guarantee. Self-managed Pro X starts $27,000/year and Enterprise X $51,000/year. [Pricing](https://jfrog.com/pricing/) | Reliability, SSO, governance, security and support provide established enterprise packaging comparators, not proof npm buyers will pay the same. |
| JSR | FAQ says always free and Deno Company pays hosting bills; charter says Deno funds until a formal structure exists, with contributions, sponsorships or grants as alternatives. Private publishing is not currently offered. [FAQ](https://jsr.io/docs/faq), [charter](https://jsr.io/docs/governance/charter), [private registries](https://jsr.io/docs/private-registries) | Cross-subsidy and governance are documented alternatives, not evidence the service is self-funding. |
| JSR quotas | Default three owned scopes/account, 100 packages/scope, 20 package creations/scope per rolling week, 1,000 publish attempts/scope per rolling week, and 20 MB package/file limits; support can raise them. [Limits](https://jsr.io/docs/quotas-and-limits) | Anti-abuse quotas need not become payment gates for legitimate OSS. |

Cloudsmith's official pricing URL returned HTTP 429 and a verification page, so no current price was verified or borrowed from snippets. npm's marketing products page returned HTTP 403; the dollar prices above are from official npm documentation instead. [Cloudsmith](https://cloudsmith.com/pricing), [npm products](https://www.npmjs.com/products).

Important rights and operating constraints:

- npm's Open Source Terms, last updated March 10, 2022 and observed November 8, 2026, permit replication through public APIs, prohibit automated website crawling and unreasonable infrastructure load, and explicitly call five million requests per individual, organization or affiliated group per month unreasonable. This is an acceptable-use boundary, not a published enterprise tariff or a guarantee that fewer requests are always acceptable. [Terms, Acceptable Use](https://docs.npmjs.com/policies/open-source-terms/).
- The terms reserve package IP to publishers and state publishers decide licensing. Publicly downloadable is not equivalent to permissively licensed. Preserve licenses/notices, honor relevant copyleft obligations, verify redistribution rights, and review takedown/security/deletion synchronization before offering a commercial mirror. npm's special license to host content should not be assumed transferable to a competitor. This is a legal-review recommendation, not legal advice. [Terms, Your Content](https://docs.npmjs.com/policies/open-source-terms/).
- The same terms restrict redistribution of npm's package-security data beyond personal/internal business use. A competing paid security service must establish its own data rights or agreements, not simply resell npm audit results. [Terms, Conditions](https://docs.npmjs.com/policies/open-source-terms/).
- JSR disallows production browser asset-CDN usage and general-purpose file hosting. Its scope/creation/publish limits are abuse controls, not an unlimited CDN entitlement. [Usage policy, dated March 6, 2024](https://jsr.io/docs/usage-policy), [limits](https://jsr.io/docs/quotas-and-limits).
- Registry work includes Node.js services across 30-plus repositories as of February 13, 2024, and security incident response: GitHub reported removing 500-plus compromised packages in response to the September 2025 Shai-Hulud incident. Neither count discloses ongoing staffing costs. [Engineering](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/), [September 22, 2025 security report](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/).

### Inferences

- Charging organizations for policy enforcement, support and private collaboration is more aligned with their procurement needs than charging public maintainers for being depended on. This is a product hypothesis suggested by the offers above, not measured willingness to pay.
- Keep baseline publication authentication, integrity and security protections public. Sell organization policy management, evidence retention, compliance exports and response commitments on top. Charging for essential safety creates a weaker free ecosystem and undermines paid customers' dependencies too.
- npm's 2020 announcement proposed moving paying private customers to GitHub Packages. It is not proof this migration completed; today's npm documentation still describes paid private plans. [Announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/), [current Teams documentation](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan/).

### Gaps

- Current Cloudsmith prices were not verified. Current npm Enterprise custom pricing and commercial terms were not established.
- No evidence here establishes how many npm seats pay list price, the proportion annual/prepaid/discounted, or net retention.
- No official public price establishes Cloudflare's internal marginal delivery, security or support cost, or npm's negotiated infrastructure contract.

## 3. Which sustainable pricing models deserve testing, and what would they need to earn?

### Takeaway

The strongest candidate is a free public registry financed by paid enterprise consumption controls, with private collaboration, a bounded managed cache and optional memberships as complementary revenues. The scenario math below is deliberately independent of unknown npm demographics: it answers “how many buyers would be needed?”, not “how many buyers exist?”. Comparators are the [npm private-seat model](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan/), [GitHub's public/private split](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-packages/about-billing-for-github-packages) and [JFrog's enterprise tiers](https://jfrog.com/pricing/).

### Cited Findings

Cloudflare R2's observed retail Standard prices are $0.015/GB-month storage, $4.50/million Class A operations and $0.36/million Class B operations; direct R2 egress is free, but connected metered services may charge separately. These are retail infrastructure inputs, not Cloudflare's marginal costs and not a complete registry budget. [Pricing](https://developers.cloudflare.com/r2/pricing/).

### Inferences

Everything in the following tables is a proposed design or arithmetic on explicit assumptions, not market evidence.

| Proposed model | Payer and benefit | Friction, incentives and safeguards |
| --- | --- | --- |
| Enterprise consumer subscription | Businesses buying SSO/SCIM, private endpoints, policy allowlists, audit trails, provenance retention, response SLA and contractual support | Procurement takes time; prove differentiation versus existing artifact managers. Keep public publishing, basic verification and ordinary downloads free. Offer free eligible OSS organization plans. |
| Private packages and seats | Companies storing restricted internal code | Familiar npm pattern; per-member charges penalize collaboration. Test active human administrator/developer seats, free read-only guests and nonmultiplicative CI identities, plus storage allowances. |
| Organization tiers | Businesses pay a predictable annual minimum for controls, storage and support | Easier budgets than per-download billing, but org count is not company count. Consolidated billing and clear multi-org rules reduce namespace splitting. Verify eligibility rather than infer it from scope names. |
| Managed CI cache with usage bands | CI providers and high-volume commercial consumers buy predictable cache, byte/request quotas and reports | Customers can self-cache or bypass. Charge measured service-specific units, with included allowances, spend alerts and negotiated sustained-load contracts. Do not bill maintainers for consumer popularity. |
| Security/compliance add-on | Risk and platform teams buy approvals, policy evidence, license/provenance workflows and emergency response | Requires legitimate data rights and expertise; provenance is not a safety guarantee. Baseline safety remains free. Count analyst/on-call labor and third-party feeds in COGS. |
| Sponsorship/membership | Corporate beneficiaries fund a common public service and possibly maintainer grants | Free-rider and donor concentration risk. Publish budget and reserves, cap sponsor governance power, and keep security decisions and package ranking independent of payment. Separate registry operating funds from maintainer grants. |
| Voluntary individuals | Supporters opt into a small monthly contribution | Simple and inclusive but unreliable as the only funding source. Avoid install-time nagging or ads. Do not equate paying with package trust. |
| Platform cross-subsidy | GitHub or Cloudflare funds registry costs from adjacent commercial products | Can support free access but is not registry profit. Disclose the subsidy, portability plans, funding commitments and what happens if the sponsor withdraws. JSR's charter is a concrete governance reference. |
| Quotas/fair-use | Everyone has anti-spam publication/storage limits; verified OSS gets increases, exceptional commercial bulk load gets contracts | Not a revenue plan alone. Use staged limits, explanations, appeals and advance notice. Avoid deleting old dependency versions to save costs or charging emergency security releases. |

#### Assumption-labeled annual recurring revenue scenarios

“Reachable base” means a hypothetical qualified prospect pool, not an npm census. Revenue is steady-state annualized run-rate at the stated number of payers; it is not first-year collected cash. No model assumes a percentage of 4.58 million documents represents companies.

| Scenario | Hypothetical qualified base | Assumed conversion | Paying units | Assumed annual price | ARR arithmetic |
| --- | --- | --- | --- | --- | --- |
| Small business org plan | 20,000 organizations | 5% | 1,000 orgs | $600/org | 20,000 × 5% × $600 = $600,000 |
| Larger org plan | 50,000 organizations | 4% | 2,000 orgs | $1,200/org | 50,000 × 4% × $1,200 = $2,400,000 |
| Enterprise controls | 5,000 qualified enterprises | 5% | 250 enterprises | $12,000 | 5,000 × 5% × $12,000 = $3,000,000 |
| Private seats | 100,000 eligible seats | 10% | 10,000 seats | $84, matching 12 monthly npm list payments | 100,000 × 10% × $84 = $840,000 |
| Managed commercial cache | 10,000 qualified orgs | 5% | 500 orgs | $2,400 base, overages excluded | 10,000 × 5% × $2,400 = $1,200,000 |
| Corporate membership | 2,000 approached companies | 2.5% | 50 sponsors | $20,000 | 2,000 × 2.5% × $20,000 = $1,000,000 pledged recurring support |
| Individual support | 1,000,000 reached people | 1% | 10,000 supporters | $60 | 1,000,000 × 1% × $60 = $600,000 recurring support |

The last two rows are only ARR-like if renewal is genuinely recurring; donations and grants are not automatically contracted ARR. Seat conversion is not organization conversion. Seats may duplicate people across orgs under actual billing rules. Do not sum scenarios without deduplicating overlapping buyers and checking bundle cannibalization.

Illustrative mixed model with disjoint customer tiers: 2,000 small orgs × $600 + 150 enterprises × $12,000 + 20 recurring corporate sponsors × $25,000 = $3.5 million annualized revenue/support. At an assumed blended 80% contribution margin, this yields $2.8 million before fixed operating overhead. With an assumed $2 million fixed annual budget, modeled operating surplus is $800,000 before tax, financing and unmodeled costs. This is not npm's profit or a validated forecast.

#### Break-even sensitivity

Assume the budget is fixed annual operating overhead, excluding variable COGS. Required payers = ceiling(fixed budget / (annual price × assumed contribution margin)). At 80% contribution margin, 20% of revenue is reserved for variable delivery, scanning, payment processing and directly attributable service/support costs. A service with a different cost mix must replace this assumption.

| Annual price/unit | Assumed contribution/unit at 80% | $500,000 fixed budget | $2 million fixed budget | $10 million fixed budget |
| --- | --- | --- | --- | --- |
| $84/seat | $67.20 | 7,441 seats | 29,762 seats | 148,810 seats |
| $600/org | $480 | 1,042 orgs | 4,167 orgs | 20,834 orgs |
| $1,200/org | $960 | 521 orgs | 2,084 orgs | 10,417 orgs |
| $12,000/enterprise | $9,600 | 53 enterprises | 209 enterprises | 1,042 enterprises |
| $25,000/sponsor | $20,000 | 25 sponsors | 100 sponsors | 500 sponsors |

These budgets are deliberately hypothetical scale probes, not npm cost estimates. At $2 million fixed overhead and $12,000 annual contracts, break-even is 278 customers at 60% contribution margin, 209 at 80%, and 186 at 90%. Fixed and variable support allocation must be consistent. If a budget instead includes all COGS, simple revenue coverage is budget/price, and applying the margin again would double-count costs.

Accounting boundaries:

- Revenue is not profit. Gross profit is revenue minus COGS; gross margin is gross profit/revenue. Operating profit also subtracts engineering, sales, administration and other operating expenses. The contribution margin assumption above is a scenario convention, not a reported GAAP gross margin.
- Model monthly request classes and bytes independently: edge hits, metadata reads, origin misses, writes, background replication, malware scanning CPU, evidence retention, backups, logs, DDoS/abuse, payment fees, support cases and on-call coverage. Never multiply the aggregate npm download count by a CDN price and label it the real bill.
- An R2 GET price applies to measured R2 reads, not npm's public download statistics. Edge caching, client caching, retries, metadata requests and private traffic change request ratios. The public API does not measure those ratios. [Download definition](https://github.com/npm/registry/blob/main/docs/download-counts.md), [R2 billing units](https://developers.cloudflare.com/r2/pricing/).
- Enterprise features can improve revenue per buyer but add sales, compliance, support and liability costs. A small cache/mirror budget is not interchangeable with an authoritative registry's identity, namespace ownership, publication and security-response obligations.

Suggested validation sequence: interview 15 to 20 commercial consumer teams, including some that publish nothing; ask what they already spend on artifact security and CI, and what they would replace. Obtain five design partners before building enterprise controls. Test $600/$1,200 org tiers and $12,000 enterprise contracts as hypotheses, not “market prices.” Run a bounded opt-in CI cache pilot with actual bytes, origin reads, metadata calls and support logs. Publish a draft subsidy/OSS exemption policy and independently review mirror licenses, API rights and security-data rights. This sequence is a recommendation, not completed customer research.

### Gaps

- The reachable buyer pools, willingness to pay, churn, conversion rates, sales-cycle length and blended margins above are not measured.
- Actual npm operating budgets and Cloudflare marginal costs remain unknown. None of the scenarios establishes npm is currently unprofitable, or that a replacement could deliver equivalent reliability/security at the assumed budgets.
- Before adoption forecasts, obtain both supplier-side activity counts and buyer-side procurement evidence. Publisher demographics alone cannot size an enterprise-consumer product.
