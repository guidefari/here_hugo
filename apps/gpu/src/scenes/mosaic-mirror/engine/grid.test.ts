import { Schema } from 'effect'
import { describe, expect, test } from 'vitest'

import { Grid, hexRgb, layout, sampleMask, tileLevels } from './grid'

describe('mirror grid', () => {
  test('uses square cells in portrait and landscape', () => {
    expect(layout(8, 4, 4)).toEqual({ columns: 4, rows: 2, cellSize: 2 })
    expect(layout(4, 8, 4)).toEqual({ columns: 2, rows: 4, cellSize: 2 })
    expect(layout(7, 4, 4)).toEqual({ columns: 4, rows: 3, cellSize: 1.75 })
  })

  test('averages person coverage, including partially covered cells', () => {
    const grid = sampleMask(new Float32Array([1, 1, 0, 0, 1, 0, 0, 0]), 4, 2, 2)
    expect(grid.coverage).toEqual([0.75, 0])
    expect(tileLevels(grid, [], 50, 0, 67)).toEqual([1, 0])
  })

  test('keeps empty frames base-colored and detects a stationary person', () => {
    const empty = sampleMask(new Float32Array(16), 4, 4, 2)
    const person = sampleMask(new Float32Array(16).fill(1), 4, 4, 2)
    expect(tileLevels(empty, [1, 1, 1, 1], 50, 0, 67)).toEqual([0, 0, 0, 0])
    expect(tileLevels(person, [1, 1, 1, 1], 50, 50, 67)).toEqual([1, 1, 1, 1])
  })

  test('sensitivity changes the activation threshold', () => {
    const grid = sampleMask(new Float32Array([0.4]), 1, 1, 1)
    expect(tileLevels(grid, [], 0, 0, 67)).toEqual([0])
    expect(tileLevels(grid, [], 100, 0, 67)).toEqual([1])
  })

  test('smoothing approaches both subject and base without overshooting', () => {
    const person = sampleMask(new Float32Array([1]), 1, 1, 1)
    const empty = sampleMask(new Float32Array([0]), 1, 1, 1)
    const rising = tileLevels(person, [0], 50, 50, 67)[0] ?? 0
    const falling = tileLevels(empty, [1], 50, 50, 67)[0] ?? 0
    expect(rising).toBeGreaterThan(0)
    expect(rising).toBeLessThan(1)
    expect(falling).toBeCloseTo(1 - rising)
    expect(tileLevels(person, [0], 50, 50, 0)).toEqual([0])
  })

  test('rejects malformed or non-finite worker grids', () => {
    const valid = sampleMask(new Float32Array([1]), 1, 1, 1)
    expect(Schema.is(Grid)(valid)).toBe(true)
    expect(Schema.is(Grid)({ ...valid, coverage: [] })).toBe(false)
    expect(Schema.is(Grid)({ ...valid, coverage: [NaN] })).toBe(false)
    expect(Schema.is(Grid)({ ...valid, width: 0 })).toBe(false)
  })

  test('decodes palette colors for either renderer', () => {
    expect(hexRgb('#ff8000')).toEqual([1, 128 / 255, 0])
  })
})
