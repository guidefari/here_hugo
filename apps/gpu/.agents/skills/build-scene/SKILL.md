---
name: build-scene
description: Design, add, change, or audit a visual scene in Effect Art Studio. Use for scene modules, generative-art algorithms, canvas frames, scene animation, Effect randomness, Foldkit Commands or Subscriptions, scene routes, and scene tests.
---

# Build a Scene

Build each scene as a cohesive feature module with a small interface. Keep renderer-independent art descriptions separate from Foldkit runtime code.

## Read First

1. Read `AGENTS.md` completely.
2. Read `src/canvas/canvas.ts` and `src/ui/canvasView.ts`.
3. Read the closest existing scene. Use `src/scenes/prism-field/` for animation, Commands, Subscriptions, or an engine.
4. Read `src/app.ts`, `src/route.ts`, and `src/ui/sceneList.ts` before integrating a route.

## Choose the Module Shape Before Coding

Use this default structure:

```text
src/scenes/<scene-name>/
├── index.ts          Intended interface only
├── constants.ts      Values shared by two or more scene modules
├── model.ts          Schema states and Model union
├── message.ts        Message declarations and union
├── update.ts         init, update, and the Commands update returns
├── subscriptions.ts  Model-derived continuous work
├── view.ts           Frame derivation and HTML
├── story.test.ts     Update and Command behavior
└── scene.test.ts     Rendered behavior
```

Add `engine/` when the scene has pure simulation, geometry, palette, or generation logic with its own reason to change.

Do not start with one `main.ts` when the scene has any two of these: async generation, animation, user interaction, controls, pure engine logic, or route integration. Do not wait for file length to expose seams already known from the requirements.

## Ownership Rules

- `model.ts` owns legal scene states. Use tagged states such as `Waiting | Generating | Drawing | Ready | Failed`; do not encode them with booleans or nullable fields.
- `message.ts` owns facts. Keep declarations together and use verb-first past-tense names.
- `update.ts` owns transitions and colocates each Command it returns. Randomness belongs in Effect Commands, never `Math.random()` or a view.
- `subscriptions.ts` owns work whose lifetime follows the Model. Use `Subscription.animationFrame` for animation; never `setTimeout`, `requestAnimationFrame`, or an imperative drawing loop.
- `view.ts` derives an immutable `Canvas.Frame` from the Model. It must not mutate a canvas, generate randomness, advance time, or start effects.
- `engine/` stays pure and imports neither Foldkit nor DOM modules. It may import the renderer-independent `src/canvas/canvas.ts` vocabulary.
- `index.ts` exports only what `app.ts` needs: usually `Model`, `Message`, `init`, `update`, `subscriptions`, `view`, and an inactive Model when route-lazy initialization needs one.

## Canvas and Animation

- Define each scene's own logical canvas dimensions. Do not copy another scene's dimensions without an explicit requirement.
- Describe points, shapes, paths, transforms, and frames with `src/canvas/canvas.ts`.
- Render browser HTML only through `src/ui/canvasView.ts`.
- Keep generated values in the Model when they are the source of the artwork.
- Express random generation as a Command backed by Effect `Random` or a scene Effect service.
- Express frame progression as a Subscription Message and a pure update transition.
- Reveal generated content through Model state. Never draw directly from a Command or event handler.
- Match visual speed to display frames. A point sequence may advance several logical points per animation frame while preserving sequence order; do not dispatch 10,000 Commands or force 10,000 full repaints.

## Root Integration

Complete every applicable step:

1. Add the route schema and router in `src/route.ts`.
2. Add the child Model and lifted Message in `src/app.ts`.
3. Initialize the scene only when its route needs it.
4. Fold child update results and lift child Commands.
5. Lift Subscriptions and gate them by the active route.
6. Mount the view with `h.submodel`.
7. Add the scene card in `src/ui/sceneList.ts`.
8. Exclude high-frequency lifted Messages from devtools history when needed.

## Build Workflow

1. State the scene lifecycle and file ownership before editing.
2. Add or change Story and Scene tests so the requested behavior fails first.
3. Implement the smallest complete transition through the real scene interface.
4. Run `bun run typecheck`, `bun run lint`, `bun run test`, and `bun run build`.
5. Test the route with `agent-browser`. Verify initial state, visible progress, completion, canvas dimensions, accessibility label, and browser console output.
6. Inspect `git diff --check` and the final module tree before committing.

## Stop Conditions

Stop and redesign before continuing if:

- one file owns Model, Messages, Commands, Subscriptions, and view;
- a view or event handler performs randomness or mutation;
- animation creates an unbounded Command chain;
- scene-specific rules leak into `app.ts` beyond child integration;
- the browser adapter enters pure engine code;
- tests need private helpers instead of the scene interface;
- the requested canvas shape or dimensions remain implicit.
