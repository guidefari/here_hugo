import { describe, expect, test } from 'vitest'

import { canvasResolution } from './canvasResolution'

describe('canvasResolution', () => {
  test('uses the device pixel ratio for a crisp backing buffer', () => {
    expect(canvasResolution(600, 2)).toBe(1_200)
    expect(canvasResolution(600, 3.5)).toBe(2_100)
  })

  test('caps extreme zoom levels to bound GPU memory usage', () => {
    expect(canvasResolution(600, 8)).toBe(2_400)
  })

  test('always returns a usable whole-pixel dimension', () => {
    expect(canvasResolution(0, 2)).toBe(1)
    expect(canvasResolution(320.4, 1.5)).toBe(481)
  })
})
