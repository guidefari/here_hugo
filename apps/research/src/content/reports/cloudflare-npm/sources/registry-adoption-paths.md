---
title: "Registry adoption paths"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## What actually changes when somebody switches?

### Takeaway

- Switching delivery, publishing authority, and package identity are different migrations. JSR can coexist with npm dependencies; it is not an npm catalog replacement. [npm registry, CLI v11.21.2][registry]; [JSR publishing rules][publish].

### Cited Findings

- Checked 2026-11-08 using primary documentation, not live installs or publishing. npm references use CLI v11.21.2; JSR/vendor pages are rolling documentation.
- npm selects registry by scope, otherwise the default. A library's project `.npmrc` does not configure its consumers. Credentials match registry host and optionally path, independently of package scope. [npm registry][registry]; [npm `.npmrc`, edited 2026-02-19][auth].
- `publishConfig.registry` controls npm publishing separately from install routing. JSR's npm endpoint cannot accept `npm publish`; JSR requires its publishing workflow. [npm package.json, publishConfig][config]; [JSR limitations][compat].
- npm lockfiles record tarball `resolved` URLs and `integrity`. npmjs has special current-registry semantics; custom-registry locks can retain the former registry after configuration changes. Do not generalize that every URL stays fixed or every client rewrites it. [npm lockfile packages][lock]; [npm registry][registry].
- Git URLs, local paths, workspaces, and aliases are separate dependency forms, not automatically rerouted registry downloads. [npm dependency forms and workspaces][config].
- JSR `@luca/cases` becomes `@jsr/luca__cases` at `npm.jsr.io`; an npm alias preserves the import spelling, not the underlying identity. Deno's native `jsr:` consumption differs from npm tarballs; pnpm 10.9+ and Yarn 4.9+ accept JSR dependency specifiers through npm compatibility. [JSR advanced setup][compat].
- Generated JavaScript/declaration tarballs can receive new revisions without semver changes. Locked revision URLs preserve exact bytes, except deletion. JSR warns of duplicate dependency copies in some npm/Yarn cases. [JSR technical details][compat].
- JSR accepts ESM, requires its scope/package creation, and permits npm dependencies. Existing npm namespace membership does not establish JSR membership. [JSR publishing rules and scope creation][publish].

### Inferences

- Proposed must-preserve acceptance matrix, grounded in these interfaces rather than claimed product parity: [npm configuration][config]; [JSR compatibility][compat]; [npm audit][audit].

| Surface | npm-compatible delivery must preserve | JSR-specific work |
| --- | --- | --- |
| Resolution | Names, ranges, tags, metadata freshness | Map `@jsr` identities and aliases |
| Artifacts | Integrity, locked bytes, tarball paths | Test generated revisions and declarations |
| Runtime | Exports, peers, optional dependencies, scripts, binaries | ESM eligibility; test emitted package |
| Release | Publish routing, tags, permissions, provenance checks | Separate auth/workflow; coordinate releases |
| Security | Audit, signatures, approved origin/policy | Verify advisory identity coverage |
| Clients | Pinned npm/pnpm/Yarn/Bun and lock formats | Test each chosen route, not assumed parity |

- Namespace migration should verify control through independently authenticated accounts/repository evidence and review membership. Copying public author/maintainer fields must not grant authority; never submit npm tokens to a competitor. Auth scoping and explicit JSR scope creation support this safety requirement. [npm auth][auth]; [JSR publishing][publish].

### Gaps

- No client-version compatibility suite, scope-transfer mechanism, or measured artifact equivalence was tested. Matrix rows are requirements, not verified support.

## Who can adopt, and who approves?

### Takeaway

- Public package intake and private corporate hosting are separate. JSR currently lacks private publishing; a direct scope override is not a corporate upstream. [JSR private registries][private].

### Cited Findings

- Azure: JSR documents a custom npm upstream, ranked above npmjs, and explicit package import. This is a recipe, not a tested tenant deployment. [JSR Azure instructions][private].
- Artifactory/Google: JSR explicitly documents incompatible tarball layouts. Nexus documents generic npm proxy URLs, but JSR-specific success remains unverified. [JSR vendor caveats][private]; [Sonatype npm registry][nexus].
- AWS documents `public:npmjs`, not an arbitrary JSR external connection; engineered imports remain a different possibility. [AWS supported external repositories][aws].
- npm audit posts package names/versions to the default registry's bulk endpoint, with Quick Audit fallback carrying the tree and environment metadata. Delivery compatibility does not prove advisory coverage or permitted disclosure. [npm audit endpoints, CLI v11.21.2][audit].

### Inferences

- Proposed actor decisions, informed by separate publishing and corporate-upstream interfaces: [JSR publishing][publish]; [JSR upstream setup][private].
  - Individual, new zero-dependency library: add optional dual publishing for docs/runtime reach; risk generated-artifact differences; stop JSR releases to roll back. Maintainer approves after both artifacts pass consumer checks.
  - Coordinated monorepo: add version/release orchestration; possible alternate release channel; risk peers, aliases, partial publication and version skew. Release lead approves after failure/retry drills; retain npm releases and previous manifests.
  - App consumer: change one dependency/routing/lockfile; benefit must be measured; risk duplicates and transitive npm access. App owner approves green builds and clean-cache installs; revert manifests/config/locks together.
  - Enterprise platform/security/procurement: approve upstream or scoped exception; possible centralized intake/support value; risk egress, policy, contracts and ownership. Those teams approve separate technical/commercial gates; restore approved feed and artifact inventory.
  - CI/cache provider: offer opt-in routing/cache integration; possible repeat-install savings; risk stale metadata and incomplete platform caches. Provider owner and tenant admin approve isolation/failure tests; restore old routing/cache namespace.
- Restricted-egress pilot: block runner public access; verify metadata, tarballs, redirects, full transitive graph and publishing-tool bootstrap. Fully offline runs require approved preloaded artifacts/tools; warm-cache success is insufficient. Interface basis: [JSR tarballs][compat]; [npm dependency forms][config].
- Fail closed on denied packages or missing approvals. Direct bypass during outages needs explicit security approval, not silent fallback. Restore availability without weakening package-origin policy. [Corporate intake purpose][private].

### Gaps

- Azure tenant availability, Nexus integration, offline completeness and audit coverage need experiments. No unsupported blanket claim follows from missing verification.

## What staged strategy deserves testing?

### Takeaway

- Proposed strategy, not an announced Cloudflare product: earn a reversible trial before asking for authority or payment.

### Cited Findings

- Open source provides registry code and local-stack instructions, not automatic production portability of hosted accounts, namespaces or managed infrastructure. [JSR README, commit 1624825][source].

### Inferences

- Candidate sequence: interoperable new library dual publish; one consumer pilot through an approved direct/upstream path; sell corporate controls only after they exist; optionally make the alternative authoritative later. Existing private-registry users may start elsewhere.
- Cache adoption does not establish publishing adoption. npm dependencies can remain throughout. Sell gradual adoption through concrete compatibility/rollback evidence, not trust-based advertising. [Distinct read/write APIs][registry]; [JSR dependencies][publish].
- Proposed four-week pilot: baseline matched builds and releases; measure cold/warm p50/p95 latency, failure/retry rates, release-to-install visibility, full-graph coverage, policy-denial behavior, rollback time and operator hours.
- Agree thresholds before starting; require zero credential leakage, integrity mismatch or unauthorized bypass. Include upstream outage, partial publish, revocation and clean-runner drills.
- Buyer test: identify budget owner, priced support/control requirements and a paid-pilot or purchase commitment. Downloads, free signups and cache hits are not willingness to pay.

### Gaps

- No adoption funnel, performance advantage, buyer demand or production portability has been measured. Proposed gates are research questions, not forecasts.

[registry]: https://github.com/npm/cli/blob/v11.21.2/docs/lib/content/using-npm/registry.md
[auth]: https://docs.npmjs.com/cli/v11/configuring-npm/npmrc#auth-related-configuration
[config]: https://docs.npmjs.com/cli/v11/configuring-npm/package-json#publishconfig
[lock]: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json#packages
[compat]: https://jsr.io/docs/npm-compatibility#technical-details
[publish]: https://jsr.io/docs/publishing-packages#jsr-package-rules
[private]: https://jsr.io/docs/private-registries#using-jsr-as-an-upstream-for-an-npm-private-registry
[audit]: https://github.com/npm/cli/blob/v11.21.2/docs/lib/content/commands/npm-audit.md#audit-endpoints
[aws]: https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html#supported-public-repositories
[nexus]: https://help.sonatype.com/en/npm-registry.html
[source]: https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/README.md#getting-started-entire-stack
