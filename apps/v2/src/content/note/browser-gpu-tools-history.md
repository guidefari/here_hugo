---
title: "How browser GPU tools evolved"
date: 2026-09-02T15:35:00+02:00
description: A timeline from programmable shaders and WebGL to WebGPU, TypeGPU, and vgpu.
tags: [typescript, graphics]
images: ['https://og.guidefari.com/og-image?title=How%20browser%20GPU%20tools%20evolved']
series: browser-gpu-tools
series_order: 50
---

Browser GPU tools arrived at different times. Shader languages let developers program parts of the graphics pipeline. WebGL brought shaders to the browser, and Three.js gave developers scenes and cameras. WebGPU added an API for rendering and compute; TypeGPU and `vgpu` now build on it.

<ol class="gpu-history" aria-label="Browser GPU tools timeline">
  <li><span class="gpu-history-date">2002–04</span><span>GLSL makes it practical to write small programs for graphics hardware.</span></li>
  <li><span class="gpu-history-date">2010–11</span><span>Three.js and WebGL bring programmable 3D graphics to web pages.</span></li>
  <li><span class="gpu-history-date">2017</span><span>WebGL 2 arrives; work on WebGPU begins.</span></li>
  <li><span class="gpu-history-date">2021–23</span><span>WebGPU drafts appear, then Chrome turns on WebGPU for some desktops.</span></li>
  <li><span class="gpu-history-date">2024</span><span>WebGPU and WGSL advance in standards work; TypeGPU releases v0.1.</span></li>
  <li><span class="gpu-history-date">2026</span><span>Vercel Labs introduces <code>vgpu</code>.</span></li>
</ol>

## 2002 to 2004: shaders become a standard language

Early consumer graphics pipelines were mostly fixed-function. Applications selected predefined operations instead of supplying small programs for vertices and pixels.

The OpenGL Shading Language changed that. Work on GLSL moved into the OpenGL Architecture Review Board in 2002, and OpenGL 2.0 incorporated the programmable shading model in 2004.[^glsl][^opengl2]

Applications could supply their own programs for vertices and pixels, which the GPU runs across many items in parallel.

## 2010 to 2011: Three.js and WebGL lower the barrier

The first commit in the Three.js repository dates to April 2010.[^three-first] The library wrapped browser 3D work in scenes, cameras, geometry, and materials.

Khronos released the final WebGL 1.0 specification in March 2011.[^webgl-release] WebGL adapted the OpenGL ES 2.0 model to the security and portability constraints of the web. Together, WebGL and libraries such as Three.js made plugin-free 3D pages practical.

## 2017: WebGL grows, and WebGPU begins

WebGL 2.0 became final in January 2017, bringing browser graphics closer to OpenGL ES 3.0 with features such as transform feedback, instancing, multiple render targets, and new texture capabilities.[^webgl2]

The W3C GPU for the Web Community Group also began work in 2017 on a portable web API based on newer native graphics systems.[^webgpu-origins]

## 2021 to 2024: WebGPU becomes a real web platform

The W3C published the first public working drafts of WebGPU and WGSL in May 2021.[^first-drafts] Chrome enabled WebGPU by default in version 113 in 2023, initially on selected desktop platforms.[^chrome]

WebGPU and WGSL reached Candidate Recommendation in 2024. The W3C has kept updating the drafts since then.[^webgpu-history][^wgsl-history]

## 2024 onward: abstractions move up the stack

Software Mansion started TypeGPU publicly in 2024 and tagged version 0.1.0 that September.[^typegpu-first][^typegpu-release] It helps keep TypeScript data definitions, GPU layouts, bindings, and shader types in agreement.

Vercel Labs' `vgpu` appeared in 2026 with a different emphasis: modular WGSL, reflection, browser and headless runtimes, and deterministic testing.[^vgpu-first][^vgpu]


Back to [the browser GPU tools map](/webgpu-webgl-typegpu-threejs-shaders/).

[^glsl]: Khronos, [The OpenGL Shading Language, version 1.10](https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.1.10.pdf).
[^opengl2]: Khronos, [OpenGL 2.0 specification](https://registry.khronos.org/OpenGL/specs/gl/glspec20.pdf).
[^three-first]: Three.js, [first repository commit](https://github.com/mrdoob/three.js/commit/214dd9dcfc56b0d85484d6841110fe1f089ff055).
[^webgl-release]: Khronos, [final WebGL 1.0 specification announcement](https://www.khronos.org/news/press/khronos-releases-final-webgl-1.0-specification).
[^webgl2]: Khronos, [WebGL 2.0 arrives](https://www.khronos.org/blog/webgl-2.0-arrives).
[^webgpu-origins]: W3C, [WebGPU origins and evolution](https://www.w3.org/2024/01/webevolve-series-events/media/slides/gu-yang.pdf).
[^first-drafts]: W3C, [first public WebGPU and WGSL working drafts](https://www.w3.org/news/2021/first-public-working-drafts-webgpu-and-webgpu-shading-language/).
[^chrome]: Chrome Developers, [Chrome ships WebGPU](https://developer.chrome.com/blog/webgpu-release).
[^webgpu-history]: W3C, [WebGPU publication history](https://www.w3.org/standards/history/webgpu/).
[^wgsl-history]: W3C, [WGSL publication history](https://www.w3.org/standards/history/WGSL/).
[^typegpu-first]: TypeGPU, [first repository commit](https://github.com/software-mansion/TypeGPU/commit/8848c01f8130950370c3024092464fb212ff428d).
[^typegpu-release]: TypeGPU, [v0.1.0 release](https://github.com/software-mansion/TypeGPU/releases/tag/v0.1.0).
[^vgpu-first]: Vercel Labs, [`vgpu` initial commit](https://github.com/vercel-labs/vgpu/commit/3da19088ce9620cad1db87ae813768ea07972ac8).
[^vgpu]: Vercel Labs, [`vgpu` repository](https://github.com/vercel-labs/vgpu).
