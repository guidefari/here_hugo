---
title: "npm attack classes and security design"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

- Cutoff: November 8, 2026. Existing incident, publishing-security and main-article notes read. Primary operator and maintainer sources fetched; investigator findings remain attributed. Counterfactuals below are conditional design inferences, not measured guarantees.

## Which trust boundaries fail?

### Takeaway
- Separate publication authority, dependency selection, execution and registry implementation. A worm combines several classes; OIDC provenance does not certify benign code. [Wray, maintainer, August 31, 2026](https://jaredwray.com/blog/keyv-and-cacheable-chaindrop-worm).

### Cited Findings
- **Account phishing/session theft: human to registry authority.** Qix's September 8, 2025 takeover followed a fake npm 2FA-reset email; poisoned chalk/debug releases targeted browser cryptocurrency transactions. The phishing is documented; the precise stolen session/credential sequence is not independently established here. [StepSecurity, investigator, September 8, quoting maintainer](https://www.stepsecurity.io/blog/20-popular-npm-packages-compromised-chalk-debug-strip-ansi-color-convert-wrap-ansi).
- **Stolen publish tokens: bearer secret to release authority.** PostHog's November 26, 2025 postmortem traces November 18 untrusted PR execution in privileged CI, bot-PAT theft, November 23 npm-token theft and November 24 malicious publication. This is not a registry authorization bypass. [PostHog, affected publisher](https://posthog.com/blog/nov-24-shai-hulud-attack-post-mortem).
- **Source/workflow compromise: trusted build to publication.** August 4, 2026 ChainDrop used legitimate Actions/OIDC and valid provenance for poisoned source. Wray attributes access to a likely stale full-access PAT but cannot prove its original theft mechanism. [Wray, August 31](https://jaredwray.com/blog/keyv-and-cacheable-chaindrop-worm).
- **Malicious new/typosquat packages: selected name to trusted dependency.** July 19, 2017 crossenv campaign; npm removed roughly 40 packages after August 1 notification. No legitimate account takeover was necessary. [npm operator, August 2, 2017](https://blog.npmjs.org/post/163723642530/crossenv-malware-on-the-npm-registry.html).
- **Dependency confusion: private namespace to public resolution.** Birsan's authorized 2020 tests, disclosed February 9, 2021, induced public npm-package installation at companies including Apple. His higher-version explanation for pip must not be generalized to npm. [Birsan, original researcher](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610).
- **Maintainer handover: social trust to package control.** event-stream gained a malicious dependency following maintainer social engineering; npm removed flatmap-stream and event-stream@3.3.6 on November 26, 2018. Payload activation during Copay builds contaminated shipped applications. [npm operator, November 27, 2018](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident).
- **Install-time worms: dependency execution to host secrets and further publishing.** September 2025 Shai-Hulud used postinstall; November PostHog packages used preinstall, credential harvesting and republishing. npm reported removing 500+ compromised packages in September. [GitHub operator, September 22, 2025](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/); [PostHog](https://posthog.com/blog/nov-24-shai-hulud-attack-post-mortem).
- **Slug reuse: mutable repository name to OIDC authorization.** SlugFest requires a reclaimable slug and never-used trust configuration; immutable identity was recorded only after first publication. Bloom demonstrated this in researcher-owned packages, not a confirmed victim compromise. [Bloom/Golan Myers, October 13, 2026 body date](https://bloom.security/blog/slugfest-millions-of-ai-agents-download-exposed-npm-packages).
- **Registry authorization defect: checked identity to mutated identity.** November 2, 2021 report exposed URL-versus-upload package mismatch across services. GitHub patched within six hours; no exploitation found in telemetry since September 2020, with older history unknown. Private-name leakage through replication was a separate October incident. [GitHub/Mike Hanley, November 15, 2021](https://github.blog/open-source/githubs-commitment-to-npm-ecosystem-security/).

### Inferences
- Native builds, optional dependencies and downloaded loaders describe execution/packaging mechanisms, not separate initial-access classes. A hook block could stop a loader path, not malicious imports, CLI execution, build plugins or browser bundles. event-stream and Qix illustrate the distinction. [npm scripts](https://docs.npmjs.com/cli/v12/using-npm/scripts/); [event-stream](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident).

### Gaps
- No verified historical npm CDN/artifact-cache replacement incident established here. Do not invent one or label legitimately published malware “cache poisoning.” The 2021 defect was unauthorized new publication, not replacement of immutable bytes.

## Which defenses have actually shipped?

### Takeaway
- npm has substantive controls; distinguish current opt-ins and version requirements from future enforcement. [Current trusted-publishing docs](https://docs.npmjs.com/trusted-publishers).

### Cited Findings
- **July 31, 2025:** OIDC trusted publishing GA. Current support: GitHub-hosted Actions, GitLab.com shared runners, CircleCI cloud; no self-hosted runners. CLI 11.5.1+ and Node 22.14+ required. Automatic provenance has narrower support than authentication. [GitHub launch](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/); [npm current docs](https://docs.npmjs.com/trusted-publishers).
- **December 9, 2025:** classic tokens permanently revoked; login sessions expire after two hours, publishing enforces 2FA, new-package 2FA defaults announced, existing package settings retained; write granular tokens have 90-day maximum. [GitHub operator](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/).
- **2026 current:** staging and stage-only OIDC exist. September 17 roadmap describes recovery-code sensitive-write holds of 72 hours and already-reduced token management rights. Bypass-2FA tokens lose direct publishing in **January 2027**, not yet. [Operator roadmap](https://github.com/orgs/community/discussions/208130); [staging docs](https://docs.npmjs.com/staged-publishing).
- **July 8, 2026:** npm 12 default-denies dependency lifecycle scripts, git and remote-URL dependencies. Native implicit node-gyp builds and non-registry prepare hooks need approval. Platform-incompatible optional dependencies do not execute; platform-matching ones remain relevant. npm 12 supports Node `^22.22.2 || ^24.15.0 || >=26.0.0`. [Version-pinned release](https://github.com/npm/cli/releases/tag/v12.0.0); [current install policy](https://docs.npmjs.com/cli/v12/commands/npm-install/).
- **July 28, 2026:** publish-time scans gate installation availability, potentially holding/blocking packages. Typical five minutes is not an SLA. Current dual-use policy prohibits direct OIDC, requiring staging plus interactive 2FA promotion or direct interactive 2FA; launch wording differs. [GitHub launch](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/); [current policy](https://docs.npmjs.com/policies/dual-use).
- **October 2, 2026:** unused trust bindings expire after 48 hours; first publish still establishes immutable identity. GitHub issue_comment OIDC events now blocked alongside pull_request_target. [GitHub operator](https://github.blog/changelog/2026-10-02-unvalidated-npm-trusted-publishing-configurations-now-expire/).

### Inferences
- Default-deny is not sandboxing. Approval permits execution; a compatibility bypass restores risk. Do not assume every Node installation bundles npm 12. [Pinned release](https://github.com/npm/cli/releases/tag/v12.0.0).

### Gaps
- No native npm OS-sandbox control verified. External sandbox support depends on backend/platform; Linux namespaces, macOS Seatbelt and Windows/WSL are not interchangeable. [Example implementation's explicit platform limitations](https://github.com/suethttps/npm-jail#requirements).

## What better design could block specific paths?

### Takeaway
- Separate identity, release approval, dependency intake and runtime authority. A new registry helps only where its effective controls differ. [Wray's boundary analysis](https://jaredwray.com/blog/keyv-and-cacheable-chaindrop-worm).

### Cited Findings
- npm already recommends origin-bound security keys, scoped private packages and restricted token access; these are not missing inventions. [npm threat model, edited July 8, 2024](https://docs.npmjs.com/threats-and-mitigations); [scope routing](https://docs.npmjs.com/cli/v12/using-npm/scope/).
- Immutable package/version identities cannot be reused after unpublish. Deprecation leaves bytes downloadable; voluntary unpublish thresholds do not constrain operator malware takedowns. [npm policy](https://docs.npmjs.com/policies/unpublish); [September security removal](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/).

### Inferences
- **Prevent account-phishing path:** origin-bound passkeys/hardware authentication plus hardened recovery, assuming no stolen live session or endpoint compromise. Generic OTP 2FA is weaker against relay phishing. Fresh release approval helps only if independent of stolen authority. [npm threat model](https://docs.npmjs.com/threats-and-mitigations).
- **Prevent token-release path:** remove durable publish secrets, scope ephemeral credentials and isolate release jobs from PR execution. Cross-repository PATs defeat isolation. OIDC cannot sanitize trusted source. [PostHog](https://posthog.com/blog/nov-24-shai-hulud-attack-post-mortem); [Wray](https://jaredwray.com/blog/keyv-and-cacheable-chaindrop-worm).
- **Prevent automatic poisoned-source release:** stage-only CI plus independent review of the exact immutable tarball could stop ChainDrop promotion if the reviewer detects it and the attacker cannot approve. This already-shipped option costs release latency and reviewer capacity. [Wray](https://jaredwray.com/blog/keyv-and-cacheable-chaindrop-worm).
- **Prevent slug-substitution path:** resolve repository and owner immutable IDs at configuration creation, validate issuer/audience/workflow/environment at exchange, and reauthorize transfers. Requires authenticated private-repository lookup, provider availability and explicit migration policy. DNS ownership is also mutable on expiry; it cannot replace permanent identity. [Bloom](https://bloom.security/blog/slugfest-millions-of-ai-agents-download-exposed-npm-packages); [npm expired-domain checks](https://docs.npmjs.com/threats-and-mitigations).
- **Prevent public/private confusion:** reserve scopes and fail closed on private misses at client and proxy. Costs configuration/migration; scope routing alone cannot repair a proxy that falls back publicly. [npm scope semantics](https://docs.npmjs.com/cli/v12/using-npm/scope/).
- **Detect/contain:** first-publish/new-maintainer review and cooldowns buy detection time, not permanent safety. No-secret disposable builders, no shared home/agent sockets and restricted egress limit worms; approved endpoints can still carry exfiltration. Signed/reproducible builds detect substitution or source/build disagreement only under trusted verification assumptions, not malicious source. [Wray](https://jaredwray.com/blog/keyv-and-cacheable-chaindrop-worm).

### Gaps
- No comparative prevention rate, scan false-positive rate or support SLA established. Screening needs observable states, appeals and dependency-aware promotion; batch approval is not atomic availability. [Operator roadmap and maintainer feedback](https://github.com/orgs/community/discussions/208130).
