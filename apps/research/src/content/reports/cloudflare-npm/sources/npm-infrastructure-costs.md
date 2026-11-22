---
title: "npm ownership, infrastructure, replication, and operating costs"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

Research cutoff and observation date: November 8, 2026. Primary sources were fetched directly, including live npm API responses. General web search returned no results for multiple queries, so discovery used official documentation, GitHub's blog search API, and linked primary sources. This limits the completeness of the historical cost search. No site content was changed.

## 1. Who runs npm, and what responsibilities would a replacement inherit?

### Takeaway

GitHub owns and operates npm, within Microsoft. Replacing npm as the authoritative registry means replacing identity, package ownership, publication authorization, security response, policy enforcement, and developer workflows, not merely finding cheaper distribution infrastructure. [GitHub acquisition completion](https://github.blog/news-insights/company-news/npm-has-joined-github/), [Microsoft acquisition completion](https://blogs.microsoft.com/blog/2018/10/26/microsoft-completes-github-acquisition/), [current trusted publishing](https://docs.npmjs.com/trusted-publishers/), [publish-time scanning](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata).

### Cited Findings

#### Ownership and operational timeline

- October 26, 2018: Microsoft completed its acquisition of GitHub. The announcement says GitHub would operate independently and remain an open platform. This establishes corporate ownership, not that npm necessarily runs on Azure. [Microsoft](https://blogs.microsoft.com/blog/2018/10/26/microsoft-completes-github-acquisition/).
- March 16, 2020: GitHub announced its agreement to acquire npm. It reported over 1.3 million packages and 75 billion downloads per month, promised the public registry would remain free, and identified infrastructure, publishing/MFA experience, the open-source CLI, community engagement, and supply-chain security as responsibilities. [GitHub announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/).
- April 15, 2020: GitHub announced completion of the npm acquisition and renewed the public-registry availability/free commitment. Distinguish announcement from completion in an article timeline. [GitHub completion](https://github.blog/news-insights/company-news/npm-has-joined-github/).
- February 13, 2024: an npm engineer described registry services as Node.js microservices distributed across more than 30 repositories, each containerized with Docker. A user workflow could touch six services. The article concerns development in Codespaces, not production hosting on Azure or Codespaces. [npm engineering](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/).

#### Publication, identity, security, and policy

- Current trusted publishing accepts a CI identity only after the package owner configures a relationship to a specific provider/workflow. It exchanges OIDC identity for short-lived publish credentials. Current documentation lists GitHub Actions, GitLab CI/CD, and CircleCI cloud, excludes self-hosted runners, supports up to ten trusted publishers per package, and distinguishes stage, direct-publish, and dist-tag permissions. It also documents expiry after two days for an unvalidated new configuration. These are substantive authorization services. [Trusted publishing, last edited October 6, 2026](https://docs.npmjs.com/trusted-publishers/).
- Current docs describe package-owner settings to require 2FA and disallow traditional tokens, plus stage-only permissions that require a maintainer's review and 2FA approval before public release. A compatible replacement must reproduce the intended security properties, not only accept a tarball PUT. [Trusted publishing](https://docs.npmjs.com/trusted-publishers/).
- July 28, 2026: GitHub announced automatic publish-time malware scanning before new packages become installable. Results can permit publishing, hold packages for manual review, or block them. Typical availability delay is about five minutes, potentially 15 minutes or longer, explicitly not a guarantee. Blocked publishers may receive appeal options and accounts may face further action. [Publish-time scanning announcement](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata).
- The same announcement describes Trust & Safety review of dual-use packages, mandatory `contentPolicy` metadata and a text `DISCLOSURE` file, persistent declarations across future versions, and 2FA-enforced publication rules. This is a particularly strong present-day rebuttal to treating the registry as an ordinary static website. [Same announcement](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata).
- Provenance comprises a build/source attestation and a publish attestation generated by the registry for an authorized publication. Sigstore public-good services sign/log attestations in a transparency ledger. Provenance is evidence of where/how a package was built, not a guarantee it is non-malicious. Trusted publishing automatically generates provenance for supported public-repository/public-package combinations; CircleCI currently lacks this generation. [Provenance docs](https://docs.npmjs.com/generating-provenance-statements/), [trusted publishing limitations](https://docs.npmjs.com/trusted-publishers/).
- The unpublish policy protects the immutability of `name@version`: even an unpublished version cannot be reused. Within 72 hours, a newly created package may be unpublished if no registry packages depend on it. Beyond that window, it must have no dependents, fewer than 300 downloads in the last week, and one owner/maintainer. Deprecation is an alternative that preserves installation while warning consumers. These rules require authoritative package, dependency, ownership, and usage state. [Unpublish policy](https://docs.npmjs.com/policies/unpublish/).
- npm support handles unpublish/deprecation assistance and alleged terms violations; the same policy directs copyright claims to DMCA procedures and privacy claims to a privacy team. Even free public distribution has support, rights, and takedown work. [Unpublish policy, Issues section](https://docs.npmjs.com/policies/unpublish/).

### Inferences

- A useful article should separate three propositions: a cheaper npm read cache, an independently operated npm mirror, and a replacement authoritative publishing ecosystem. Each inherits a larger part of the responsibilities above. This distinction follows from the separate read/replication protocols and authorization/policy services. [Replication migration guide](https://github.com/orgs/community/discussions/152515), [trusted publishing](https://docs.npmjs.com/trusted-publishers/).
- Cloudflare infrastructure could help implement these services, but CDN economics do not themselves establish authority over existing npm accounts, namespaces, publisher permissions, or CI trust configuration. Mirroring informational package metadata is not transferring authoritative permissions: npm's archived metadata specification explicitly calls the maintainers field informational, not authoritative. [Metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).

### Gaps

- No current npm-specific staffing number, security-review budget, support cost, or total operating expenditure was found.
- The acquisition price and current npm-specific internal budget are not established by the acquisition sources used here.
- The 2020 acquisition announcement proposed moving private npm customers to GitHub Packages. Do not report that proposal as a completed migration; it was a forward-looking plan, and current npm documentation still includes private-package and paid-account workflows. [2020 announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/), [current documentation navigation](https://docs.npmjs.com/trusted-publishers/).

## 2. How do package delivery, metadata, origins, and replication actually work?

### Takeaway

The protocol separates mutable package metadata from versioned tarball payloads. Current observations already show Cloudflare in front of both metadata and a tarball, while public package metadata contains an S3 storage-host reference. The available evidence does not establish a complete present-day origin/database topology. Old CouchDB replication examples are specifically unsafe as current instructions after the 2025 API migration. [Metadata protocol](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md), [live package metadata](https://registry.npmjs.org/react/latest), [2025 migration guide](https://github.com/orgs/community/discussions/152515).

### Cited Findings

#### What a client downloads

- `GET https://registry.npmjs.org/<package>` returns a JSON package document, often called a packument. It carries versions, dependency ranges, distribution tags, and a `dist` object containing the tarball URL and integrity information. The client can request an abbreviated installation document with `Accept: application/vnd.npm.install-v1+json`, rather than the full document. Full metadata for some packages historically exceeded 10 MB uncompressed. This size observation comes from archived docs, not a current registry-wide measurement. [Metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).
- The specification distinguishes `dist.unpackedSize`, the bytes of unpacked files, from the compressed tarball payload. Do not use unpacked size as measured network transfer. It also identifies `maintainers` as informational rather than authoritative. [Metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).
- July 9, 2024: npm removed README content from package-version metadata to reduce packument size and improve registry/package-manager performance. This supersedes old examples that repeat a README within every version. [GitHub changelog](https://github.blog/changelog/2024-07-09-leaner-npm-packument-metadata-contents).

#### Present-day observations, November 8, 2026

- A direct GET of `https://registry.npmjs.org/` returned HTTP 200, body `{}`, `server: cloudflare`, and `cf-ray: a573339e891273e0-JNB`. A GET of `https://registry.npmjs.org/react/latest` also returned `server: cloudflare` and a Cloudflare request ID. These are observed HTTP headers, not a press release or a complete map of all regions. [Registry root](https://registry.npmjs.org/), [React latest metadata](https://registry.npmjs.org/react/latest).
- A HEAD of `https://registry.npmjs.org/react/-/react-19.3.1.tgz` returned HTTP 200, `server: cloudflare`, and `cf-ray: a57333e3c9b273e0-JNB`. Thus Cloudflare is observed on a tarball route as well as metadata. A HEAD request does not measure delivered bytes or prove a cache hit. [Observed tarball endpoint](https://registry.npmjs.org/react/-/react-19.3.1.tgz).
- The observed React metadata reported version `19.3.1`, an integrity hash, registry signatures, an attestations endpoint, and `_npmUser.trustedPublisher.id: github`. Its `_npmOperationalInternal.host` was `s3://npm-registry-packages-npm-production`. That is evidence of a public metadata reference to S3 package storage, not sufficient proof that today's entire tarball fleet, origin routing, or databases are on AWS. The internal reference could persist in metadata independently of later infrastructure changes. [Live version document](https://registry.npmjs.org/react/latest).
- The replication root returned `{"db_name":"registry","engine":"npm-replicate","doc_count":4580507,"update_seq":142968424}`, also behind `server: cloudflare`. `doc_count` is a registry document count, not a count of every package version, bytes in storage, humans, or downloads. The observed engine identifies the API service, not an exposed underlying database product. [Live replication root](https://replicate.npmjs.com/).

#### Historical architecture versus current evidence

- npm's old open-source `npm-registry-couchapp` explicitly says in its deprecation notice that npm had evolved toward a complex distributed architecture, that the CouchApp was only a small part, and that new features were being added to microservices. Even that old repository is evidence against describing modern npm as merely the public CouchDB app. It is historical code, not the complete current production server. [npm CouchApp README](https://github.com/npm/npm-registry-couchapp).
- The `npm/registry` repository now labels itself a collection of archived registry endpoint/API documentation. Its examples of disk size, `_rev`, CouchDB behavior, and PGP fields must be interpreted with this status in mind. [Repository README](https://github.com/npm/registry).
- The archived download-count documentation describes raw logs written to S3 and a daily map-reduce job that aggregates the preceding day's downloads into a database. This is useful historical evidence for a non-delivery analytics pipeline, not confirmation that the same implementation is deployed in November 2026. [Archived download-count docs](https://github.com/npm/registry/blob/main/docs/download-counts.md).
- The strongest reasonably recent published architectural description found is the February 2024 engineering post's 30-plus repositories of Dockerized Node.js microservices. It does not specify production CDN, load balancer, object-store replication strategy, or database providers. [Engineering post](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/).

#### Replication: important 2025 break with old instructions

- The old npm follower tutorial consumes a CouchDB-style continuous stream, uses `include_docs: true`, and describes resumable followers. It is useful for historical design context only. [Official historical tutorial](https://github.com/npm/registry-follower-tutorial).
- February 27 and April 22, 2025 official announcements say the legacy replication endpoints would be retired May 29, 2025 and that new endpoints were already live during transition. [First announcement](https://github.blog/changelog/2025-02-27-changes-and-deprecation-notice-for-npm-replication-apis), [reminder](https://github.blog/changelog/2025-04-22-reminder-for-changes-to-npm-replication-feeds-apis).
- The linked official migration guide supports `GET /registry/_changes`, `GET/POST /registry/_all_docs`, and a root information endpoint. It removes `include_docs`, attachment parameters, and continuous/longpoll/eventsource streaming. Followers should paginate changes with `since`, enumerate IDs with `_all_docs`, and fetch packuments separately from `registry.npmjs.org/<package>`. Limits default to 1,000 and max at 10,000. `skimdb.npmjs.com` redirects to `replicate.npmjs.com`. [Migration guide](https://github.com/orgs/community/discussions/152515).
- A direct current request to `/registry/_changes?descending=true&limit=2` succeeded and returned a JSON `results` array plus `last_seq`, with IDs, sequence numbers, and revisions. It did not contain tarball contents or full packuments. [Observed changes response](https://replicate.npmjs.com/registry/_changes?descending=true&limit=2).
- Caution on contradictory documentation: the older crawler policy still advertises CouchDB replication and an hour-or-two full metadata sync. That timing and procedure should not override the newer explicit 2025 migration guide. The policy does explicitly permit downloading tarballs for inspection/experimentation; that statement alone does not settle every legal question about operating a competing commercial mirror. [Crawler policy](https://docs.npmjs.com/policies/crawlers/), [newer migration guide](https://github.com/orgs/community/discussions/152515).
- The migration discussion contains a July 1, 2025 report that approximately 27,000 package IDs appeared in the feed despite corresponding registry requests returning 404. On July 2 an npm participant responded that the data had been updated and inconsistencies would be investigated. Treat 27,000 as a user's incident report, not an official ongoing error count. This illustrates why deletion reconciliation matters. [Report and response](https://github.com/orgs/community/discussions/152515#discussioncomment-13630035).
- The migration guide initially emphasized `/registry/_changes`; a July 10, 2025 npm engineer response says both that and `/_changes` point to the same endpoint. Prefer the explicit `/registry/` route when describing the published migration, without asserting that the alias cannot work. [Engineer response](https://github.com/orgs/community/discussions/152515#discussioncomment-13725220).

### Inferences

- Immutable tarball distribution is amenable to caching, but packuments and tags are mutable. Mirrors must coordinate changes, integrity checks, missing objects, deprecations, deletions, and security takedowns. A snapshot or cache does not by itself reproduce the authoritative registry's lifecycle. [Protocol](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md), [unpublish policy](https://docs.npmjs.com/policies/unpublish/), [replication guide](https://github.com/orgs/community/discussions/152515).
- The strongest safe present-state wording is: "npm's public delivery endpoints already show Cloudflare at the edge; GitHub operates the registry services; the public evidence does not expose the entire origin stack." Do not write "npm runs on Fastly" as a present fact based on a historical anecdote, or "npm must run on Azure" based on ownership. [Live registry](https://registry.npmjs.org/), [GitHub engineering](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/).

### Gaps

- Fastly and AWS case-study URLs tried during research returned 404. No fetched primary case study established the date, extent, or economics of a historical Fastly deployment. This is a source gap, not evidence npm never used Fastly or AWS.
- No confirmed present production database technology, total storage, multi-region topology, origin-provider contract, CDN cache-hit ratio, or complete security-scanning architecture was found.
- Header observations show a delivery provider on these routes at this time; they do not show an exclusive worldwide vendor arrangement, caching policy, or Cloudflare's negotiated price.
- A follower's current deletion guarantees and reconciliation procedures require more testing than the small read-only sample performed here. Do not promise a perfect byte-for-byte mirror from the change feed alone.

## 3. What does npm actually cost, and does cheap CDN delivery establish displacement?

### Takeaway

No actual current npm operating bill or credible npm-specific total cost disclosure was located. Published retail object-storage prices support transparent hypothetical delivery models, not an assertion about GitHub's actual expense. npm's scale is measurable, but a download count is neither transferred bytes nor total system requests. [Current downloads API](https://api.npmjs.org/downloads/point/last-month), [API definitions](https://github.com/npm/registry/blob/main/docs/download-counts.md), [Cloudflare retail pricing](https://developers.cloudflare.com/r2/pricing/).

### Cited Findings

#### Credible scale figures with dates and limits

- March 2020: GitHub's acquisition announcement gave more than 1.3 million packages and 75 billion downloads per month. These are historical figures, not today's scale. [GitHub announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/).
- November 8, 2026 observation: the official all-packages API returned `{"downloads":999243276881,"start":"2026-10-09","end":"2026-11-07"}` for `last-month`, approximately 999.24 billion package downloads over that 30-day interval. The archived API docs define `last-month` as the last 30 available days and say start/end dates are inclusive. This is an official reported count, not an independent traffic audit. [Live API](https://api.npmjs.org/downloads/point/last-month), [definitions](https://github.com/npm/registry/blob/main/docs/download-counts.md).
- For reproducibility after the relative URL changes, use the fixed-date endpoint for the reported interval: `https://api.npmjs.org/downloads/point/2026-10-09:2026-11-07`. This fixed URL is provided as the documented equivalent; the exact result above was observed using `last-month`. [API syntax](https://github.com/npm/registry/blob/main/docs/download-counts.md).
- November 8, 2026 replication observation: 4,580,507 documents, compared with the package count in the 2020 announcement. Avoid treating the metrics as perfectly interchangeable. Neither documents nor downloads establish stored compressed bytes. [Replication root](https://replicate.npmjs.com/), [2020 announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/).

#### Transparent illustrative model, NOT an npm cost estimate

Pricing source: Cloudflare R2 pricing page, last updated October 30, 2026. Standard storage is $0.015 per GB-month, Class A operations $4.50 per million, Class B operations $0.36 per million, and direct R2 Internet egress is free. GET and HEAD are Class B; PUT and LIST operations are Class A. Free tier: 10 GB-month, 1 million A, and 10 million B operations monthly. Other metered connected services can charge separately. [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

The following is researcher arithmetic on deliberately assumed workloads. It is not a disclosed npm invoice, actual npm storage footprint, quote from Cloudflare, or estimate of Cloudflare's internal marginal cost. Figures use decimal GB and ignore free allowances for a simple gross comparison. Pricing input is sourced; workload inputs are assumptions. [Pricing basis](https://developers.cloudflare.com/r2/pricing/).

| Assumed monthly input | Hypothetical gross retail calculation |
| --- | --- |
| 100 TB stored constantly, meaning 100,000 GB-month | 100,000 × $0.015 = $1,500 |
| 10 million Class A writes/list operations | 10 × $4.50 = $45 |
| 1 billion Class B origin GET/HEAD requests | 1,000 × $0.36 = $360 |
| Total for this selected storage/operations slice | $1,905/month before free allowances |
| 1 trillion Class B operations, instead of 1 billion | 1,000,000 × $0.36 = $360,000/month, before allowances |

These are storage and R2 operations only. A hypothetical fronting cache changes origin operations: with one trillion edge reads, one R2 GET per miss, and 99% request hit ratio, origin reads would be ten billion and gross Class B cost $3,600; at 99.9%, one billion and $360. Hit ratios are assumptions, not npm measurements; HEADs, retries, multi-tier cache behavior, and metadata reads can change the accounting. Edge request processing/CDN contract costs are not included. [R2 operation charges](https://developers.cloudflare.com/r2/pricing/).

For bandwidth intuition only, one trillion downloads averaging an assumed 100 kB compressed would transfer 100 PB in decimal units; an assumed 1 MB average gives 1 EB. Neither average was measured. The official download count does not disclose the average compressed size. R2's zero egress charge would remove a per-byte R2 egress line, not turn storage, requests, compute, or operations labor into zero. [Download API](https://api.npmjs.org/downloads/point/last-month), [R2 pricing and connected-service caveat](https://developers.cloudflare.com/r2/pricing/).

#### What a serious total-cost model still needs

- Separate edge request count and bytes, metadata traffic and freshness, origin miss rate, total compressed object storage, write/list/head operations, replication read load, backup/recovery, and peak/attack load. The protocol and R2 billable units demonstrate why these inputs cannot be inferred from a package-download count alone. [Metadata protocol](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md), [replication guide](https://github.com/orgs/community/discussions/152515), [R2 pricing](https://developers.cloudflare.com/r2/pricing/).
- Add authentication and permissions storage/compute, publication processing, malware scanning and review, support/appeals, on-call engineering, analytics, and takedown policy operations. The existence of these functions is documented, but their npm-specific costs are not. [2024 service architecture](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/), [trusted publishing](https://docs.npmjs.com/trusted-publishers/), [2026 scanning/review](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata), [policy/support](https://docs.npmjs.com/policies/unpublish/).

### Inferences

- Strongest defensible pro-Cloudflare claim: owning a large delivery platform plus storage without per-byte egress pricing can make a high-download public package distribution service economically attractive. This is an inference from R2's price structure, not evidence that Cloudflare uniquely has the necessary economics or that Microsoft's npm bill is high. [R2 pricing](https://developers.cloudflare.com/r2/pricing/).
- Strongest counterargument: npm is already observed using Cloudflare on public delivery routes. A CDN supplier can capture distribution business without replacing the registry's ownership, accounts, publisher authorization, moderation, or ecosystem position. A faster/cheaper mirror is a different outcome from displacing the authoritative registry. [Observed registry](https://registry.npmjs.org/), [observed tarball](https://registry.npmjs.org/react/-/react-19.3.1.tgz), [authorization](https://docs.npmjs.com/trusted-publishers/), [security review](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata).
- Package distribution is not "just bandwidth," but the opposite extreme is also unsupported: these sources do not prove bytes are a small share of npm's bill. The right claim is that the share is unknown, and retail egress multiplication alone cannot establish total operating cost. [Published R2 dimensions](https://developers.cloudflare.com/r2/pricing/), [npm services architecture](https://github.blog/engineering/engineering-principles/bringing-npm-registry-services-to-github-codespaces/).
- Cloudflare's retail offer is not its internal cost, and neither is GitHub's negotiated vendor rate. The illustrative model should be labeled hypothetical throughout, with no headline claiming npm can be run for $1,905 or that npm actually pays $360,000 for reads. [Retail pricing context](https://developers.cloudflare.com/r2/pricing/).

### Gaps

- **Actual current bill unavailable in this research.** No verifiable current npm CDN invoice, AWS invoice, Cloudflare contract, total operating-cost disclosure, or audited package-registry cost breakdown was found. Discovery limitations mean this is not a categorical claim that no disclosure exists anywhere.
- No reliable current total storage bytes, traffic PB/month, average compressed tarball size, cache-hit rate, or edge-versus-origin request split was established. Do not backfill them with guesses from download counts or `dist.unpackedSize`.
- No fetched Fastly/AWS case study established a historical npm bill either. Historical cost figures circulating without a dated primary source should not be used as today's npm cost.
- The key unresolved article question is not whether Cloudflare can serve package files, which the observed existing edge relationship already supports. It is whether it could win authoritative publishing trust and ecosystem adoption while sustaining the full registry obligations, and whether its economics would be uniquely better than npm's existing arrangements.
