import { describe, expect, test } from 'vitest'

import { canvasBackingResolution } from './canvasResolution'

describe('canvasBackingResolution', () => {
  test('preserves the logical 1000 by 700 aspect at device resolution', () => {
    expect(canvasBackingResolution(1_000, 1_000, 700, 2)).toStrictEqual({
      width: 2_000,
      height: 1_400,
    })
  })

  test('responds to a narrower CSS width', () => {
    expect(canvasBackingResolution(500, 1_000, 700, 2)).toStrictEqual({
      width: 1_000,
      height: 700,
    })
  })

  test('caps extreme zoom levels to bound GPU memory usage', () => {
    expect(canvasBackingResolution(1_000, 1_000, 700, 8)).toStrictEqual({
      width: 4_000,
      height: 2_800,
    })
  })

  test('always returns usable whole-pixel dimensions', () => {
    expect(canvasBackingResolution(0, 1_000, 700, 2)).toStrictEqual({
      width: 1,
      height: 1,
    })
    expect(canvasBackingResolution(Number.NaN, 1_000, 700, 2)).toStrictEqual({
      width: 1,
      height: 1,
    })
  })
})
