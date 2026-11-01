# Mosaic Mirror

## D001: Separate person segmentation from mosaic rendering

Status: implemented. Date: 2026-11-01.

The scene needs a human silhouette, including people who stand still. Motion detection and brightness thresholds cannot provide that contract. TypeGPU can draw the tiles but does not supply a trained person detector.

Use MediaPipe Tasks Vision in a dedicated worker with the pinned Selfie Segmenter float16 model, version 1. Inference uses its CPU/WASM delegate, independent of WebGPU availability. The browser adapter transfers small camera frames, allows one inference at a time, and adapts capture frequency to processing time. WASM assets are bundled by Vite; the model is served from this application. No camera frames leave the device.

The existing GPU custom elements are rendering-only, so camera acquisition and worker lifetime belong in a separate scene-local adapter. Foldkit owns settings, camera status, tile levels, and animation-frame timing. The custom element translates those properties into resource operations and emits typed facts. Grid sampling and temporal smoothing stay pure.

Camera access starts only after an explicit click. Stop, unmount, backgrounding, failures, and late permission grants release tracks and terminate the worker. Returning from a hidden tab requires another click. Session IDs reject old results; density stamps reject results produced before a density change.

Canvas 2D renders the same tile levels without requiring WebGPU. A lazily loaded TypeGPU fullscreen shader replaces it after successful initialization. Initialization failure, drawing failure, or device loss retains or restores Canvas 2D without restarting the camera. Both renderers consume the same model-owned tile levels and settings. Revisit CPU inference if real-device measurements show unacceptable latency; do not make GPU inference a prerequisite for rendering fallback.

### Sources and assets

- [MediaPipe web image segmentation](https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter/web_js)
- Model source: `https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite`
- [MediaPipe model documentation and license](https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter/index#models)
- MediaPipe Tasks Vision is Apache-2.0 licensed; see `node_modules/@mediapipe/tasks-vision/package.json`.

### Verification

Story and Scene tests cover lifecycle transitions, invalid settings, stale results, controls, frame-subscription gating, and route integration. Browser checks used synthetic camera streams showing a real portrait and the actual model/worker, producing a stable silhouette. Both landscape and portrait frames were checked, including 96-cell density and a 320px viewport without horizontal overflow.

Browser checks also covered WebGPU rendering, Canvas rendering with WebGPU disabled, fallback after destroying the GPU device, empty-frame clearing, stop/unmount cleanup, tab-switch pausing, permission-denied feedback, and releasing a camera granted after startup was cancelled. These checks do not prove physical iOS or Android camera behavior or performance; those still require real-device testing.
