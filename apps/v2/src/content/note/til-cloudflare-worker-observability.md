---
title: "TIL: Cloudflare Worker observability with SST"
date: 2026-07-04T20:00:00+02:00
description: Enabling logs and traces on a Cloudflare Worker deployed via SST, via the transform escape hatch.
tags: [sst, cloudflare, observability, til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=TIL%3A%20Cloudflare%20Worker%20observability%20with%20SST']
---

## The short version

Cloudflare's Worker dashboard has two toggles, **Workers Logs** and **Workers Traces**. Both live under a single `observability` block in the worker's payload, and SST exposes the underlying Pulumi resource through `transform.worker`. The shape is the same on `sst.cloudflare.Worker` and on any component built on `SsrSite` (Astro, React Router, TanStack Start, Solid Start), just nested one level deeper.

## The config

For a standalone worker:

```ts
// infra/worker.ts
export const api = new sst.cloudflare.Worker("Api", {
  handler: "packages/functions/src/index.ts",
  link: [db, secret.BetterAuthSecret, bucket /* ... */],
  url: true,
  transform: {
    worker: (script) => {
      script.observability = {
        enabled: true,
        headSamplingRate: 1,
        logs: { enabled: true, invocationLogs: true, headSamplingRate: 1 },
        traces: { enabled: true, headSamplingRate: 1 },
      };
    },
  },
});
```

For an SSR site (`sst.cloudflare.x.Astro` in this case), `transform.server` is a `Transform<WorkerArgs>`, so you set the same `transform.worker` on the inner worker:

```ts
// infra/web.ts
new sst.cloudflare.x.Astro("Web", {
  path: "apps/web",
  /* ... */
  transform: {
    server: (worker) => {
      worker.transform = {
        worker: (script) => {
          script.observability = {
            enabled: true,
            headSamplingRate: 1,
            logs: { enabled: true, invocationLogs: true, headSamplingRate: 1 },
            traces: { enabled: true, headSamplingRate: 1 },
          };
        },
      };
    },
  },
});
```

That gets you logs at 100% sampling with invocation logs on, and traces at 100% sampling, on the next `sst deploy`. The dashboard's two toggles flip together.

## How I got here

I forked SST ([planetaryescape/sst](https://github.com/planetaryescape/sst)) because Cloudflare's API has first-class observability for Workers, but I couldn't find any SST-side docs about exposing it. I sent an agent off to do the work, and it came back with [PR #1: `feat(cloudflare): expose Worker observability as first-class arg`](https://github.com/planetaryescape/sst/pull/1), adding a typed `observability` prop to `cloudflare.Worker`, `SsrSite` and subclasses, `StaticSiteV2`, and `Workflow`, with normalization for `enabled` and `invocationLogs`.

Then, while another agent was reviewing the PR, it pointed at the `transform.worker` escape hatch and said, "you can already do this, here." And yeah, the transform pattern already lets you set every field the API accepts. The whole first-class prop work was redundant.

I'm probably going to abandon the pr, but it's already provided value.

## Heads-up

The first-class prop discussion in [PR #1](https://github.com/planetaryescape/sst/pull/1) is still worth reading. It spells out which fields SST should normalize (`enabled`, `invocationLogs`) and which it should defer (`destinations`, `persist`) so the prop doesn't break the moment the API grows. If a future SST release adds the typed arg, the transform pattern is still useful for anything the new arg doesn't cover.
