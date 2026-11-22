---
title: "JavaScript dependency-security providers"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## Which controls and providers belong in the landscape?

### Takeaway

Research snapshot: **2026-11-08**. These are ten relevant providers, not a market-share ranking. Sources establish documented capabilities, not independently tested efficacy. No products were installed or tested. Undated pages below were accessed on the snapshot date.

### Cited Findings

Separate five jobs: vulnerability/advisory SCA; behavioral malicious-package detection; registry quarantine/install enforcement; publisher and CI integrity; incident response. Known malware need not have a CVE: [Snyk malicious-package documentation](https://docs.snyk.io/scan-fix-and-prevent/fix/prioritize-issues-for-fixing/malicious-packages) explicitly distinguishes them. “SCA” vendors can also provide malware intelligence, so these categories overlap.

| Provider | Insertion point and npm coverage | Documented control and important boundary |
| --- | --- | --- |
| Socket | GitHub PR, CLI, developer/CI install wrapper, enterprise registry proxy; npm plus other ecosystems | Behavioral dependency analysis and policy gates; Firewall Free blocks confirmed malware, not unknown packages. [Firewall docs, updated 2026-09-01](https://docs.socket.dev/docs/socket-firewall-free). |
| Snyk | Repository/developer/CI SCA; npm and other registries | Curated malicious-package advisories alongside vulnerability findings. Scanners cannot distinguish private versus public origin from matching ecosystem/name/version, risking false positives. Not proof of pre-execution behavioral inspection. [Malicious packages](https://docs.snyk.io/scan-fix-and-prevent/fix/prioritize-issues-for-fixing/malicious-packages). |
| GitHub/npm | PR dependency review, Dependabot alerts/update PRs, CLI audit, publisher authentication | Dependency review can block merges through required checks, not laptop installs; private review requires Code Security or Advanced Security. Audit queries known vulnerabilities. [GitHub review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review); [npm audit, edited 2026-03-18](https://docs.npmjs.com/cli/v12/commands/npm-audit/). |
| Mend | Repository/CLI/CI SCA; npm, PyPI, RubyGems malware coverage | Mend SCA reports malicious-package findings, including obfuscation and exfiltration threats. Renovate is separate dependency-update automation, not itself a malware firewall. [SCA docs](https://docs.mend.io/platform/latest/malicious-packages-in-mend-sca); [Renovate](https://www.mend.io/renovate/). |
| Sonatype | Repository Firewall at proxy intake; Lifecycle at application/build stages; npm supported | Firewall quarantines policy violations. Existing cached components are audited, not automatically quarantined in this documented flow; Lifecycle manages application exposure. Unavailable quarantine service fails closed for new requests. [Quarantine docs](https://help.sonatype.com/en/firewall-quarantine.html). |
| JFrog | Artifactory registry; Xray SCA; Curation request-time enforcement, including npm | Curation checks Catalog intelligence and package-age/license/security policy. Cached-package enforcement requires enabling its setting. Do not equate merely operating Artifactory with buying/enabling Curation. [Curation product documentation](https://jfrog.com/curation/). |
| Endor Labs | SCA/reachability and Package Firewall, directly or behind enterprise registries; npm, pnpm, Yarn, Bun | Firewall checks package identity against malware intelligence and policy; private-registry routing is supported, but **private-only packages are not evaluated** by this firewall. [Firewall docs](https://docs.endorlabs.com/package-firewall); [reachability](https://www.endorlabs.com/use-case/sca-with-reachability). |
| Aikido | Safe Chain local proxy/wrapper and CI shims; npm family including Bun, plus Python | Intel-list malware blocking and configurable minimum age, default 48 hours; custom registries supported. This is install interception, not general application-runtime isolation. [Safe Chain repository](https://github.com/AikidoSec/safe-chain). |
| StepSecurity | Harden-Runner inside CI jobs, language-independent, therefore relevant to npm execution | Network monitoring/blocking and source-integrity checks target executing workflows/dependencies, not package-CVE lookup. Features vary by OS; Community is public-repository-only, private requires Enterprise. [Harden-Runner docs](https://docs.stepsecurity.io/github-actions/harden-runner). |
| Cloudsmith | Hosted artifact registry/intake and policy quarantine; npm among supported formats | Matches package URLs against OpenSSF malicious-package intelligence via OSV; checks uploads and every five minutes thereafter. Detection feeds policy, not an unconditional automatic quarantine guarantee. [Malicious-package docs](https://docs.cloudsmith.com/supply-chain-security/risk-detection/malicious-packages). |

Phylum is not a separate current startup recommendation: Veracode acquired its technology on **2025-01-06**; legacy docs redirect to Veracode Package Firewall and say Community ended **2025-02-24**. [Acquisition announcement](https://www.veracode.com/blog/innovating-secure-software-supply-chains-veracode-acquires-phylum/); [legacy notice, updated 2025-07-25](https://docs.phylum.io/).

### Inferences

- These controls can complement npm, a JSR-based workflow, or an enterprise proxy without forcing the whole ecosystem to migrate. However, npm support does not establish native JSR coverage: verify each actual download path.

### Gaps

- No comparable adoption denominator or controlled efficacy benchmark was established. Broad “popular,” “best,” and percentage-prevention rankings would overstate this evidence.

## What does Socket specifically offer?

### Takeaway

Socket combines package-behavior review with several enforcement surfaces. Its current install-time successor is **Socket Firewall**, not a product generically called “Safe npm.” [Wrapper docs, updated 2026-09-23](https://docs.socket.dev/docs/socket-npm-socket-npx).

### Cited Findings

- Static analysis detects install scripts, obfuscated code, network requests, filesystem/shell/environment access; metadata and maintainer signals add context. These are risk indicators, not proof every network-capable package is malicious. GitHub App reviews manifest changes in PRs; CLI/API offer other entry points. [FAQ, updated 2026-09-21](https://docs.socket.dev/docs/faq).
- Original `socket npm`/`socket npx` checks new/changed dependencies before installation, but does not recheck unchanged installed packages. Docs recommend `sfw` instead. [Wrapper docs](https://docs.socket.dev/docs/socket-npm-socket-npx).
- **Firewall Free** needs no account/API key and supports npm/yarn/pnpm, pip/uv and Cargo. It filters artifact network requests, including transitives. AI-only suspicion warns; human-confirmed malware blocks. Unknown versions pass; local-cache hits escape this network gate. It requires online checks and excludes custom/private registries. [Free documentation](https://docs.socket.dev/docs/socket-firewall-free).
- **Firewall Enterprise** adds private/custom registries, configurable unknown/suspected-package policy, allowlists, dashboard and centralized registry deployment. Registry compatibility does not establish analysis of proprietary package contents. Free telemetry includes machine identifier, package identity, latency/errors and potentially GitHub organization name; it cannot be disabled. The license is **PolyForm Shield**, not an unrestricted OSS license. [Free/Enterprise comparison](https://docs.socket.dev/docs/socket-firewall-free).
- Pricing lists Free and paid tiers, public/private repositories, paid precomputed reachability and Enterprise application function-level CVE reachability. FAQ says manifests/lockfiles, not customer source, are collected. Verify this boundary for the exact reachability configuration. OSS upgrade wording differs between FAQ and pricing; request current eligibility rather than promising a particular paid tier free. [Pricing](https://socket.dev/pricing); [FAQ](https://docs.socket.dev/docs/faq).

### Inferences

- A PR check protects merge policy; install interception protects participating download paths. Neither alone guarantees containment of a compromised legitimate publisher or malicious CI source.

### Gaps

- Obtain exact provenance-verification policy, private-artifact analysis scope, outage behavior and reachability data flow. Do not infer them from feature labels.

## What should buyers test and retain operationally?

### Takeaway

Treat detection, enforcement and response as separate acceptance tests. A clean report is not a universal guarantee against worms, exfiltration or malicious releases.

### Cited Findings

- Confidentiality varies: Snyk normally handles manifests/lockfiles but some modes clone source; hosted Renovate temporarily clones repositories; Harden-Runner uploads runtime metadata, not source contents. [Snyk data handling](https://docs.snyk.io/snyk-data-and-governance/how-snyk-handles-your-data); [Renovate privacy](https://docs.renovatebot.com/security-and-permissions/); [runner telemetry](https://docs.stepsecurity.io/github-actions/harden-runner).
- Safe Chain advertises tokenless/free use, but its license is AGPL/commercial with an additional commercial-use preamble: obtain clarification, not a permissive-license assumption. [Repository](https://github.com/AikidoSec/safe-chain); [license](https://github.com/AikidoSec/safe-chain/blob/main/LICENSE).
- npm trusted publishing removes long-lived publish tokens through OIDC; provenance establishes build origin, not benign intent. Automatic provenance excludes private repositories/packages. [Trusted publishing, edited 2026-10-06](https://docs.npmjs.com/trusted-publishers/).

### Inferences

- Pilot on disposable, secret-free machines with harmless vendor fixtures: measure false positives, detection latency, transitive coverage, cold/warm caches, private scopes, direct URLs and outage fail-open/closed behavior. Record p95 install overhead and waiver ownership.
- Require the scanned artifact to equal the installed hash, including caches and mirrors. Test changed behavior in legitimate releases, not just CVE fixtures. Keep sandboxing, least privilege and egress restrictions: source-code exfiltration can happen during builds before deployment.
- After execution, quarantine alone is insufficient: preserve evidence, isolate affected runners, revoke exposed credentials, inspect published artifacts and rebuild from trusted inputs.

### Gaps

- For every vendor, request retention/residency, private-code access, intelligence freshness, hash binding, bypass controls, licensing, SLA and incident-response ownership. Commercial entitlements beyond explicitly cited free tiers remain unverified here.
