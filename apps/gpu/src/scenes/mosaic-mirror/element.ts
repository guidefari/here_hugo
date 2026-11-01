import { Effect, Option, Schema } from 'effect'
import { CustomElement } from 'foldkit'

import { openCamera } from './camera/session'
import type { CameraSession } from './camera/session'
import { Grid } from './engine/grid'
import { Settings } from './model'
import { createCanvasRenderer } from './render/canvas'
import type { Artwork, Renderer } from './render/canvas'

const ELEMENT_TAG = 'mosaic-mirror-canvas'

type CameraRequest = { mode: 'Stopped' | 'Active'; session: number }

export const mirrorCanvas = CustomElement.define({
  tag: ELEMENT_TAG,
  properties: {
    request: Schema.Struct({
      mode: Schema.Literals(['Stopped', 'Active']),
      session: Schema.Int,
    }),
    artwork: Schema.Struct({
      grid: Grid,
      levels: Schema.Array(Schema.Number),
      settings: Settings,
    }),
    timeMs: Schema.Number,
  },
  events: {
    'camera-started': Schema.Struct({ session: Schema.Int }),
    'camera-failed': Schema.Struct({
      session: Schema.Int,
      reason: Schema.String,
    }),
    'camera-paused': Schema.Struct({ session: Schema.Int }),
    'mask-received': Schema.Struct({
      session: Schema.Int,
      density: Schema.Int,
      grid: Grid,
    }),
  },
})

class MirrorCanvasElement extends HTMLElement {
  #canvas = document.createElement('canvas')
  #renderer: Option.Option<Renderer> = Option.none()
  #artwork: Option.Option<Artwork> = Option.none()
  #camera: Option.Option<CameraSession> = Option.none()
  #controller: Option.Option<AbortController> = Option.none()
  #request: CameraRequest = {
    mode: 'Stopped',
    session: 0,
  }
  #startedSession = -1
  #rendererLifecycle = 0

  constructor() {
    super()
    this.#canvas.style.cssText = 'display:block;width:100%;height:auto;'
    this.#canvas.width = 960
    this.#canvas.height = 720
    this.attachShadow({ mode: 'open' }).append(this.#canvas)
  }

  set request(request: CameraRequest) {
    this.#request = request
    this.#syncCamera()
  }

  set artwork(artwork: Artwork) {
    if (
      Option.isSome(this.#artwork) &&
      this.#artwork.value.grid === artwork.grid &&
      this.#artwork.value.levels === artwork.levels &&
      this.#artwork.value.settings === artwork.settings
    ) {
      return
    }

    this.#artwork = Option.some(artwork)
    this.#draw()
  }

  set timeMs(timeMs: number) {
    Option.match(this.#camera, {
      onNone: () => undefined,
      onSome: camera =>
        Option.match(this.#artwork, {
          onNone: () => undefined,
          onSome: artwork => camera.capture(timeMs, artwork.settings.density),
        }),
    })
  }

  connectedCallback(): void {
    this.#fallback()
    const lifecycle = ++this.#rendererLifecycle
    this.#initializeGpu(lifecycle)
    document.addEventListener('visibilitychange', this.#pauseWhenHidden)
    window.addEventListener('pagehide', this.#pause)
    this.#draw()
    this.#syncCamera()
  }

  disconnectedCallback(): void {
    this.#rendererLifecycle += 1
    document.removeEventListener('visibilitychange', this.#pauseWhenHidden)
    window.removeEventListener('pagehide', this.#pause)
    this.#stop()
    Option.match(this.#renderer, {
      onNone: () => undefined,
      onSome: renderer => renderer.destroy(),
    })
    this.#renderer = Option.none()
  }

  #draw(): void {
    try {
      Option.match(this.#renderer, {
        onNone: () => undefined,
        onSome: renderer =>
          Option.match(this.#artwork, {
            onNone: () => undefined,
            onSome: artwork => renderer.draw(artwork),
          }),
      })
    } catch {
      this.#fallback()
    }
  }

  #fallback(): void {
    Option.match(this.#renderer, {
      onNone: () => undefined,
      onSome: renderer => renderer.destroy(),
    })
    this.#canvas = this.#newCanvas()
    this.shadowRoot?.replaceChildren(this.#canvas)
    this.#renderer = Option.some(createCanvasRenderer(this.#canvas))
    this.dataset.renderer = 'canvas'
    Option.match(this.#artwork, {
      onNone: () => undefined,
      onSome: artwork =>
        Option.match(this.#renderer, {
          onNone: () => undefined,
          onSome: renderer => renderer.draw(artwork),
        }),
    })
  }

  #newCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'display:block;width:100%;height:auto;'

    return canvas
  }

  #initializeGpu(lifecycle: number): void {
    if (!('gpu' in navigator) || navigator.gpu === undefined) {
      return
    }

    const canvas = this.#newCanvas()
    Effect.runFork(
      Effect.tryPromise({
        try: async () => {
          const { createGpuRenderer } = await import('./render/gpu')

          return createGpuRenderer(canvas, () => {
            if (lifecycle === this.#rendererLifecycle && this.isConnected) {
              this.#fallback()
            }
          })
        },
        catch: () => undefined,
      }).pipe(
        Effect.match({
          onFailure: () => undefined,
          onSuccess: renderer => {
            if (lifecycle !== this.#rendererLifecycle || !this.isConnected) {
              renderer.destroy()

              return
            }

            Option.match(this.#renderer, {
              onNone: () => undefined,
              onSome: previous => previous.destroy(),
            })
            this.#canvas = canvas
            this.shadowRoot?.replaceChildren(canvas)
            this.#renderer = Option.some(renderer)
            this.dataset.renderer = 'webgpu'
            this.#draw()
          },
        }),
      ),
    )
  }

  #stop(): void {
    Option.match(this.#controller, {
      onNone: () => undefined,
      onSome: controller => controller.abort(),
    })
    Option.match(this.#camera, {
      onNone: () => undefined,
      onSome: camera => camera.stop(),
    })
    this.#controller = Option.none()
    this.#camera = Option.none()
    this.#startedSession = -1
    this.dataset.camera = 'stopped'
  }

  readonly #pauseWhenHidden = (): void => {
    if (document.hidden) {
      this.#pause()
    }
  }
  readonly #pause = (): void => {
    if (this.#startedSession < 0) {
      return
    }

    const session = this.#startedSession
    this.#stop()
    this.dispatchEvent(
      new CustomEvent('camera-paused', { detail: { session } }),
    )
  }

  #syncCamera(): void {
    if (!this.isConnected) {
      return
    }

    if (this.#request.mode === 'Stopped') {
      this.#stop()

      return
    }

    if (this.#startedSession === this.#request.session) {
      return
    }

    this.#stop()
    const session = this.#request.session
    const controller = new AbortController()
    this.#controller = Option.some(controller)
    this.#startedSession = session
    this.dataset.camera = 'starting'

    const emit = (
      name: string,
      detail: {
        session: number
        reason?: string
        density?: number
        grid?: Grid
      },
    ): void => {
      if (!controller.signal.aborted && this.isConnected) {
        this.dispatchEvent(new CustomEvent(name, { detail }))
      }
    }

    Effect.runFork(
      openCamera(
        {
          ready: () => {
            if (!controller.signal.aborted) {
              this.dataset.camera = 'running'
              emit('camera-started', { session })
            }
          },
          mask: (density, grid) =>
            emit('mask-received', { session, density, grid }),
          failed: reason => emit('camera-failed', { session, reason }),
        },
        controller.signal,
      ).pipe(
        Effect.match({
          onFailure: reason => emit('camera-failed', { session, reason }),
          onSuccess: camera => {
            if (controller.signal.aborted || !this.isConnected) {
              camera.stop()
            } else {
              this.#camera = Option.some(camera)
            }
          },
        }),
      ),
    )
  }
}

export const registerMirrorElement = (): void => {
  if (customElements.get(ELEMENT_TAG) === undefined) {
    customElements.define(ELEMENT_TAG, MirrorCanvasElement)
  }
}
