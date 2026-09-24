---
title: "WebGL and WebGPU: two generations of browser GPU APIs"
date: 2026-09-02T15:31:00+02:00
description: What WebGL and WebGPU are, why both exist, and where their programming models differ.
tags: [typescript, graphics]
images: ['https://og.guidefari.com/og-image?title=WebGL%20and%20WebGPU']
series: browser-gpu-tools
series_order: 10
---

WebGL and WebGPU let code in a web page send work to the GPU. Their programming models differ.

## What is WebGL?

WebGL is the older browser graphics API. WebGL 1 was based on OpenGL ES 2.0, while WebGL 2 largely follows OpenGL ES 3.0.[^webgl1][^webgl2]

WebGL brought hardware-accelerated 3D graphics to a normal `<canvas>` without a browser plugin. JavaScript sets GPU state, uploads data, compiles shaders, and issues draw calls.

A WebGL program changes the current buffer, texture, shader program, and other context state before drawing. Larger renderers have to track those changes carefully.

WebGL primarily targets graphics. Its essential programmable stages are [vertex](/what-are-shaders/#vertex-shaders) and [fragment shaders](/what-are-shaders/#fragment-shaders). It has no standard, first-class [compute-shader pipeline](/what-are-shaders/#compute-shaders).

## What is WebGPU?

WebGPU is the newer W3C API for both rendering and general-purpose GPU computation.[^webgpu]

WebGPU draws on native APIs such as [Direct3D 12](https://learn.microsoft.com/en-us/windows/win32/direct3d12/direct3d-12-graphics), [Metal](https://developer.apple.com/metal/), and [Vulkan](https://www.vulkan.org/). The browser maps it onto the machine's graphics system. The API has [buffers](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer), [textures](https://developer.mozilla.org/en-US/docs/Web/API/GPUTexture), [bind groups](https://developer.mozilla.org/en-US/docs/Web/API/GPUBindGroup), [render](https://developer.mozilla.org/en-US/docs/Web/API/GPURenderPipeline) and [compute pipelines](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePipeline), [command encoders](https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder), and [queues](https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue). Its shader language is [WGSL](https://www.w3.org/TR/WGSL/).

For the triangle below, WebGPU needs a shader module and render pipeline before I can record a draw command. The pipeline describes its shader stages, primitive type, and target format. The browser checks the pipeline against WebGPU's validation rules when I create it.[^pipeline-validation]

WebGPU also has compute shaders. They let a program run parallel work such as simulations, image processing, particle updates, or machine-learning kernels.[^wgsl-stages]

## The practical difference

| | WebGL | WebGPU |
|---|---|---|
| Heritage | OpenGL ES 2.0 and 3.0 | Direct3D 12, Metal, and Vulkan generation |
| Main work | Rendering | Rendering and compute |
| Shader language | GLSL ES | WGSL |
| Programming model | Stateful context | Explicit resources, pipelines, and command submission |
| Compatibility | Older and broader | Newer browsers and devices |
| Best reason to use it | Reach and mature ecosystem | Compute and explicit control of GPU resources |

## What does the code actually look like?

Both examples draw the same triangle. The WebGL 2 version changes the context's current state before drawing. The WebGPU version builds a pipeline, records a render pass, then submits it to a queue. The vertex shader generates the triangle's three points, so these examples need no vertex buffers or bind groups. We would use those to send our own data to the GPU.

<div class="gpu-playground" data-gpu-playground>
  <p>Here is the code next to the triangle it draws. Switch between the APIs to compare them.</p>
  <p data-gpu-status role="status" aria-live="polite">The examples will load when you scroll here.</p>
  <div data-gpu-content hidden>
    <div class="gpu-playground-switch" role="group" aria-label="Choose a browser GPU API">
      <button type="button" data-gpu-example="webgl2" aria-pressed="true">WebGL 2</button>
      <button type="button" data-gpu-example="webgpu" aria-pressed="false">WebGPU</button>
    </div>
    <div class="gpu-playground-panes">
      <div class="gpu-playground-code"><strong>Code</strong><div data-gpu-code></div></div>
      <div class="gpu-playground-preview"><strong>Preview</strong><div class="gpu-playground-preview-frame"><canvas data-gpu-canvas width="640" height="480" aria-label="A coloured triangle drawn by the selected GPU API"></canvas></div><p data-gpu-result role="status" aria-live="polite"></p></div>
    </div>
  </div>
</div>

Chrome enabled WebGPU by default in version 113 in 2023.[^chrome] As of September 2026, the W3C still lists WebGPU and WGSL as Candidate Recommendations.[^webgpu-history][^wgsl-history]

Next: [TypeGPU and vgpu: typed tools above WebGPU](/typegpu-and-vgpu/).

[^webgl1]: Khronos, [WebGL Specification 1.0](https://registry.khronos.org/webgl/specs/latest/1.0/).
[^webgl2]: Khronos, [WebGL 2.0 Specification](https://registry.khronos.org/webgl/specs/2.0.0/).
[^webgpu]: W3C, [WebGPU specification](https://www.w3.org/TR/webgpu/).
[^pipeline-validation]: W3C, [WebGPU render pipeline creation and validation](https://www.w3.org/TR/webgpu/#render-pipeline-creation).
[^wgsl-stages]: W3C, [WGSL shader stages](https://www.w3.org/TR/WGSL/#shader-stages).
[^chrome]: Chrome Developers, [Chrome ships WebGPU](https://developer.chrome.com/blog/webgpu-release).
[^webgpu-history]: W3C, [WebGPU publication history](https://www.w3.org/standards/history/webgpu/).
[^wgsl-history]: W3C, [WGSL publication history](https://www.w3.org/standards/history/WGSL/).
