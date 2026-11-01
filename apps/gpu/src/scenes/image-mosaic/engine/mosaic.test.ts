import { describe, expect, test } from 'vitest'

import { gridLayout, renderMosaic, sampleGrid } from './mosaic'
import { stationaryMotion } from './motion'

describe('square mosaic grid', () => {
  test('samples the cell center rather than its corner or average', () => {
    const pixels = new Uint8ClampedArray(4 * 2 * 4)
    pixels.set([20, 40, 60, 255], (1 * 4 + 2) * 4)
    const grid = sampleGrid({ width: 4, height: 2, pixels }, 1)
    expect(grid.tiles).toEqual([
      {
        x: 0,
        y: 0,
        width: 4,
        height: 2,
        red: 20,
        green: 40,
        blue: 60,
        alpha: 1,
      },
    ])
  })
  test('keeps the requested count despite floating point division', () => {
    expect(gridLayout(900, 600, 41).columns).toBe(41)
  })
  test('fits square cells to the longest edge and clips the last row', () => {
    expect(gridLayout(400, 201, 16)).toEqual({
      columns: 16,
      rows: 9,
      cellSize: 25,
    })
    expect(gridLayout(200, 400, 16)).toEqual({
      columns: 8,
      rows: 16,
      cellSize: 25,
    })
  })

  test('samples the center of each cell including alpha', () => {
    const grid = sampleGrid(
      {
        width: 2,
        height: 1,
        pixels: new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 128]),
      },
      2,
    )

    const svg = renderMosaic(grid, 123, stationaryMotion)
    expect(grid.columns).toBe(2)
    expect(grid.rows).toBe(1)
    expect(svg).toContain('fill="rgb(255 0 0)" fill-opacity="1"')
    expect(svg).toContain(
      'fill="rgb(0 0 255)" fill-opacity="0.5019607843137255"',
    )
    expect(svg).toContain('viewBox="0 0 2 1"')
  })
})
