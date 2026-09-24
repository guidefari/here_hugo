# Random Dot Fields — Implementation Progress

This file is the running record for the Random Dots composition and its move from Canvas 2D to TypeGPU/WebGPU. Items are checked only after their implementation and evidence are complete.

## Decisions

- [x] Use four panels: weighted grid, uniform, top-edge concentration, and radial concentration.
- [x] Generate 20,000 dots in each panel, for 80,000 total.
- [x] Advance all four panels together during each Foldkit frame update.
- [x] Scale dot radius relative to panel width.
- [x] Use one shared `spread`, `strength`, and `background` concentration API for edge and radial fields.
- [x] Use TypeGPU directly over native WebGPU.
- [x] Target modern macOS browsers and omit the WebGL fallback.
- [x] Keep GPU resources outside the Schema Model.
- [x] Keep Foldkit as the only animation and state-transition owner.

## Agreed seams

- [x] Pure distribution interface: definitions, panel layout, weighted allocation, and density evaluation.
- [x] Foldkit update interface: 20,000 generated points per panel and synchronized reveal progress.
- [x] GPU renderer interface: one artwork upload and one draw call for the current visible instance count.
- [x] Foldkit scene interface: progress and accessible loading, ready, failed, and unsupported states.
- [x] Browser route: native WebGPU rendering, completed artwork, cleanup, and console health.

## Completed foundation

- [x] Write and review the initial technical specification.
- [x] Add the pure distribution and layout engine with behavior tests.
- [x] Build the first four-panel Canvas 2D composition.
- [x] Verify the Canvas 2D prototype in the browser and identify its per-circle repaint path.
- [x] Document the current Canvas 2D architecture and target TypeGPU/WebGPU architecture.

The Canvas 2D composition is a working prototype, but it is now the architecture being replaced. Its area-derived point count and global reveal count are not the final requirements.

## TypeGPU/WebGPU work plan

### Setup

- [x] Install `typegpu`, `@webgpu/types`, and the TypeGPU Vite plugin.
- [x] Install and read the official TypeGPU agent skill.
- [x] Configure TypeScript with WebGPU types.
- [x] Defer the optional TypeGPU Runtime Inspector MCP until the tracer exposes a runtime debugging need.

### Tracer renderer

- [x] Add an element-lifetime TypeGPU root and WebGPU canvas context.
- [x] Draw a static four-dot tracer through a TypeGPU render pipeline.
- [x] Verify the tracer in a browser before adding the 40,000-dot path.
- [x] Prove renderer cleanup on unmount.

### Artwork data

- [x] Change generation to exactly 20,000 points per panel.
- [x] Replace global reveal progress with `visibleCountPerPanel`.
- [x] Interleave the four panel point collections by reveal cycle.
- [x] Define the typed per-instance GPU layout.
- [x] Upload the complete 80,000-dot instance buffer once per artwork.

### Distribution controls

- [x] Use `spread` to set the edge band width or radial radius of influence.
- [x] Use `strength` to control clustering near the edge or center attractor.
- [x] Use `background` to control residual density beyond the spread.
- [x] Validate concentration parameters at construction.
- [x] Cover edge, radial, and background semantics with behavior tests.

### Reference matching

- [x] Add 30-pixel outer padding and widen the panel gap to 60 pixels.
- [x] Tune the weighted grid to preserve the upper-center void and sparse lower-left region.
- [x] Tighten the top-edge field while reducing distant background dots.
- [x] Broaden the radial field while strengthening its center attractor.
- [x] Compare the completed browser render against the supplied reference.

### Rendering quality

- [x] Reduce dot radius to 75% of the reference-matched size.
- [x] Scale the canvas backing buffer with CSS size and device pixel ratio.
- [x] Cap backing resolution at 4× to bound GPU memory use during extreme zoom.
- [x] Redraw after responsive resize and browser zoom changes.
- [x] Replace binary fragment discard with derivative-based circle coverage and alpha blending.
- [x] Verify a forced 2× device scale produces a 1,196-pixel backing buffer for the 598-pixel canvas.

### GPU drawing

- [x] Build an instanced-quad vertex shader.
- [x] Build a circular-mask fragment shader.
- [x] Draw all visible panel dots in one instanced draw call.
- [x] Render the white background, panel gaps, and relative dot radius.
- [x] Remove Random Dots' dependency on the shared Canvas 2D frame renderer.

### Foldkit integration

- [x] Model unsupported WebGPU and device initialization failure as legal Schema states.
- [x] Keep animation under `Subscription.animationFrame`.
- [x] Make one frame tick reveal the next dots in all four panels.
- [x] Keep TypeGPU resources and browser objects outside the Model.
- [x] Add accessible loading, failed, unsupported, drawing, and ready views.

### Verification

- [x] Add or update pure engine behavior tests.
- [x] Add Story coverage for synchronized per-panel reveal.
- [x] Add Scene coverage for accessible lifecycle states and progress.
- [x] Run formatting checks.
- [x] Run typecheck.
- [x] Run lint.
- [x] Run the full test suite.
- [x] Run the production build.
- [x] Verify native WebGPU initialization on macOS.
- [x] Verify 20,000 dots in each panel and 80,000 completed instances.
- [x] Verify the synchronized reveal completes in about five seconds.
- [x] Verify animation advances all four panels together.
- [x] Verify no repeated point-buffer uploads during frame ticks.
- [x] Verify route unmount cleanup.
- [x] Verify the browser console has no TypeGPU or WebGPU errors.
- [x] Review `git diff --check` and the final module tree.

## Commit log

- [x] `2b9ee79` — specification and implementation tracker.
- [x] `188f6b9` — pure distribution engine.
- [x] `51f475c` — four-panel Canvas 2D prototype.
- [x] `e598401` — before/after rendering architecture and revised execution plan.
- [x] `dbc0508` — TypeGPU dependency and tooling setup.
- [x] `fb99d5d` — static TypeGPU tracer renderer.
- [x] `54e5267` — 40,000-dot generation and synchronized lifecycle.
- [x] `520caac` — instanced GPU dot rendering.
- [x] `4c82d08` — accessibility and failure states.
- [x] `323b0f4` — reload-safe GPU draw-count normalization.
- [x] `fbb27dd` — shared edge and radial concentration controls.
- [x] `694113e` — verification and documentation cleanup.
- [x] `052b073` — inset reference composition geometry.
- [x] `4fe1360` — 80,000-dot generation and five-second synchronized reveal.
- [x] `ef47287` — reference-matched distribution tuning.
- [x] `890efa8` — smaller, zoom-stable antialiased dots.

## Evidence log

- [x] 2026-08-27 — TypeGPU setup passed typecheck and production build.
- [x] 2026-08-27 — Native TypeGPU tracer rendered four circular instanced quads in the Random Dots route through WebGPU.
- [x] 2026-08-27 — Tracer browser console contained no TypeGPU or WebGPU validation errors. Foldkit reported one existing slow-update warning while accepting the generated 40,000-point Message.
- [x] 2026-08-27 — Completed GPU draw reported 40,000 visible instances with one artwork upload.
- [x] 2026-08-27 — Mid-animation diagnostics reported an instance count divisible by four, proving synchronized panel advancement.
- [x] 2026-08-27 — SPA route unmount disconnected the GPU custom element and destroyed its TypeGPU root.
- [x] 2026-08-27 — Story and Scene tests cover unsupported WebGPU and renderer initialization failure without allowing late generation to overwrite those states.
- [x] 2026-08-27 — A fresh browser session completed with 40,000 visible instances, one upload, and no page errors.
- [x] 2026-08-27 — Reload crash regression normalizes non-finite, negative, and oversized instance counts before calling WebGPU.
- [x] 2026-08-27 — Reload stress loop completed 40/40 attempts without renderer failure or browser errors.
- [x] 2026-08-27 — Distribution tests verify edge spread, radial spread, concentration strength, and background density.
- [x] 2026-08-27 — Completed GPU draw reported 80,000 visible instances with one artwork upload.
- [x] 2026-08-27 — Browser timing measured the synchronized reveal at 4,773 milliseconds.
- [x] 2026-08-27 — Reference-matched render completed with 80,000 instances, one upload, and no browser errors.
- [x] 2026-08-27 — Forced 2× device scale rendered a 1,196-pixel backing buffer for a 598-pixel CSS canvas, with 80,000 instances and no browser errors.
