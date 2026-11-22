---
title: "npm enterprise capabilities and configuration"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## 1. What does npm itself provide to teams?

### Takeaway

- Research cutoff: **2026-11-08**. Official current CLI documentation identifies **12.2.2**, released **2026-11-03**. Local read-only `npm --version` returned **11.13.0**; local behavior must not be assumed to match v12. No installation, authentication, publishing, or account changes performed. [npm changelog](https://docs.npmjs.com/cli/v12/using-npm/changelog#1222-2026-11-03), [current registry manifest](https://registry.npmjs.org/npm/latest).
- Separate the open-source client and registry interface from npmjs.com subscriptions. Paid hosting buys private collaboration, not exclusive access to workspaces, lockfiles, audit, or client configuration. [Private packages](https://docs.npmjs.com/about-private-packages), [workspaces](https://docs.npmjs.com/cli/v12/using-npm/workspaces).

### Cited Findings

| Capability | Layer and maturity | Important limit or cost |
| --- | --- | --- |
| Private package hosting | Current npmjs.com paid individual and organization plans | Individual: $7/month. Teams: $7/member/month, including members whose teams cannot access private packages. The direct pricing page returned 403; these amounts come from official billing documentation, last edited October 23, 2023, checked at cutoff. [Individual billing](https://docs.npmjs.com/upgrading-to-a-paid-user-account-plan), [Teams billing](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan). |
| Organization roles | Current hosted owner/admin/member roles | Owners manage billing and membership; admins manage teams/package access; members create/publish in the organization scope, subject to package permissions. CLI calls the member role `developer`. [Role matrix](https://docs.npmjs.com/organization-roles-and-permissions), [npm org](https://docs.npmjs.com/cli/v12/commands/npm-org). |
| Teams and package permissions | Current hosted read-only/read-write package grants | Organization-scoped private access is assigned through teams. An org-management token permission does not grant publishing permission on its packages. [Team grants](https://docs.npmjs.com/managing-team-access-to-organization-packages), [token boundaries](https://docs.npmjs.com/about-access-tokens#about-granular-access-tokens). |
| Organization 2FA enforcement | Current hosted control | Enabling enforcement removes noncompliant members and their access. This is an operational change, not a harmless checkbox. [Organization 2FA](https://docs.npmjs.com/requiring-two-factor-authentication-in-your-organization). |
| Tokenless CI publishing | Current npmjs.com OIDC trusted publishing | GitHub-hosted Actions, GitLab.com shared runners, CircleCI cloud only; no self-hosted runners. Up to ten trusted publishers/package. Initial successful publish required within two days of configuration. Private dependency installation still needs separate read authentication. [Trusted publishing, edited October 6, 2026](https://docs.npmjs.com/trusted-publishers). |
| Publish approval | Current hosted staged publishing plus CLI | npm >=11.15.0; stage, inspect/download, then approve with human 2FA. New package staging creates a public `0.0.0-stage` placeholder, not public staged contents. No documented mandatory second distinct approver or configurable multi-person quorum. [Staging, edited September 29, 2026](https://docs.npmjs.com/staged-publishing). |
| Release channels and retirement | CLI operations backed by registry metadata/policies | Dist-tags point to versions; deprecation warns without deleting. Unpublishing is restricted; a used name/version cannot be reused. These are not immutable promotion approvals. [Metadata](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md), [unpublish policy](https://docs.npmjs.com/policies/unpublish). |
| Vulnerability checks | Free CLI plus compatible advisory service | Known-advisory lookup, not a proof of safety. `npm audit signatures` separately verifies registry signatures and provenance. Non-npm registries must implement the relevant endpoints. [npm audit](https://docs.npmjs.com/cli/v12/commands/npm-audit). |
| Build provenance | Current npmjs.com publishing feature | Automatic for OIDC publishes from public repositories to public packages through GitHub/GitLab; not CircleCI, private repositories, or private packages. Provenance identifies the build origin; it does not prove benign code. [Provenance limits](https://docs.npmjs.com/trusted-publishers#automatic-provenance-generation). |
| SBOM generation | Current local CLI | SPDX or CycloneDX, including lockfile-only operation. An inventory, not a managed license-policy or compliance service. [npm sbom](https://docs.npmjs.com/cli/v12/commands/npm-sbom). |

- **Granular authentication:** scopes/packages, organization permissions, read/write distinctions, CIDR restrictions, expiry, revocation, and user-bound permission ceilings. Classic tokens were removed in November 2025. The September 29, 2025 security announcement sets newly created write-enabled tokens to seven-day default and 90-day maximum lifetime; do not generalize that maximum to read-only tokens without further evidence. [Current token overview, edited September 10, 2026](https://docs.npmjs.com/about-access-tokens), [dated lifetime announcement](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/).
- **Deprecation to mention:** current docs say granular-token direct version publishing will be removed in **January 2027**, not that it is already removed at this cutoff. Since August 2026, bypass-2FA tokens cannot perform account/governance actions without interactive 2FA. Stage-only tokens still move dist-tags and deprecate versions, so they are not generally read-only. [Token deprecations and stage-only limits](https://docs.npmjs.com/about-access-tokens#direct-publishing-is-being-deprecated).
- **Workflow permissions:** trusted publishers can stage; direct publishing and dist-tag management are independent allowed actions. Stage-only OIDC plus disallowing traditional tokens gives a human review step. OIDC cannot approve stages. OIDC dist-tags require npm 11.21.0+ or 12.2.0+. [Trusted publisher permissions](https://docs.npmjs.com/trusted-publishers#managing-dist-tags-with-trusted-publishing).
- **Administration commands:** `npm org set orgname username [developer|admin|owner]`, `npm org ls orgname --json`, `npm team create @scope:team`, `npm team add @scope:team username`, `npm access grant read-only @scope:team @scope/package`, `npm access list collaborators @scope/package`, and token list/revoke/create are documented. These are administrative interfaces, not an unattended SCIM service or billing API; current governance may require interactive 2FA. [org](https://docs.npmjs.com/cli/v12/commands/npm-org), [team](https://docs.npmjs.com/cli/v12/commands/npm-team), [access](https://docs.npmjs.com/cli/v12/commands/npm-access), [token](https://docs.npmjs.com/cli/v12/commands/npm-token), [governance restriction](https://docs.npmjs.com/about-access-tokens#account-identity-actions-require-an-interactive-2fa-challenge).

### Inferences

- For a small team needing private JavaScript libraries and straightforward package grants, npm Teams can avoid operating another registry. Example arithmetic: ten organization members at the documented rate is $70/month, even if only two use private packages. This is an inference from the documented member-based rate, not a quote or negotiated offer. [Billing basis](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan).

### Gaps

- No verified current npmjs.com plan documentation establishing SAML SSO, SCIM, enterprise audit-log export, customer-specific SLA, or current on-prem Enterprise purchasing. Do not claim these either exist or categorically cannot exist. Direct [pricing](https://www.npmjs.com/pricing) access was blocked.
- Documentation conflicts: the hosted [token creation guide](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-tokens-with-the-cli) says granular token creation is website-only, but current [v12 npm-token](https://docs.npmjs.com/cli/v12/commands/npm-token) explicitly documents granular creation flags. Prefer versioned CLI documentation for CLI syntax; do not claim a successful live creation test.

## 2. Which configuration capabilities matter in practice?

### Takeaway

- The client already supports scope routing, narrowly scoped credentials, repeatable installation, local monorepos, dependency policy, and corporate networking. These remain client capabilities even when used against somebody else's registry. [Config](https://docs.npmjs.com/cli/v12/using-npm/config), [.npmrc](https://docs.npmjs.com/cli/v12/configuring-npm/npmrc).

### Cited Findings

- **Layering:** CLI > `npm_config_*` environment > project `.npmrc` > user `~/.npmrc` > global `$PREFIX/etc/npmrc` > built-in/defaults. `${VARIABLE}` interpolation keeps the value outside checked-in config; an unset variable normally remains uninterpolated. Project `.npmrc` does not apply to global mode and does not impose config on consumers of a published dependency. [npmrc, edited February 19, 2026](https://docs.npmjs.com/cli/v12/configuring-npm/npmrc), [config sources](https://docs.npmjs.com/cli/v12/using-npm/config#description).
- **Routing/authentication:** default `registry` plus `@scope:registry` support mixed public/private registries. Auth keys must be URI-scoped, including path where needed, not a bare `_authToken` that could travel to an unintended endpoint. Illustrative only, no real credential or deployment endpoint: [auth configuration](https://docs.npmjs.com/cli/v12/configuring-npm/npmrc#auth-related-configuration).

```ini
registry=https://registry.npmjs.org/
@example:registry=https://packages.example.invalid/npm/
//packages.example.invalid/npm/:_authToken=${EXAMPLE_READ_TOKEN}
strict-ssl=true
save-exact=true
```

- **Publish safety:** `publishConfig.registry`, `access`, and `tag` configure publication, not downstream installation. `"private": true` refuses publication entirely; it does not mean “publish this as a hosted private package.” Set publishing destination/access explicitly. Current `npm publish`/config docs say **public for new packages**, while older access/private-package pages say scoped defaults are restricted. Flag the inconsistency rather than promising scopes prevent leaks. [package.json private/publishConfig](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#private), [v12 publish access](https://docs.npmjs.com/cli/v12/commands/npm-publish#access), [contradictory older access page](https://docs.npmjs.com/cli/v12/commands/npm-access#details).
- **Repeatability:** lockfiles record exact tree, resolved locations and integrity hashes; `npm ci` requires matching manifest/lockfile, removes existing `node_modules`, and does not rewrite manifests/locks. Use the same tree-shaping settings in local and CI config. `save-exact` pins newly saved direct dependencies but does not replace a transitive lockfile or freeze registry policy. Integrity checks bytes, not whether code is safe. [lockfile](https://docs.npmjs.com/cli/v12/configuring-npm/package-lock-json), [ci](https://docs.npmjs.com/cli/v12/commands/npm-ci), [save-exact](https://docs.npmjs.com/cli/v12/using-npm/config#save-exact).
- **Migration caveat:** lockfiles contain tarball URLs. `registry.npmjs.org` is treated specially; arbitrary custom registry URLs are not automatically portable. `replace-registry-host` supports replacement policy and host/path prefixes. Metadata `dist.tarball` can point elsewhere. npm 12 defaults `allow-remote=none`; same-host registry tarballs are allowed, but split metadata/tarball hosts need deliberate configuration and correctly scoped auth. Avoid blanket credential widening. [resolved field](https://docs.npmjs.com/cli/v12/configuring-npm/package-lock-json#packages), [host replacement](https://docs.npmjs.com/cli/v12/using-npm/config#replace-registry-host), [remote policy](https://docs.npmjs.com/cli/v12/using-npm/config#allow-remote), [metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md#dist).
- **Dependency controls:** root overrides change transitive resolution; npm aliases permit a different installed name; `file:`/directory dependencies and workspaces link local packages. Workspace dependencies use normal ranges in official examples, not an assumed `workspace:*` protocol. These are client mechanisms, not hosted registry features. [overrides](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#overrides), [package specs](https://docs.npmjs.com/cli/v12/using-npm/package-spec), [workspaces](https://docs.npmjs.com/cli/v12/using-npm/workspaces).
- **Newer v12 niceties:** dependency lifecycle scripts default to blocked; root `allowScripts` records approvals/denials, with `npm install-scripts approve/deny/ls/prune`; approval tooling defaults to version-pinned grants. `strict-allow-scripts` can fail on unreviewed scripts. Git and user-supplied remote tarballs default to denied. `min-release-age` is in **days**, with package/glob exceptions; it can delay security fixes, which the CLI warns about. `install-strategy=linked` graduated to stable. npm 12 ignores `npm-shrinkwrap.json`; do not recommend it as current behavior. [install-script docs, edited November 6, 2026](https://docs.npmjs.com/cli/v12/commands/npm-install-scripts), [release-age](https://docs.npmjs.com/cli/v12/using-npm/config#min-release-age), [v12 breaking changes](https://docs.npmjs.com/cli/v12/using-npm/changelog#1200-2026-07-08).
- **Cache/network:** configurable cache path; `prefer-offline` skips freshness checks but fetches misses; `offline` forbids install network access and therefore needs cache completeness. Proxy/HTTPS proxy/no-proxy, CA bundles, scoped client key/cert files, request timeout and retry/backoff knobs support corporate networks. Keep `strict-ssl=true`; supply the organization's CA rather than disabling validation. Retry settings concern idempotent read/network/5xx failures, not bypassing auth. [offline](https://docs.npmjs.com/cli/v12/using-npm/config#offline), [proxy](https://docs.npmjs.com/cli/v12/using-npm/config#https-proxy), [CA](https://docs.npmjs.com/cli/v12/using-npm/config#cafile), [TLS](https://docs.npmjs.com/cli/v12/using-npm/config#strict-ssl), [retries](https://docs.npmjs.com/cli/v12/using-npm/config#fetch-retries).
- **Audit data routing:** standalone audit sends package names/versions to the configured default registry's bulk endpoint; fallback quick audit submits the full lockfile tree plus npm/Node/platform/architecture/environment metadata. Private-name scrubbing was removed in npm 7. General install `audit=true` documentation also mentions default and scope registries. Check service support and information-sharing policy when selecting a private registry; do not promise audit is local or only goes to npmjs.com. [audit endpoints](https://docs.npmjs.com/cli/v12/commands/npm-audit#audit-endpoints), [audit config](https://docs.npmjs.com/cli/v12/using-npm/config#audit).

### Inferences

- The registry choice is partly a governance choice: changing an endpoint does not reproduce its ACLs, audit service, OIDC exchange, stage approval workflow, or signing keys. Compatibility must be checked per operation. [audit/signature contract](https://docs.npmjs.com/cli/v12/commands/npm-audit), [trusted publishing](https://docs.npmjs.com/trusted-publishers).

### Gaps

- No live v12 test was performed. Installed npm 11.13.0 predates the documented staged-publish minimum. Versioned docs are evidence of documented behavior, not proof that all third-party clients or registries implement it. [Staging minimum](https://docs.npmjs.com/staged-publishing).

## 3. What should not be called an npmjs.com enterprise feature?

### Takeaway

- “Works with npm” does not mean “provided by npmjs.com.” GitHub Packages, third-party registries, and historical npm Enterprise products need separate labels. [GitHub Packages npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), [Verdaccio](https://verdaccio.org/docs/what-is-verdaccio).

### Cited Findings

- **GitHub Packages:** separate service at `npm.pkg.github.com`; scoped packages only, repository-linked or independent package permissions, GitHub Actions `GITHUB_TOKEN`, and classic GitHub PAT authentication outside suitable workflows. Do not confuse these GitHub classic PATs with removed npm classic tokens. Its billing, identity controls and visibility model are not npm Teams entitlements. [GitHub's registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
- **Third-party registries:** Verdaccio explicitly provides private hosting, configurable access, and an on-demand caching proxy. It is not an npm paid plan. Other vendors' SSO, retention, replication, quarantine, license enforcement or SLAs require vendor-specific evidence; registry-protocol compatibility alone does not establish any of them. [Verdaccio overview, updated November 7, 2026](https://verdaccio.org/docs/what-is-verdaccio), [npm registry interface](https://docs.npmjs.com/cli/v12/using-npm/registry).
- **Historical Enterprise:** GitHub's March 16, 2020 acquisition announcement, updated April 15, explicitly referred to npm Pro, Teams and Enterprise and future private-package migration. That dated statement is not a current product sheet and its future plan is not proof the migration happened. Do not reuse historical private-registry/Enterprise promises as current npm Teams features. [Acquisition announcement](https://github.blog/news-insights/company-news/npm-is-joining-github/).
- **Protocol depth:** official metadata defines versions, dependencies, dist-tags, deprecation, tarball URLs and integrity, plus abbreviated install metadata negotiation. The specification contains historical signing references; use current ECDSA/provenance CLI documentation for present verification behavior, not its old PGP example. [Metadata contract](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md), [current signature verification](https://docs.npmjs.com/cli/v12/commands/npm-audit#audit-signatures).

### Inferences

- Plain-language choice: buy npm Teams for hosted private collaboration; use GitHub Packages for its GitHub permission/workflow model; evaluate a third-party registry when a specifically documented network, hosting or governance requirement justifies operating or buying it. None of these choices changes what the npm client intrinsically is. [Teams](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan), [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), [Verdaccio](https://verdaccio.org/docs/what-is-verdaccio).

### Gaps

- A definitive primary-source shutdown date covering both legacy npm Enterprise and npm On-Site was not recovered. Treat both as historical offerings, not current recommended purchase options, but do not invent a discontinuation date. Current evidence establishes Teams/individual private hosting, not a current on-prem plan. [Current hosted billing documentation](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan), [historical Enterprise mention](https://github.blog/news-insights/company-news/npm-is-joining-github/).
