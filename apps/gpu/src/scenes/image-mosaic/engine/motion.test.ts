import { Array } from 'effect'
import { describe, expect, test } from 'vitest'

import { renderMosaic, sampleGrid } from './mosaic'
import { stationaryMotion, tileMovement, tileOffset } from './motion'

describe('seeded tile movement', () => {
  test('assigns stable single-axis movements with both axes and directions represented', () => {
    const movements = Array.makeBy(100, index => tileMovement(123, index))
    expect(movements).toEqual(
      Array.makeBy(100, index => tileMovement(123, index)),
    )
    expect(new Set(movements.map(movement => movement.axis))).toEqual(
      new Set(['X', 'Y']),
    )
    expect(new Set(movements.map(movement => movement.direction))).toEqual(
      new Set([-1, 1]),
    )
    expect(
      movements.every(movement => movement.weight >= 0 && movement.weight <= 1),
    ).toBe(true)

    const offsets = Array.makeBy(100, index =>
      tileOffset(123, index, 10, {
        intensity: 50,
        horizontalWeight: 100,
        verticalWeight: 100,
      }),
    )

    expect(offsets.every(offset => offset.x === 0 || offset.y === 0)).toBe(true)
  })

  test('scales movement linearly without changing direction and can freeze either axis', () => {
    const full = { intensity: 100, horizontalWeight: 100, verticalWeight: 100 }
    Array.makeBy(100, index => {
      const offset = tileOffset(123, index, 10, full)

      const half = tileOffset(123, index, 10, {
        intensity: 50,
        horizontalWeight: 100,
        verticalWeight: 100,
      })

      expect(half.x).toBe(offset.x / 2)
      expect(half.y).toBe(offset.y / 2)
      expect(
        tileOffset(123, index, 10, {
          intensity: 100,
          horizontalWeight: 0,
          verticalWeight: 100,
        }).x,
      ).toBe(0)
      expect(
        tileOffset(123, index, 10, {
          intensity: 100,
          horizontalWeight: 100,
          verticalWeight: 0,
        }).y,
      ).toBe(0)
    })
  })

  test('never changes sampled colors and restores the exact grid at zero intensity', () => {
    const grid = sampleGrid(
      {
        width: 2,
        height: 1,
        pixels: new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 128]),
      },
      2,
    )

    const original = renderMosaic(grid, 123, stationaryMotion)

    const moved = renderMosaic(grid, 123, {
      intensity: 100,
      horizontalWeight: 100,
      verticalWeight: 100,
    })

    const reshuffled = renderMosaic(grid, 456, {
      intensity: 100,
      horizontalWeight: 100,
      verticalWeight: 100,
    })

    expect(moved).not.toBe(original)
    expect(reshuffled).not.toBe(moved)
    expect(moved.match(/fill="[^"]+" fill-opacity="[^"]+"/g)).toEqual(
      original.match(/fill="[^"]+" fill-opacity="[^"]+"/g),
    )
    expect(renderMosaic(grid, 456, stationaryMotion)).toBe(original)
    expect(grid.tiles[0]?.x).toBe(0)
  })
})
