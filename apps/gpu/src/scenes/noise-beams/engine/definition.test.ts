import { describe, expect, test } from 'vitest'

import { NOISE_BEAM_FIELD } from '../constants'
import {
  PerlinWaveField,
  defineBeamGrid,
  defineBeamStyle,
  defineCamera,
  defineGroundStyle,
  defineNoiseBeamField,
} from './definition'

const ground = defineGroundStyle({
  elevation: -10.5,
})

const waveField = PerlinWaveField({
  cellSize: 190,
  baseAzimuthRadians: 0,
  azimuthAmplitudeRadians: Math.PI / 2,
  tiltAmplitudeRadians: 0.9,
  azimuthDrift: { x: 0.22, y: 0.11 },
  tiltDrift: { x: -0.15, y: 0.19 },
})

const camera = defineCamera({
  eye: { x: 500, y: 350, z: 750 },
  target: { x: 500, y: 350, z: 0 },
  up: { x: 0, y: -1, z: 0 },
  verticalFovRadians: (55 * Math.PI) / 180,
  near: 50,
  far: 2_500,
})

const defineFieldWith = (
  width: number,
  height: number,
  columns: number,
  rows: number,
  padding: number,
  length: number,
) =>
  defineNoiseBeamField({
    width,
    height,
    grid: defineBeamGrid({ columns, rows, padding }),
    beam: defineBeamStyle({
      length,
      radius: 2.2,
    }),
    waveField,
    camera,
    ground,
  })

describe('3D noise beam field definition', () => {
  test('accepts and preserves the cylindrical rod composition', () => {
    expect(NOISE_BEAM_FIELD).toStrictEqual({
      width: 1_000,
      height: 700,
      grid: { columns: 55, rows: 37, padding: 40 },
      beam: { length: 18, radius: 1.8 },
      waveField: PerlinWaveField({
        cellSize: 145,
        baseAzimuthRadians: 0,
        azimuthAmplitudeRadians: Math.PI,
        tiltAmplitudeRadians: 0.72,
        azimuthDrift: { x: 0.36, y: 0.24 },
        tiltDrift: { x: -0.27, y: 0.33 },
      }),
      camera: {
        eye: { x: 500, y: 350, z: 750 },
        target: { x: 500, y: 350, z: 0 },
        up: { x: 0, y: -1, z: 0 },
        verticalFovRadians: (55 * Math.PI) / 180,
        near: 50,
        far: 2_500,
      },
      ground,
    })
    expect(JSON.stringify(NOISE_BEAM_FIELD)).not.toMatch(/GPU|buffer|pipeline/i)
  })

  test('uses near-square cells at the enlarged logical size', () => {
    const cellWidth =
      (NOISE_BEAM_FIELD.width - 2 * NOISE_BEAM_FIELD.grid.padding) /
      NOISE_BEAM_FIELD.grid.columns

    const cellHeight =
      (NOISE_BEAM_FIELD.height - 2 * NOISE_BEAM_FIELD.grid.padding) /
      NOISE_BEAM_FIELD.grid.rows

    expect(cellWidth).toBeCloseTo(16.7273, 4)
    expect(cellHeight).toBeCloseTo(16.7568, 4)
    expect(Math.abs(cellWidth - cellHeight)).toBeLessThan(0.05)
    expect(NOISE_BEAM_FIELD.grid.columns * NOISE_BEAM_FIELD.grid.rows).toBe(
      2_035,
    )
  })

  test('rejects non-positive and fractional grid dimensions', () => {
    expect(() => defineBeamGrid({ columns: 0, rows: 52, padding: 40 })).toThrow(
      'columns must be positive',
    )
    expect(() =>
      defineBeamGrid({ columns: 78, rows: -1, padding: 40 }),
    ).toThrow('rows must be positive')
    expect(() =>
      defineBeamGrid({ columns: 78.5, rows: 52, padding: 40 }),
    ).toThrow('columns and rows must be integers')
  })

  test('rejects non-positive cylindrical rod dimensions and Perlin cell size', () => {
    expect(() => defineBeamStyle({ length: 0, radius: 2.2 })).toThrow(
      'beam length must be positive',
    )
    expect(() => defineBeamStyle({ length: 10.5, radius: 0 })).toThrow(
      'beam radius must be positive',
    )
    expect(() => PerlinWaveField({ ...waveField, cellSize: 0 })).toThrow(
      'Perlin cell size must be positive',
    )
  })

  test('rejects padding that removes the drawable interior', () => {
    expect(() => defineFieldWith(1_000, 700, 78, 52, 350, 1)).toThrow(
      'padding must leave a positive drawable interior',
    )
  })

  test('keeps the maximum horizontal reach within the smaller cell dimension', () => {
    expect(() => defineFieldWith(1_000, 700, 78, 52, 40, 15.1)).toThrow(
      'beam horizontal reach must not exceed the smaller grid cell dimension',
    )
    expect(defineFieldWith(1_000, 700, 78, 52, 40, 15).beam.length).toBe(15)
  })

  test('rejects invalid wave amplitudes and drift coordinates', () => {
    expect(() =>
      PerlinWaveField({
        ...waveField,
        azimuthAmplitudeRadians: Math.PI + 0.01,
      }),
    ).toThrow('azimuth amplitude must be between 0 and pi')
    expect(() =>
      PerlinWaveField({
        ...waveField,
        tiltAmplitudeRadians: Math.PI / 2 + 0.01,
      }),
    ).toThrow('tilt amplitude must be between 0 and pi / 2')
    expect(() =>
      PerlinWaveField({
        ...waveField,
        azimuthDrift: { x: Number.NaN, y: 0.11 },
      }),
    ).toThrow('azimuth drift x must be finite')
  })

  test('rejects invalid perspective camera controls', () => {
    expect(() => defineCamera({ ...camera, verticalFovRadians: 0 })).toThrow(
      'camera vertical FOV must be between 0 and pi',
    )
    expect(() => defineCamera({ ...camera, near: 0 })).toThrow(
      'camera near must be positive',
    )
    expect(() => defineCamera({ ...camera, far: camera.near })).toThrow(
      'camera far must be greater than camera near',
    )
    expect(() => defineCamera({ ...camera, target: camera.eye })).toThrow(
      'camera eye and target must differ',
    )
    expect(() =>
      defineCamera({
        ...camera,
        target: { x: 500, y: 350, z: 0 },
        up: { x: 0, y: 0, z: 1 },
      }),
    ).toThrow('camera up must not be zero or parallel to its view')
  })

  test('rejects an invalid ground elevation', () => {
    expect(() =>
      defineGroundStyle({ ...ground, elevation: Number.NaN }),
    ).toThrow('ground elevation must be finite')
  })

  test('rejects non-finite controls', () => {
    expect(() =>
      PerlinWaveField({ ...waveField, baseAzimuthRadians: Number.NaN }),
    ).toThrow('base azimuth must be finite')
  })
})
