import { Schema as S } from 'effect'
import { CustomElement } from 'foldkit'

import * as Theme from '../../../theme'
import { PanelArtwork } from '../model'
import { canvasResolution } from './canvasResolution'
import { DotRenderer, createDotRenderer } from './renderer'

const ELEMENT_TAG = 'random-dots-gpu-canvas'

export const randomDotsGpuCanvas = CustomElement.define({
  tag: ELEMENT_TAG,
  properties: {
    artworkId: S.String,
    panels: S.Array(PanelArtwork),
    visibleCountPerPanel: S.Number,
    pointCountPerPanel: S.Number,
    palette: Theme.Palette,
  },
  events: {
    'renderer-unsupported': S.Struct({}),
    'renderer-failed': S.Struct({ reason: S.String }),
  },
})

class RandomDotsGpuCanvasElement extends HTMLElement {
  readonly #canvas = document.createElement('canvas')
  #renderer: DotRenderer | undefined
  #artworkId = ''
  #uploadedArtworkId: string | undefined
  #panels: ReadonlyArray<PanelArtwork> = []
  #visibleCountPerPanel = 0
  #pointCountPerPanel = 0
  #palette = Theme.darkPalette
  #initialization: Promise<void> | undefined
  #resizeObserver: ResizeObserver | undefined
  #lifecycle = 0
  #uploadCount = 0
  #drawCount = 0

  constructor() {
    super()

    this.#canvas.width = 600
    this.#canvas.height = 600
    this.#canvas.style.display = 'block'
    this.#canvas.style.width = '100%'
    this.#canvas.style.height = 'auto'

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.append(this.#canvas)
  }

  set artworkId(artworkId: string) {
    this.#artworkId = artworkId
    this.#drawArtwork()
  }

  set panels(panels: ReadonlyArray<PanelArtwork>) {
    this.#panels = panels
    this.#drawArtwork()
  }

  set visibleCountPerPanel(visibleCountPerPanel: number) {
    this.#visibleCountPerPanel = visibleCountPerPanel
    this.#drawArtwork()
  }

  set pointCountPerPanel(pointCountPerPanel: number) {
    this.#pointCountPerPanel = pointCountPerPanel
    this.#drawArtwork()
  }

  set palette(palette: Theme.Palette) {
    this.#palette = palette
    this.#renderer?.updatePalette(palette)
    this.#drawArtwork()
  }

  connectedCallback(): void {
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
    this.dataset.rendererDestroyed = 'true'
    this.#renderer = undefined
    this.#uploadedArtworkId = undefined
    this.#initialization = undefined
  }

  readonly #syncCanvasResolution = (): void => {
    const resolution = canvasResolution(
      this.getBoundingClientRect().width,
      window.devicePixelRatio,
    )

    if (
      this.#canvas.width === resolution &&
      this.#canvas.height === resolution
    ) {
      return
    }

    this.#canvas.width = resolution
    this.#canvas.height = resolution
    this.dataset.backingResolution = String(resolution)
    this.#drawArtwork()
  }

  #drawArtwork(): void {
    const renderer = this.#renderer

    if (
      renderer === undefined ||
      this.#artworkId === '' ||
      this.#pointCountPerPanel === 0 ||
      this.#panels.length === 0
    ) {
      return
    }

    if (this.#uploadedArtworkId !== this.#artworkId) {
      renderer.uploadArtwork(this.#panels, this.#pointCountPerPanel)
      this.#uploadedArtworkId = this.#artworkId
      this.#uploadCount += 1
      this.dataset.uploadCount = String(this.#uploadCount)
    }

    renderer.draw(this.#visibleCountPerPanel, this.#panels.length)
    this.#drawCount += 1
    this.dataset.drawCount = String(this.#drawCount)
    this.dataset.visibleInstanceCount = String(
      this.#visibleCountPerPanel * this.#panels.length,
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

    try {
      const renderer = await createDotRenderer(this.#canvas, this.#palette)

      if (lifecycle !== this.#lifecycle || !this.isConnected) {
        renderer.destroy()

        return
      }

      this.#renderer = renderer
      this.#drawArtwork()
    } catch (cause: unknown) {
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

export const registerRandomDotsGpuElement = (): void => {
  if (customElements.get(ELEMENT_TAG) === undefined) {
    customElements.define(ELEMENT_TAG, RandomDotsGpuCanvasElement)
  }
}
