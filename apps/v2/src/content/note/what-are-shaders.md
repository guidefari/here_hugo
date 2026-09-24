---
title: "What are shaders?"
date: 2026-09-02T15:34:00+02:00
description: A plain-language explanation of vertex, fragment, and compute shaders, plus GLSL and WGSL.
tags: [typescript, graphics]
images: ['https://og.guidefari.com/og-image?title=What%20are%20shaders%3F']
series: browser-gpu-tools
series_order: 40
---

Imagine drawing a coloured triangle on a web page. You tell the computer where its three corners should be and what colour it should have. The graphics processing unit, or **GPU**, does the work of putting it on the screen.

A **shader** is a small set of instructions for that GPU. The GPU runs the same instructions many times, once for each part of the job. That is why it can handle so much drawing work at once.

For our triangle, the steps are:

1. Put the three corners in place.
2. Work out which parts of the screen lie inside the triangle.
3. Choose their colours.

The first step uses a **vertex shader**. The last uses a **fragment shader**. The GPU handles the step between them.

## Vertex shaders

A **vertex** is a corner of a shape. A triangle has three vertices. A vertex shader runs once for each one and tells the GPU where that corner should appear.

If the triangle moves, its corners need new positions. The vertex shader can also provide information, such as a colour at each corner, for the later colouring step.

## Fragment shaders

Once the corners are in place, the GPU works out which parts of the screen the triangle covers. It calls each piece it might colour a **fragment**. Think of a fragment as a candidate for a screen pixel.

The fragment shader chooses its colour. It might make the triangle solid blue, blend colours from its corners, or use an image to add detail. The name "shader" comes from this job of shading a surface.

## Compute shaders

Not every GPU job draws a shape. A **compute shader** uses the GPU to work on many pieces of data, such as the pixels in a photo, without first drawing a triangle.

For example, an image filter can run the same brightness adjustment on many pixels. WebGPU supports compute shaders; WebGL does not offer a standard compute-shader feature.[^wgsl-stages]

## GLSL versus WGSL

**[GLSL ES](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders)** and **[WGSL](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)** are languages used to write shaders. They are not different kinds of shader; they are different ways to write the instructions.

WebGL uses GLSL ES and needs vertex and fragment shaders to draw.[^webgl-shaders] WebGPU uses WGSL, which can describe vertex, fragment, and compute shaders.[^wgsl-stages]

I do not always have to write shaders myself. Three.js supplies them for common materials. Tools such as TypeGPU and `vgpu` help when I need to write my own GPU code.

Next: [How browser GPU tools evolved](/browser-gpu-tools-history/).

[^wgsl-stages]: W3C, [WGSL shader stages](https://www.w3.org/TR/WGSL/#shader-stages).
[^webgl-shaders]: Khronos, [WebGL 1.0 shader requirements](https://registry.khronos.org/webgl/specs/latest/1.0/#5.8).
