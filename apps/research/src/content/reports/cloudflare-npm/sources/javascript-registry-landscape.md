---
title: "JavaScript package registry landscape"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## Which layer does each player compete in?

### Takeaway

Package-manager choice, package authority, and delivery infrastructure are separate decisions. A competitor to Cloudflare's registry ambitions can preserve npm clients and identities rather than recruit publishers into a new public namespace. This is analysis grounded in the distinct npm configuration and JSR publishing interfaces below.

### Cited Findings

- Research cutoff: 2026-11-08. All linked rolling documentation and HTTP metadata were read on that date. Source dates below are publication/commit dates where supplied, not invented publication dates for undated pages. No install, publication, deployment, account creation, or compatibility benchmark was run.
- **npm CLI:** defaults to `https://registry.npmjs.org/`, but supports compatible alternative registries and scope-specific routing. npm the command is not synonymous with npm the hosted registry. Owner: npm/GitHub, CLI v11 documentation. [Registry](https://docs.npmjs.com/cli/v11/using-npm/registry).
- **pnpm:** npm-registry client with configurable default/scoped registries. The v10 configuration documents npmjs as default; current documentation also describes named registries and server-specific tarball layouts. Owner: pnpm, rolling docs. [v10 registry settings](https://pnpm.io/10.x/npmrc#registry); [current registry model](https://pnpm.io/registries).
- **Yarn:** current `npmRegistryServer` default is `https://registry.yarnpkg.com`, not literally npmjs.org. That endpoint should not be counted as a separate publisher namespace in this comparison. Owner: Yarn, rolling reference. [Configuration](https://yarnpkg.com/configuration/yarnrc#npmRegistryServer).
- **Bun:** package-manager default is `registry.npmjs.org`; supports scoped registries and `.npmrc` as well as `bunfig.toml`. Owner: Bun, rolling docs. [Scopes and registries](https://bun.com/docs/pm/scopes-registries).
- **Deno:** not accurately described by one default registry. Native `jsr:` and `npm:` specifiers select different ecosystems; Deno recommends JSR for third-party ES modules while supporting npm. Owner: Deno, rolling docs. [Modules](https://docs.deno.com/runtime/fundamentals/modules/).
- **vlt CLI:** current docs explicitly say **there is no default registry**. Configure `vlt.json`, flags, or `VLT_REGISTRY`; do not repeat old claims that every vlt install implicitly uses npmjs. Owner: vlt, rolling docs. [Configuration](https://docs.vlt.io/client/configuring.md).
- **npm public registry:** publishing authority and npm namespace, as distinct from software that proxies its metadata/tarballs. Owner: npm/GitHub. [Registry interface](https://docs.npmjs.com/cli/v11/using-npm/registry).
- **JSR:** separate publishing authority/namespace and TypeScript/ESM-oriented publishing workflow. npm-compatible consumption translates identities, for example `@luca/cases` into `@jsr/luca__cases`. Its compatibility endpoint does not accept `npm publish`; npm dependencies can remain. Owner: JSR, rolling docs. [Compatibility](https://jsr.io/docs/npm-compatibility); [Publishing](https://jsr.io/docs/publishing-packages).
- **GitHub Packages:** actual npm-compatible public/private package hosting at `npm.pkg.github.com`, but **only scoped packages**. Documentation requires authentication for installing even public npm packages. Do not frame this as an anonymous, complete npm public-catalog replacement. Owner: GitHub, rolling docs. [npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

### Inferences

- Count npm and JSR as public publishing authorities here, not as an exhaustive list of places anyone can host a public tarball. GitHub Packages, hosted vlt `main`, or a publisher's own registry can also be authoritative for their packages.
- A package manager can help a registry acquire users through configuration and integration, but a faster resolver alone does not establish a new registry, ownership system, or public catalog.

### Gaps

- No client-version matrix was executed. Yarn's default endpoint is verified from configuration, not an audit of its present hosting or proxy implementation. Current pnpm docs now also describe `pnpr`; this note does not independently evaluate that server's maturity or license. [pnpm registry reference](https://pnpm.io/registries).

## What exactly are vlt, VSR, Verdaccio, and Alchemy shipping?

### Takeaway

vlt is active and has three distinguishable surfaces: a released client, hosted registry service, and separately distributed VSR server. Alchemy's package is real implemented preview infrastructure, not evidence of a general npm publishing replacement.

### Cited Findings

- **Brand/company:** fetching `https://www.vlt.sh` redirects to `https://www.vlt.io/`. The current site identifies **vlt technology inc.**, offers sign-up, private/public publishing, and an npm mirror. Its about page lists **Darcy Clarke as CEO**, plus current engineers and operations staff. This is first-party product/team evidence, not an independent legal ownership search. Owner: vlt, accessed 2026-11-08. [Site](https://www.vlt.io/); [Team](https://www.vlt.io/about).
- **Isaac correction:** his own CV says vlt employment was **2024/02 to 2025/07** and Sentry **2025/11 to present**. Do not turn a historical founder association into a current vlt executive/employer claim, or infer the company ceased operating when he left. Owner: Isaac Z. Schlueter, accessed 2026-11-08. [Personal CV](https://izs.me).
- **Client maintenance:** GitHub release **v1.6.4**, non-prerelease, published **2026-11-05T15:38:57Z**. Latest observed main commit was **7b624ae1d4990310fc042d4b136d4ecaabb733b4**, **2026-11-06T22:56:25Z**, upgrading ESLint. This is direct evidence against calling the client abandoned. Owner: vltpkg. [Release](https://github.com/vltpkg/vltpkg/releases/tag/v1.6.4); [Commit](https://github.com/vltpkg/vltpkg/commit/7b624ae1d4990310fc042d4b136d4ecaabb733b4); [API](https://api.github.com/repos/vltpkg/vltpkg/releases?per_page=3).
- **Client source/license:** monorepo identifies reusable client and CLI workspaces as BSD-2-Clause-Patent, with some ISC/MIT components. Do not transfer that license claim to VSR. Owner: vltpkg, main observed 2026-11-06. [Pinned README](https://github.com/vltpkg/vltpkg/blob/7b624ae1d4990310fc042d4b136d4ecaabb733b4/README.md).
- **Hosted registry:** accounts receive `https://registry.vlt.io/<account>/npm/` as npm mirror and `.../<account>/main/` for their own packages. Mirror access always requires a token. Public `main` packages can be installed without a token when scoped routing is configured. Existing npm/pnpm/Yarn/Bun clients need not be replaced by vlt. Owner: vlt, rolling docs. [Interoperability](https://docs.vlt.io/npm-interoperability.md); [npm install/publish guide](https://docs.vlt.io/registry/publishing/npm.md).
- **Writes are real documented workflows:** guide specifies `npm publish`, `publishConfig.registry`, `--access public`, web login, personal-token OTP approval and CI service tokens with `package:write`. This is more specific than a landing-page compatibility claim, but was not live-tested. Owner: vlt. [Publishing](https://docs.vlt.io/registry/publishing/npm.md).
- **Hosted pricing snapshot:** Free $0 with 2 GB combined Storage+Delivery; Pro **$8/user/month billed annually**, 10 GB; Premium $20, minimum 2 seats, 50 GB; Enterprise $79, minimum 10 seats, 1 TB. These are annual-billing displayed rates, not verified monthly-billing rates. Pro table displayed $1.20/GB/month extra usage. Some feature-table entries say coming soon, including Activity Logs, despite a November 5 activity-log announcement on the home page. Do not present every pricing feature as verified available. Owner: vlt, accessed 2026-11-08. [Pricing](https://www.vlt.io/pricing); [Activity announcement](https://www.vlt.io/blog/activity-and-usage).
- **VSR distribution:** `@vltpkg/vsr` npm `latest` was **1.0.0-rc.18**, published **2026-02-04T20:30:36.962Z**. GitHub releases API returned no release objects, which is not the same as no npm distribution. Latest observed source commit **4ed014c61e3a332a7599724105d38366d2ebae6b**, **2026-08-25T19:35:49Z**. Its docs mention rc.19 authentication changes even though npm latest remains rc.18: distinguish source instructions from the released package. Owner: vltpkg/npm metadata. [npm metadata](https://registry.npmjs.org/@vltpkg%2fvsr); [Source commit](https://github.com/vltpkg/vsr/commit/4ed014c61e3a332a7599724105d38366d2ebae6b); [Manifest](https://github.com/vltpkg/vsr/blob/4ed014c61e3a332a7599724105d38366d2ebae6b/package.json); [Deploy guide](https://github.com/vltpkg/vsr/blob/4ed014c61e3a332a7599724105d38366d2ebae6b/info/DEPLOY.md).
- **VSR architecture:** source `wrangler.json` binds D1 `DB`, R2 `BUCKET`, refresh queue producer/consumer, and asset storage to a Worker. `vsr deploy` targets Cloudflare Workers; local execution uses Wrangler-backed tooling. Self-host here means operate your own instance, not demonstrated cloud-neutral standalone server portability. Owner: vltpkg. [Bindings](https://github.com/vltpkg/vsr/blob/4ed014c61e3a332a7599724105d38366d2ebae6b/wrangler.json); [Deploy](https://github.com/vltpkg/vsr/blob/4ed014c61e3a332a7599724105d38366d2ebae6b/info/DEPLOY.md).
- **VSR npm interface verified in code:** `src/routes/packages.ts` implements packument/manifest/tarball reads, upstream proxying, authenticated package publishing and a publish route documenting `npm publish`. Tests exist for manifest, packument, dist-tags, audit, access and token behavior. This verifies implemented surfaces, not full npm feature parity or passing tests today. Owner: vltpkg. [Package routes](https://github.com/vltpkg/vsr/blob/4ed014c61e3a332a7599724105d38366d2ebae6b/src/routes/packages.ts); [Tests](https://github.com/vltpkg/vsr/tree/4ed014c61e3a332a7599724105d38366d2ebae6b/test).
- **VSR license:** FSL-1.1-MIT, copyright 2025 vlt technology Inc. Internal use is explicitly permitted; competing commercial products/services are excluded until each version's two-year MIT conversion. Describe as **source-available/fair-source with restrictions**, not unrestricted open source, even though the site places it in an Open Source menu. Owner: vltpkg. [Exact license](https://github.com/vltpkg/vsr/blob/4ed014c61e3a332a7599724105d38366d2ebae6b/LICENSE).
- **Verdaccio:** Node.js private npm registry and on-demand upstream cache. Own small database, storage/auth plugins, Docker and Helm options. MIT-licensed and volunteer-maintained. README describes actual npm/pnpm/Yarn/Bun/Deno E2E matrix, including install/publish, rather than just an API slogan. No vendor seat subscription is established here; operating cost remains yours. Owner: Verdaccio, rolling source/docs. [Repository](https://github.com/verdaccio/verdaccio); [License](https://github.com/verdaccio/verdaccio/blob/master/LICENSE); [Overview](https://verdaccio.org/docs/what-is-verdaccio); [E2E project](https://github.com/verdaccio/e2e-tests).
- **Alchemy actual product:** `packages/pkg` contains README, `Registry.ts`, HTTP protocol, handler, pack/publish CLI, migrations and tests; `stacks/src/pkg.ts` declares `pkg.alchemy.run` and aliases. Package metadata declares Apache-2.0. npm `latest` **2.0.0-beta.85**, published **2026-11-02T21:06:23.691Z**, matching source release commit **d0b4a3326718309793459160e94b35abee517b23**. Owner: alchemy-run. [Pinned package](https://github.com/alchemy-run/alchemy/tree/d0b4a3326718309793459160e94b35abee517b23/packages/pkg); [Stack](https://github.com/alchemy-run/alchemy/blob/d0b4a3326718309793459160e94b35abee517b23/stacks/src/pkg.ts); [npm metadata](https://registry.npmjs.org/@alchemy.run%2fpkg).
- **Alchemy scope and architecture:** PR/commit/branch preview tarballs, GitHub Actions run/artifact verification, SHA-256 content-addressed R2 storage, D1 tag index, KV cache, Worker and TTL cleanup. CLI publishes through custom `POST /api/publish` and upload endpoints. Consumers install HTTPS tarball URLs; packed workspace dependency links are rewritten to immutable URLs. **Not a demonstrated general npm packument registry or standard `npm publish` destination.** Default one-week TTL alone makes it unsuitable to describe as permanent public package authority. No hosted commercial pricing was verified. Owner: Alchemy. [Pinned README and HTTP contract](https://github.com/alchemy-run/alchemy/blob/d0b4a3326718309793459160e94b35abee517b23/packages/pkg/README.md); [Protocol](https://github.com/alchemy-run/alchemy/blob/d0b4a3326718309793459160e94b35abee517b23/packages/pkg/src/Protocol.ts).

### Inferences

- The hosted vlt service is an actual registry competitor. Its client is optional; VSR is an independently useful but restricted-license deployment option. A company competing against Cloudflare can itself use Cloudflare infrastructure.
- Do not infer hosted vlt production internals exactly match the public VSR repository. Public deployment bindings establish VSR's architecture, not a full SaaS infrastructure audit.
- Alchemy shows publishers building focused distribution infrastructure for a concrete workflow, reducing their need to ask a general registry to solve previews. It does not show willingness to migrate stable releases or pay for a new universal registry.

### Gaps

- No verified current cap table/acquisition history, customer count, revenue, public SLA comparison, or independent performance result. Current team, company branding, commits and releases establish activity, not business success.
- VSR rc.19 documentation versus rc.18 distribution remains an explicit version mismatch. No end-to-end install/publish test was run for either VSR or hosted vlt.

## Which competitors already solve corporate delivery, and what must adoption preserve?

### Takeaway

Enterprise npm delivery is not an empty category. Existing registries already combine internal publication with upstream caching and access controls, so a new provider must displace a working path, not merely be better than npm's homepage.

### Cited Findings

| Product / source owner | What the official interface establishes | Deployment/commercial boundary |
| --- | --- | --- |
| [JFrog Artifactory](https://docs.jfrog.com/artifactory/docs/npm-repositories.md), updated 2026-09-17 | npm/pnpm/Yarn install and publish; local, remote cache, virtual aggregation | [Managed SaaS and operated deployments](https://jfrog.com/artifactory); commercial feature/edition terms, not a blanket free npm registry claim |
| [Sonatype Nexus Repository](https://help.sonatype.com/en/npm-registry.html), rolling | hosted, proxy, group; `.npmrc` routing; npm publication | [Group publishing requires Pro](https://help.sonatype.com/en/publishing-npm-packages.html); do not apply historical OSS licensing to every current edition |
| [AWS CodeArtifact](https://docs.aws.amazon.com/codeartifact/latest/ug/using-npm.html), rolling | npm repository reads/writes and other clients; [`public:npmjs` external connection](https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html) | AWS-managed service, not a self-hostable registry distribution |
| [Azure Artifacts](https://learn.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops), rolling | npm feeds, scopes, upstreams and separate project routing/user credentials | Microsoft service/feed offering; not an independent public npm namespace |
| [Google Artifact Registry](https://docs.cloud.google.com/artifact-registry/docs/nodejs), rolling | Node/npm hosting, auth, scope routing and publishing | Google-managed repository service |
| [Cloudsmith](https://docs.cloudsmith.com/formats/npm-registry), rolling | native npm install/publish plus upstream proxy/cache | Managed artifact platform; older compatibility versions in docs are not evidence of tests against every current client |

- **Lockfile reality:** npm treats original npmjs default-registry lock URLs specially, but a custom registry lock may retain its host. pnpm's current reference explains when tarball URLs can be omitted/rebuilt and when content-digest URLs must remain. Owner: npm and pnpm. [npm registry](https://docs.npmjs.com/cli/v11/using-npm/registry); [pnpm layouts](https://pnpm.io/registries#servertype).
- **vlt migration caveats:** official migration guide says keep npm lockfiles for npmjs-to-mirror routing, but retained `vlt-lock.json` can continue fetching the old registry; links [issue #1579](https://github.com/vltpkg/vltpkg/issues/1579). It documents auth-file differences across clients, mirror tokens, lock regeneration for some tools, a pnpm-12 mirror issue and Turborepo package-manager limitations. This materially qualifies the marketing phrase “nothing else changes.” Owner: vlt, rolling docs. [Migration guide](https://docs.vlt.io/skills/vlt-registry-migration/SKILL.md).

### Inferences

- Separate three asks: **consume through my proxy**, **publish private packages here**, **make my public namespace authoritative**. Each has a different buyer and switching cost.
- Lowest-friction adoption pitch: preserve current client/version, manifest names, existing scope authority and complete transitive dependency access. Prove auth routing, metadata freshness, integrity, lifecycle scripts, audit/provenance behavior and CI clean-cache installs. npm protocol support alone does not establish equivalent trust or lockfile portability.
- A publisher-owned registry can win one scope without replacing the entire network. Conversely, a new public registry must earn publisher releases, downstream routing, namespace trust and transitive availability together. A mirror inherits catalog usefulness but remains dependent on its upstream for new publications.
- Against incumbent enterprise products, Cloudflare would need demonstrable value in price, latency, reliability, policy/support or operator time. CDN reach is not by itself evidence that organizations will replace their approved artifact gateway.

### Gaps

- No complete enterprise price/license matrix, contract review, tenant testing, procurement evidence, or security-tool vendor inventory. Socket and related scanning/firewall products should be evaluated as security/control competitors when relevant, not casually equated with authoritative public registries.
- These proposed adoption tests and commercial conclusions are analysis, not measured results or announced Cloudflare products.
