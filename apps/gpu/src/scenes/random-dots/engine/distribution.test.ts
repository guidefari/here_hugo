import { describe, expect, test } from 'vitest'

import { Edge, Grid, Radial, relativeDensityAt } from './distribution'

describe('Grid', () => {
  test('requires exactly one weight for every cell', () => {
    expect(() => Grid({ divisions: 4, weights: [1, 1, 1] })).toThrow(
      'A 4 × 4 grid requires exactly 16 weights',
    )
  })
})

describe('relativeDensityAt', () => {
  test('uses spread to set the width of an edge concentration', () => {
    const distribution = Edge({
      from: 'Top',
      concentration: { spread: 0.5, strength: 2, background: 0 },
    })

    expect(relativeDensityAt(distribution, { x: 0.5, y: 0 })).toBe(1)
    expect(relativeDensityAt(distribution, { x: 0.5, y: 0.25 })).toBe(0.25)
    expect(relativeDensityAt(distribution, { x: 0.5, y: 0.5 })).toBe(0)
  })

  test('uses spread to set the radius of a point concentration', () => {
    const distribution = Radial({
      center: { x: 0.5, y: 0.5 },
      concentration: { spread: 0.5, strength: 2, background: 0 },
    })

    expect(relativeDensityAt(distribution, { x: 0.5, y: 0.5 })).toBe(1)
    expect(relativeDensityAt(distribution, { x: 0.75, y: 0.5 })).toBe(0.25)
    expect(relativeDensityAt(distribution, { x: 1, y: 0.5 })).toBe(0)
  })

  test('retains the configured background density beyond the spread', () => {
    const distribution = Radial({
      center: { x: 0.5, y: 0.5 },
      concentration: { spread: 0.25, strength: 3, background: 0.1 },
    })

    expect(relativeDensityAt(distribution, { x: 1, y: 1 })).toBe(0.1)
  })
})
