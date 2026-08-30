---
title: "The Cloudflare Worker runtime behind Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 11
description: How Alchemy runs the Goosebumps.fm API through Cloudflare Workers.
tags: [infra, cloudflare, alchemy, workers, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+Cloudflare+Worker+runtime"]
---

Alchemy now runs the Goosebumps.fm API as a Cloudflare Worker. The [Bun and ECS note](/gbfm-bun-ecs-runtime) records the earlier runtime.

## The Worker

[Alchemy provisions the Worker](https://github.com/guidefari/gbfm/blob/prod/alchemy/api.ts) with its schedules and Cloudflare bindings:

```ts
const api = yield* Cloudflare.Worker('Api', {
  main: './apps/server/src/worker.ts',
  ...hostname(config, 'api.goosebumps.fm'),
  compatibility: { date: '2026-07-04', flags: ['nodejs_compat'] },
  crons: [reminderSweepCron, sitemapRegenerationCron, maintenanceSweepCron],
  env: {
    DB: store.db,
    USER_CONTENT: store.userContent,
    MIXES: store.mixes,
    SITEMAP: store.sitemap,
    REMINDERS: store.reminders,
```

The runtime has separate entry points for requests, schedules, and Queue messages. [The Worker code](https://github.com/guidefari/gbfm/blob/prod/apps/server/src/worker.ts) dispatches them here:

```ts
async fetch(request: Request, env: ApiEnv, ctx: ExecutionContext): Promise<Response> {
  return ctx.tracing.enterSpan('gbfm.api.request', async (span) => {
    span.setAttribute('http.request.method', request.method)
    span.setAttribute('url.path', new URL(request.url).pathname)

    const webHandler = createWebHandler({ appServicesLive: appServicesLive(env) })
    try {
      return await webHandler.handler(request)
    } finally {
      await webHandler.dispose()
    }
  })
},
```

The scheduled entry point maps each cron expression to one job:

```ts
scheduled(controller: ScheduledController, env: ApiEnv): Promise<void> {
  return dispatchScheduledJob(controller.cron, {
    regenerateSitemap: () => Effect.runPromise(runSitemapRegeneration(env)),
    sweepReminders: () => Effect.runPromise(runReminderSweep(env)),
    runMaintenance: () => Effect.runPromise(runMaintenanceSweep(env))
  })
},
```

Queue delivery has its own handler, which uses the Effect exit to choose `ack()` or `retry()`.

```ts
async queue(batch: MessageBatch<ReminderJob>, env: ApiEnv): Promise<void> {
  for (const message of batch.messages) {
    const exit = await Effect.runPromiseExit(processReminderMessage(env, message.body))
    if (exit._tag === 'Success') {
      message.ack()
    } else {
      message.retry()
    }
  }
}
```

## Take aways

- Worker bindings arrive with each invocation. `worker.ts` passes them to Effect layers before application code runs.
- Schedules became named Worker entry points. Queue retries now carry reminder delivery across invocations; [the current scheduled-work note](/gbfm-cloudflare-scheduled-work) has the job details.
- The request handler creates and disposes its Effect runtime at the request boundary. Cloudflare owns isolate shutdown.
- The API generates PDFs with a built-in `pdf-lib` font, which removed local font reads. Direct R2 uploads also kept large bodies away from the Worker.

The database binding in this runtime points to D1. [The D1 note](/gbfm-cloudflare-d1) follows that boundary into the data layer.
