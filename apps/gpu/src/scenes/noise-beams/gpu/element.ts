import { Schema as S } from 'effect'
import { CustomElement } from 'foldkit'

import * as Theme from '../../../theme'
import { NOISE_BEAM_FIELD } from '../constants'
import { canvasBackingResolution } from './canvasResolution'
import { NoiseBeamRenderer, createNoiseBeamRenderer } from './renderer'

const ELEMENT_TAG = 'noise-beams-gpu-canvas'

export const noiseBeamsGpuCanvas = CustomElement.define({
  tag: ELEMENT_TAG,
  properties: {
    timeSeconds: S.Number,
    seed: S.Int,
    palette: Theme.Palette,
  },
  events: {
    'renderer-ready': S.Struct({}),
    'renderer-unsupported': S.Struct({}),
    'renderer-failed': S.Struct({ reason: S.String }),
  },
})

class NoiseBeamsGpuCanvasElement extends HTMLElement {
  readonly #canvas = document.createElement('canvas')
  #renderer: NoiseBeamRenderer | undefined
  #timeSeconds = 0
  #seed = 0
  #palette = Theme.darkPalette
  #initialization: Promise<void> | undefined
  #resizeObserver: ResizeObserver | undefined
  #lifecycle = 0
  #drawCount = 0

  constructor() {
    super()

    this.#canvas.width = NOISE_BEAM_FIELD.width
    this.#canvas.height = NOISE_BEAM_FIELD.height
    this.#canvas.style.display = 'block'
    this.#canvas.style.width = '100%'
    this.#canvas.style.height = 'auto'
    this.#canvas.style.aspectRatio = `${NOISE_BEAM_FIELD.width} / ${NOISE_BEAM_FIELD.height}`

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.append(this.#canvas)
  }

  set palette(palette: Theme.Palette) {
    this.#palette = palette

    if (this.#renderer === undefined) {
      return
    }

    this.#renderer.updatePalette(palette)
    this.#draw()
  }

  set seed(seed: number) {
    if (this.#seed === seed) {
      return
    }

    this.#seed = seed
    this.dataset.seed = String(seed)

    if (this.#renderer === undefined) {
      return
    }

    this.#renderer.updateSeed(seed)
    this.#draw()
  }

  set timeSeconds(timeSeconds: number) {
    if (this.#timeSeconds === timeSeconds) {
      return
    }

    this.#timeSeconds = timeSeconds
    this.dataset.timeSeconds = String(timeSeconds)

    if (this.#renderer === undefined) {
      return
    }

    this.#renderer.updateTime(timeSeconds)
    this.#draw()
  }

  connectedCallback(): void {
    this.dataset.logicalWidth = String(NOISE_BEAM_FIELD.width)
    this.dataset.logicalHeight = String(NOISE_BEAM_FIELD.height)
    this.dataset.timeSeconds = String(this.#timeSeconds)
    this.dataset.seed = String(this.#seed)
    delete this.dataset.rendererDestroyed
    this.#resizeObserver = new ResizeObserver(this.#syncCanvasResolution)
    this.#resizeObserver.observe(this)
    window.addEventListener('resize', this.#syncCanvasResolution)
    this.#syncCanvasResolution()

    const lifecycle = this.#lifecycle + 1
    this.#lifecycle = lifecycle
    this.#initialization = this.#initialize(lifecycle)
  }

  disconnectedCallback(): void {
    this.#resizeObserver?.disconnect()
    this.#resizeObserver = undefined
    window.removeEventListener('resize', this.#syncCanvasResolution)
    this.#lifecycle += 1
    this.#renderer?.destroy()
    this.#renderer = undefined
    this.#initialization = undefined
    this.dataset.rendererDestroyed = 'true'
  }

  readonly #syncCanvasResolution = (): void => {
    const resolution = canvasBackingResolution(
      this.getBoundingClientRect().width,
      NOISE_BEAM_FIELD.width,
      NOISE_BEAM_FIELD.height,
      window.devicePixelRatio,
    )

    if (
      this.#canvas.width === resolution.width &&
      this.#canvas.height === resolution.height
    ) {
      return
    }

    this.#canvas.width = resolution.width
    this.#canvas.height = resolution.height
    this.dataset.backingResolution = `${resolution.width}x${resolution.height}`

    if (this.#renderer === undefined) {
      return
    }

    this.#renderer.resize(resolution.width, resolution.height)
    this.#recordDraw()
  }

  #draw(): void {
    if (this.#renderer === undefined) {
      return
    }

    this.#renderer.draw()
    this.#recordDraw()
  }

  #recordDraw(): void {
    this.#drawCount += 1
    this.dataset.drawCount = String(this.#drawCount)
    this.dataset.instanceCount = String(
      NOISE_BEAM_FIELD.grid.columns * NOISE_BEAM_FIELD.grid.rows,
    )
  }

  async #initialize(lifecycle: number): Promise<void> {
    if (!('gpu' in navigator)) {
      this.dispatchEvent(
        new CustomEvent('renderer-unsupported', {
          detail: {},
          bubbles: true,
          composed: true,
        }),
      )

      return
    }

    let renderer: NoiseBeamRenderer | undefined

    try {
      renderer = await createNoiseBeamRenderer(
        this.#canvas,
        NOISE_BEAM_FIELD,
        this.#palette,
        this.#seed,
      )

      if (lifecycle !== this.#lifecycle || !this.isConnected) {
        renderer.destroy()

        return
      }

      if (this.#timeSeconds !== 0) {
        renderer.updateTime(this.#timeSeconds)
      }

      renderer.draw()
      this.#renderer = renderer
      renderer = undefined
      this.#recordDraw()
      this.dispatchEvent(
        new CustomEvent('renderer-ready', {
          detail: {},
          bubbles: true,
          composed: true,
        }),
      )
    } catch (cause: unknown) {
      try {
        renderer?.destroy()
      } catch {
        // NOTE: Cleanup failure must not replace the renderer failure.
      }

      if (lifecycle !== this.#lifecycle || !this.isConnected) {
        return
      }

      this.dispatchEvent(
        new CustomEvent('renderer-failed', {
          detail: { reason: String(cause) },
          bubbles: true,
          composed: true,
        }),
      )
    }
  }
}

export const registerNoiseBeamsGpuElement = (): void => {
  if (customElements.get(ELEMENT_TAG) === undefined) {
    customElements.define(ELEMENT_TAG, NoiseBeamsGpuCanvasElement)
  }
}
