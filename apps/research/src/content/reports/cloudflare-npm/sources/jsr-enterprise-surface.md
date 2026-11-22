---
title: "JSR enterprise registries and developer surface"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## How does JSR fit corporate private registries?

### Takeaway

- Hosted jsr.io does not support private packages. Public JSR packages can enter corporate npm workflows through an npm compatibility endpoint, but compatibility depends on the proxy product, not merely its npm support. [JSR, Private registries, checked 2026-11-08](https://jsr.io/docs/private-registries).

### Cited Findings

- Evidence checked November 8, 2026. No installs, publishing, proxy deployment, or authentication experiments were performed. Live docs and metadata establish documented behavior and current observations, not a tested enterprise deployment.
- Hosted private publishing: explicitly unavailable. The docs' title “Private registries” means consuming public JSR through a corporate npm registry, not private scopes on jsr.io. [JSR, Private registries](https://jsr.io/docs/private-registries). Feature request [jsr-io issue #203](https://github.com/jsr-io/jsr/issues/203), opened March 5, 2024, remained open; last issue update January 20, 2026, per [GitHub issue record](https://api.github.com/repos/jsr-io/jsr/issues/203).
- Identity: `@luca/cases` becomes npm package `@jsr/luca__cases`, available from `https://npm.jsr.io`, not registry.npmjs.org. Alias `"@luca/cases": "npm:@jsr/luca__cases@1"` retains the original import name without changing the underlying registry package identity. [JSR, npm compatibility, Advanced setup and Technical details](https://jsr.io/docs/npm-compatibility#advanced-setup).
- Two distinct routing modes:
  - Coexistence: keep the corporate default registry and route `@jsr` directly to `https://npm.jsr.io`. This is a second external registry, not a corporate proxy integration. [JSR, npm compatibility](https://jsr.io/docs/npm-compatibility#advanced-setup).
  - Mandatory corporate path: configure an actual server-side JSR upstream and keep `@jsr` routed through the corporate feed. Merely setting the default `registry` while retaining a public `@jsr:registry` override does not achieve that policy. [JSR, Private registries](https://jsr.io/docs/private-registries); [npm, scope routing configuration](https://docs.npmjs.com/cli/v11/configuring-npm/npmrc).
- Product integration matrix:
  - **Azure Artifacts: explicitly documented by JSR.** Add public custom npm upstream `https://npm.jsr.io`, rank it above npmjs, then search/import `@jsr/scope__package` into the feed. This is the clearest official JSR-specific recipe found, not an independently tested installation. [JSR, Azure instructions](https://jsr.io/docs/private-registries#configuring-a-jsr-upstream-with-azure-devops-artifacts).
  - **Azure caveat:** Microsoft's general instructions describe public sources and Azure feeds, not the JSR-specific custom-registry option. They require owner/admin privileges for upstream configuration and collaborator-or-higher privileges for initially saving upstream packages. Do not promise that every tenant or Server version exposes JSR's pictured path. [Microsoft Learn, Set up upstream sources, page dated 2026-02-06, updated 2026-08-31](https://learn.microsoft.com/en-us/azure/devops/artifacts/how-to/set-up-upstream-sources?view=azure-devops).
  - **JFrog Artifactory: JSR explicitly says not yet usable as an npm upstream**, because of tarball URL layout. This is a specific documented limitation, not a claim that every custom integration is impossible. [JSR, Artifactory caveat](https://jsr.io/docs/private-registries#configuring-a-jsr-upstream-with-jfrog-artifactory).
  - **Google Artifact Registry: same explicit JSR limitation.** Google now documents custom HTTPS npm upstream URLs generally; that does not prove JSR's tarballs satisfy its assumptions. [JSR, Google caveat](https://jsr.io/docs/private-registries#configuring-a-jsr-upstream-with-google-artifact-registry); [Google Cloud, Remote repositories, Custom URLs](https://cloud.google.com/artifact-registry/docs/repositories/remote-overview#custom-upstream).
  - **Shared blocker:** contributor Luca Casonato opened issue #405 on April 18, 2024, saying upstreams requiring npm's tarball paths are known to affect Google and Artifactory. Still open; issue updated August 25, 2026. [JSR issue #405](https://github.com/jsr-io/jsr/issues/405); [dated API record](https://api.github.com/repos/jsr-io/jsr/issues/405).
  - **Sonatype Nexus: generic npm-proxy capability confirmed, JSR-specific compatibility unverified.** Sonatype says it can proxy other npm registries by setting remote storage URL. No tested JSR recipe or vendor guarantee was found. Do not promote this to “supported JSR upstream.” [Sonatype, npm Registry, Proxying npm Registries](https://help.sonatype.com/en/npm-registry.html).
  - **AWS CodeArtifact: no arbitrary JSR external-connection choice in the documented interface.** The npm external connection is `public:npmjs`; internal CodeArtifact upstream repositories are not arbitrary external registry URLs. This blocks the simple proposed “add npm.jsr.io as an external connection” recipe, without ruling out a separately engineered import/mirror. [AWS, external connections and supported repositories](https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html); [AWS, upstream/external distinction](https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html).
  - **GitHub Packages: hosting and scope routing documented, not a custom JSR upstream.** GitHub discusses npmjs.org access but does not establish arbitrary npm.jsr.io proxy support. Scoped GitHub packages can coexist with direct JSR routing; that is not proof of central JSR caching. [GitHub, Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
- Firsthand workaround report, not vendor support: issue commenter Peterlustig78 reported August 4, 2025 that an Artifactory generic repository worked after injecting an Accept header through another proxy. They expressly left npm tarball support unresolved. It concerns native file delivery and a specific configuration, not resolution of #405. [Dated comment](https://github.com/jsr-io/jsr/issues/405#issuecomment-3149819904).
- Live artifact evidence: `@jsr/std__http` latest `1.1.4` advertised tarball `https://npm.jsr.io/~/11/@jsr/std__http/1.1.4.tgz` and nine `@jsr/std__...` dependencies. Metadata success alone does not prove the tarball and complete dependency graph can pass a corporate proxy. [JSR live npm metadata, observed 2026-11-08](https://npm.jsr.io/@jsr/std__http).
- npm dependencies remain relevant too: JSR packages may depend on npm packages, and npm-compatible version metadata has a dependencies field. All relevant package scopes/registries must remain resolvable under corporate policy. [JSR, Publishing rules](https://jsr.io/docs/publishing-packages#jsr-package-rules); [JSR, npm API](https://jsr.io/docs/api#npm-compatibility-registry-api).
- Lockfiles matter: regenerated compatibility tarballs can have a new revision without changing semver; their URLs include the revision and remain immutable, except version deletion. Existing locked URLs retain their exact artifacts. Switching registry configuration alone does not demonstrate that existing locked external URLs now pass through the corporate cache. [JSR, Technical details](https://jsr.io/docs/npm-compatibility#technical-details).
- Auth must be separated: corporate feed credentials authenticate client-to-feed, not JSR publishing. npm credentials must be scoped by registry host/path to avoid sending them to the wrong host. The management API has separate tokens. [npm, Auth related configuration, last edited 2026-02-19](https://docs.npmjs.com/cli/v11/configuring-npm/npmrc#auth-related-configuration); [JSR, API authentication](https://jsr.io/docs/api#authentication-tokens).
- Native Deno `jsr:` fetching uses jsr.io metadata and individual source files, not npm.jsr.io tarballs. A corporate npm feed alone therefore does not cover that route. pnpm 10.9+ and Yarn 4.9+ accept JSR dependency specifiers and automatically route the compatibility scope to npm.jsr.io. “Native support” here does not mean Deno's source-file delivery or compliance with a company's proxy policy. [JSR, npm compatibility](https://jsr.io/docs/npm-compatibility); [JSR, API](https://jsr.io/docs/api#jsr-registry-api).

### Inferences

- An enterprise acceptance check should verify metadata, rewritten `dist.tarball`, any redirect destination, transitive JSR and npm dependencies, auth scoping, and a clean-cache lockfile install with client public egress blocked. These are proposed verification steps, not observed defects in every proxy. Evidence for separate metadata/tarball/dependency surfaces: [JSR npm API](https://jsr.io/docs/api#npm-compatibility-registry-api).
- Administrators control upstreams, approvals, egress, credentials and cache retention; developers control dependency declarations and local routing only within those rules. A CLI that writes direct routing is convenience, not organizational approval. [Microsoft permissions](https://learn.microsoft.com/en-us/azure/devops/artifacts/how-to/set-up-upstream-sources?view=azure-devops); [JSR CLI configuration code at released gitHead](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/commands.ts).

### Gaps

- No JSR-specific Nexus certification, arbitrary JSR upstream support in GitHub Packages, Azure tenant UI confirmation, or live verification of the documented Google/JFrog blocker. Preserve these distinctions rather than calling all integrations supported or all impossible.
- Redirect behavior and authorization forwarding were not experimentally tested. No claim that JSR requires a cross-host redirect or corporate credential forwarding.

## Does JSR have its own CLI, and which implementation actually ships?

### Takeaway

- Yes. The npm `jsr` package's current latest is **0.14.3**, published February 12, 2026. Its metadata still identifies the TypeScript `jsr-io/jsr-npm` implementation, not the newer Rust `jsr-io/cli` implementation. [npm full package metadata, time and versions](https://registry.npmjs.org/jsr); [latest version metadata](https://registry.npmjs.org/jsr/latest).

### Cited Findings

- Released 0.14.3 has executable `dist/bin.js`, repository jsr-npm, gitHead `9e797fbf742ca1dd741be76369a626b8ebfb2ab5`. Supported commands: `add/install/i`, `remove/uninstall/r`, `info/show/view`, `publish`, `run <script>` and package script shorthand. No built-in `init` or `pack`. A project script named init or pack is a different matter. [npm version record](https://registry.npmjs.org/jsr/0.14.3); [released command parser](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/bin.ts).
- Bun invocation equivalents, illustrative only: `bunx jsr@0.14.3 add @std/encoding --bun`, `bunx jsr@0.14.3 info @std/encoding`, `bunx jsr@0.14.3 remove @std/encoding --bun`, `bunx jsr@0.14.3 run build --bun`, `bunx jsr@0.14.3 publish --dry-run`. The official JSR docs illustrate npm's executor; Bun is used here as the user's preferred executor. Nothing was run. [Released flags/parser](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/bin.ts).
- The released add command detects the project's package manager or accepts `--bun`; it writes aliases and routing config. Existing `.npmrc` containing `@jsr:registry=` is preserved by `setupNpmRc`, rather than unconditionally overwritten. Yarn Berry has a different configuration path. Review generated changes under enterprise policy. [Released implementation](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/commands.ts).
- Released `jsr publish` actually invokes Deno. It downloads Deno unless `DENO_BIN_PATH` is set; `package.json` projects get flags including `--no-check`. `JSR_URL` is documented for the publishing target, not as a universal redirect for add/info/native consumption. This matters for restricted-network machines and binary approval. [Released publishing implementation](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/commands.ts); [released environment help](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/bin.ts).
- Rust repository at `71a684cac1353db57148e5ecc7221a30ff9b55e0`, commit dated October 29, 2026, has the preceding commands plus `pack`, and no built-in `init`. It implements publishing directly and explicitly does not type-check. Its README describes an npm wrapper that downloads a Rust binary, but that description does not match npm's observed latest release. [Rust parser](https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/cli/main.rs); [Rust README](https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/README.md).
- Rust Cargo version is `0.1.0`; GitHub releases API returned an empty list on November 8. Describe this as source/new implementation, not the current stable distributed CLI, and do not tell users `bunx jsr pack` works on latest. [Cargo manifest](https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/cli/Cargo.toml); [releases API](https://api.github.com/repos/jsr-io/cli/releases).
- Deno also has the official first-class `deno publish` route; configs contain name/version/exports in jsr.json or deno.json(c). The npm compatibility endpoint cannot receive an ordinary npm publish. [JSR, Publishing packages](https://jsr.io/docs/publishing-packages); [JSR, npm limitations](https://jsr.io/docs/npm-compatibility#limitations).

### Inferences

- Source repositories and installed executables need separate version checks. Calling JSR's CLI “Rust” without the release caveat is presently misleading. [Released npm metadata](https://registry.npmjs.org/jsr/latest); [Rust README](https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/README.md).

### Gaps

- No network install or binary execution was used to verify help output. Command claims come from the released package's recorded source commit, cross-checked against npm metadata. A future dist-tag update could change defaults.

## What are JSR's HTTP, UI, authentication and self-hosting surfaces?

### Takeaway

- Three distinct APIs plus the website: native module delivery, npm compatibility, and user-oriented management. They are not one interchangeable npm endpoint. [JSR, API](https://jsr.io/docs/api).

### Cited Findings

- Native delivery: `https://jsr.io/@scope/package/meta.json`, `.../<version>_meta.json`, and `.../<version>/<path>`. Requests must not accept text/html or set `Sec-Fetch-Dest: document`, otherwise content may render as a website. Source files are JS/TS, unlike the transpiled npm tarballs. [JSR, native API](https://jsr.io/docs/api#jsr-registry-api).
- npm delivery: `https://npm.jsr.io/@jsr/scope__package` returns npm metadata, dist URLs/integrity and dependencies. Package metadata between native/npm surfaces can briefly diverge. [JSR, npm API](https://jsr.io/docs/api#npm-compatibility-registry-api).
- Management: REST JSON at `https://api.jsr.io`, public [OpenAPI specification](https://api.jsr.io/.well-known/openapi) and [rendered endpoint reference](https://jsr.io/docs/api-reference). Publishing, scope management and account operations belong here. Docs explicitly prohibit using management endpoints for ordinary install-time version/metadata resolution. [JSR, Management API and Usage restrictions](https://jsr.io/docs/api#management-api).
- Auth: short-lived interactively approved device access tokens and long-lived personal access tokens use `Authorization: Bearer`; GitHub Actions OIDC uses `Authorization: githuboidc`. Documented permissions are `package/publish`, optionally restricted to package/version, or all actions except token management. OIDC is publish-only with a specific package/version. Do not equate these with enterprise SSO or an arbitrary OAuth provider integration. [JSR, tokens and permissions](https://jsr.io/docs/api#authentication-tokens).
- Publishing UI/browser flow approves the specific package. GitHub Actions tokenless publishing requires linking its repository and id-token permission. Other CI providers can use a personal access token; docs say tokenless OIDC and provenance are GitHub Actions-only. [JSR, Publishing packages, CI sections](https://jsr.io/docs/publishing-packages#publishing-from-github-actions).
- Website: search, generated API docs, sources/package versions, creation/settings, scope members and account token settings. Scope admins and members are distinct; scopes have no single owner. The CLI command list is not the full service administration surface. [JSR, Scopes](https://jsr.io/docs/scopes); [publishing setup](https://jsr.io/docs/publishing-packages#creating-a-scope-and-package); [account token docs](https://jsr.io/docs/api#authentication-tokens).
- Self-hosting: root MIT license allows running/modifying registry software, and entire-stack instructions document independent local services plus `JSR_URL=http://jsr.test deno publish`. This is not a hosted private-package product or proof of production-ready enterprise permissions/SSO/air-gap completeness. [JSR README at registry snapshot 1624825](https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/README.md#getting-started-entire-stack); [MIT license](https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/LICENSE).

### Inferences

- Practical answer: keep proprietary packages in the existing private registry; assess public JSR intake product by product. Open code makes independent operation possible, not automatically equivalent to Artifactory or a complete hosted-service migration. [JSR private-registry statement](https://jsr.io/docs/private-registries); [local stack documentation](https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/README.md).

### Gaps

- Public package access and MIT source do not supply production user data, hosted namespace control, secrets or third-party managed services. No full portability, licensing-of-all-packages, production deployment or enterprise feature audit was performed.
