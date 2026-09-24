# 3D Liquid Noise Beams — Technical Specification

## Summary

Noise Beams renders a large field of lit cylindrical rods from directly overhead. Every rod is a ground-rooted post: its bottom endpoint stays at one fixed grid point while coherent Perlin waves move only its top endpoint. Perspective depth, pivoted geometry, directional lighting, and soft projected shadows make the top-down composition read as 3D.

This specification supersedes the centred-cylinder model in the prior version of this document and the 2D decisions in `docs/tech-spec-noise-beam-field.md`. The route, Foldkit child boundary, WebGPU-only target, retained Custom Element, responsive backing resolution, and Foldkit-owned animation remain unchanged.

## Composition and rooted geometry

The logical scene is `1000 × 700`. Its desktop view width is `1000px` with `max-width: 100%`, so narrow layouts preserve the `10:7` aspect ratio without horizontal overflow. The grid is:

```text
columns = 78
rows    = 52
padding = 40
instances = 4,056
cell width  = 920 / 78 ≈ 11.795
cell height = 620 / 52 ≈ 11.923
```

Each mark is a capped cylinder with a 12-segment radial section. The static unit mesh uses these local axes and bounds:

```text
local +Z = cylinder axis
bottom cap centre = (0, 0, 0)
top cap centre    = (0, 0, 1)
local XY = circular radial plane with radius 0.5
```

The vertex shader scales local `XY` by the `4.4` diameter and local `Z` by the `10.5` rod length. The opaque rod material is warm charcoal `rgba(0.28, 0.27, 0.25, 1)`.

Each instance has one immutable world root:

```text
root = (gridCenterX, gridCenterY, ground.elevation)
```

No noise sample or time value translates the root in world `x`, `y`, or `z`.

## Orientation vocabulary and endpoint transform

Azimuth is the compass direction around world `Z`. Tilt is the signed angle away from vertical. Roll is rotation around the rod's own axis; it is visually irrelevant for a circular cylinder and is not part of the model.

The base-pivot transform scales the unit mesh, applies local tilt around `Y`, then applies azimuth around world `Z`, and finally adds the fixed root. For scaled local position `(x, y, z)`:

```text
tiltedX = x cos(tilt) + z sin(tilt)
tiltedY = y
tiltedZ = -x sin(tilt) + z cos(tilt)

worldX = root.x + tiltedX cos(azimuth) - tiltedY sin(azimuth)
worldY = root.y + tiltedX sin(azimuth) + tiltedY cos(azimuth)
worldZ = root.z + tiltedZ
```

This gives exact cap-centre endpoints:

```text
bottom = root

top.x = root.x + length sin(tilt) cos(azimuth)
top.y = root.y + length sin(tilt) sin(azimuth)
top.z = root.z + length cos(tilt)
```

The bottom endpoint therefore remains equal to `root` for every azimuth, tilt, and time value. The top remains exactly one rod length from the root. Zero tilt points along world `+Z`, independent of azimuth.

## Liquid wave field

Two related moving Perlin domains control azimuth and tilt:

```text
flowPosition = worldXY / 190

azimuthNoise = perlin2(flowPosition + time × azimuthDrift)
tiltNoise = perlin2(
  flowPosition × 0.83 + tiltOffset + time × tiltDrift
)

azimuth = baseAzimuth + azimuthNoise × (π / 2)
tilt = tiltNoise × 0.9
```

The fast drift vectors remain:

```text
azimuthDrift = ( 0.90, 0.45) noise cells / second
tiltDrift    = (-0.65, 0.80) noise cells / second
```

The old orientation velocities map directly to these names. There is no height domain, height amplitude, or height drift. Root elevation always equals the fixed ground elevation.

## Perspective camera

The camera is renderer-independent data validated by `defineCamera`:

```ts
type Camera = Readonly<{
  eye: Point3
  target: Point3
  up: Point3
  verticalFovRadians: number
  near: number
  far: number
}>
```

The concrete camera is:

```text
eye          = (500, 350, 750)
target       = (500, 350,   0)
up           = (  0,  -1,   0)
vertical FOV = 55°
near         = 50
far          = 2500
aspect       = 1000 / 700
```

Validation requires finite vectors, distinct eye and target positions, a non-zero up vector that is not parallel to the view, a vertical FOV in `(0, π)`, a positive near distance, and `far > near`.

`engine/cameraProjection.ts` derives a fixed manual camera basis:

```text
forward  = normalize(target - eye)
right    = normalize(cross(forward, up))
cameraUp = normalize(cross(right, forward))
```

For `fromEye = worldPosition - eye`, shader projection uses positive camera-forward distance:

```text
cameraX = dot(fromEye, right)
cameraY = dot(fromEye, cameraUp)
cameraZ = dot(fromEye, forward)

tanHalfFov = tan(verticalFov / 2)
clip.x = cameraX / (tanHalfFov × aspect)
clip.y = cameraY / tanHalfFov
clip.w = cameraZ

depthScale = far / (far - near)
clip.z = cameraZ × depthScale - near × depthScale
```

The eye and target share `x/y`, so `forward = (0, 0, -1)` and the ground has one camera depth. The input up vector produces `cameraUp = (0, -1, 0)`. The depth expression maps the near plane to WebGPU NDC `z = 0` and the far plane to `z = 1`.

## Ground and rooted projected shadows

A warm ground plane spans the full `1000 × 700` field at world `z = -10.5`. Its opaque material is `rgba(0.82, 0.79, 0.72, 1)`. The clear color remains the lighter studio background.

Each rod gets one six-vertex instanced soft-shadow quad. The shadow shader samples the same azimuth, tilt, and elapsed-time uniform as the rod shader. It derives the same world top endpoint from the fixed root.

For normalized surface-to-light direction `L`, the top projects to the ground along the opposite light direction:

```text
topHeight = top.z - ground.elevation
projectedTop.xy = top.xy - L.xy × topHeight / L.z
```

The shadow segment is:

```text
shadowStart = root.xy
shadowEnd   = projectedTop.xy
```

The quad runs from `shadowStart` to `shadowEnd`. Its perpendicular width comes from the rod radius, and its fragment alpha softens the footprint edges. The quad sits `0.08` world units above the ground, uses `rgba(0.09, 0.08, 0.07, 0.2)`, alpha-blends, and does not write depth. The root never follows a translated centre, so the footprint pivots around the same fixed ground point as the rod.

This is a small GPU-native projected cue, not a shadow map. It adds no shadow texture, per-instance buffer, blur pass, or post-processing.

## GPU geometry and lighting

One renderer-independent 144-vertex capped-cylinder mesh is generated once on the CPU at module initialization. Its 12 radial segments use smooth radial `XY` normals on the sides and duplicated vertices with flat `-Z` and `+Z` normals on the caps. One static TypeGPU vertex buffer uploads this mesh during renderer setup and shares it across all `4,056` instances. Grid row, column, root, and wave values derive from `instanceIndex` in shaders. Ground and shadow quads derive six corners from `vertexIndex`, so they need no mesh upload.

The rod vertex shader applies the rooted endpoint transform above to positions and the same rotations to normals. The fragment shader uses:

```text
lightDirection = normalize(-0.35, -0.45, 0.82)
diffuse = max(dot(normalize(worldNormal), lightDirection), 0)
intensity = 0.34 + diffuse × 0.78
color = rodColor × intensity
```

A frame uses three fixed draw calls:

1. ground plane, clearing color and depth;
2. `4,056` instanced soft-shadow quads, loading both attachments;
3. `4,056` instanced rooted cylindrical rods, loading both attachments.

There are no per-instance CPU uploads and no frame-dependent mesh allocation.

## Uniforms and animation

The renderer retains one field uniform containing logical canvas and grid values, rod controls, azimuth and tilt controls, camera basis and projection values, ground values, and material colors. Setup writes the whole uniform once. Each animation update patches only the `timeSeconds` scalar through `d.memoryLayoutOf` and redraws.

Foldkit remains the sole animation owner:

```text
Subscription.animationFrame
  → TickedFrame(deltaTimeMs)
  → update increments elapsedSeconds
  → view passes timeSeconds
  → retained Custom Element patches one uniform field and draws
```

The Custom Element never calls `requestAnimationFrame`. Waiting and terminal Models ignore ticks. Route subscriptions remain gated by the drawing Model, and the root excludes lifted frame Messages from DevTools history.

## Depth, resize, and teardown

The renderer creates one `depth24plus` texture at the canvas backing dimensions. Opaque ground and rods use depth writes with `depthCompare: less`; shadows test depth but do not write it. Every frame clears depth to `1` before the ground draw.

The Custom Element computes backing dimensions from CSS width, the logical `1000:700` aspect, and bounded device-pixel ratio. A backing-size change destroys the old depth texture, creates and caches one matching replacement and view, then redraws with the current uniform state. It does not recreate the TypeGPU root, pipelines, or static rod buffer.

Disconnect destroys the depth texture and TypeGPU root. Initialization cleanup preserves the original configuration error if cleanup also fails. One retained Custom Element and root remain mounted while Foldkit time changes.

## Accessibility and status

The artwork label describes a live direct-overhead 3D field of cylindrical rods pivoting from fixed roots and casting soft shadows. Drawing status reports `4056 ground-rooted cylindrical rods pivoting in a direct-overhead 3D liquid field`. Waiting, unsupported, and failed renderer states keep their accessible status or alert behavior.

## Verification

Automated checks cover:

- validated cylindrical rod, wave, perspective camera, ground, and shadow definitions;
- the `1000 × 700`, `78 × 52`, 40-padding composition and `4,056` count;
- pure rooted endpoint invariants across several azimuth and tilt values;
- direct-overhead perspective basis, framing, rectangular ground projection, and `[0, 1]` clip depth;
- static mesh vertex count, local `Z` bounds `0..1`, flat cap normals, smooth radial side normals, outward winding, and seam closure;
- responsive backing resolution at `10:7`;
- Foldkit elapsed-time transitions and subscription gating;
- one `timeSeconds` property and rooted status and accessibility copy.

Browser verification must confirm:

- the canvas reaches `1000px` on a wide viewport and remains responsive when narrowed;
- the full ground plane appears as a centred rectangle with parallel opposite edges;
- every bottom endpoint stays at one fixed ground point while only the top moves;
- rod sides and flat caps separate under directional lighting;
- each soft shadow pivots from the fixed root toward the projected top;
- the scene changes within one second without jitter;
- `data-logical-width="1000"`, `data-logical-height="700"`, and `data-instance-count="4056"` are present;
- time and draw count advance on the same Custom Element;
- resizing replaces backing and depth resources without replacing the renderer;
- route exit marks renderer teardown;
- browser console and WebGPU validation remain clean.

## Decisions

- Use a fixed direct-overhead perspective camera.
- Root each post at its grid centre on the ground and move only its top endpoint.
- Drive only azimuth and signed tilt with coherent Perlin waves.
- Use capped 12-segment cylinders with radius `2.2` and length `10.5`.
- Project the derived top endpoint along the directional light to make a rooted soft shadow.
- Keep one static mesh buffer, one uniform, one retained renderer, one depth texture, and three fixed draw calls.
- Keep time and lifecycle ownership in Foldkit.

## Out of scope

- camera controls or orbit interaction;
- roll controls for circular rods;
- shadow maps, reflections, refraction, environment maps, or post-processing;
- compute-shader fluid simulation or particle advection;
- per-instance CPU transforms or uploads;
- interactive wave controls;
- WebGL or Canvas 2D fallback.
