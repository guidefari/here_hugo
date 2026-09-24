import { describe, expect, test } from 'vitest'

import { gradientHashCpuMirror, perlin2CpuMirror } from './perlinMirror'

const sampleCoordinates: ReadonlyArray<readonly [number, number]> = [
  [-1.75, -0.5],
  [-0.25, 0.75],
  [0, 0],
  [0.125, 0.875],
  [1.5, 2.25],
  [3.9, -2.1],
  [4.25, 6.75],
]

describe('Perlin noise', () => {
  test('uses deterministic lattice-gradient hash fixtures', () => {
    expect(gradientHashCpuMirror(0, 0)).toBe(0)
    expect(gradientHashCpuMirror(1, 0)).toBe(2_182_377_940)
    expect(gradientHashCpuMirror(-1, 2)).toBe(1_965_274_915)
    expect(gradientHashCpuMirror(3, 4)).toBe(536_746_366)
    expect(gradientHashCpuMirror(7, -5)).toBe(1_573_083_587)
  })

  test('is continuous across lattice-cell boundaries', () => {
    const epsilon = 0.000_001
    const left = perlin2CpuMirror(2 - epsilon, 1.375)
    const right = perlin2CpuMirror(2 + epsilon, 1.375)
    const above = perlin2CpuMirror(1.625, 3 - epsilon)
    const below = perlin2CpuMirror(1.625, 3 + epsilon)

    expect(Math.abs(left - right)).toBeLessThan(0.000_01)
    expect(Math.abs(above - below)).toBeLessThan(0.000_01)
  })

  test('stays within the expected signed range', () => {
    sampleCoordinates.forEach(([x, y]) => {
      expect(perlin2CpuMirror(x, y)).toBeGreaterThanOrEqual(-1)
      expect(perlin2CpuMirror(x, y)).toBeLessThanOrEqual(1)
    })
  })
})
