---
title: "Deploying Goosebumps.fm with Alchemy"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 71
description: How Alchemy owns the Cloudflare stack and how the release workflow checks production traffic.
tags: [infra, cloudflare, alchemy, deployment, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+deployment+with+Alchemy"]
---

The Alchemy stack declares the Cloudflare provider and stores state in Cloudflare.

```ts
export default Alchemy.Stack(
  'gbfm',
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state()
  },
  Effect.gen(function* () {
    const config = yield* stageConfig
    const deployment = yield* deploymentConfig(config.isLocalDev)
```

The generator continues with each resource.

One composition path owns secrets, email, D1, R2, KV, Queues, the CDN Worker, DNS redirects, the API Worker, and the website. Resource outputs flow into later constructors as typed values.

```ts
const email = yield* emailResources(config, emailConfig)
const store = yield* storage(config)
const cdn = yield* cdnRouter(config, store)
const api = yield* apiWorker({
  config,
  store,
  secrets,
  email,
  emailConfig,
  cdn,
  adminEmail: deployment.adminEmail
})

yield* dnsRedirects(config)
```

Existing resources use an explicit adoption policy. Production adopts the Cloudflare zone before Alchemy manages its redirect rules.

```ts
const zone = yield* Cloudflare.Zone.Zone('Zone', { name: 'goosebumps.fm' }).pipe(adopt(true))
```

Alchemy also adopts the D1 database during local development and reads its production name through `stackRef`. These choices keep resource ownership visible where the resource enters the stack.

The API constructor receives the resources it binds. Application services get Worker bindings through `env`; deployment state stays in Alchemy.

The release workflow runs lint, type checks, tests, and the website build before it starts the Alchemy workflow. The deploy job checks every required secret first. Alchemy patches a stored secret when its value changes, so an empty GitHub variable could otherwise replace a working Cloudflare secret.

```sh
missing=""
for name in $REQUIRED; do
  [ -n "${!name:-}" ] || missing="$missing $name"
done
if [ -n "$missing" ]; then
  echo "Missing repository secrets for:$missing" >&2
  exit 1
fi
```

Production uses one explicit stage and profile.

```sh
bunx alchemy deploy --stage prod --profile env-token --yes
```

The workflow probes the API health and shows endpoints, a known CDN object, the website, and the apex RSS redirect. Each probe retries five times because `/health` caches readiness for five seconds.

```sh
check https://api.goosebumps.fm/health 200
check https://api.goosebumps.fm/api/shows 200
check https://cdn.goosebumps.fm/mixes/gb52.mp3 200
check https://www.goosebumps.fm/ 200
check https://goosebumps.fm/rss.xml 301
```

These checks test the Cloudflare paths that the stack now owns. They no longer query ECS task state. The old Sentry span assertion has not moved to this workflow, so production deploys have less telemetry proof than the SST gate supplied.

Alchemy also provided the recovery command during the SST teardown outage. A production deploy reconciled the custom domains after SST deleted the apex and `www` records. That recovery showed why one tool must own each live resource before the former owner removes its state. It also exposed an environment-name mismatch: Alchemy reads `CLOUDFLARE_ACCOUNT_ID`, while the teardown shell had exported `CLOUDFLARE_DEFAULT_ACCOUNT_ID`.

Read [the SST deployment](/gbfm-sst-deployment) for its links, state, checks, and teardown fault.
