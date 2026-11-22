---
title: "JSR codebases and open-source status"
description: "Supporting evidence for the Cloudflare and npm research pack. Findings, inferences, and gaps as of 8 November 2026."
date: "2026-11-08"
tags: ["cloudflare","npm","source-notes"]
draft: false
parent: "cloudflare-npm"
---

## Is JSR open source, and where is the code?

### Takeaway

Yes. JSR's registry application is open source under MIT, including its backend, frontend, edge routing, and public deployment configurations, not merely a client SDK. The hosted jsr.io service and its third-party infrastructure are not themselves a wholly open-source, independently reproducible service. [Official FAQ](https://jsr.io/docs/faq#is-jsr-open-source); [repository LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE); [architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md).

### Cited Findings

Checked November 8, 2026. Links below point to the branches inspected on that date, not immutable archival snapshots.

| Codebase | What it contains or does | License verified from file |
| --- | --- | --- |
| [jsr-io/jsr](https://github.com/jsr-io/jsr) | Main registry monorepo. The README explicitly identifies it as the source for jsr.io. | [MIT, copyright 2024 the JSR authors](https://github.com/jsr-io/jsr/blob/main/LICENSE) |
| [api/](https://github.com/jsr-io/jsr/tree/main/api) | Rust management API, authentication, publishing pipeline, npm-compatible tarball generation, database migrations, documentation integration, administration. | Covered by root [MIT LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE) |
| [frontend/](https://github.com/jsr-io/jsr/tree/main/frontend) | Fresh/Deno/Preact website, user and admin interfaces, and [registry documentation](https://github.com/jsr-io/jsr/tree/main/frontend/docs). Current architecture deploys it as a Cloudflare Worker. | Root [MIT LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE) |
| [lb/](https://github.com/jsr-io/jsr/tree/main/lb) | Cloudflare Worker edge router for the frontend, API, package files, and npm tarballs. | Root [MIT LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE) |
| [terraform/](https://github.com/jsr-io/jsr/tree/main/terraform), [terraform_infra/](https://github.com/jsr-io/jsr/tree/main/terraform_infra), [CI/deployment workflow](https://github.com/jsr-io/jsr/blob/main/.github/workflows/ci.yml) | Application/cloud infrastructure and CI service accounts, OIDC and artifact registry setup; workflow includes Terraform planning and application. These are public configuration, not access to the actual cloud accounts or secrets. | Root [MIT LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE) |
| [jsr-io/cli](https://github.com/jsr-io/cli) | Rust JSR CLI: publishing, packing, adding/removing npm-project dependencies, package information and scripts. Includes the npm wrapper that downloads and runs its binary. Its README documents `JSR_URL` for another publishing registry. | [MIT, copyright 2018-2026 the Deno authors](https://github.com/jsr-io/cli/blob/main/LICENSE.md) |
| [jsr-io/jsr-npm](https://github.com/jsr-io/jsr-npm) | Separate TypeScript npm-facing CLI repository, with add/remove/publish/run commands and npm alias configuration. Do not omit it when giving the source links, but do not assume it and the newer Rust CLI are the same codebase. | [MIT, copyright 2024 the JSR authors](https://github.com/jsr-io/jsr-npm/blob/main/LICENSE.md) |
| [denoland/deno](https://github.com/denoland/deno) | Deno runtime/CLI, including the native `deno publish` publishing route documented by JSR. | [MIT](https://github.com/denoland/deno/blob/main/LICENSE.md) |
| [denoland/deno_doc](https://github.com/denoland/deno_doc) | JavaScript/TypeScript documentation generator. JSR explicitly directs documentation-generation contributions here; integration-specific changes stay in JSR. | [MIT](https://github.com/denoland/deno_doc/blob/main/LICENSE) |
| [denoland/deno_ast](https://github.com/denoland/deno_ast), [denoland/deno_graph](https://github.com/denoland/deno_graph) | Parsing/transformation and dependency analysis used by the API alongside deno_doc. | [deno_ast MIT](https://github.com/denoland/deno_ast/blob/main/LICENSE); [deno_graph MIT](https://github.com/denoland/deno_graph/blob/main/LICENSE) |
| [freshframework/fresh](https://github.com/freshframework/fresh) | Frontend framework, formerly reachable as denoland/fresh. | [MIT](https://github.com/freshframework/fresh/blob/main/LICENSE) |

- Official-source identity is independently corroborated: the [live JSR introduction](https://jsr.io/docs/introduction) links its GitHub footer and edit-page link to jsr-io/jsr; the [GitHub organization API](https://api.github.com/orgs/jsr-io/repos?per_page=100) lists public jsr, jsr-npm and cli repositories. The [JSR README](https://github.com/jsr-io/jsr/blob/main/README.md) explicitly says it is the source for https://jsr.io.
- Backend/framework roles above are documented in [architecture.md](https://github.com/jsr-io/jsr/blob/main/architecture.md), the [API dependency manifest](https://github.com/jsr-io/jsr/blob/main/api/Cargo.toml), the [frontend manifest](https://github.com/jsr-io/jsr/blob/main/frontend/deno.json), the [Rust CLI README](https://github.com/jsr-io/cli/blob/main/README.md), and the [TypeScript CLI README](https://github.com/jsr-io/jsr-npm/blob/main/README.md).
- Do not label the registry AGPL or Apache-2.0: its actual [LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE) is MIT. Local development uses MinIO, whose separate [LICENSE](https://github.com/minio/minio/blob/master/LICENSE) is GNU AGPL version 3. Jaeger, the local tracing service, has an [Apache-2.0 LICENSE](https://github.com/jaegertracing/jaeger/blob/main/LICENSE). These dependency licenses are not the license of JSR itself. [Local architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md#local-development); [dev orchestrator](https://github.com/jsr-io/jsr/blob/main/tools/dev.ts).
- Cloudflare's [workerd](https://github.com/cloudflare/workerd) runtime is [Apache-2.0](https://github.com/cloudflare/workerd/blob/main/LICENSE). That does not make the hosted Workers platform, R2 service or Cloudflare account configuration open source, and JSR's documented local stack uses Deno for its local load balancer rather than documenting a complete workerd-based production replacement. [JSR architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md).
- MIT permits use, modification, redistribution, sublicensing and sale while retaining its copyright and permission notice. It does not impose AGPL-style publication of hosted modifications. Apache-2.0 and AGPL have different obligations; preserve each dependency's actual license rather than describing the entire deployment as uniformly MIT. [JSR MIT terms](https://github.com/jsr-io/jsr/blob/main/LICENSE); [Apache terms](https://github.com/cloudflare/workerd/blob/main/LICENSE); [AGPL terms](https://github.com/minio/minio/blob/master/LICENSE).

### Inferences

- Calling JSR an "open-source registry" is justified, and "only the client is open source" would be wrong. Calling every aspect of the production service open source would be too broad: application source, external managed services, production state and operational credentials are different things. [README](https://github.com/jsr-io/jsr/blob/main/README.md); [architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md); [Terraform variables](https://github.com/jsr-io/jsr/blob/main/terraform/variables.tf).

### Gaps

- This is not an exhaustive license audit of every transitive crate, npm package, bundled asset or dependency version. Root MIT does not relicense third-party components. [Dependency manifest](https://github.com/jsr-io/jsr/blob/main/api/Cargo.toml).
- The newer Rust CLI repository's README describes npm delivery, but this research did not independently establish which implementation every released npm `jsr` version uses. Give both CLI source links instead of claiming an unverified universal migration. [Rust CLI README](https://github.com/jsr-io/cli/blob/main/README.md); [TypeScript CLI README](https://github.com/jsr-io/jsr-npm/blob/main/README.md).

## Can it actually be self-hosted, and what is documented?

### Takeaway

A runnable independent local registry is explicitly documented, including publishing to it. Production self-hosting is legally possible and supported by public architecture and deployment code, but the inspected docs are contributor/local-development instructions plus JSR's cloud configurations, not a turnkey, provider-independent production hosting guide. [README, entire-stack setup](https://github.com/jsr-io/jsr/blob/main/README.md#getting-started-entire-stack); [infrastructure architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md#infrastructure); [MIT license](https://github.com/jsr-io/jsr/blob/main/LICENSE).

### Cited Findings

- Entire-stack prerequisites are Deno, Rust, PostgreSQL, sqlx and, on Linux, Docker/Compose. Non-employees are explicitly given a setup route: create a GitHub App with the documented callback and permissions, copy `api/.env.example`, and configure local database and OAuth values. Setup is `deno task dev setup`; start with `deno task dev`; publish with `JSR_URL=http://jsr.test deno publish`. These are quotations of documented instructions, not commands executed in this research. [README](https://github.com/jsr-io/jsr/blob/main/README.md#getting-started-entire-stack).
- Local development runs PostgreSQL, MinIO in place of R2, Jaeger tracing, local routing, Rust API and Fresh frontend. The [environment template](https://github.com/jsr-io/jsr/blob/main/api/.env.example) explicitly configures a localhost S3 endpoint. [Architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md#local-development); [dev orchestrator](https://github.com/jsr-io/jsr/blob/main/tools/dev.ts).
- Warning: the separate frontend-only workflow connects to the production API. It is not an isolated self-hosted instance, and the README explicitly says to use the same care as the live registry. [README frontend-only setup](https://github.com/jsr-io/jsr/blob/main/README.md#getting-started-frontend-only).
- Production architecture uses Cloudflare Workers and R2, Google Cloud Run, Google Cloud SQL, Cloud Tasks, BigQuery and Algolia; it also integrates Postmark email. These are external hosted services, not services whose full implementations are supplied by the MIT registry repository. [Architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md); [Terraform providers](https://github.com/jsr-io/jsr/blob/main/terraform/providers.tf).
- The checked-in production variables specify a Grafana Cloud OTLP endpoint. The README and architecture still mention Google Cloud Trace; therefore describe Google Cloud Trace as documented architecture, not an exclusively verified current tracing destination. The actual config permits optional generic OTLP export. [Production variables](https://github.com/jsr-io/jsr/blob/main/terraform/prod.tfvars); [config](https://github.com/jsr-io/jsr/blob/main/api/src/config.rs); [README](https://github.com/jsr-io/jsr/blob/main/README.md).
- Search indexing keys, Postmark integration, Cloudflare analytics/cache-purge configuration, Turnstile CAPTCHA, telemetry and background queue IDs are optional configuration fields. That supports local operation without every production integration, not a claim that every production feature has an included self-hosted substitute. The documented login path still requires an external GitHub App. [API config](https://github.com/jsr-io/jsr/blob/main/api/src/config.rs); [README](https://github.com/jsr-io/jsr/blob/main/README.md).
- `FALLBACK_REGISTRY_URL` is explicitly documented in code as allowing self-hosted instances to resolve dependencies from jsr.io or other instances. The Rust CLI also documents `JSR_URL` for selecting a publishing registry. [API config](https://github.com/jsr-io/jsr/blob/main/api/src/config.rs); [CLI README](https://github.com/jsr-io/cli/blob/main/README.md#environment-variables).
- Some operational steps are explicitly dashboard-managed rather than covered by Terraform, including the Postmark inbound webhook and Cloudflare Workers observability destinations. Accounts, OAuth credentials, email credentials, domain ownership and cloud provisioning must still be supplied by the operator. [Architecture, support tickets](https://github.com/jsr-io/jsr/blob/main/architecture.md#support-tickets); [Terraform variables](https://github.com/jsr-io/jsr/blob/main/terraform/variables.tf).
- The public "Private registries" document is about integrating JSR as an upstream of npm private registries. It explicitly says JSR does not currently provide private-package functionality. It is not a private JSR hosting manual. [Private registries docs](https://jsr.io/docs/private-registries).

### Inferences

- Best phrasing: "You can run your own JSR instance, and the project documents a full local stack. Running a production equivalent requires operating/adapting the public infrastructure configuration and supplying external services or replacements." Avoid both "impossible to self-host" and "one-click, entirely self-contained production replacement." [README](https://github.com/jsr-io/jsr/blob/main/README.md); [architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md).

### Gaps

- No independent deployment was performed. The inspected materials do not establish a supported provider-neutral production distribution, Helm chart, SLA for self-hosters, or a fully feature-equivalent air-gapped installation. This is a limitation of what was verified, not proof that none exists elsewhere. [Inspected setup documentation](https://github.com/jsr-io/jsr/blob/main/README.md).

## What does openness not transfer: packages, service state and control?

### Takeaway

MIT covers the registry software, not ownership or administrative control of jsr.io's production accounts, package namespaces or user database. Packages retain their own specified licenses, and service access and scope administration remain subject to the hosted registry's rules. Open-source code alone also does not establish independent governance. [Registry LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE); [package licensing](https://jsr.io/docs/licenses); [usage policy](https://jsr.io/docs/usage-policy); [scopes](https://jsr.io/docs/scopes).

### Cited Findings

- Every package must supply its own license, through a configuration SPDX field or recognized license file. Registry MIT is not a blanket MIT grant for packages hosted on JSR. The long list of package licenses, including AGPL and Apache, should not be mistaken for the registry's own license. [Package license docs](https://jsr.io/docs/licenses); [registry LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE).
- User accounts, OAuth authorizations, scopes, scope membership, package records, audit logs and support records are database tables; package source and generated artifacts are held separately in object storage. The existence of public software schemas is not a grant to access or administer those production records. [Architecture database/storage descriptions](https://github.com/jsr-io/jsr/blob/main/architecture.md#database); [MIT grant limited to Software](https://github.com/jsr-io/jsr/blob/main/LICENSE).
- In-product scope administration is shared among one or more admins, not necessarily a single "owner." The service's scopes docs explicitly say scopes have no single owner. Scope admins and members have different publishing/deletion/invitation privileges. [Scopes](https://jsr.io/docs/scopes).
- Service operators reserve the right to suspend accounts, disallow namespace squatting and selling, and reclaim scopes that violate copyright/trademark or other laws. A fork of MIT software is therefore not a grant to control or keep the same namespace on jsr.io. [Usage policy](https://jsr.io/docs/usage-policy).
- The registry FAQ states that Deno Company currently pays hosting bills and describes future funding possibilities. That statement is about funding and operations, not a consequence of the MIT license; board affiliations and governance independence are intentionally left to the parallel governance research. [FAQ](https://jsr.io/docs/faq#how-is-jsr-funded-do-i-have-to-pay-for-jsr); [MIT license](https://github.com/jsr-io/jsr/blob/main/LICENSE).

### Inferences

- Forkability reduces dependence on a unique implementation, but does not automatically transfer the live domain, accounts, namespace allocation, production database, provider contracts, service reputation or operator decisions. Do not equate "open source" with "independently governed," "all production data is open," or "anyone can take over jsr.io." [MIT scope](https://github.com/jsr-io/jsr/blob/main/LICENSE); [infrastructure and data architecture](https://github.com/jsr-io/jsr/blob/main/architecture.md); [usage policy](https://jsr.io/docs/usage-policy).

### Gaps

- This research does not determine legal title to every production asset or copyright assignment. The sources establish software licensing, documented technical operation and service-level administrative rules, not complete contractual ownership of the live service. Board membership/affiliation and formal governance are outside this assignment. [LICENSE](https://github.com/jsr-io/jsr/blob/main/LICENSE); [usage policy](https://jsr.io/docs/usage-policy).
