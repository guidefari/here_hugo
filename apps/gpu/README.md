# GPU Playground

An Effect-first laboratory for learning and making GPU art. Foldkit
controls the studio UI; Effect services own generation, randomness, resources,
and future rendering/export capabilities.

The playground is deployed at [gpu.guidefari.com](https://gpu.guidefari.com).
Its light and dark palettes come from `packages/theme`, shared with the main site.

## Architecture

The app is a URL-routed collection of independent visual scenes, browsable
from a landing page. The source is organized by responsibility:

```text
src/
├── canvas/         Renderer-independent geometry, shapes, and frames
├── route.ts        AppRoute union + routers (Home, one per scene, NotFound)
├── app.ts          Top-level Model/Message/update/view — composes scenes
├── entry.ts        Browser runtime composition and boot, routing wired up
├── ui/             Foldkit rendering adapters and shared HTML views
└── scenes/
    └── <scene-name>/
        ├── index.ts          Intended scene interface
        ├── model.ts          Schema states
        ├── message.ts        Message facts
        ├── update.ts         Transitions and Commands
        ├── subscriptions.ts  Model-derived continuous work
        ├── view.ts           Frame and HTML derivation
        └── engine/           Pure simulation when needed
```

Within a scene, the dependency direction is deliberate:

```text
scene/ (Foldkit shell) → engine/ (pure domain logic)
```

- `engine/` holds simulation math, noise, physics, and color/shape
  derivation as plain functions with no Foldkit or DOM dependencies —
  directly unit-testable, reusable outside the browser runtime. Effect
  services that provide randomness (e.g. a particle generator) also live
  here, since randomness is an explicit injected dependency, not ambient
  state.
- Each scene owns its Foldkit-facing interface: Model/Message schemas,
  Command orchestration, frame construction, HTML rendering, and subscriptions.
  Larger scenes split that interface into `scene/` and call `engine/` for the
  simulation step and shape derivation.
- `canvas/` defines the mathematical drawing space and frame vocabulary.
  `ui/canvasView.ts` interprets a frame with Foldkit's browser canvas renderer.
- `route.ts` maps URLs to scenes; `app.ts` mounts the active scene's
  Submodel and wires its Commands/Subscriptions into the top-level loop.
- `entry.ts` is the only file that starts the runtime.

Adding a new scene means adding a module under `scenes/<name>/`, one route in
`route.ts`, and one card in `ui/sceneList.ts`. The repo-local `build-scene`
skill in `.agents/skills/` defines the full workflow and ownership rules. Split
out an engine only when the scene has a distinct simulation core.

Scenes keep artwork state and animation under Foldkit while choosing the
renderer that fits their workload. Prism Field describes frames with
renderer-independent Canvas primitives. Random Dots uses a scene-local TypeGPU
adapter to upload stable artwork once and draw changing reveal progress through
WebGPU.

Prism Field is a noise-driven particle flow field. Its `ParticleGenerator`
service is requested by Foldkit Commands through the runtime's shared resource
layer; Commands do not own the random-generation rules themselves. Random Dots
generates four 20,000-point fields—a weighted grid, uniform field, edge
concentration, and radial concentration—then reveals all four together through
one instanced GPU draw.

## Getting Started

```bash
bun install
bun dev
```

## Checks

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

## Near-term direction

1. Introduce an `ArtworkRecipe` Schema with a stable seed and parameters.
2. Add a seeded random service so recipes reproduce exactly.
3. Move flow-field evolution behind an `ArtworkEngine` service.
4. Add SVG and offline renderer adapters.
5. Add recipe persistence, permalinks, and deterministic export.

## Learn More

- [Foldkit Documentation](https://github.com/foldkit/foldkit)
- [Effect Documentation](https://effect.website)
