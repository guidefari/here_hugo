---
title: "Yet another infra migration"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 0
series_index: true
description: The infrastructure journey of goosebumps.fm, from Vercel and AWS via SST to Cloudflare and Alchemy.
tags: [infra, migrations, aws, cloudflare, alchemy, effect, retro]
images: ["https://og.guidefari.com/og-image?title=Vercel+to+Cloudflare"]
---

[Goosebumps.fm](https://goosebumps.fm) started on Vercel. After some self-hosting experiments, I ran it on AWS via SST. It now runs on Cloudflare with Alchemy.

Each move solved a different problem and gave me practice changing a live system and shutting the old setup down safely.

## Before Cloudflare

The first version used Vercel and Next.js. I managed it through the dashboard, with no infrastructure in the repository. I left because I wanted a thinner presentation layer and did not want the application tied to a venture-funded framework. I wrote more about that decision in [Exploring CI/CD options](/ci-cd).

I also tried [Lambda, API Gateway, and Dynamo through CDK](https://github.com/guidefari/goCDK), then a [Coolify-managed VPS](/vps+coolify+custom-domain) running PocketBase. Those experiments clarified what I wanted next.

The [`nextgoose` → `gbfm` rewrite](/gbfm-sst) put the frontend on Vite and React. The backend ran on AWS through SST.

I first kept content as MDX in git. I tried Postgres and Dynamo before settling on PlanetScale Postgres. The backend used Lambda for some API work, then a Bun service on ECS. By mid-2025, I had [removed Lambda and Dynamo](https://github.com/guidefari/gbfm/commit/db0215ec93673a54ee6a2e2943a5dceb87b2fde5).

Auth also changed over time:

- [SST's built-in `sst.aws.Auth` construct](https://github.com/guidefari/gbfm/commit/80c9ba67d0cbe671d8b63e380959cb2ec0b615e6) with a custom handler.
- [OpenAuth on that same SST auth component](https://github.com/guidefari/gbfm/commit/f2524a2e6626df40d6f7155831ecf1d55b7e5796).
- [Custom JWT sessions using `hono/jwt`](https://github.com/guidefari/gbfm/commit/8c78700b627f13764e668cb3f54232ca1a9ecdc6), after I [removed the SST auth infrastructure](https://github.com/guidefari/gbfm/commit/c46392e4e248b7ba00b5610636e5ca2f78d1db79).
- [Better Auth](https://github.com/guidefari/gbfm/commit/0ad61fc595dc80b66f9234997d7a445072d4bef0), which I introduced in December 2025 through a clean-cut migration with automatic user-data migration and no backward compatibility.

Better Auth came before the Cloudflare migration. The later move from PostgreSQL to D1 only changed its Drizzle adapter from `pg` to `sqlite`.

## Why leave AWS via SST?

The site ran on Bun in ECS. AWS provided networking, storage, email, [scheduled work](/gbfm-aws-scheduled-work), and the other services around it. SST made that infrastructure manageable in code and taught me a great deal about AWS.

The system had more parts than the site needed. AWS charged about $335 from August 2025 to July 2026, or about $28 per month. RDS, ECS, and VPC accounted for about 78% of the service charges. The site had too little traffic to justify that cost.

Cloudflare covered roughly 90% of my needs and fit this site better for $5 per month.

SST's Cloudflare support also shaped the decision. I often dropped into Pulumi to use Cloudflare's full capabilities. I wanted to use Cloudflare's model directly.

## The migration

I used a strangler migration. Alchemy provisioned the Cloudflare stack while SST managed the AWS production stack. I then moved one responsibility at a time:

- [Bun/ECS](/gbfm-bun-ecs-runtime) → [Cloudflare Workers](/gbfm-cloudflare-worker-runtime)
- [PlanetScale Postgres](/gbfm-planetscale-postgres) → [D1](/gbfm-cloudflare-d1)
- [S3](/gbfm-s3-storage) → [R2](/gbfm-r2-storage)
- [CloudFront CDN](/gbfm-cloudfront-cdn) → [a Cloudflare Worker routing to R2](/gbfm-cloudflare-cdn-router)
- [SES](/gbfm-ses-email) → [Cloudflare Email Sending](/gbfm-cloudflare-email)
- [process-local work](/gbfm-aws-scheduled-work) → [Queues, Cron Triggers, KV, and Durable Objects](/gbfm-cloudflare-scheduled-work)
- [SST deployment](/gbfm-sst-deployment) → [Alchemy](/gbfm-alchemy-deployment)

I built and tested the new stack beside the old one. I migrated the data and objects, then rehearsed a production snapshot. Once the new system passed its checks, I moved the domains.

## What the platform exposed

The old system relied on behaviour from its Bun process, ECS, and PostgreSQL:

- [PostgreSQL transactions](/gbfm-postgres-transactions) became [D1 batches, simpler operations, or Durable Objects](/gbfm-d1-write-semantics).
- [A database row lock](/gbfm-postgres-navigation-lock) became [a Durable Object](/gbfm-durable-object-navigation-lock).
- [Reminder polling](/gbfm-aws-scheduled-work) became [scheduled Queue work with idempotent claims](/gbfm-cloudflare-scheduled-work).
- [Sitemap state in process memory](/gbfm-process-local-sitemap) moved to [KV](/gbfm-kv-sitemap).
- The [Bun PDF generator, including its filesystem font reads](/gbfm-bun-pdf-generation), became [an API Worker generator that uses a built-in `pdf-lib` font](/gbfm-worker-pdf-boundary).
- [Browser uploads to S3](/gbfm-s3-browser-uploads) became [browser uploads with explicit R2 CORS configuration](/gbfm-r2-browser-uploads).

The [old backend imported a process-wide `db` client and sometimes wrapped it in `DatabaseService`](/gbfm-module-scope-database). The [service refactor introduced the later Effect `Database` service](/gbfm-worker-database-layer), which services requested through Effect's `R` channel.

Workers then exposed a constraint that the old runtime had hidden. The [old backend created a PostgreSQL pool at module scope](/gbfm-module-scope-database):

```ts
const pool = instrumentDatabaseClient(new Pool(dbConfig))
export { pool }
```

That works in a long-lived Bun process. [A Worker only receives bindings such as `env.DB` inside `fetch`](/gbfm-worker-database-layer), so it could not use the same database singleton. The [Worker composition seam](https://github.com/guidefari/gbfm/commit/b566c6333ee286a376b7fd33cb046c4432f8ce0a) made the boundary explicit:

```ts
return AppLayer({
  database: DatabaseLayer(env.DB),
  // ...other request-scoped capabilities
})
```

`DatabaseLayer` turns that binding into the service the rest of the application uses:

```ts
export const DatabaseLayer = (database: D1Database) =>
  Layer.sync(Database, () => drizzle(database, { schema }))
```


## Verification and cutover

For the staging rehearsal, I imported a production snapshot into temporary D1 infrastructure. I checked data integrity, API responses, Worker boot, and readiness. I also tested Durable Object concurrency, scheduled work, bundle size, and CDN behaviour.

The rehearsal found issues that would have mattered in production:

- a uniqueness constraint would have removed 53 real rows;
- [module-scope MDX compilation exceeded the Worker CPU budget](https://github.com/guidefari/gbfm/commit/754779ae1aef3e6b5f0cb45bbfc72f16c3e2cda7);
- SQLite import order broke foreign keys;
- D1 parameter limits required batching;
- PostgreSQL and SQLite returned different shapes and ordering.

I added gates that exercised real user behaviour.

During the cutover, I transferred ownership of domains, buckets, secrets, redirects, email, CI, and deployment checks. DNS resolution wobbled while it settled.

## Teardown matters too

After Alchemy took over, SST still contained resources that Alchemy depended on. During teardown, SST removed DNS records for the website and apex, taking the site down. Redeploying Alchemy restored them.

The plan included a production check for Alchemy. It also needed a check that SST could be removed safely. A stale infrastructure state can still destroy live resources. I now treat teardown as an ownership audit and rehearsal.

## What I would do differently

I would create a live ownership map earlier. Each domain, bucket, secret, database, Worker, and deployment workflow would have one clear owner at every stage.

Before changing a resource, I would define its rollback. I would also run the teardown procedure against a disposable environment much earlier.
