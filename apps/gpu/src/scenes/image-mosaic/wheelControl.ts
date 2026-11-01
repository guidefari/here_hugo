import { Schema } from 'effect'
import { CustomElement } from 'foldkit'

const ELEMENT_TAG = 'mosaic-wheel-control'

export const wheelControl = CustomElement.define({
  tag: ELEMENT_TAG,
  properties: {},
  events: { 'scrolled-control': Schema.Struct({ direction: Schema.Number }) },
})

class MosaicWheelControlElement extends HTMLElement {
  connectedCallback(): void {
    this.addEventListener('wheel', this.#onWheel, { passive: false })
  }

  disconnectedCallback(): void {
    this.removeEventListener('wheel', this.#onWheel)
  }

  readonly #onWheel = (event: WheelEvent): void => {
    if (
      !(event.target instanceof HTMLInputElement) ||
      event.target.type !== 'range' ||
      document.activeElement !== event.target ||
      event.target.disabled ||
      event.deltaY === 0
    ) {
      return
    }

    event.preventDefault()
    this.dispatchEvent(
      new CustomEvent('scrolled-control', {
        detail: { direction: -Math.sign(event.deltaY) },
        bubbles: true,
        composed: true,
      }),
    )
  }
}

export const registerMosaicWheelControl = (): void => {
  if (!customElements.get(ELEMENT_TAG)) {
    customElements.define(ELEMENT_TAG, MosaicWheelControlElement)
  }
}
