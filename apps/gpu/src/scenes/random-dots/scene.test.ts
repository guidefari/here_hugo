import { expect, given, role, scene, text, withViewInputs } from 'foldkit/scene'
import { describe, test } from 'vitest'

import { darkPalette } from '../../theme'
import {
  DrawingDots,
  FailedRenderer,
  ReadyDots,
  UnsupportedRenderer,
} from './model'
import { update } from './update'
import { view } from './view'

const testView = withViewInputs(view, { palette: darkPalette })()

const panels = [
  {
    id: 'weighted-grid',
    origin: { x: 0, y: 0 },
    size: 290,
    dotRadius: 0.5,
    points: [{ x: 12, y: 34 }],
  },
  {
    id: 'uniform',
    origin: { x: 310, y: 0 },
    size: 290,
    dotRadius: 0.5,
    points: [{ x: 56, y: 78 }],
  },
]

const accessibleCanvasName =
  'Four animated random dot distribution studies on a white square canvas'

describe('view', () => {
  test('shows the completed point count and an accessible composition', () => {
    scene(
      { update, view: testView },
      given(
        ReadyDots({ artworkId: 'artwork-1', panels, pointCountPerPanel: 2 }),
      ),
      expect(text('2 points per panel')).toExist(),
      expect(role('img', { name: accessibleCanvasName })).toExist(),
    )
  })

  test('explains when WebGPU is unavailable', () => {
    scene(
      { update, view: testView },
      given(UnsupportedRenderer()),
      expect(role('alert')).toHaveText(
        'WebGPU is not available in this browser. Open the scene in a modern WebGPU-enabled browser.',
      ),
    )
  })

  test('explains when WebGPU initialization fails', () => {
    scene(
      { update, view: testView },
      given(FailedRenderer({ reason: 'Device request failed' })),
      expect(role('alert')).toHaveText(
        'WebGPU could not start: Device request failed',
      ),
    )
  })

  test('shows progress across all panels while dots animate', () => {
    scene(
      { update, view: testView },
      given(
        DrawingDots({
          artworkId: 'artwork-1',
          panels,
          visibleCountPerPanel: 1,
          pointCountPerPanel: 2,
          carryMs: 0,
        }),
      ),
      expect(text('1 / 2 points per panel')).toExist(),
    )
  })
})
