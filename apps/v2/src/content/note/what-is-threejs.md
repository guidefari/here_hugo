---
title: "What is Three.js?"
date: 2026-09-02T15:33:00+02:00
description: Where Three.js sits in the browser graphics stack and how it relates to WebGL, WebGPU, and TypeGPU.
tags: [typescript, graphics]
images: ['https://og.guidefari.com/og-image?title=What%20is%20Three.js%3F']
series: browser-gpu-tools
series_order: 30
---

Three.js is a high-level JavaScript 3D library. It gives me the vocabulary of a 3D application: scenes, cameras, geometry, materials, lights, textures, animation, model loaders, and renderers.[^fundamentals]

WebGL and WebGPU know about buffers, textures, pipelines, and draw calls. They do not know that an object is a car, that a light should cast a shadow, or that a camera has a field of view. Three.js supplies that application-facing layer.

## What does Three.js do for me?

A small Three.js program usually:

1. creates a scene;
2. adds a camera;
3. creates meshes from geometry and materials;
4. positions lights and objects;
5. asks a renderer to draw each frame.

Behind that final step, Three.js traverses the scene, works out what is visible, manages GPU resources, chooses or generates shader programs, and submits the required work to the browser API.

I can work with objects and materials while Three.js handles the render pipelines.

## Does Three.js use WebGL or WebGPU?

Both, depending on the renderer.

`WebGLRenderer` is the mature WebGL path. `WebGPURenderer` uses WebGPU when available and can fall back to a WebGL 2 backend. The WebGPU renderer uses Three.js Shading Language, or TSL, as its node-based way to express material and compute logic. Three.js still describes `WebGPURenderer` as experimental, so existing WebGL applications should not migrate without a feature and performance reason.[^webgpu-renderer]

The scene code stays much the same when I switch between Three.js renderers, though renderer features may differ.

## Is Three.js an alternative to TypeGPU or `vgpu`?

They solve different problems:

- Choose **Three.js** when the main problem is building and rendering a 3D world.
- Choose **TypeGPU** when the main problem is expressing custom WebGPU data and algorithms safely.
- Choose **`vgpu`** when modular WGSL and browser, server, or mock runtimes are central.

They can also meet at a boundary. The `@typegpu/three` package, for example, lets TypeGPU resources integrate with Three.js.[^typegpu-three]

I would start with Three.js for a 3D scene and use raw WebGPU if I need control that its renderer does not expose.

Next: [What are shaders?](/what-are-shaders/).

[^fundamentals]: Three.js manual, [Fundamentals](https://threejs.org/manual/en/fundamentals.html).
[^webgpu-renderer]: Three.js manual, [WebGPURenderer](https://threejs.org/manual/en/webgpurenderer).
[^typegpu-three]: TypeGPU documentation, [Three.js integration](https://docs.swmansion.com/TypeGPU/ecosystem/typegpu-three/).
