# Random Dots Rendering Architecture

## Decision

Move the Random Dots scene from Foldkit's Canvas 2D renderer to TypeGPU over native WebGPU.

The first version targets modern macOS browsers. It will not use `@typegpu/gl` or maintain a WebGL fallback. If WebGPU initialization fails, the scene will enter an explicit unsupported state.

Each of the four panels contains 20,000 dots. All four panels advance together during one Foldkit animation update and render in one GPU draw call.

## Before: Canvas 2D

The current scene uses this path:

```text
Foldkit Runtime
  Model → update → view
                   ↓
             Canvas.Frame
                   ↓
        src/ui/canvasView.ts
                   ↓
          Foldkit Canvas.view
                   ↓
        Snabbdom postpatch hook
                   ↓
       CanvasRenderingContext2D
                   ↓
clearRect + save + arc + fill + restore
             for every dot
```

### State and generation

- An Effect-backed Foldkit Command generates dot positions on the CPU.
- Generated points are stored in the Schema Model.
- `Subscription.animationFrame` emits `TickedFrame` Messages.
- `update` increases the visible count.
- `view` turns every visible point into a `Canvas.Circle` object.

### Browser rendering

Foldkit's Canvas adapter requests `canvas.getContext('2d')`. On every virtual-DOM postpatch it clears the complete canvas, walks the complete shape collection, and paints each circle separately.

The browser may use the GPU when compositing the finished canvas, but the application does not create GPU buffers, shaders, or draw commands. JavaScript submits every circle through the Canvas 2D API on every frame.

### Cost at the new scale

With four panels of 20,000 dots, a completed repaint describes and executes 80,000 circles. During reveal animation, every frame rebuilds the visible shape collection and repaints it from the beginning. The amount of CPU work grows with the number of visible dots.

This architecture remains appropriate for small declarative scenes. It is not the renderer we want to study or optimize for this dot field.

## After: TypeGPU and WebGPU

The target path is:

```text
Foldkit Runtime
  Model → update → view
                   ↓
       Random Dots GPU view input
                   ↓
       TypeGPU renderer resource
          ├─ typed instance buffer
          ├─ vertex shader
          ├─ fragment shader
          └─ render pipeline
                   ↓
                 WebGPU
                   ↓
        browser graphics backend
                   ↓
          Metal on modern macOS
```

TypeGPU provides typed schemas, buffers, shader functions, and pipeline construction over WebGPU. TypeGPU generates WGSL for the GPU shaders. WebGPU remains the browser API that owns the device, canvas context, command submission, and execution.

## GPU data model

One dot instance contains renderer data such as:

```ts
type DotInstance = Readonly<{
  center: Readonly<{ x: number; y: number }>
  radius: number
}>
```

The renderer flattens the four Model panels into this order:

```text
weighted[0], uniform[0], edge[0], radial[0],
weighted[1], uniform[1], edge[1], radial[1],
weighted[2], uniform[2], edge[2], radial[2],
...
```

The complete 80,000-dot collection is uploaded to one instance buffer after generation. Frame ticks do not upload point positions again.

Interleaving makes the visible instance count:

```text
visible instance count = visibleCountPerPanel × panel count
```

A frame where `visibleCountPerPanel` is 300 draws the first 1,200 instances. That includes 300 dots from each panel.

## GPU pipeline

### Vertex stage

WebGPU point primitives are not suitable for portable, size-controlled circles. Each dot is therefore an instanced quad made from two triangles.

The draw uses six vertices per instance. The vertex shader combines:

- the built-in vertex index, which selects one of six quad corners;
- the per-instance center and radius;
- the logical canvas dimensions.

It converts logical canvas coordinates into WebGPU clip coordinates and passes local quad coordinates to the fragment stage.

### Fragment stage

The fragment shader receives the local coordinate inside the quad. It evaluates the signed distance from the unit circle and uses `fwidth` to derive smooth pixel coverage. Standard alpha blending composites those antialiased edges over the white background without letting transparent quad corners erase earlier dots.

The canvas keeps 600 × 600 logical coordinates, but its backing dimensions follow the displayed CSS size multiplied by `devicePixelRatio`, capped at 4×. A resize observer and window resize listener update the backing buffer after responsive layout changes or browser zoom, then redraw the stable uploaded artwork.

### Draw

Each rendered frame issues one conceptual command:

```text
draw(vertexCount: 6, instanceCount: visibleCountPerPanel × 4)
```

At completion, `instanceCount` is 80,000. Dot processing is parallelized by the GPU rather than expressed as 80,000 Canvas 2D paint calls.

## Foldkit ownership

Foldkit remains responsible for application behavior:

- the Schema Model stores generated points and `visibleCountPerPanel`;
- Messages describe generation, frame ticks, initialization success, and initialization failure;
- `update` remains the only place that changes reveal progress;
- `Subscription.animationFrame` remains the only animation loop;
- Commands and managed resources own effects and browser resource acquisition.

TypeGPU does not start an independent `requestAnimationFrame` loop. The renderer receives the current immutable artwork and reveal progress from the Foldkit view.

## Resource ownership

GPU objects are browser resources and must not enter the Schema Model. A dedicated renderer resource owns:

- the TypeGPU root;
- the WebGPU device;
- the configured canvas context;
- the dot instance buffer;
- shader and pipeline resources;
- upload identity and cleanup.

The resource lifecycle is:

```text
scene mount
  → await tgpu.init()
  → configure the WebGPU canvas context
  → create the pipeline and buffers

new generated artwork
  → interleave panel points
  → upload the instance buffer once

Foldkit frame update
  → draw the current visible instance count

scene unmount
  → destroy owned TypeGPU resources
```

Unsupported WebGPU and initialization failure are facts reported back through Messages. The Model represents an unsupported or failed renderer state instead of letting initialization defects crash the application. Handling a device that is lost after successful initialization remains future work.

## Module boundary

The Random Dots scene keeps renderer-specific code behind a small adapter:

```text
src/scenes/random-dots/
├── engine/                   Pure distribution and allocation rules
├── gpu/
│   ├── dotInstance.ts        Instance flattening and reveal-count derivation
│   ├── pipeline.ts           Vertex and fragment pipeline
│   └── renderer.ts           Root, context, buffer, draw, and cleanup
├── model.ts                  Schema lifecycle and generated artwork
├── message.ts                Facts from generation, animation, and GPU setup
├── update.ts                 Pure transitions and Effect Commands
├── subscriptions.ts          Foldkit animation frames
└── view.ts                   HTML and GPU canvas adapter input
```

The `gpu/` modules may depend on TypeGPU and browser GPU types. The pure `engine/` modules must not.

## Why not `@typegpu/gl`

`@typegpu/gl` is an experimental WebGL 2 backend for a subset of TypeGPU's render API. It is valuable when broad browser fallback is a product requirement. It also excludes important WebGPU facilities, including vertex and storage buffers, and requires fallback-compatible resource strategies.

This project currently prioritizes:

- learning the modern browser GPU model;
- using typed instance buffers directly;
- a small implementation;
- macOS development rather than broad deployment support.

A WebGL fallback would obscure the WebGPU architecture and create a second compatibility constraint. We can reconsider it after the native WebGPU renderer works and is understood.

## Tooling

Use the official TypeGPU agent skill while implementing schemas, shaders, buffers, and pipelines:

```text
npx skills add software-mansion-labs/skills -s typegpu
```

The optional TypeGPU Runtime Inspector MCP can expose generated WGSL and runtime pipeline errors. It complements Foldkit DevTools MCP:

```text
Foldkit DevTools MCP → Model and Message flow
TypeGPU Inspector MCP → shader generation and GPU runtime diagnostics
```

## Verification boundary

The renderer is complete when we have evidence that:

- TypeGPU initializes on the development Mac;
- exactly 20,000 points are generated for each panel;
- one frame tick advances every panel together;
- generated artwork uploads once rather than once per tick;
- one draw call renders all visible dot instances;
- the completed draw contains 80,000 instances;
- dot radius scales with panel width;
- device initialization failure has an accessible rendered state;
- route unmount destroys owned resources;
- typecheck, lint, tests, and production build pass;
- browser verification has no console or WebGPU validation errors.
