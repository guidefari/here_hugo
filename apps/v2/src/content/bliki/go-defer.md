---
title: "Go, defer"
date: 2026-07-04T10:00:00+02:00
description: schedule a function call to run when the surrounding function returns
tags: [go]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Go%20%E2%80%94%20defer']
---


- Schedules a function call to run when the surrounding function returns (normal return, panic, or `os.Exit` aside)
- Arguments are evaluated at the `defer` line, not when the deferred call actually runs
- Multiple defers in the same scope run in **LIFO** order (last in, first out)
- Common use: pairing acquire with release, open file → `defer file.Close()`, lock mutex → `defer mu.Unlock()`, open span → `defer span.End()`
- Keep deferred work cheap. If it's expensive, decide explicitly in the caller instead

```go
f, err := os.Open(path)
if err != nil {
    return err
}
defer f.Close()

// ... do stuff with f ...
// f.Close() runs on return, even if the stuff panics
```

The whole point: cleanup lives next to setup, you can't forget it, and it survives a panic between the two.
