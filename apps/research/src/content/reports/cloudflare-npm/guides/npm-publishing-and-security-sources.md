---
title: "npm publishing and security source guide"
description: "An annotated source guide from the Cloudflare and npm research pack, checked on 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","sources"]
draft: false
parent: "cloudflare-npm"
---

Checked November 8, 2026. Full research: [publishing and security research](/reports/cloudflare-npm/sources/npm-publishing-security-posture/). Primary sources below were fetched, not just indexed search snippets. No site or article files changed when this guide was compiled.

## Ten strongest primary sources

1. [July 28, 2026 scanning launch](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/): packages unavailable until scanning; typical approximately five minutes, 15 or more possible; explicitly no service guarantee. Pending tags work, deprecate/unpublish do not. Its direct-OIDC dual-use wording conflicts with current policy.
2. [Current dual-use policy](https://docs.npmjs.com/policies/dual-use): exact `contentPolicy.class = "dual-use"`, root text `DISCLOSURE`, persistence and review. **Direct OIDC is prohibited for these packages**; OIDC may stage, followed by human 2FA approval. Prefer this for current requirements and disclose the launch inconsistency.
3. [Scanning feedback and operator replies, #203413](https://github.com/orgs/community/discussions/203413): first-person Cloudflare/AWS multi-release friction; August status/appeal replies; October 15 explicit operator refusal to share underlying scan findings. Especially [Cloudflare incident](https://github.com/orgs/community/discussions/203413#discussioncomment-17999689), [October mitigation update](https://github.com/orgs/community/discussions/203413#discussioncomment-18762490), and [appeal clarification](https://github.com/orgs/community/discussions/203413#discussioncomment-18955930).
4. [npm PM roadmap and maintainer feedback, #208130](https://github.com/orgs/community/discussions/208130): shipped staging/multiple publishers, remaining batch/provider gaps, January 2027 future bypass-token deadline, recovery holds. [Effect October 11 account](https://github.com/orgs/community/discussions/208130#discussioncomment-18860239) reports 22 hours in validation and support difficulties. These observations are not an npm latency distribution.
5. [Current trusted-publishing docs](https://docs.npmjs.com/trusted-publishers): three cloud providers, no self-hosted runners, up to 10 connections, first-publish immutable-identity binding, 48-hour validation window, save-time nonvalidation, separate private-install credentials and provenance limitations. OIDC dist-tags now exist; staging approval is still interactive.
6. [Bloom Security original SlugFest research](https://bloom.security/blog/slugfest-millions-of-ai-agents-download-exposed-npm-packages): never-used binding plus reclaimable slug precondition; controlled proof of concept; vendor-reported 1,500-plus exposed packages, not 1,500 compromises. Body dates disclosure October 13, metadata October 28. Counts and timeline are researcher claims, not independently reproduced results.
7. [October 2, 2026 official expiry mitigation](https://github.blog/changelog/2026-10-02-unvalidated-npm-trusted-publishing-configurations-now-expire/): unvalidated bindings expire after 48 hours; first publish exempts validated bindings. Does not claim immutable identity resolution when saved. Also restricts `issue_comment` events. Official corroboration is narrower than a full SlugFest advisory.
8. [Exact npm unpublish policy](https://docs.npmjs.com/policies/unpublish): `(new package within first 72 hours AND no public dependents) OR (no public dependents AND <300 last-week downloads AND single owner)`. The second path is regardless of age. Used version identity cannot be reused; deprecating warns but does not remove. Security/policy takedowns are separate from voluntary author eligibility.
9. [December 9, 2025 authentication completion](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/): actual classic-token revocation, two-hour sessions, 90-day write-token maximum, CLI granular-token management, new-package 2FA defaults, compatibility mitigation. Do not use the earlier proposed November deadline as actual completion.
10. [JSR governance](https://jsr.io/docs/governance): Deno operator, community board, prospective foundation move and moderation/appeal responsibilities. Compare with [usage policy](https://jsr.io/docs/usage-policy) and [provenance docs](https://jsr.io/docs/trust), not an unsupported claim that JSR is scanner-free or safer.

## Supporting sources and editorial corrections

- [July 31, 2025 OIDC GA](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/): trusted publishing is already incumbent functionality. Initial providers were GitHub/GitLab; CircleCI is in current docs.
- [September 29, 2025 token announcement](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/): seven days was a default, 90 days a maximum, not mandatory weekly rotation. Historical post is marked retired.
- [Staged publishing docs](https://docs.npmjs.com/staged-publishing): CLI 11.15.0+, Node 22.14.0+, human 2FA promotion, new-package `0.0.0-stage` placeholder. Claims that a manual first publish is always necessary are stale.
- [WorkOS October 16 SlugFest explainer](https://workos.com/blog/npm-trusted-publishing-slugfest): useful secondary explanation of mutable identifiers and mitigation limits. **WorkOS was not the original discovering researcher; Bloom was.**
- [October 29 batch-approval request](https://github.com/orgs/community/discussions/208130#discussioncomment-19264806): demonstrates a remaining user need, not exhaustive proof that no later feature shipped anywhere.
- [CLI configuration correction](https://github.com/orgs/community/discussions/208130#discussioncomment-18489512): PM says `npm trust` already configures OIDC for multiple packages.

## Do not publish these stronger claims without more evidence

- A five-minute measured median, 15-minute hard maximum, guaranteed appeal turnaround, registry-wide outage inferred from one hold, or ecosystem-wide false-positive rate.
- Known-hash detection failure without exact hashes/versions and evidence of when npm knew them.
- Every trusted publisher remained vulnerable, 1,500 packages were hacked, 10 million downloads were malicious, or the October mitigation resolved identity at configuration creation.
- All granular tokens were banned by November 8, all automation requires manual approval, every GitHub Enterprise deployment is unsupported, or OIDC tag operations still do not exist.
- JSR has no scanning, JSR is safer, its foundation move is completed, or a different CDN operator automatically fixes authorization and moderation.
- A separate official SlugFest CVE/GHSA, complete legacy-binding migration outcome or measured residual population. None was established here.

Safe synthesis: npm has shipped meaningful security controls, but dated maintainer accounts expose operational costs in scan predictability, multi-package release coherence, CI compatibility and opaque appeals. A replacement must improve those workflows without discarding the security responsibilities.
