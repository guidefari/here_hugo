# Noise Beam Field — Technical Specification

## Summary

Create a WebGPU scene of evenly spaced short beams seen directly from above. Every beam has a fixed centre, length, and width. A smooth two-dimensional Perlin-noise sample at that centre controls the beam's **tilt angle**. This produces a coherent orientation field like the supplied reference: nearby beams lean similarly, while the direction bends gradually across the canvas.

This is a live orientation field, not a particle-flow simulation. Beam positions stay fixed while the noise domain drifts through their centres, so only their angles evolve. The GPU derives every beam from its instance index, so no CPU-generated per-beam data is stored in the Foldkit Model or uploaded to a vertex buffer.

## Coordinate systems and axes

There are three coordinate systems. Giving each one a name avoids mixing layout, noise sampling, and beam geometry.

| Space          | Axes                       | Unit                   | Purpose                                                                                                                                                                                 |
| -------------- | -------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| World / canvas | `x` right, `y` down        | logical canvas pixels  | Places beam centres and maps them to WebGPU clip space. This matches the existing canvas and WebGPU framebuffer convention.                                                             |
| Grid           | `column` right, `row` down | integer cell index     | Identifies one beam from `instanceIndex`; it defines even spacing and does not carry angle data.                                                                                        |
| Beam-local     | `along` and `across`       | logical canvas pixels  | Defines an unrotated beam as a narrow rectangle: `along` is its long axis (`length`), `across` its short axis (`thickness`). The renderer rotates this local geometry about its centre. |
| Noise domain   | `u` right, `v` down        | noise-cell coordinates | Samples Perlin noise. It is derived from the beam centre, not from the grid index, so changing spacing does not change the field's physical scale unexpectedly.                         |

The field is top-down and two-dimensional. There is deliberately no visible `z` or elevation axis: “tilt” means rotation inside the screen plane, not a 3D pitch or roll.

### Angle convention

Use screen-space radians:

```text
0             → right
π / 2         → down
π             → left
-π / 2        → up
```

This clockwise-positive convention follows the canvas `y`-down axis. The unrotated beam points right along its local `along` axis.

For a beam centre `p`, noise-cell size `s`, and domain offset `o`, the initial mapping is:

```text
n     = perlin2d(p / s + o)       // n is in [-1, 1]
angle = baseAngleRadians + n × amplitudeRadians
```

`baseAngleRadians` is the calm, global direction; `amplitudeRadians` is the largest departure on either side. With `baseAngleRadians: 0` and `amplitudeRadians: π / 2`, the field ranges from straight up to straight down.

The reference image sweeps close to a full half-turn: beams run from `\` through `—` to `/` and reach near-vertical `|` at the right edge. A single Perlin sample scaled by a moderate amplitude reads noticeably flatter than that. Start at `amplitudeRadians: π / 2` with `baseAngleRadians: 0`, which is the widest spread that still keeps the beams unambiguously readable as an orientation field rather than an unbounded rotation. Because a beam is symmetric under a half-turn, `π / 2` already covers every visually distinct orientation; larger amplitudes only re-visit angles the field has already shown.

`domainOffset` is part of the noise domain, not the world layout. It lets a later animation pan the field without moving beam centres.

## Public configuration API

The scene should expose one small, renderer-independent definition. It names the visual controls rather than GPU buffers, workgroups, or shader details.

```ts
type BeamGrid = Readonly<{
  columns: number
  rows: number
  padding: number
}>

type BeamStyle = Readonly<{
  length: number
  thickness: number
  color: Readonly<{
    red: number
    green: number
    blue: number
    alpha: number
  }>
}>

type PerlinAngleField = Readonly<{
  _tag: 'PerlinAngleField'
  cellSize: number
  domainOffset: Readonly<{
    x: number
    y: number
  }>
  baseAngleRadians: number
  amplitudeRadians: number
}>

type NoiseBeamFieldDefinition = Readonly<{
  width: number
  height: number
  background: Readonly<{
    red: number
    green: number
    blue: number
    alpha: number
  }>
  grid: BeamGrid
  beam: BeamStyle
  angleField: PerlinAngleField
}>
```

`PerlinAngleField` carries a `_tag` even though it is the only variant today. That is deliberate: simplex noise is an explicitly anticipated second variant, and tagging now means adding it later widens a union instead of reshaping `NoiseBeamFieldDefinition`.

Use constructors such as `defineNoiseBeamField`, `defineBeamGrid`, `defineBeamStyle`, and `PerlinAngleField`. They validate the following invariants:

- canvas `width` and `height`, beam `length` and `thickness`, `cellSize`, `columns`, and `rows` are positive;
- `columns` and `rows` are integers;
- `padding` is non-negative and leaves positive space for the grid;
- beam `length` does not exceed the smaller cell dimension (see _Beam fit_);
- RGBA channels are in `0..1`;
- `baseAngleRadians`, `amplitudeRadians`, and domain offsets are finite;
- `amplitudeRadians` is in `0..π`, keeping the control interpretable as a directional spread.

The scene definition is a constant, not an editable Schema Model value. The active Schema Model owns only the current `domainOffset`; if controls are added later, the same closed structures can become Schema values at the Foldkit boundary.

### Canvas aspect and square cells

The reference is a wide landscape field of visually square cells. Cell spacing is derived, not configured:

```text
cell width  = (width  - 2 × padding) / columns
cell height = (height - 2 × padding) / rows
```

If the canvas is square but `columns ≠ rows`, those two spacings differ and the beams read as denser along one axis than the reference. The first composition therefore uses a landscape canvas whose aspect matches the grid, so the two spacings agree within a fraction of a pixel.

`defineBeamGrid` does not silently correct a mismatch; the composition below chooses `width`, `height`, `columns`, and `rows` that already agree. A later composition is free to use deliberately non-square cells.

### Proposed first composition

```ts
export const NOISE_BEAM_FIELD = defineNoiseBeamField({
  width: 600,
  height: 400,
  background: { red: 0.96, green: 0.95, blue: 0.92, alpha: 1 },
  grid: defineBeamGrid({
    columns: 68,
    rows: 44,
    padding: 24,
  }),
  beam: defineBeamStyle({
    length: 8,
    thickness: 1.6,
    color: { red: 0.06, green: 0.06, blue: 0.05, alpha: 1 },
  }),
  angleField: PerlinAngleField({
    cellSize: 150,
    domainOffset: { x: 0, y: 0 },
    baseAngleRadians: 0,
    amplitudeRadians: Math.PI / 2,
  }),
})
```

That gives a cell of `(600 - 48) / 68 = 8.12` by `(400 - 48) / 44 = 8.0` logical pixels, square to within a fifth of a pixel.

### Beam fit

The validated rule is on the **rotated** footprint, not the axis-aligned rectangle. A beam of length `L` rotated to any angle sweeps a circle of diameter `L` about its centre, so the only rotation-independent bound is:

```text
length ≤ min(cell width, cell height)
```

Checking `length` against cell width and `thickness` against cell height separately would pass configurations that overlap once rotated, which is why the earlier axis-aligned phrasing is not used.

This rule permits neighbours to touch. That is intended: in the reference the beams nearly meet, and the visual density is part of the composition. Only a beam long enough to reach past its neighbour's centre is rejected.

`cellSize` is the most useful artistic scale control:

- larger values make broad, calm bends;
- smaller values make tighter turbulence;
- it has a physical meaning in canvas pixels, independent of beam count.

### Noise implementation

Perlin noise is evaluated on the GPU, in the vertex shader, once per instance. There is no `@typegpu/noise` dependency: the project already owns a working 2D Perlin implementation at `src/scenes/prism-field/engine/noise.ts`, and this scene **ports that function to a `tgpu.fn`** in `gpu/renderer.ts` rather than adding a package.

The reasons to port rather than depend:

- `@typegpu/noise` is not currently installed, and its `perlin2d` caches gradients in a GPU buffer with its own seed plumbing and bind group. That is materially more GPU wiring than this scene needs and cuts against "one immutable uniform, no storage buffer".
- The existing implementation derives gradients from a pure integer hash of the lattice cell, so it needs no buffer, no bind group, and no seed. It is the single hardest part of this scene, and it is already written and already the look the project uses.
- It keeps the seed-free configuration honest rather than deferred: there is no seed because the gradients are a pure function of position, not because an API is missing.

The port is mechanical. `fade`, `lerp`, `dotGradient`, and `perlin2` translate directly; the only substantive changes are that integer hashing uses `d.u32` arithmetic with explicit wrapping, and `gradientAngle` returns a `vec2f` gradient via `std.cos`/`std.sin` instead of an angle plus two trig calls at the use site. The CPU version in `prism-field` stays where it is and is not shared: duplicating forty lines is cheaper than a cross-scene abstraction over two different execution targets.

Validate the port against the CPU original before wiring it into the scene, by sampling a small grid of coordinates through both and comparing. `fractalNoise` is **not** ported; the scene uses a single octave.

Because gradients are a pure function of the lattice cell, there is no seed. The live `domainOffset` is the supported way to move or vary the composition.

## GPU design

Use the same integration boundary as Random Dots: a Foldkit Custom Element owns browser resources, while a TypeGPU renderer owns the root, context, pipeline, uniform buffer, draw calls, and teardown.

```text
Foldkit Model → scene view → noise-beams GPU custom element
                                  ↓
                            TypeGPU renderer
                         ┌────────┴────────┐
                       uniform          pipeline
                         ↓                  ↓
                  field definition    instanced beam quads
                                           ↓
                                        WebGPU
```

### Per-instance derivation

The draw has `columns × rows` instances and six vertices per instance. The vertex shader derives all per-instance values:

```text
column = instanceIndex % columns
row    = floor(instanceIndex / columns)
center = grid origin + (column + 0.5, row + 0.5) × cell spacing
noise  = perlin2d(center / cellSize + domainOffset)
angle  = base angle + noise × amplitude
```

It selects one of six local quad corners from `vertexIndex`, scales it by beam length and thickness, rotates it by `angle`, translates it to `center`, and converts the result to clip space. It also passes the corner as a beam-local `vec2f` in `-1..1` to the fragment stage.

### Fragment coverage

The fragment shader is **not** opaque. At a thickness near 1.6 logical pixels an opaque rectangle aliases badly along its rotated edges, which is the exact problem Random Dots already solves for dot rims. Reuse that approach: compute coverage from the beam-local coordinate with `std.fwidth` and `std.smoothstep` on the `across` axis, and emit the beam colour with that coverage as alpha.

```text
coverage = 1 - smoothstep(1 - fwidth(|across|), 1 + fwidth(|across|), |across|)
```

Use the same premultiplied `src-alpha` / `one-minus-src-alpha` blend state and `alphaMode: 'premultiplied'` context configuration as the Random Dots pipeline, so overlapping beam ends composite rather than punch out.

### Uniform layout and alignment

This scene introduces a uniform buffer, which Random Dots did not need: it drove everything from a vertex layout. WGSL `vec2f` is 8-byte aligned and the struct itself rounds up to 16 bytes, so field order matters and implicit padding is easy to get wrong.

Group scalars into `vec2f` pairs and place the `vec4f` colour last, which leaves a layout with no implicit holes:

```ts
const FieldUniform = d.struct({
  canvasSize: d.vec2f, // width, height
  gridSize: d.vec2f, // columns, rows
  paddingAndCellSize: d.vec2f,
  beamSize: d.vec2f, // length, thickness
  domainOffset: d.vec2f,
  angleControls: d.vec2f, // baseAngleRadians, amplitudeRadians
  color: d.vec4f,
})
```

`columns` and `rows` are integers carried as `f32`; the vertex shader converts them with `d.u32` when deriving `column` and `row` from `instanceIndex`. Their magnitudes are far below the point where `f32` loses integer precision.

This needs no storage buffer, compute pass, random command, or per-frame geometry upload. The renderer creates the uniform once, then patches only `domainOffset` before each changed frame.

The renderer clears the presentation texture to `background` and draws:

```text
draw(vertexCount: 6, instanceCount: columns × rows)
```

The Custom Element should retain the existing Random Dots responsibilities:

- create the `canvas` in a shadow root;
- synchronize backing resolution with CSS width and device-pixel ratio;
- initialize TypeGPU only when connected;
- report ready, unsupported, and initialization-failed facts;
- redraw after resize and destroy the TypeGPU root when disconnected.

There is no independent renderer animation loop.

## Scene lifecycle and module ownership

The renderer lifecycle stays deliberately small while the active state owns motion:

```text
WaitingNoiseBeams → DrawingNoiseBeams { domainOffset }
        │                 │
        ├─ unsupported ───┴→ UnsupportedRenderer
        └─ initialization failure → FailedRenderer
```

`CompletedInitializeRenderer` moves the scene to `DrawingNoiseBeams` at the configured initial offset. `Subscription.animationFrame` is active only in that state and emits `TickedFrame({ deltaTimeMs })`; waiting and terminal states ignore frame facts. GPU resources never enter the Schema Model.

Recommended module shape:

```text
src/scenes/noise-beams/
├── index.ts
├── constants.ts             concrete field definition
├── engine/
│   └── definition.ts        renderer-independent API and validation
├── gpu/
│   ├── element.ts           Custom Element and resource lifetime
│   └── renderer.ts          TypeGPU schema, shaders, pipeline, and drawing
├── model.ts                 Waiting, drawing, unsupported, and failed states
├── message.ts               renderer facts
├── update.ts                pure state transitions
├── subscriptions.ts         active-state animation frames
├── view.ts                  scene HTML and declarative GPU-element input
├── story.test.ts
└── scene.test.ts
```

The route, root Model, lifted message, scene-list card, and mount follow the existing Random Dots integration pattern. The scene card copy should describe it as a “Perlin-noise orientation field rendered with WebGPU.”

## Motion

Only `domainOffset` evolves:

```text
domainOffset(t + Δt) = domainOffset(t) + drift × Δt
```

The intentional drift is `x: 0.08`, `y: 0.045` noise cells per second. Both axes move slowly enough for nearby frames to remain coherent while producing a visible change over several seconds.

`DrawingNoiseBeams` carries the current `domainOffset`. A `Subscription.animationFrame`, additionally gated by the active route at the root, emits `TickedFrame({ deltaTimeMs })`. The pure update advances the offset from elapsed time. The view passes both coordinates as one typed Custom Element property, so one Model update causes one property setter. The element compares both coordinates, patches the existing uniform through `updateDomainOffset`, and redraws only when the value changed. It neither owns an animation loop nor recreates the TypeGPU root, pipeline, or buffer per frame. Resize still redraws the current uniform state, and disconnect still destroys the root.

## Tests and verification

### Noise tests

- the ported GPU Perlin function agrees with `prism-field`'s CPU `perlin2` across a sampled grid of coordinates, within floating-point tolerance;
- the function is continuous across lattice-cell boundaries;
- output stays within roughly `[-1, 1]`.

### Engine tests

- reject non-positive grid dimensions, cell sizes, and beam dimensions;
- reject a padded grid with no drawable interior;
- reject a beam whose `length` exceeds the smaller cell dimension;
- accept a beam whose rotated footprint touches its neighbours, since the reference field is deliberately dense;
- accept the proposed composition;
- preserve the public field definition without renderer types or browser objects.

### Story and pure tests

- `init` begins in `WaitingNoiseBeams`;
- renderer ready enters `DrawingNoiseBeams` at the configured initial offset;
- a frame delta advances both axes by the chosen per-second drift;
- waiting, unsupported, and failed states ignore frame facts;
- the animation-frame Subscription is active only while drawing;
- equal combined offset values are recognized as unchanged, while either changed coordinate is detected;
- unsupported and failure facts enter their corresponding accessible states;
- a late ready fact cannot replace either terminal renderer failure state.

### Scene tests

- the drawing state exposes an accessible label describing noise-driven beam orientation;
- a frame fact flows through update and into the combined typed `domainOffset` Custom Element property;
- unsupported and failed states expose an alert.

### Browser tests

- the canvas has the configured logical 600 × 400 size and responsive backing resolution;
- beam centres remain fixed while smoothly varying angles visibly evolve over several seconds;
- changed offsets increase the draw count without replacing the Custom Element or reinitializing GPU resources;
- equal offsets do not cause another uniform write or draw;
- resize redraws the current offset;
- GPU initialization, shader compilation, and drawing produce no browser console or WebGPU validation errors;
- route unmount destroys the renderer.

## Decisions

- Model tilt as a single in-plane angle, not 3D beam orientation.
- Use world `x`/`y`, grid row/column, beam-local along/across, and noise-domain `u`/`v` as distinct axes.
- Sample Perlin noise at beam centres in logical canvas coordinates.
- Port the project's existing CPU Perlin to a `tgpu.fn` instead of depending on `@typegpu/noise`, keeping the scene to one uniform with no gradient buffer or bind group.
- Match canvas aspect to grid aspect so cells are square.
- Bound the beam-fit rule by rotated footprint, and allow neighbours to touch.
- Antialias beam edges with `fwidth`/`smoothstep` coverage rather than drawing opaque rectangles.
- Map signed noise symmetrically around a base direction with an amplitude in radians.
- Derive geometry from `instanceIndex` in the vertex shader; upload only one field-control uniform.
- Keep beam centres fixed and animate only the noise-domain offset at `x: 0.08`, `y: 0.045` cells per second.
- Let Foldkit own frame progression and patch the existing GPU uniform without a renderer-side animation loop.
- Keep the scene GPU-only, with no CPU random generation or Canvas 2D fallback.

## Out of scope

- Simplex noise as a selectable algorithm;
- interactive sliders, presets, or seed controls;
- 3D pitch, roll, lighting, or shadowing;
- particle advection, trails, or flow integration;
- a WebGL or Canvas 2D fallback.
