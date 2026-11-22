---
title: "Who could pay for a sustainable JavaScript registry?"
description: "Who could fund a JavaScript registry? Verified statistics, comparable services, and explicitly hypothetical pricing models."
date: "2026-11-08"
tags: ["cloudflare","npm","economics"]
draft: false
---

Research supplement, November 8, 2026. All prices are USD. This supplement distinguishes verified statistics from hypothetical commercial scenarios. It does not estimate npm's actual revenue, profit or operating bill.

## The promising direction

**Keep public publishing and ordinary public downloads free. Sell businesses better ways to consume, govern and privately distribute packages.**

That means charging the platform or security team that wants audit trails, private packages, organization policy, dependable CI caching, support and an SLA, rather than charging a volunteer because their package became popular. This is a proposed direction, not measured willingness to pay. Existing official offers show the pattern is plausible: npm charges for private collaboration, GitHub Packages keeps public packages free, and JFrog sells enterprise artifact management and security. [npm Teams](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan/), [GitHub Packages](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-packages/about-billing-for-github-packages), [JFrog](https://jfrog.com/pricing/).

The critical market distinction is **publishers versus consumers**. A company can depend heavily on npm without publishing any package. Counting publishing organizations alone would miss those potential buyers. Conversely, a maintainer with many packages may have little budget.

## What we can actually count

| Question | Verified evidence | What it does not tell us |
| --- | --- | --- |
| How large is the visible registry? | At approximately 08:32 UTC on November 8, 2026, npm's replication API reported **4,580,521 documents**. [API](https://replicate.npmjs.com/) | Not a count of versions, people, companies, private packages or paying customers. |
| How much is downloaded? | **999,243,276,881 reported downloads**, October 9 to November 7, 2026 inclusive. [Fixed-date API](https://api.npmjs.org/downloads/point/2026-10-09:2026-11-07) | Not unique users, enterprise buyers, transferred bytes or actual CDN/origin requests. The response does not specify a public/private split. |
| What is the historical comparison? | In March 2020, GitHub reported **over 1.3 million packages and 75 billion downloads/month**. [Announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/) | These are historical numbers with different definitions from a current document count. |
| How many people publish? | No verified current exact count established in this research. The 2020 announcement says “hundreds of thousands” of contributing developers and maintainers. [Announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/) | That phrase is not a count of registered accounts or monthly active publishers. |
| How many organizations publish? | No reliable current count established. Scopes can belong to individuals or organizations; organizations can also manage unscoped packages. [Scopes](https://docs.npmjs.com/about-scopes/), [organization ownership](https://docs.npmjs.com/about-organization-scopes-and-packages/) | Counting `@scope` prefixes does not count companies. |
| How many customers already pay? | No npm-specific verified paid-seat count, customer count or revenue figure located. | There is no justified conversion denominator or existing revenue baseline here. |

A small reproducible download check queried ten familiar packages, not a ranking: react, lodash, typescript, express, debug, semver, chalk, ms, tslib and axios. They totaled **17.54 billion downloads**, about **1.756%** of the reported aggregate over the same dates. This shows why popularity needs measurement, but does not establish a top-ten concentration figure or enterprise consumption share. [Exact query](https://api.npmjs.org/downloads/point/2026-10-09:2026-11-07/react,lodash,typescript,express,debug,semver,chalk,ms,tslib,axios).

For demographic research, distinguish registered accounts, listed maintainers, accounts that published during a defined window, and verified publishing organizations. npm metadata exposes version timestamps and publisher fields, but maintainer metadata is explicitly informational, not authoritative. Accounts can also represent automation rather than unique people. [Official metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).

## What comparable services charge

Official prices and policies observed November 8, 2026:

| Service | Offer | Annualized comparison |
| --- | --- | --- |
| npm individual paid plan | $7/month for private packages | $84/year at 12 monthly payments. [Docs](https://docs.npmjs.com/upgrading-to-a-paid-user-account-plan/) |
| npm Teams | $7/member/month, including members without private-package access | Ten members cost $840/year. [Docs](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan/) |
| GitHub Packages | Public packages free; private storage/transfer allowances, then metered usage | A public/private cross-subsidy pattern, not a directly comparable seat tariff. [Billing](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-packages/about-billing-for-github-packages) |
| JFrog SaaS Pro | $150/month shown alongside limited-time $50/month promotion; 25 GB base consumption | $1,800 or $600 at 12 unchanged monthly payments, before extras. [Pricing](https://jfrog.com/pricing/) |
| JFrog SaaS Enterprise X | Starts $950/month; 125 GB base consumption, 99.9% uptime and 24/7 SLA support | $11,400 before extras at 12 monthly payments. Not an npm-specific quote. [Pricing](https://jfrog.com/pricing/) |
| JSR | Free public service, Deno-funded hosting; sponsorships, donations or grants are possible future funding sources | Cross-subsidy, not proof of self-funding. Private publishing is not currently available. [FAQ](https://jsr.io/docs/faq), [charter](https://jsr.io/docs/governance/charter), [private registries](https://jsr.io/docs/private-registries) |

npm's pricing documentation was last edited October 23, 2023 and remained live when checked. These are list prices, not realized revenue. Cloudsmith's pricing page returned a verification/rate-limit response, so no unverified figure is included.

## Alternatives worth exploring

### 1. Enterprise consumers fund the public service

Offer businesses a contract covering organization policy, SSO, controlled dependency intake, audit logs, provenance evidence retention and support commitments. Companies that publish nothing can still buy it.

The benefit is larger contracts tied to business risk. The barrier is convincing buyers to replace or supplement existing artifact managers. Sales, security expertise, compliance and support also cost money. Keep baseline integrity, publishing authentication and basic safety available to everyone. Paid provenance workflows should not imply that provenance proves code is safe.

### 2. Private collaboration and predictable organization tiers

Keep private packages as a paid service, but test predictable organization bundles rather than charging every occasional collaborator. A proposal could include human administration seats, free read-only guests and CI identities, and storage allowances with clear limits.

The tradeoff is predictability versus usage exposure. Define active seats and multi-organization billing clearly so buyers do not avoid inviting contributors or split namespaces to reduce charges. Offer transparent exemptions for eligible OSS projects, including nonprofit teams with heavy release automation.

### 3. A commercial CI cache with measured usage

Sell a managed cache to businesses or CI providers with included usage, spend alerts and negotiated sustained-load contracts. Bill for the service's actual measured bytes, storage or requests, not public package popularity.

A Cloudflare entrant could test this without immediately replacing npm's publishing authority. The barrier is that businesses can self-cache, retain existing artifact managers or bypass the service. Its value must be faster builds, policy enforcement, reliability or simpler operations, not merely a toll on free upstream code.

### 4. Corporate membership plus transparent governance

Invite companies that benefit from the registry to fund its common operating budget. Publish finances, reserves and subsidy commitments. Keep sponsorship separate from package ranking, security decisions and namespace rights. Maintainer grants should be separately accounted for, not silently treated as registry operating revenue.

JSR's charter provides a concrete example of sponsor funding, public decisions and an intended legal home, but does not prove a diversified membership model is already paying its bills. [Charter](https://jsr.io/docs/governance/charter).

### 5. Fair-use limits and voluntary contributions as complements

Use quotas to stop spam and exceptional bulk load, with easy increases and appeals for legitimate OSS. Do not charge security releases or delete historical dependency versions as a routine cost-saving mechanism. JSR explicitly frames its quotas as anti-abuse protections and permits increases. [Quotas](https://jsr.io/docs/quotas-and-limits).

Optional individual support can help, but should not be the sole operating plan. Avoid install-time ads, guilt prompts and any suggestion that paying makes a package trustworthy. Cross-subsidy from GitHub or Cloudflare is another possibility, but it should be presented honestly as subsidy rather than standalone registry profit.

## What the revenue could look like

**Every prospect pool, conversion rate and proposed price below is hypothetical.** None is an estimate of npm's customer base. ARR is steady-state annualized recurring revenue, not first-year cash or profit.

| Model | Assumed qualified pool | Assumed conversion | Paying units | Annual price | Annualized revenue |
| --- | --- | --- | --- | --- | --- |
| Small org plan | 20,000 orgs | 5% | 1,000 orgs | $600 | $600,000 |
| Larger org plan | 50,000 orgs | 4% | 2,000 orgs | $1,200 | $2.4 million |
| Enterprise controls | 5,000 enterprises | 5% | 250 enterprises | $12,000 | $3 million |
| Private seats | 100,000 eligible seats | 10% | 10,000 seats | $84 | $840,000 |
| Commercial CI cache | 10,000 orgs | 5% | 500 orgs | $2,400 base | $1.2 million, overages excluded |
| Corporate membership | 2,000 approached companies | 2.5% | 50 sponsors | $20,000 | $1 million recurring support |
| Individual support | 1 million reached people | 1% | 10,000 supporters | $60 | $600,000 recurring support |

For example, 5,000 qualified enterprise prospects × 5% conversion × $12,000/year = $3 million ARR. That calculation says what must be achieved, not that the prospects or conversion exist. Donations count as recurring support only if renewals recur; grants are not automatically ARR. Do not add all rows together without removing overlapping customers and bundle cannibalization.

A mixed, deliberately disjoint scenario could be:

- 2,000 small organizations × $600 = $1.2 million.
- 150 enterprises × $12,000 = $1.8 million.
- 20 recurring sponsors × $25,000 = $500,000.
- Total: **$3.5 million annualized revenue/support**.

At an assumed 80% contribution margin, $2.8 million remains before fixed overhead. Subtract a hypothetical $2 million fixed annual budget and the modeled surplus is $800,000 before tax, financing and omitted costs. This is not npm's profitability.

### How many payers would cover different budgets?

The following budgets are hypothetical fixed operating overhead, not estimates of npm's spending. Assume 20% of revenue goes to variable costs, leaving an 80% contribution margin.

Required payers = fixed annual budget ÷ (annual price × 80%), rounded up.

| Annual price | $500,000 fixed budget | $2 million fixed budget | $10 million fixed budget |
| --- | --- | --- | --- |
| $84/seat | 7,441 seats | 29,762 seats | 148,810 seats |
| $600/org | 1,042 orgs | 4,167 orgs | 20,834 orgs |
| $1,200/org | 521 orgs | 2,084 orgs | 10,417 orgs |
| $12,000/enterprise | 53 enterprises | 209 enterprises | 1,042 enterprises |
| $25,000/sponsor | 25 sponsors | 100 sponsors | 500 sponsors |

At $12,000/year and a $2 million fixed budget, break-even changes from 209 buyers at 80% contribution margin to 278 at 60%, or 186 at 90%. A model that instead puts all delivery and service costs inside its operating budget must not apply the same variable-cost deduction again.

The conclusion is not that enterprise pricing is guaranteed to work. It is that an enterprise model can be evaluated with hundreds of buyers, while low-price seats need tens of thousands. The next question is whether buyers value the offer enough to sign contracts.

## Costs and rights that must not disappear from the model

Revenue is not profit. Gross profit subtracts cost of goods sold; operating profit also subtracts engineering, sales, administration and other operating expenses. The scenario contribution margin above is an assumption, not npm's disclosed gross margin.

Count storage, actual edge and origin operations, metadata freshness, backups, publication processing, authentication, malware scanning, incident response, customer support, billing and takedowns. GitHub described npm services across more than 30 repositories in February 2024, and reported removing over 500 compromised packages during the September 2025 Shai-Hulud response. Those are real operating responsibilities, not a disclosed cost breakdown. [Architecture](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/), [security response](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/).

Cloudflare R2 lists Standard storage at $0.015/GB-month, Class A operations at $4.50/million and Class B operations at $0.36/million, with free direct egress. Connected services can still charge separately. These are **retail prices, not Cloudflare's marginal costs**, and package download totals do not establish actual R2 or CDN request counts. [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [npm API definitions](https://github.com/npm/registry/blob/main/docs/download-counts.md).

A commercial mirror also needs rights review. npm permits public API replication but restricts abusive load and automated website crawling. Package copyrights remain with publishers and licenses differ; public availability is not a universal redistribution license. npm security data also has explicit restrictions on redistribution beyond personal/internal use. Do not assume a competitor can simply resell npm audit data. [Open Source Terms, updated March 10, 2022](https://docs.npmjs.com/policies/open-source-terms/).

## The next useful research, without a giant scrape

1. Ask npm for aggregate registered/current accounts, 30/90/365-day public and private publishers, verified publishing organizations, paid seats, paid orgs, revenue and retention. Define humans, automation and private-only activity separately.
2. Pilot 100 named public packages. Extract version dates and publisher usernames with a bounded request budget. Publish the sample and report only panel findings, not registry-wide extrapolations. Do not retain personal emails.
3. Interview 15 to 20 commercial consuming teams, including nonpublishers, about current artifact-management/security spending. Seek five design partners before assuming a reachable market.
4. Test organization and enterprise price hypotheses with those buyers. Run an opt-in CI cache pilot measuring real bytes, requests and support costs. Do not substitute downloads for billable requests.
5. Publish an OSS exemption, fair-use and subsidy policy, then review redistribution licenses and security-data rights before a commercial mirror launch.

**Bottom line:** publisher demographics matter, but enterprise consumers may be the more important funding pool. The strongest working hypothesis is free public infrastructure financed by private collaboration and paid commercial reliability/governance, with membership and cross-subsidy providing additional resilience. Whether it works depends on buyer evidence and a measured full-service cost model, not the registry's package count alone.

Detailed source notes and measurement limitations: [publisher economics research](/reports/cloudflare-npm/sources/publisher-economics-pricing/).
