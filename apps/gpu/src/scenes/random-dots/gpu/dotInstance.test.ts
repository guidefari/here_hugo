import { describe, expect, test } from 'vitest'

import { interleavePanelArtwork, visibleInstanceCount } from './dotInstance'

const panels = [
  {
    id: 'left',
    origin: { x: 0, y: 0 },
    size: 100,
    dotRadius: 0.5,
    points: [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ],
  },
  {
    id: 'right',
    origin: { x: 100, y: 0 },
    size: 100,
    dotRadius: 0.5,
    points: [
      { x: 5, y: 6 },
      { x: 7, y: 8 },
    ],
  },
]

describe('interleavePanelArtwork', () => {
  test('places the same reveal cycle from every panel next to each other', () => {
    expect(interleavePanelArtwork(panels, 2)).toStrictEqual([
      { center: { x: 1, y: 2 }, radius: 0.5 },
      { center: { x: 105, y: 6 }, radius: 0.5 },
      { center: { x: 3, y: 4 }, radius: 0.5 },
      { center: { x: 107, y: 8 }, radius: 0.5 },
    ])
  })
})

describe('visibleInstanceCount', () => {
  test('advances every panel in one draw', () => {
    expect(visibleInstanceCount(300, 4, 10_000)).toBe(1_200)
  })

  test('never passes a non-finite count to WebGPU', () => {
    expect(visibleInstanceCount(Number.NaN, 4, 10_000)).toBe(0)
  })

  test('clamps reveal progress to the uploaded instance range', () => {
    expect(visibleInstanceCount(-1, 4, 10_000)).toBe(0)
    expect(visibleInstanceCount(20_000, 4, 10_000)).toBe(40_000)
  })
})
