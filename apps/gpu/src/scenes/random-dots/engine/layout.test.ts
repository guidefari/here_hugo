import { describe, expect, test } from 'vitest'

import { definePanelLayout } from './layout'

describe('definePanelLayout', () => {
  test('places four equal square panels inside the canvas padding', () => {
    expect(
      definePanelLayout({
        width: 600,
        height: 600,
        columns: 2,
        gap: 60,
        padding: 30,
        panelCount: 4,
      }),
    ).toStrictEqual([
      { x: 30, y: 30, size: 240 },
      { x: 330, y: 30, size: 240 },
      { x: 30, y: 330, size: 240 },
      { x: 330, y: 330, size: 240 },
    ])
  })
})
