---
title: "JSR client and configuration compatibility, checked November 8, 2026"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## What already works, and which implementation actually ships?

### Takeaway

JSR already works with npm configuration and existing package managers. The useful distinction is npm-compatible installation, native dependency-specifier convenience, native source imports, and JSR publication, not “supports .npmrc” versus “does not.” [Compatibility docs at registry snapshot](https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/frontend/docs/npm-compatibility.md#L20-L85).

### Cited Findings

- Method: read public release metadata, source and first-party documentation. No package installation, package-binary execution, publishing, credential experiments, or changes to existing configuration. “Source-derived” below means code inspection, not an executed integration test.
- **Released npm helper:** npm `jsr` latest returned **0.14.3**, gitHead `9e797fbf742ca1dd741be76369a626b8ebfb2ab5`, repository `jsr-io/jsr-npm`. This is TypeScript, not the Rust rewrite. [Observed release metadata](https://registry.npmjs.org/jsr/latest).
- **Rust CLI:** inspected main commit `71a684cac1353db57148e5ecc7221a30ff9b55e0`. The GitHub releases API returned `[]`; its implementation must not be presented as the npm package's current default. Empty GitHub releases do not prove nobody can distribute a custom build. [Releases](https://api.github.com/repos/jsr-io/cli/releases); [source parser](https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/cli/main.rs#L35-L61).
- **Version-specific client matrix:** `P` below means ordinary package-name import after installation, not a runtime `jsr:` import. npm-compatible installation does not make npm publication to JSR possible. [JSR limitations](https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/frontend/docs/npm-compatibility.md#L70-L85).

| Client | Add / repeat install / remove | Dependency representation and imports | Config and JSR publishing |
| --- | --- | --- | --- |
| npm | `npm install @luca/cases@npm:@jsr/luca__cases@1`; `npm install` or `npm ci`; `npm remove @luca/cases` | `"@luca/cases":"npm:@jsr/luca__cases@1"`; P | `.npmrc` scoped registry required; `npm publish` cannot publish to JSR. [N1][J1] |
| pnpm 10.9+ | `pnpm add jsr:@luca/cases`; `pnpm install`; `pnpm remove @luca/cases` | native `"@luca/cases":"jsr:^<resolved-version>"`; P; npm aliases also work | automatic @jsr registry fallback; publish converts `jsr:` dependency entries to npm aliases, but does not publish the package to JSR. [P1] |
| Yarn Classic 1.x | `yarn add @luca/cases@npm:@jsr/luca__cases@1`; `yarn install`; `yarn remove @luca/cases` | npm alias; P | reads `.npmrc` and its own `.yarnrc`; no documented native JSR protocol here; ordinary publish is not JSR publishing. [Y1][J1] |
| Yarn Berry 2 through 4.8 | same alias/add/install/remove | npm alias; P | `.yarnrc.yml`, not `.npmrc`; helper sets npmScopes; no built-in native protocol claim for these versions. [Y2][J2] |
| Yarn 4.9+ | `yarn add jsr:@luca/cases` or `yarn add @luca/cases@jsr:1`; install/remove as usual | `"@luca/cases":"jsr:1"` for explicit-version form; P; resolver maps to npm identity internally | automatic compatibility routing; `.yarnrc.yml` overrides still matter; JSR publication remains separate. [J1][Y3][Y4] |
| Bun, released 1.4.4 | `bun add @luca/cases@npm:@jsr/luca__cases@1`; `bun install`; `bun remove @luca/cases` | npm alias; P | `.npmrc` supported since 1.1.18, plus bunfig.toml; no verified native jsr protocol; `bun publish` is not a JSR publishing route. [B1][B2][B3] |
| Deno, current documented 2.8 behavior | `deno add jsr:@luca/cases`; `deno install`; `deno remove @luca/cases` | normally deno.json imports `"@luca/cases":"jsr:@luca/cases@^1"`; native source import or mapped bare import; `--package-json` writes npm-compatible aliases | deno.json/import map, package.json, deno.lock; supported npmrc subset for npm; `deno publish` publishes to JSR. [D1][D2][D3] |
| npm `jsr` helper 0.14.3 | `jsr add/install/i`; `jsr remove/uninstall/r`; `jsr run`, info/show/view | installs npm aliases through npm/pnpm/yarn/bun; P | config writer plus delegated package manager, not its own full npm installer; `jsr publish` invokes Deno. No built-in pack/init. [J2][J3][J4] |
| Rust `jsr` CLI main, not observed npm release | add/install/i, remove/uninstall/r, info aliases, run, publish, pack | aliases and delegated npm-compatible installer; P | ports config setup; direct JSR publishing implementation; no built-in init. [R1][R2][R3] |

- npm native `jsr:`: **unsupported in the inspected current argument parser**, not merely absent from a marketing page. npm-package-arg latest is 14.0.0 at `eec1495617fb6addbedc22ad549871e978ea8126`; URL dispatch handles git/http/https then rejects unknown protocols with `EUNSUPPORTEDPROTOCOL`. Configuring a registry does not add a specifier parser. [Version](https://registry.npmjs.org/npm-package-arg/latest); [pinned parser lines 366-431](https://github.com/npm/npm-package-arg/blob/eec1495617fb6addbedc22ad549871e978ea8126/lib/npa.js#L366-L431). This checks the parser release, not an executed npm 12 binary.
- pnpm's native support is a **released 10.9.0 feature**, including exact saved manifest and publish-time conversion examples. The default @jsr registry is npm.jsr.io only if `@jsr:registry` is not defined. A corporate default registry alone therefore does not override that scope fallback. [P1].
- Yarn source at main snapshot `8f638c0806ec8f3758adb13d93567fc782f9c903` translates `jsr:` descriptors to npm aliases and delegates to the existing resolver. This is not Deno's direct TS/file path. Version floor 4.9+ comes from JSR docs, cross-checked against Yarn's 4.9.0 changelog. [Y3][Y4]; [4.9.0 changelog at release commit](https://github.com/yarnpkg/berry/blob/2b26e3dff6fae778931445e8aca469e4bc2abac2/CHANGELOG.md).
- Bun latest GitHub release observed **1.4.4**, published October 22, 2026. Its dependency parser has npm aliases, workspace/git/tarball forms and no `jsr` handling in the inspected file. Combined with JSR's explicit instruction to use its helper for Bun, this supports “use aliases/helper; native support not established,” rather than a tested claim about every Bun runtime path. [Release API](https://api.github.com/repos/oven-sh/bun/releases/latest); [released parser](https://github.com/oven-sh/bun/blob/38afee6c84fcf48c0edb2466aa4b27d287a59c30/src/install/dependency.rs#L790-L1140); [J1].
- Deno now explicitly documents `--package-json` in 2.8+: it writes JSR packages as `npm:@jsr/...`, while normal JSR additions go to deno.json imports. `preferPackageJson: true` can make that choice the default. Existing package.json sends npm dependencies there by default, not necessarily JSR dependencies. Current docs say unprefixed CLI names default to npm; use explicit `jsr:` to avoid ambiguity. One same-page example omits the prefix for std/path, so prefer the explicit documented syntax. [D1].

### Inferences

- The adoption benefit is concrete: retain imports, package managers, package.json, lockfiles and much of the client's existing networking configuration. The work is routing a new package identity and reviewing generated artifacts, not replacing every tool. [J1][J3].
- Native `jsr:` manifest entries in pnpm/Yarn are not automatically portable to npm or Bun as source manifests. Both have publication conversion: pnpm documents it, and Yarn 4.9.0's beforeWorkspacePacking hook converts dependencies, devDependencies, peerDependencies and optional dependency entries to npm aliases in the packed manifest. That improves published-package portability without making an unprocessed repository manifest universally readable. [P1]; [Yarn release-pinned pack hook, lines 8-41](https://github.com/yarnpkg/berry/blob/2b26e3dff6fae778931445e8aca469e4bc2abac2/packages/plugin-jsr/sources/index.ts#L8-L41).

### Gaps

- No executable interoperability tests or comprehensive Bun parser/runtime audit. Yarn's pack-manifest hook is inspected, but publication was not executed. Bun native `jsr:` is unverified rather than asserted universally impossible. No claim that Yarn Classic gains the modern JSR plugin.
- Current Deno docs describe 2.8 features; source excerpts below pin main separately and do not prove all those details exist in older Deno releases.

## Exactly what does the helper do to configuration?

### Takeaway

The released helper appends a scope route while preserving existing file text, then launches the real installer. It does not parse the full npm configuration, interpolate credentials, or merge the effective user/project/environment configuration before choosing that route. Its own metadata requests are a separate network surface. [J2], [J3], [J5].

### Cited Findings

- **Read/write algorithm:** `setupNpmRc(dir)` reads only `dir/.npmrc` as UTF-8. If its text contains the exact substring `@jsr:registry=`, it leaves it unchanged. Otherwise it appends `@jsr:registry=https://npm.jsr.io\n`, inserting a missing separator newline. ENOENT creates the file; other errors propagate. Existing default registry, other scoped registry keys, unknown settings and comments remain in the original text. It does not round-trip through INI serialization. [J2, lines 23-64].
- **Idempotency is textual, not semantic:** rerunning after a normal append does not add another route. An existing `@jsr:registry=https://corp.example/` is preserved. But `# @jsr:registry=...` also satisfies the substring, while a valid spacing variant such as `@jsr:registry = ...` does not. These are source-derived edge cases, not reproduced incidents. The appended line always ends in LF, even if the separator uses the existing CRLF convention. [J2, lines 42-64]; [newline helper](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/utils.ts#L1-L78).
- **No effective-config merge:** this function does not inspect home/global `.npmrc`, `NPM_CONFIG_USERCONFIG`, CLI configuration or environment overrides for an existing route. A route in user configuration can therefore be shadowed by the generated project route under the real client's precedence rules. This is distinct from preserving a route already present in the target file. [J2][N2].
- **Nested-project location:** `findProjectDir` walks upward, remembers the nearest package.json and detects ancestor workspace roots through array-valued `workspaces` or pnpm-workspace.yaml alongside an ancestor package.json. It stops at the first detected lockfile. The returned `root || projectDir` receives npmrc/bunfig; the package-manager command runs in `projectDir`. This is a heuristic, not a guarantee that every nested workspace shape finds the outermost root. Object-valued Yarn workspaces are not recognized by that array test, and a nested lockfile stops the walk early. [pinned utils lines 80-164](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/utils.ts#L80-L164); [J3, lines 226-257].
- **Manager choice:** explicit option, then lockfile detection, then npm_config_user_agent, then npm. At each directory lockfile priority is package-lock.json, bun.lockb, bun.lock, yarn.lock, pnpm-lock.yaml. Modern bun.lock is recognized. This is not simply “use whatever invoked npx.” [J3, lines 218-257]; [utils lines 120-155](https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/utils.ts#L120-L155).
- **Delegation:** add builds `@scope/name@npm:@jsr/scope__name@range` and executes npm install, pnpm add, yarn add or bun add. The chosen client writes package.json/its lockfile and interprets its own config. Remove delegates too; removing a dependency does not contain a corresponding routing-config cleanup. No-package install skips config setup. [J2, lines 96-132]; [J3, lines 31-35, 61-213].
- **Yarn Berry is different:** helper executes `yarn config set npmScopes.jsr.npmRegistryServer https://npm.jsr.io` instead of npmrc setup. This explicitly sets that key and does not first preserve a corporate value. Yarn owns YAML editing and its own precedence. A statement that the helper always preserves an existing @jsr route would therefore be false. [J2, lines 102-117]; [J3, lines 122-146]; [Y2].
- **Old Bun fallback:** below 1.1.18, helper appends an install.scopes table to bunfig.toml unless a line matches `^"@jsr"\s+=`. This is also text inspection, not a TOML table-aware merge. Existing install.scopes tables or unusual spacing are reasons to inspect the result, not proof of a universally safe merge. Bun 1.1.18+ gets npmrc setup. [J2, lines 66-85, 102-117]; [J3, lines 208-213]; [B1].
- **Own fetch path:** `api.ts` uses fetch directly. `JSR_URL` defaults to https://jsr.io and affects native metadata and the derived npm host, so it is **not publishing-only**, contrary to overly narrow earlier wording. info fetches native metadata then npm metadata; unversioned Yarn Berry add fetches native latest before invoking Yarn. There is no npmrc parser, registry-auth extraction or npm scoped-route lookup in these helpers. Runtime environment proxy handling is not audited here. [J5, lines 5-35, 60-73]; [J3, lines 140-146]; [J2, lines 209-237].
- **Scope setup remains fixed:** even if JSR_URL changes the helper's metadata host, the configuration writer's `https://npm.jsr.io` constant does not change. Do not advertise JSR_URL as a complete private-registry override for this released helper. [J2, lines 23-28]; [J5].
- **Rust main ports much of this behavior:** substring-based npmrc append, old-Bun fallback, Yarn config set, own metadata client and delegated install. Its tests explicitly preserve an existing npmrc route. Its publish implementation supports interactive authorization, personal token, and GitHub OIDC, independently of npmrc install credentials. [R2, lines 39-69, 106-172, 189-234, 285-315]; [R3, lines 618-779].

### Inferences

- Accurate description: “JSR's helper bootstraps the chosen client's scope routing and delegates installation.” Inaccurate: “JSR must implement all npmrc features,” “it replaces your registry config,” or “it fully merges corporate config.” [J2][J3][J5].
- Corporate default plus a new direct @jsr route leaves ordinary npm dependencies on the default feed but sends JSR compatibility packages elsewhere. A preapproved corporate @jsr route in the target npmrc survives; a user-level route or Yarn Berry route needs separate review. [J2][J3][N2].

### Gaps

- No credential/config files on this machine were read. Env interpolation, host/path auth, proxy and CA behavior were not experimentally tested across clients. Exact Yarn config-set target placement in every nested workspace was not audited.

## Which settings remain client features, and what are the real adoption limits?

### Takeaway

Installation inherits supported client features, not full server feature parity. Enterprise policy still needs a working approved upstream or an approved direct route, with every metadata/artifact/transitive/tool-download path accounted for. [J1], [J6], [N2].

### Cited Findings

- **npm:** CLI/environment/project/user/global/built-in precedence, `${VARIABLE}` interpolation, scope routing and host/path-scoped credentials belong to npm. npmrc supports arbitrary keys textually, but that does not make every key meaningful to other clients or to JSR. [N2].
- **pnpm version nuance:** latest npm metadata observed 12.18.0. Current docs say only auth, registry, TLS, proxy and local-address settings are read from npmrc; other settings live in pnpm-workspace.yaml or global config.yaml. Current registries can also be declared in YAML. This is not a separate `.pnpmrc` file, and “pnpm reads every npmrc option” is wrong. User auth can live in auth.ini, with project npmrc and home npmrc also documented. Preserve the separate v10.9 feature floor and current v12 config rules. [Latest metadata](https://registry.npmjs.org/pnpm/latest); [P2][P3][P4].
- **Yarn Classic versus Berry:** Classic source reads project/user/global/ancestor npmrc locations, normalizes and merges them; Berry documentation explicitly ignores npmrc and uses yarnrc.yml. Berry uses npmRegistryServer, npmScopes, npmRegistries and its own auth/network fields rather than npm key spelling. [Y1, lines 257-343]; [Y2]; [Yarn config reference](https://yarnpkg.com/configuration/yarnrc).
- **Bun release 1.4.4:** documented precedence is home npmrc, project npmrc, bunfig global/project, registry/token environment variables, command flags. It documents `${NAME}` interpolation, scoped registries and host/path credential matching. A tarball on another origin does not automatically receive registry credentials. bunfig can override npmrc; “reads npmrc” does not mean npm's entire precedence model. [B2, lines 6-45, 68-140]. This is a release-pinned documentation claim, not a packet capture.
- **Deno:** deno.json and package.json can coexist, with dependencies read from both and Deno-specific settings from deno.json. Current docs describe npmrc support for npm private registries, tokens, mTLS in 2.8, release-age/trust controls and NPM_CONFIG_REGISTRY. Main source at `e7b39ebd55c85aaf6a29290c1f5a99e2e21e09dd` discovers home plus project npmrc next to package.json or, when no package.json is found, deno.json; project fields take precedence. It parses a finite set of keys and interpolates environment variables. None establishes inheritance of all npm CLI config or rerouting native jsr source fetches through npmrc. [D2][D3]; [discovery lines 61-257](https://github.com/denoland/deno/blob/e7b39ebd55c85aaf6a29290c1f5a99e2e21e09dd/libs/resolver/npmrc.rs#L61-L257); [parser lines 179-338](https://github.com/denoland/deno/blob/e7b39ebd55c85aaf6a29290c1f5a99e2e21e09dd/libs/npmrc/lib.rs#L179-L338); [env tests](https://github.com/denoland/deno/blob/e7b39ebd55c85aaf6a29290c1f5a99e2e21e09dd/libs/npmrc/lib.rs#L1227-L1260).
- **Artifacts:** JSR generates transpiled JS, declarations and package.json exports from jsr.json/deno.json(c). New compatibility revisions can change advertised tarball URLs without a semver change. Revision is in the URL and `_jsr_revision`, not the semver. Old URL bytes remain available except version deletion. Yanked versions disappear from version manifests but locked tarballs remain. [J1, lines 162-210].
- **Protocol surfaces:** native `https://jsr.io/@scope/pkg/meta.json`, `/<version>_meta.json`, and `/<version>/<file>` differ from npm metadata `https://npm.jsr.io/@jsr/scope__pkg`. npm metadata supplies dist.tarball, integrity and dependencies. Management API is api.jsr.io, not a substitute install resolver. [J6].
- **Publishing:** compatibility endpoint does not implement npm publish. npm publishConfig does not choose where consumers download dependencies. Released `jsr publish` launches Deno, downloading a binary if DENO_BIN_PATH is unset; Node-package flags include no-check. Native JSR authentication is not npmrc auth. [J1, lines 83-85]; [J2, lines 141-198]; [npm publishConfig](https://docs.npmjs.com/cli/v12/configuring-npm/package-json#publishconfig); [J6].
- **Lockfiles/CI:** npm ci, npm lockfiles, proxy/TLS/cache/offline controls and npm audit requests are npm client behavior. A compatibility package can participate in a normal locked install without JSR implementing npm ci. That does not establish JSR advisory identity coverage, audit endpoints, signatures, staged publishing, or all npm management APIs. Offline still requires every needed artifact and tool in cache. [npm ci](https://docs.npmjs.com/cli/v12/commands/npm-ci); [npm config](https://docs.npmjs.com/cli/v12/using-npm/config); [npm audit](https://docs.npmjs.com/cli/v12/commands/npm-audit); [J1].
- **Enterprise upstream reality:** JSR's docs provide Azure instructions and explicitly flag Artifactory/Google tarball-layout blockers. A direct scoped route is convenient but not equivalent to centralized scanning/caching. [Private registry docs](https://jsr.io/docs/private-registries); [tarball layout issue #405](https://github.com/jsr-io/jsr/issues/405).

### Inferences

- Suggested replacement for earlier npmrc framing: “JSR already uses existing package-manager configuration. What remains is version-specific config compatibility and approved end-to-end routing, not the invention of an npmrc-like feature.” [J1][J2][P2][Y2][B2][D3].
- Suggested updates to existing outlines, not performed: in jsr-enterprise-registries add the helper's preservation/append and Yarn overwrite distinctions; correct the overly narrow JSR_URL description in detailed enterprise notes; in npm-enterprise-capabilities label npm config controls as client capabilities; in package-registry-adoption replace generic config-gap language with explicit alias identity, native manifest portability, tarball revisions, upstream product support and public-egress tests. [J2][J3][J5][J1].
- Suggested acceptance checks: clean-cache locked install through approved feed, all transitives, metadata and tarball routes, allowlisted hosts, scoped auth, CA/proxy handling, no silent public fallback, helper's own info/Yarn-latest fetch, Deno/tool bootstrap and rollback. These are proposed tests, not observed universal failures. [J2][J3][J5][J6].

### Gaps

- Unverified: JSR audit/advisory coverage, signatures and attestations as interpreted by each npm client; complete mirror behavior for all proxy products; private JSR auth across every tool; executed Yarn publication; network retries/redirect credentials; fully offline cold installs; every supported client's precedence at every historical version.
- Distinguish unsupported (npm-compatible endpoint cannot publish, npm parser rejects jsr protocol), documented support (pnpm/Yarn version floors, Bun npmrc), source-derived caveats (substring matching, direct metadata fetch), and unverified (live enterprise deployments). Do not collapse them into “all missing” or “fully compatible.”

[N1]: https://docs.npmjs.com/cli/v12/using-npm/package-spec#aliases
[N2]: https://docs.npmjs.com/cli/v12/configuring-npm/npmrc
[J1]: https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/frontend/docs/npm-compatibility.md
[J2]: https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/commands.ts#L23-L132
[J3]: https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/pkg_manager.ts
[J4]: https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/bin.ts
[J5]: https://github.com/jsr-io/jsr-npm/blob/9e797fbf742ca1dd741be76369a626b8ebfb2ab5/src/api.ts#L5-L73
[J6]: https://github.com/jsr-io/jsr/blob/1624825e0783b6921e99693e10e30ae67b44119b/frontend/docs/api.md
[P1]: https://github.com/pnpm/pnpm/releases/tag/v10.9.0
[P2]: https://pnpm.io/settings
[P3]: https://pnpm.io/npmrc
[P4]: https://pnpm.io/settings/dependency-resolution#registries
[Y1]: https://github.com/yarnpkg/yarn/blob/v1.22.22/src/registries/npm-registry.js#L257-L343
[Y2]: https://yarnpkg.com/migration/guide#update-your-configuration-to-the-new-settings
[Y3]: https://yarnpkg.com/protocol/jsr
[Y4]: https://github.com/yarnpkg/berry/blob/8f638c0806ec8f3758adb13d93567fc782f9c903/packages/plugin-jsr/sources/JsrResolver.ts#L7-L79
[B1]: https://bun.sh/blog/bun-v1.1.18#npmrc-support
[B2]: https://github.com/oven-sh/bun/blob/38afee6c84fcf48c0edb2466aa4b27d287a59c30/docs/pm/npmrc.mdx
[B3]: https://github.com/oven-sh/bun/blob/38afee6c84fcf48c0edb2466aa4b27d287a59c30/src/install/dependency.rs#L1024-L1031
[D1]: https://docs.deno.com/runtime/reference/cli/add/
[D2]: https://docs.deno.com/runtime/fundamentals/configuration/
[D3]: https://docs.deno.com/runtime/fundamentals/node/#private-registries
[R1]: https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/cli/main.rs#L35-L61
[R2]: https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/src/npm_project/mod.rs
[R3]: https://github.com/jsr-io/cli/blob/71a684cac1353db57148e5ecc7221a30ff9b55e0/src/publish/mod.rs#L618-L779
