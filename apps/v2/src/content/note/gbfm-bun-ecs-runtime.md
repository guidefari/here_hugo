---
title: "The Bun and ECS runtime behind Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 10
description: How SST ran the Goosebumps.fm Bun server on ECS before the Cloudflare move.
tags: [infra, aws, sst, bun, ecs, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Bun+and+ECS+runtime"]
---

Before the Cloudflare cutover, SST created an ECS service for the Goosebumps.fm Bun backend. The [Cloudflare Worker note](/gbfm-cloudflare-worker-runtime) shows the runtime that replaced it.

## The service

SST put the service in a cluster and built its image from `apps/vps/Dockerfile`. API Gateway reached it through Cloud Map. [The old infrastructure file](https://github.com/guidefari/gbfm/blob/63fdbb1fe5494ac549bfe2200df3256928ae7903/infra/vps.ts) contained this setup:

```ts
export const service = new sst.aws.Service('gbfm_vps', {
  cluster,
  serviceRegistry: {
    port: 3003
  },
  dev: {
    directory: './apps/vps',
    command: 'bun dev'
  },
  image: {
    context: './',
    target: 'release',
    dockerfile: 'apps/vps/Dockerfile'
  },
  environment: {
    SENTRY_RELEASE: process.env.SENTRY_RELEASE ?? ''
  },
  link: [
    // database,
    email,
    urls,
    fileRouter,
    contentBucket,
    mixesBucket,
    ...allSecrets
  ],
  capacity: 'spot'
})
```

Bun owned the HTTP listener. The entry point allowed request bodies up to 1 GB:

```ts
export default {
  port: localVPSPort,
  hostname: localVPSHostname,
  fetch: effectWebHandler.handler,
  maxRequestBodySize: 1024 * 1024 * 1000 // 1GB
}
```

## Work tied to the process

The same process started the reminder and sitemap fibers during boot:

```ts
runAppFork(reminderLoopEffect)
runAppFork(sitemapRegenerationEffect)
```

It also listened for process signals and disposed the web handler before exit:

```ts
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
```

The [AWS scheduled-work note](/gbfm-aws-scheduled-work) covers those loops and the separate hourly ECS task.

## Take aways

- One process held the HTTP server, timers, and sitemap memory. An ECS restart started fresh fibers and cleared that state.
- Large request support came from Bun and the service configuration. The later upload path sent bytes from the browser to object storage, which reduced the API runtime's job.
- Spot capacity suited the site's traffic. The stack brought a VPC, cluster, service registry, gateway, image build, and shutdown path.
- I kept this stack running through the migration rehearsal. DNS supplied the cutover point. ECS remained available for rollback.
