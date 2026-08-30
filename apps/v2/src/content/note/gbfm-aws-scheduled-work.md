---
title: "Scheduled work in the AWS version of Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 60
description: The timers, loops, ECS tasks, and S3 lifecycle rules that ran behind Goosebumps.fm on AWS.
tags: [infra, aws, sst, cron, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+scheduled+work"]
---

The AWS version of [Goosebumps.fm](https://goosebumps.fm) used Bun loops and an SST cron. S3 lifecycle rules handled timed cleanup. [The Cloudflare version](/gbfm-cloudflare-scheduled-work) shows where each job runs now.

- **Music reminders.** The Bun process looked up the next due reminder and slept until that time. A new or changed reminder could wake it early. A five-minute recovery timer retried stalled work and handled reminders that another process created.

  ```ts
  const nextDate = yield* queryNextDueReminder.pipe(Effect.catch(() => Effect.succeed(null)))

  const msUntilNext = nextDate ? Math.max(0, nextDate.getTime() - Date.now()) : RECOVERY_INTERVAL_MS
  const sleepMs = Math.min(msUntilNext, RECOVERY_INTERVAL_MS)

  yield* Effect.race(Effect.sleep(Duration.millis(sleepMs)), awaitSignal)
  yield* processPendingReminders
  ```

- **Sitemap regeneration.** Another Effect fiber rebuilt the sitemap once an hour and kept the result in process memory. [The process-local sitemap note](/gbfm-process-local-sitemap) follows this path through the old code.

  ```ts
  const sitemapRegenerationEffect = Effect.gen(function* () {
    // Sentry check-in setup omitted
    yield* regenerateSitemap
  }).pipe(
    // Error handling omitted
    Effect.repeat(Schedule.spaced('1 hours'))
  )
  ```

  The ECS entry point started both fibers with the HTTP server:

  ```ts
  runAppFork(reminderLoopEffect)
  runAppFork(sitemapRegenerationEffect)
  ```

- **Bluesky sync and navigation cleanup.** SST launched an ECS task every hour. The task removed expired anonymous navigation sessions, then synced each Bluesky account whose owner had enabled scheduled sync.

  ```ts
  export const blueskySyncCron = new sst.aws.CronV2('BlueskySyncCron', {
    task: scheduledMaintenanceTask,
    schedule: 'rate(1 hour)',
    retries: 0
  })
  ```

  ```ts
  const retentionExit = yield* Effect.exit(retentionSweep)
  const syncExit = yield* Effect.exit(blueskySync)
  ```

- **Temporary QR PDFs.** S3 expired objects under `qr-pdfs/` after one day.

  ```ts
  new aws.s3.BucketLifecycleConfiguration('QrPdfLifecycle', {
    bucket: contentBucket.name,
    rules: [
      {
        id: 'expire-qr-pdfs',
        status: 'Enabled',
        filter: { prefix: 'qr-pdfs/' },
        expiration: { days: 1 }
      }
    ]
  })
  ```

Earlier, AWS ran a database backup task at 02:00 UTC. I moved backup ownership to PlanetScale and removed that task before the Cloudflare cutover.

```ts
export const dbBackupCron = new sst.aws.CronV2('DatabaseBackupCron', {
  task: dbBackupTask,
  schedule: 'cron(0 2 * * ? *)'
})
```

## Take aways

- A process loop owns time only while its process stays alive. The five-minute reminder timer capped delay after a missed signal, while the process still owned the polling loop.
- Process memory gave one ECS process a fast sitemap cache. Another process could hold a different value, and a restart began with an empty cache. The [KV version](/gbfm-kv-sitemap) gives every Worker isolate access to the same stored XML.
- The hourly ECS task let the retention sweep finish or fail before Bluesky sync ran. The Worker kept that order and catches each error inside the maintenance sweep.
- S3 expired a prefix through a lifecycle rule. The current Worker lists objects under `qr-pdfs/` and applies a 30-minute age limit in code.
- Backup ownership had already moved once before the Cloudflare work began. The migration inventory needed dates as well as resource names, since the repository contained jobs that production no longer ran.
