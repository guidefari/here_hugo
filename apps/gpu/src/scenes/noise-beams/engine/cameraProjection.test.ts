import { describe, expect, test } from 'vitest'

import { NOISE_BEAM_FIELD } from '../constants'
import { cameraProjection, projectWorldPoint } from './cameraProjection'

const vectorLength = (vector: readonly [number, number, number]): number =>
  Math.hypot(...vector)

const dot = (
  left: readonly [number, number, number],
  right: readonly [number, number, number],
): number => left[0] * right[0] + left[1] * right[1] + left[2] * right[2]

const projection = cameraProjection(
  NOISE_BEAM_FIELD.camera,
  NOISE_BEAM_FIELD.width / NOISE_BEAM_FIELD.height,
)

const groundCorners = () => {
  const z = NOISE_BEAM_FIELD.ground.elevation

  return {
    topLeft: projectWorldPoint(projection, { x: 0, y: 0, z }),
    topRight: projectWorldPoint(projection, {
      x: NOISE_BEAM_FIELD.width,
      y: 0,
      z,
    }),
    bottomLeft: projectWorldPoint(projection, {
      x: 0,
      y: NOISE_BEAM_FIELD.height,
      z,
    }),
    bottomRight: projectWorldPoint(projection, {
      x: NOISE_BEAM_FIELD.width,
      y: NOISE_BEAM_FIELD.height,
      z,
    }),
  }
}

describe('noise beam perspective camera projection', () => {
  test('derives an orthonormal direct-overhead camera basis', () => {
    expect(vectorLength(projection.right)).toBeCloseTo(1, 12)
    expect(vectorLength(projection.up)).toBeCloseTo(1, 12)
    expect(vectorLength(projection.forward)).toBeCloseTo(1, 12)
    expect(dot(projection.right, projection.up)).toBeCloseTo(0, 12)
    expect(dot(projection.right, projection.forward)).toBeCloseTo(0, 12)
    expect(dot(projection.up, projection.forward)).toBeCloseTo(0, 12)
    expect(projection.forward).toStrictEqual([0, 0, -1])
    expect(projection.up).toStrictEqual([0, -1, 0])
  })

  test('projects the camera target to the viewport centre', () => {
    const target = projectWorldPoint(projection, NOISE_BEAM_FIELD.camera.target)

    expect(target.x).toBeCloseTo(0, 12)
    expect(target.y).toBeCloseTo(0, 12)
    expect(target.z).toBeGreaterThan(0)
    expect(target.z).toBeLessThan(1)
  })

  test('uses WebGPU clip depth from zero at near to one at far', () => {
    const pointAlongView = (distance: number) => ({
      x: projection.eye[0] + projection.forward[0] * distance,
      y: projection.eye[1] + projection.forward[1] * distance,
      z: projection.eye[2] + projection.forward[2] * distance,
    })

    expect(
      projectWorldPoint(projection, pointAlongView(projection.near)).z,
    ).toBeCloseTo(0, 12)
    expect(
      projectWorldPoint(projection, pointAlongView(projection.far)).z,
    ).toBeCloseTo(1, 12)
  })

  test('preserves perspective depth scaling above the ground', () => {
    const groundLeft = projectWorldPoint(projection, {
      x: 450,
      y: 350,
      z: NOISE_BEAM_FIELD.ground.elevation,
    })

    const groundRight = projectWorldPoint(projection, {
      x: 550,
      y: 350,
      z: NOISE_BEAM_FIELD.ground.elevation,
    })

    const raisedLeft = projectWorldPoint(projection, {
      x: 450,
      y: 350,
      z: 20,
    })

    const raisedRight = projectWorldPoint(projection, {
      x: 550,
      y: 350,
      z: 20,
    })

    expect(Math.abs(raisedRight.x - raisedLeft.x)).toBeGreaterThan(
      Math.abs(groundRight.x - groundLeft.x) * 1.03,
    )
    expect(raisedLeft.cameraDepth).toBeLessThan(groundLeft.cameraDepth)
  })

  test('frames the complete field symmetrically with an even margin', () => {
    const { topLeft, topRight, bottomLeft, bottomRight } = groundCorners()

    expect(topLeft.x).toBeCloseTo(-topRight.x, 12)
    expect(bottomLeft.x).toBeCloseTo(-bottomRight.x, 12)
    expect(topLeft.y).toBeCloseTo(-bottomLeft.y, 12)
    expect(topRight.y).toBeCloseTo(-bottomRight.y, 12)
    expect(Math.abs(topLeft.x)).toBeCloseTo(Math.abs(topLeft.y), 12)

    const corners = [topLeft, topRight, bottomLeft, bottomRight]
    corners.forEach(point => {
      expect(Math.abs(point.x)).toBeGreaterThan(0.85)
      expect(Math.abs(point.x)).toBeLessThan(0.92)
      expect(Math.abs(point.y)).toBeGreaterThan(0.85)
      expect(Math.abs(point.y)).toBeLessThan(0.92)
      expect(point.z).toBeGreaterThan(0)
      expect(point.z).toBeLessThan(1)
    })
  })

  test('projects the ground as a rectangle rather than a trapezoid', () => {
    const { topLeft, topRight, bottomLeft, bottomRight } = groundCorners()
    const topWidth = Math.abs(topRight.x - topLeft.x)
    const bottomWidth = Math.abs(bottomRight.x - bottomLeft.x)
    const leftHeight = Math.abs(bottomLeft.y - topLeft.y)
    const rightHeight = Math.abs(bottomRight.y - topRight.y)

    expect(topLeft.y).toBeCloseTo(topRight.y, 12)
    expect(bottomLeft.y).toBeCloseTo(bottomRight.y, 12)
    expect(topLeft.x).toBeCloseTo(bottomLeft.x, 12)
    expect(topRight.x).toBeCloseTo(bottomRight.x, 12)
    expect(topWidth).toBeCloseTo(bottomWidth, 12)
    expect(leftHeight).toBeCloseTo(rightHeight, 12)
  })

  test('rejects invalid aspect ratios without browser resources', () => {
    expect(() => cameraProjection(NOISE_BEAM_FIELD.camera, 0)).toThrow(
      'camera aspect ratio must be positive and finite',
    )
    expect(JSON.stringify(projection)).not.toMatch(/GPU|buffer|pipeline/i)
  })
})
