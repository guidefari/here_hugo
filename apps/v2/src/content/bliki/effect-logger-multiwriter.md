---
title: "Effect Logger Multi-Writer"
date: 2026-06-27T10:00:00+02:00
description: "how I do multi-writer logging in effect: Logger.zip, Logger.layer([...]), and the scoped file logger"
tags: [effect, observability]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Effect%20Logger%20Multi-Writer']
---


Effect equivalents of Go's `slog.NewMultiHandler` plus the scoped file logger pattern. The Go `slog.NewMultiHandler` and `defer closeFunc()` versions are in [Foundations](/bootdev-observability-foundations/).

## Pattern 1: `Logger.zip`

Direct `slog.NewMultiHandler` equivalent. Each logger fires for every log line.

```ts
// effect-utils/packages/@overeng/tui-react/src/effect/TuiLogger.ts:187-196
const layer = logToConsole === true
  ? Layer.merge(
      Logger.replace(Logger.defaultLogger, Logger.zip(Logger.defaultLogger, tuiLogger)),
      Logger.minimumLogLevel(minLevel),
    )
  : Layer.merge(
      Logger.replace(Logger.defaultLogger, tuiLogger),
      Logger.minimumLogLevel(minLevel),
    )
```

[View on GitHub](https://github.com/overengineeringstudio/effect-utils/blob/d10748d4df93af71778ddd71004ab176ae3676e2/packages/@overeng/tui-react/src/effect/TuiLogger.ts#L187-L196)

`Logger.zip(defaultLogger, tuiLogger)` ↔ `slog.New(slog.NewMultiHandler(handlerA, handlerB))`. Output type is the zip of the two output types. Both loggers receive every message.

## Pattern 2: `Logger.layer([...])`

Array-form API. `mergeWithExisting: false` replaces the default logger entirely instead of appending.

```ts
// t3code/apps/server/src/serverLogger.ts:8-16
export const ServerLoggerLive = Effect.gen(function* () {
  const config = yield* ServerConfig;
  const minimumLogLevelLayer = Layer.succeed(References.MinimumLogLevel, config.logLevel);
  const loggerLayer = Logger.layer([Logger.consolePretty(), Logger.tracerLogger], {
    mergeWithExisting: false,
  });

  return Layer.mergeAll(loggerLayer, minimumLogLevelLayer);
}).pipe(Layer.unwrap);
```

[View on GitHub](https://github.com/pingdotgg/t3code/blob/b3e8c0334b25238e2b55868a87bd6270e234b7de/apps/server/src/serverLogger.ts#L8-L16)

## Pattern 3: Scoped file logger with `acquireRelease`

Go `closeFunc` pattern, but structured by the Layer's scope. File handle is opened, attached to the logger, closed on Layer finalization.

```ts
// effect-utils/packages/@overeng/utils/src/node/FileLogger.ts:56-76
export const makeFileLogger = ({ logFilePath, threadName, colors }: MakeFileLoggerOptions) =>
  Layer.unwrapScoped(
    Effect.gen(function* () {
      yield* Effect.sync(() => fs.mkdirSync(path.dirname(logFilePath), { recursive: true }))

      const logFile = yield* Effect.acquireRelease(
        Effect.sync(() => fs.openSync(logFilePath, 'a', 0o666)),
        (fd) => Effect.sync(() => fs.closeSync(fd)),
      )

      return Logger.replace(
        Logger.defaultLogger,
        prettyLoggerTty({
          colors: colors ?? false,
          stderr: false,
          formatDate: (date) => `${defaultDateFormat(date)} ${threadName ?? ''}`,
          onLog: (str) => fs.writeSync(logFile, str),
        }),
      )
    }),
  )
```

[View on GitHub](https://github.com/overengineeringstudio/effect-utils/blob/d10748d4df93af71778ddd71004ab176ae3676e2/packages/@overeng/utils/src/node/FileLogger.ts#L56-L76)

`Effect.acquireRelease` ties cleanup to the Layer's scope. Combine with `Logger.zip` (or `Logger.layer([...])`) when you want console + file:

```ts
const fileLogger = makeFileLogger({ logFilePath: '/var/log/app.log' });
const consoleLogger = Logger.replace(Logger.defaultLogger, Logger.prettyLogger());

yield* myProgram.pipe(Effect.provide(Logger.zip(consoleLogger, fileLogger)));
```

## When to use which

| Pattern | Reach for it when |
| --- | --- |
| `Logger.zip(a, b)` | Two loggers, both need to keep their identity, you want the zip output type |
| `Logger.layer([a, b, c], { mergeWithExisting: false })` | Three or more destinations, or you're building a server logger with mixed transports |
| `makeFileLogger` + `Logger.zip` | You need a file *and* stdout, with the file handle scoped to the program |
