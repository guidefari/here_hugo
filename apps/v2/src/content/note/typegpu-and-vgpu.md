---
title: "TypeGPU and vgpu: typed tools above WebGPU"
date: 2026-09-02T15:32:00+02:00
description: How TypeGPU and Vercel Labs vgpu make WebGPU easier, and why they are not the same as a virtual GPU.
tags: [typescript, graphics]
images: ['https://og.guidefari.com/og-image?title=TypeGPU%20and%20vgpu']
series: browser-gpu-tools
series_order: 20
---

TypeScript runs on the CPU; WGSL runs on the GPU. With raw WebGPU, I have to keep data layouts, bindings, and shader inputs in sync across the two languages. A mismatch can be hard to spot in the source.

TypeGPU helps with shared types and data layouts. Vercel Labs' `vgpu` focuses on modular WGSL and running GPU code in different environments.

## What does TypeGPU do?

TypeGPU is a type-safe WebGPU abstraction from Software Mansion. Its core idea is to describe GPU data with schemas that TypeScript understands, then carry those types through buffers, bindings, pipelines, and shader code.[^why-typegpu]

Its `'use gpu'` functions let me write shader logic in a TypeScript-like form that TypeGPU translates into WGSL. It can also express functions meant to run on both CPU and GPU.[^typegpu-functions]

TypeGPU checks the types across my CPU and shader code, so I can catch mismatches while writing it. I can still use raw WGSL and WebGPU when I need them.[^why-typegpu]

For cameras, lights, and a scene graph, I would reach for Three.js. TypeGPU is useful when I am writing custom rendering, simulations, or compute code and need the GPU data types to line up.

## What is Vercel Labs' `vgpu`?

`vgpu` is a WebGPU toolkit for modular WGSL that can run in browsers, headless Node, or a test mock.[^vgpu]

Its shader compiler lets WGSL files import and export code. It can also inspect a shader to find its bindings and entry points, so TypeScript code knows how to use it. The runtime can target browser WebGPU, a headless Node environment backed by Dawn, or a deterministic mock. Its modules cover lower-level effects, draw and compute operations, render targets, and higher-level scenes.

The headless and mock runtimes let me run GPU code in CI or on a server.[^vgpu]

## TypeGPU versus `vgpu`

| | TypeGPU | Vercel Labs `vgpu` |
|---|---|---|
| Shader authoring | TypeScript-like `'use gpu'` functions and WGSL escape hatches | WGSL files with imports and exports; tooling that inspects shader bindings and entry points |
| Main type-safety focus | Data schemas across TypeScript and WGSL | Typed APIs generated around shader modules |
| Runtime focus | Browser WebGPU | Browser, headless Node, and deterministic mock |
| Higher-level layer | Typed pipelines and ecosystem integrations | Effects, draw/compute operations, targets, and scenes |
| Best fit | Type-safe custom GPU programming | Portable and testable GPU modules |


Both projects are young and pre-1.0. TypeGPU published its first tagged release in September 2024. The `vgpu` repository began in May 2026 and its early releases followed soon after.[^typegpu-release][^vgpu-first][^vgpu-release]

## How is this different from a vGPU?

In infrastructure, **vGPU** usually means **virtual GPU**. NVIDIA vGPU, for example, partitions or time-slices physical GPU resources so virtual machines can share them.[^nvidia-vgpu]

`vgpu` is a TypeScript library; it does not partition physical GPUs.

Next: [What is Three.js?](/what-is-threejs/).

[^why-typegpu]: TypeGPU documentation, [Why TypeGPU?](https://docs.swmansion.com/TypeGPU/why-typegpu/).
[^typegpu-functions]: TypeGPU documentation, [Functions](https://docs.swmansion.com/TypeGPU/apis/functions/).
[^vgpu]: Vercel Labs, [`vgpu` repository](https://github.com/vercel-labs/vgpu).
[^typegpu-release]: TypeGPU, [v0.1.0 release](https://github.com/software-mansion/TypeGPU/releases/tag/v0.1.0).
[^vgpu-first]: Vercel Labs, [`vgpu` initial commit](https://github.com/vercel-labs/vgpu/commit/3da19088ce9620cad1db87ae813768ea07972ac8).
[^vgpu-release]: Vercel Labs, [`vgpu` v0.0.2 release](https://github.com/vercel-labs/vgpu/releases/tag/v0.0.2).
[^nvidia-vgpu]: NVIDIA, [Virtual GPU software overview](https://docs.nvidia.com/vgpu/latest/grid-vgpu-user-guide/grid-vgpu-introduction.html).
