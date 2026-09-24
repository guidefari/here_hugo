# Random Dot Fields — Technical Specification

## Summary

Change the Random Dots scene from one uniform square into a two-by-two composition of four smaller square dot fields:

1. a four-by-four weighted grid;
2. a uniform field;
3. a field concentrated toward the top edge;
4. a field concentrated around its center.

Each panel contains exactly 20,000 dots, for 80,000 total. Dot radius is derived from panel width so the smaller panels use appropriately smaller marks. One Foldkit animation update advances all four panels together.

The main design goal is an intuitive, renderer-independent configuration API. Callers should describe the visual distribution they want without choosing a sampling algorithm.

## User-facing result

The 600 × 600 canvas contains four equal square panels with a consistent gap. Every panel has the same dimensions, dot count, dot style, and background. Only its spatial distribution changes.

| Position     | Distribution      | Meaning                                                                              |
| ------------ | ----------------- | ------------------------------------------------------------------------------------ |
| Top left     | `Grid`            | A four-by-four matrix of relative weights controls how many dots each cell receives. |
| Top right    | `Uniform`         | Every position has equal probability.                                                |
| Bottom left  | `Edge` from `Top` | Density is greatest at the top and falls toward the bottom.                          |
| Bottom right | `Radial`          | Density is greatest at a configurable center and falls with distance.                |

The panel gap is not part of any sampling region. Dots must remain inside their panel.

## Configuration API

Use a closed distribution union rather than an arbitrary density callback. The union gives each visual idea a name, supports exhaustive matching, and can later be represented by Effect Schema if controls make the configuration part of the Model.

```ts
type NormalizedPoint = Readonly<{
  x: number
  y: number
}>

type Concentration = Readonly<{
  spread: number
  strength: number
  background: number
}>

type DotDistribution =
  | Readonly<{
      _tag: 'Uniform'
    }>
  | Readonly<{
      _tag: 'Grid'
      divisions: number
      weights: ReadonlyArray<number>
    }>
  | Readonly<{
      _tag: 'Edge'
      from: 'Top' | 'Right' | 'Bottom' | 'Left'
      concentration: Concentration
    }>
  | Readonly<{
      _tag: 'Radial'
      center: NormalizedPoint
      concentration: Concentration
    }>

type DotPanelDefinition = Readonly<{
  id: string
  distribution: DotDistribution
}>

type DotCompositionDefinition = Readonly<{
  width: number
  height: number
  columns: number
  gap: number
  padding: number
  dotCountPerPanel: number
  dotRadiusRatio: number
  panels: ReadonlyArray<DotPanelDefinition>
}>
```

The scene definition should read close to the visual intent:

```ts
const composition = defineDotComposition({
  width: 600,
  height: 600,
  columns: 2,
  gap: 60,
  padding: 30,
  dotCountPerPanel: 20_000,
  dotRadiusRatio: 1 / 800,
  panels: [
    {
      id: 'weighted-grid',
      distribution: Grid({
        divisions: 4,
        weights: [
          1.2, 1.2, 1.2, 1.2, 1.15, 0.12, 0.65, 1, 0.18, 0.25, 1.3, 1.15, 0.04,
          0.06, 0.75, 1,
        ],
      }),
    },
    { id: 'uniform', distribution: Uniform() },
    {
      id: 'top-heavy',
      distribution: Edge({
        from: 'Top',
        concentration: {
          spread: 0.82,
          strength: 1.5,
          background: 0.002,
        },
      }),
    },
    {
      id: 'centered',
      distribution: Radial({
        center: { x: 0.5, y: 0.5 },
        concentration: {
          spread: 0.8,
          strength: 3.2,
          background: 0.0015,
        },
      }),
    },
  ],
})
```

Constructor functions validate and hide `_tag` values from callers. Configuration numbers use these domains:

- normalized coordinates: `0..1`;
- `divisions`: an integer from `1..32`;
- grid weights: exactly `divisions × divisions` finite numbers greater than or equal to zero, with at least one positive weight;
- `dotCountPerPanel`: a positive integer;
- `dotRadiusRatio`: greater than zero;
- concentration `spread`: greater than zero, measured as a normalized fraction of panel size;
- concentration `strength`: greater than zero, where `1` is linear and larger values cluster dots more tightly;
- concentration `background`: `0..1`, controlling residual density away from the attractor.

The grid uses a flat row-major array because its required length is explicit: a four-by-four grid has `divisions: 4` and exactly 16 weights. The constructor rejects missing or excess entries. Divisions do not need to be multiples of four; any whole number divides normalized panel space cleanly, while the upper bound prevents an accidentally huge configuration.

For a panel of width `w`, derive its mark size as:

```text
dot radius = w × dotRadiusRatio
```

At the configured panel width of 240, the example ratio produces a radius of 0.3 logical pixels. The count remains exactly 20,000 regardless of panel dimensions.

The shared `concentration` object separates three visual controls. `spread` sets the geometric reach of the dense region. `strength` controls how strongly dots favor the edge or center within that reach. `background` controls the outer haze; `0` permits empty space.

## Distribution semantics

### Uniform

Generate each point independently over the full panel bounds.

### Weighted grid

Weights are relative and do not need to add to one. For a panel with `N` dots and cell weights `wᵢ`, the ideal cell count is:

```text
N × wᵢ / sum(weights)
```

Allocate exact integer counts with the largest-remainder method:

1. take the floor of every ideal count;
2. distribute the remaining dots to cells with the largest fractional remainders;
3. break equal remainders by row-major cell order;
4. sample uniformly inside each cell;
5. shuffle the combined points before animation.

This guarantees that the configured weights determine the actual allocation, the panel always contains exactly `N` dots, and generation remains deterministic under controlled randomness. A zero-weight cell receives no dots.

### Edge concentration

Map a point to normalized distance `d` from the selected edge, where `0` is the source edge and `1` is the opposite edge.

### Radial concentration

Measure normalized Euclidean distance `d` from `center`. The center point is the radial attractor; `spread` acts as its radius of influence.

Both variants use the same density function:

```text
normalizedDistance = clamp(d / spread, 0, 1)

weight =
  background +
  (1 - background) × (1 - normalizedDistance) ^ strength
```

Positions beyond `spread` use `background`. The sampler must produce this density without exposing rejection sampling, bin resolution, or inverse-CDF details through the public API.

## Placement and reveal order are separate concepts

“Dots are concentrated at the top” and “drawing starts at the top” are different controls:

- `distribution` decides where dots exist;
- `revealOrder` decides the order in which existing dots appear.

This change needs only spatial distribution. Generated points should be shuffled so sampling order does not leak into the animation. If directional animation is added later, extend each panel with a separate union:

```ts
type RevealOrder =
  | Readonly<{ _tag: 'Random' }>
  | Readonly<{ _tag: 'FromEdge'; edge: 'Top' | 'Right' | 'Bottom' | 'Left' }>
  | Readonly<{ _tag: 'FromPoint'; point: NormalizedPoint }>
```

Do not add this control until the desired animation behavior is confirmed.

## Architecture

Keep dot generation and renderer initialization concurrent, with legal renderer failure states:

```text
GeneratingDots → DrawingDots → ReadyDots
      │               ↓
      │           TickedFrame
      │
      └─ renderer initialization runs with the mounted GPU element
             ├─ CompletedInitializeRenderer → keep current artwork state
             ├─ DetectedUnsupportedRenderer → UnsupportedRenderer
             └─ FailedInitializeRenderer → FailedRenderer
```

Randomness remains inside an Effect-backed Command. Foldkit remains the only owner of state transitions and animation frames. TypeGPU owns rendering resources but does not start an independent animation loop. A late generation result cannot replace an unsupported or failed renderer state.

Recommended module shape:

```text
src/scenes/random-dots/
├── engine/
│   ├── distribution.ts       Distribution definitions and relative-density rules
│   ├── layout.ts             Panel rectangles from composition dimensions
│   └── weightedAllocation.ts Exact grid allocation
├── gpu/
│   ├── dotInstance.ts        TypeGPU instance schema and panel interleaving
│   ├── pipeline.ts           Instanced-quad vertex and fragment pipeline
│   └── renderer.ts           Root, context, buffer, draw, and cleanup
├── constants.ts              The concrete four-panel composition
├── model.ts                  Generated artwork, reveal progress, and lifecycle
├── message.ts                Generation, animation, and renderer facts
├── update.ts                 Commands and pure transitions
├── subscriptions.ts          Animation-frame subscription
├── view.ts                   HTML and declarative GPU canvas input
├── story.test.ts
└── scene.test.ts
```

The pure engine owns layout, density evaluation, and exact allocation. `update.ts` owns Effect `Random` sampling and returns generated panel points in `CompletedGenerateDots`. The `gpu/` adapter owns TypeGPU and browser resources. GPU objects never enter the Schema Model.

Store points in panel-local coordinates together with a stable panel ID. Before upload, interleave the four panel collections by reveal cycle. The complete 80,000-dot instance collection is uploaded once per generated artwork.

## Model shape

Replace the flat `points` collection in drawing and ready states with panel artwork:

```ts
type PanelArtwork = Readonly<{
  id: string
  origin: Canvas.Point
  size: number
  points: ReadonlyArray<Canvas.Point>
}>
```

Because Model fields must be Schema values, the implementation must define this with Effect Schema. The lifecycle remains a tagged union. `DrawingDots.visibleCountPerPanel` records synchronized progress from `0..20,000`.

A frame tick advances `visibleCountPerPanel` from elapsed time. The complete reveal lasts 5,000 milliseconds regardless of the configured point count. Rendering derives the GPU instance count as `visibleCountPerPanel × 4`, so one update and one draw advance every panel together.

## Rendering

- Use TypeGPU directly over native WebGPU; do not use `@typegpu/gl`.
- Keep the logical canvas at 600 × 600 while scaling its backing buffer to the displayed CSS size and device pixel ratio, capped at 4×.
- Recompute the backing resolution after responsive resizes and browser zoom changes.
- Use a two-column layout with four 240-pixel square panels, 30-pixel outer padding, and a 60-pixel gap.
- Generate exactly 20,000 dots per panel and derive dot radius from panel width.
- Upload one interleaved 80,000-instance vertex buffer per artwork.
- Render each dot as an instanced quad whose fragment shader derives smooth circle coverage with `fwidth` and alpha blending.
- Issue one draw call with six vertices and `visibleCountPerPanel × 4` instances.
- Preserve a white background, black dots, and subtle panel boundaries.
- Clip points to panel bounds by construction.
- Update the accessible label to describe four random-dot distribution studies.
- Status uses per-panel progress: `visible / 20,000 points per panel`.
- Render an accessible unsupported state when WebGPU initialization fails.

The exact panel size remains owned by `layout.ts`. GPU roots, devices, buffers, contexts, and pipelines are managed resources outside the Model. See `docs/random-dots-rendering-architecture.md` for the before-and-after data flow.

## Tests

### Pure engine tests

- layout returns four equal non-overlapping square panel rectangles inside the canvas;
- grid construction rejects a weight count other than `divisions × divisions`;
- grid allocation always totals exactly 20,000 dots;
- zero-weight cells receive zero dots;
- equal weights differ by at most one dot after allocation;
- larger weights never receive fewer dots than smaller weights, apart from documented rounding ties;
- edge density is greatest at its selected edge and decreases monotonically;
- radial density is greatest at its center and decreases monotonically with distance;
- invalid definitions are rejected by constructors.

### Story tests

- initialization enters `GeneratingDots` and returns `GenerateDots`;
- completed generation enters `DrawingDots` with four 20,000-point panels;
- one frame tick advances `visibleCountPerPanel` for all panels together;
- frame ticks never exceed 20,000 visible points per panel;
- the final frame enters `ReadyDots`;
- generation failure enters `FailedDots`;
- renderer initialization failure enters an accessible unsupported or failed state.

### Scene tests

- drawing and ready states expose the revised accessible canvas label;
- progress reports synchronized per-panel progress;
- the rendered GPU canvas represents four panel regions;
- no scene test depends on private sampling helpers.

### Browser verification

Verify the route in a real browser:

- all four panels are visible and square;
- the top-left panel visibly follows its four-by-four weight map;
- the top-right panel appears uniform;
- the bottom-left panel falls from top to bottom;
- the bottom-right panel forms a centered round cluster;
- TypeGPU initializes through native WebGPU;
- each panel contains 20,000 completed dots;
- animation progresses across all four panels together;
- artwork uploads once and frame updates issue one instanced draw;
- no point appears in a gap or outside the canvas;
- route unmount releases renderer resources;
- the browser console has no TypeGPU or WebGPU errors.

## Decisions

- Generate exactly 20,000 dots per panel, for 80,000 total.
- Derive dot radius from panel width so smaller panels use smaller marks.
- Advance all panels together through one per-panel reveal count.
- Treat grid weights as exact allocation targets, not independent probabilities.
- Use named distribution variants instead of one generic callback.
- Keep reveal order independent from spatial distribution.
- Generate all four panels in one Command and animate them as one artwork.
- Render through TypeGPU over native WebGPU with one interleaved instance buffer and one draw call.
- Target modern macOS browsers and show an unsupported state rather than maintaining a WebGL fallback.

## Out of scope

- interactive controls for editing weights or concentration;
- user-supplied seeds and repeatable saved compositions;
- combining several distributions in one panel;
- arbitrary masks or image-derived density maps;
- directional reveal controls;
- WebGL or Canvas 2D fallback rendering;
- changes to the shared Canvas 2D renderer.

These can be added later without changing the four initial distribution variants.
