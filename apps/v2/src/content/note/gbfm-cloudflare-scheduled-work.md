---
title: "Scheduled work in the Cloudflare version of Goosebumps.fm"
date: 2026-08-15T00:00:00+02:00
series: gbfm-cloudflare-migration
series_order: 61
description: How Alchemy wires Cloudflare Cron Triggers, Queues, KV, R2, and D1 for Goosebumps.fm.
tags: [infra, cloudflare, alchemy, cron, effect, gbfm]
images: ["https://og.guidefari.com/og-image?title=GBFM+scheduled+work+on+Cloudflare"]
---

Alchemy gives the API Worker its schedules and binds the services each job needs. The [AWS note](/gbfm-aws-scheduled-work) records the jobs that these services replaced.

```ts
crons: [reminderSweepCron, sitemapRegenerationCron, maintenanceSweepCron],
```

```ts
DB: store.db,
USER_CONTENT: store.userContent,
MIXES: store.mixes,
SITEMAP: store.sitemap,
REMINDERS: store.reminders,
```

```ts
yield* Cloudflare.Queues.Consumer('ReminderConsumer', {
  queueId: store.reminders.queueId,
  scriptName: api.workerName
})
```

The schedules live beside the Worker code:

```ts
export const reminderSweepCron = '* * * * *'
export const sitemapRegenerationCron = '0 * * * *'
export const maintenanceSweepCron = '17 * * * *'
```

- **Music reminders.** A Cron Trigger runs every minute and queries D1 for due reminders. The scheduled handler puts one message per reminder on a Cloudflare Queue.

  ```ts
  const enqueueDueReminders = Effect.gen(function* () {
    const dueReminders = yield* queryDueReminders
    const reminderQueue = yield* ReminderQueue

    yield* Effect.forEach(
      dueReminders,
      (reminder) =>
        reminderQueue.enqueue({
          reminderId: reminder.id,
          idempotencyKey: reminder.id,
          dueAt: reminder.reminderDate.getTime()
        }),
      { concurrency: 5 }
    )
  }).pipe(
    Effect.catch((error) => Effect.logError('[worker.scheduled] reminder sweep failed', { error }))
  )
  ```

  The Queue consumer claims each row with a guarded D1 update. A claim can move a `PENDING` or `FAILED` row to `PROCESSING`. A zero-row result tells the consumer that another invocation owns the reminder.

  ```ts
  const claimed = yield* Effect.tryPromise({
    try: () =>
      db
        .update(musicReminder)
        .set({ status: REMINDER_STATUS.PROCESSING, updatedAt: new Date() })
        .where(
          and(
            eq(musicReminder.id, reminderId),
            or(
              eq(musicReminder.status, REMINDER_STATUS.PENDING),
              eq(musicReminder.status, REMINDER_STATUS.FAILED)
            )
          )
        )
        .returning({ id: musicReminder.id }),
    catch: (error) =>
      new ReminderProcessingError({
        message: `Failed to claim reminder: ${getErrorMessage(error)}`,
        reminderId,
        stage: 'query'
      })
  })
  ```

  The consumer sends the email after a successful claim. It acknowledges successful work and asks Cloudflare to retry failures.

  ```ts
  const exit = await Effect.runPromiseExit(processReminderMessage(env, message.body))
  if (exit._tag === 'Success') {
    message.ack()
  } else {
    message.retry()
  }
  ```

- **Sitemap regeneration.** The hourly trigger rebuilds the XML and writes it to KV. Requests can read the same value across Worker isolates. [The KV sitemap note](/gbfm-kv-sitemap) traces the binding, cache service, scheduled write, and request read.

  ```ts
  const sitemap = yield* Cloudflare.KV.Namespace('Sitemap')
  ```

  ```ts
  kv.put(
    SITEMAP_KEY,
    JSON.stringify({ xml: sitemap.xml, generatedAt: sitemap.generatedAt.toISOString() })
  )
  ```

- **Bluesky sync and navigation cleanup.** The trigger at minute 17 runs both jobs inside the API Worker. Each job catches its own errors, which lets the next one run after a failure.

  ```ts
  const runMaintenanceSweep = (env: ApiEnv) =>
    Effect.gen(function* () {
      const retention = yield* NavigationRetentionService
      const report = yield* retention.sweepExpiredAnonymousSessions(new Date())
      yield* Effect.logInfo('[worker.scheduled] navigation retention sweep finished', report)
    }).pipe(
      Effect.catch((error) =>
        Effect.logError('[worker.scheduled] navigation retention sweep failed', { error })
      ),
      Effect.andThen(
        Effect.gen(function* () {
          const sync = yield* BlueskySyncService
          const report = yield* sync.syncScheduled()
          yield* Effect.logInfo('[worker.scheduled] bluesky sync finished', report)
        }).pipe(
          Effect.catch((error) =>
            Effect.logError('[worker.scheduled] bluesky sync failed', { error })
          )
        )
      ),
      Effect.andThen(
        cleanupExpiredQrPdfs.pipe(
          Effect.tap((report) =>
            Effect.logInfo('[worker.scheduled] qr pdf cleanup finished', report)
          ),
          Effect.catch((error) =>
            Effect.logError('[worker.scheduled] qr pdf cleanup failed', { error })
          ),
          Effect.asVoid
        )
      ),
      Effect.provide(appServicesLive(env))
    )
  ```

- **Temporary QR PDFs.** The maintenance trigger lists `qr-pdfs/` objects in R2 and deletes files older than 30 minutes.

  ```ts
  const QR_PDFS_PREFIX = 'qr-pdfs/'
  const MAX_AGE_MS = 30 * 60 * 1000

  const expiredObjects = objects.filter((obj) => now - obj.lastModified.getTime() > MAX_AGE_MS)
  ```

  The maintenance chain calls the cleanup after retention and Bluesky sync. The cleanup catches each object deletion error, allowing the remaining deletes to run.

- **Database recovery.** Alchemy provisions D1 without an application backup task. Cloudflare Time Travel supplies restore points. The migration rehearsal captured a bookmark, wrote a marker row, restored the bookmark, confirmed that the marker had gone, and ran `PRAGMA foreign_key_check`. It found no violations.

## Take aways

- A Cron Trigger should start bounded work. The reminder trigger finds due rows and fills the Queue, while the consumer handles delivery and retries.
- Queue delivery can repeat. The guarded D1 update gives one consumer the claim for a reminder row. Email delivery and the final D1 update remain separate operations, so a provider acceptance followed by an update failure can still produce a second email.
- Shared sitemap state needs storage outside a Worker isolate. KV holds the generated XML, and a missing or unreadable value sends the request through regeneration. The [process-local version](/gbfm-process-local-sitemap) kept its cache in one Bun process.
- The maintenance sweep catches each job's errors. After one job fails, the chain starts the next job.
- R2 cleanup became application work. The sweep lists `qr-pdfs/`, removes objects older than 30 minutes, and catches deletion errors per object.
- Recovery needs a drill. The D1 rehearsal proved the Time Travel bookmark and foreign-key check against the deployed staging database.
