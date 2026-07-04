---
title: "goosebumps.fm, Observability"
date: 2026-07-04T10:00:00+02:00
description: how goosebumps.fm wires Sentry, OTel, Pino, and request ID correlation across frontend and backend
tags: [observability, sentry, otel, effect]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=goosebumps.fm%20%E2%80%94%20Observability']
---


How [gbfm](https://github.com/guidefari/gbfm) (goosebumps.fm) wires its observability. Sentry on both ends, OTel for backend traces, Pino for stdout, Effect as the wiring layer. Code is inlined (not linked) so the patterns stay readable as the repo moves.

## What the join looks like in Sentry

When a user hits a 500, Sentry shows:

- The **frontend error** with React stack, route, user ID, breadcrumbs (clicks, navigation, console)
- The **trace**, started in the browser, propagated to the backend via `traceparent`
- The **backend exception** with the same trace ID, the request ID, the handler that failed

One error, three views, all linked. `requestId` is the manual join key, trace ID is the automatic one. See [Correlated logging](/correlated-logging/) for the general pattern.

## Stack

- **Backend**: Hono + Effect + Pino + Sentry (Bun) + OTel
- **Frontend**: React + Sentry (React) + OTel
- **Correlation**: Hono `requestId()` middleware, Sentry scopes, `traceparent` headers

## Backend: middleware chain

The full chain on every request. Order matters: CORS, request ID, favicon, logging, rate limiter.

```ts
// apps/vps/src/lib/create-app.ts
app.use('*', cors(corsConfig))
app.use(requestId())
  .use(serveEmojiFavicon('🪿'))
  .use(effectLogger())
  .use(standardRateLimiter())

app.onError((err, c) => {
  runAppFork(
    Effect.gen(function* () {
      const sentry = yield* SentryService
      yield* sentry.captureException(err, {
        path: c.req.path,
        method: c.req.method,
        requestId: c.get('requestId')
      })
    })
  )
  return onError(err, c)
})
```

`requestId()` middleware sets the ID, `c.get('requestId')` retrieves it, the Sentry call carries it. Every backend error in Sentry has a `requestId` extra that joins to the frontend via `traceparent` propagation. One error, two reports, one ID.

## Backend: logger (Pino + Sentry dual sink)

Every `Effect.log*` call ends up in BOTH Pino (stdout or file) and Sentry's structured logs:

```ts
// apps/vps/src/services/logger.service.ts
export const AppLogger = Logger.make(({ logLevel, message, cause, fiber, date }) => {
  const msg = formatMessage(message)
  const data = redactValue({ cause, fiberId: fiber.id, date })
  const payload = { ...(isRecord(data) ? data : {}), logLevel }

  pinoInstance[pinoLevel(logLevel)](payload, msg)

  if (!Sentry.getClient()) return

  const sentryLogger = Sentry.logger
  switch (logLevel) {
    case 'Trace':
    case 'Debug': sentryLogger.debug(msg, payload); break
    case 'Info':   sentryLogger.info(msg, payload); break
    case 'Warn':   sentryLogger.warn(msg, payload); break
    case 'Error':
    case 'Fatal':  sentryLogger.error(msg, payload); break
    default:       sentryLogger.info(msg, payload)
  }
})
```

Two sinks, one switch on `logLevel`. Pino uses string levels, Sentry its own enum, Effect its own. The `pinoLevel` helper does the same mapping for Pino.

Pino itself has a redaction list, so secrets never reach stdout or Sentry:

```ts
const REDACT_PATHS = [
  'password', 'token', 'authorization', 'cookie', 'email',
  '*.password', '*.token', '*.authorization', '*.cookie', '*.email',
  'req.headers.authorization', 'req.headers.cookie',
  'accessToken', 'refreshToken', 'spotifyAccessToken', 'betterAuthSession'
]
const pinoInstance = pino({
  level: config.app.logLevel || defaultLevel,
  redact: { paths: REDACT_PATHS, censor: '[Redacted]' }
}, config.app.nodeEnv === 'production' ? undefined : pretty())
```

Redaction at the logger, not in the caller. Same rule as [Log quality & hygiene](/bootdev-observability-log-quality/).

## Backend: OTel spans + perf monitoring

Each request runs inside an active OTel span. The span is named after the matched route, so transaction aggregates work:

```ts
// apps/vps/src/middlewares/effect-logger.ts
const tracer = trace.getTracer('gbfm.vps')
const spanName = `${c.req.method} ${c.req.path}`

const loggingEffect = Effect.gen(function* () {
  yield* Effect.tryPromise({
    try: () =>
      tracer.startActiveSpan(spanName, async (span) => {
        try {
          await next()
        } catch (error) {
          span.recordException(error)
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
          throw error
        } finally {
          const routePattern = Reflect.get(c.req, 'routePath') ?? c.req.path
          span.updateName(`${c.req.method} ${routePattern}`)
          span.setAttribute('http.method', c.req.method)
          span.setAttribute('http.route', routePattern)
          span.setAttribute('http.status_code', c.res.status)
          span.setAttribute('http.duration_ms', Date.now() - start)
          span.end()
        }
      })
  })

  const performanceEffects = [
    duration > VERY_SLOW_REQUEST_THRESHOLD
      ? Effect.logError('[Performance] Very slow request detected', { /* fields */ })
      : duration > SLOW_REQUEST_THRESHOLD
        ? Effect.logWarning('[Performance] Slow request detected', { /* fields */ })
        : Effect.void,
    recordRequest(duration, c.res.status >= 400),
    checkPerformanceHealth,
    Effect.log(`[INFO] ${c.req.method} ${c.req.path} ${c.res.status} - ${duration}ms`)
  ]

  yield* Effect.all(performanceEffects, { concurrency: 'unbounded' })
})
```

Two patterns:

- **Route pattern, not URL**. `c.req.path` for individual requests, `c.req.routePath` for aggregation. `/content/posts/foo` and `/content/posts/bar` both surface as `/content/posts/:slug` in the trace list
- **Slow-request logs as parallel effects**. The performance effects run via `Effect.all(..., { concurrency: 'unbounded' })`, separate from the main flow. 500ms threshold logs a warning, 2s logs an error, same fields both times. Lets you alert on "very slow" without instrumenting each handler

## Frontend: Sentry init

The interesting parts are `tracePropagationTargets` and the `beforeSend` filter:

```ts
// apps/www/src/main.tsx
const tracePropagationTargets = env.isDev
  ? [/^\//, 'http://127.0.0.1:3003', 'http://localhost:3003']
  : [/^\//, 'https://goosebumps.fm', 'https://www.goosebumps.fm', 'https://vps.goosebumps.fm']

Sentry.init({
  dsn: env.sentryDsn,
  environment: env.sentryEnvironment ?? (env.isDev ? 'development' : 'production'),
  release: env.sentryRelease,
  debug: env.isDev,
  enableLogs: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: env.isDev ? 0 : 1.0,
  sendDefaultPii: false,
  beforeSend: (event) => (hasLocalUrl(event) ? null : event),
  beforeSendTransaction: (event) => (hasLocalUrl(event) ? null : event)
})
```

- `tracePropagationTargets` lists the backend origin. Without it, Sentry doesn't attach `sentry-trace` and `baggage` headers to fetch calls, so the backend gets a fresh trace context and the join is lost
- `beforeSend` and `beforeSendTransaction` drop events with local URLs in dev. Otherwise dev reloads spam Sentry with localhost transactions
- `replaysOnErrorSampleRate: 1.0` in prod. On error, full replay. `replaysSessionSampleRate: 0` (no baseline replays, those are expensive)
