import { describe, expect, test } from 'vitest'

import {
  CYLINDRICAL_ROD_RADIAL_SEGMENTS,
  UNIT_CYLINDRICAL_ROD_MESH,
  UNIT_CYLINDRICAL_ROD_VERTEX_COUNT,
} from './cylindricalRodMesh'

type Vector3 = readonly [number, number, number]

const SIDE_VERTEX_COUNT = CYLINDRICAL_ROD_RADIAL_SEGMENTS * 6

const EXPECTED_VERTEX_COUNT = 144

const cross = (left: Vector3, right: Vector3): Vector3 => [
  left[1] * right[2] - left[2] * right[1],
  left[2] * right[0] - left[0] * right[2],
  left[0] * right[1] - left[1] * right[0],
]

const subtract = (left: Vector3, right: Vector3): Vector3 => [
  left[0] - right[0],
  left[1] - right[1],
  left[2] - right[2],
]

const dot = (left: Vector3, right: Vector3): number =>
  left[0] * right[0] + left[1] * right[1] + left[2] * right[2]

describe('unit cylindrical rod mesh', () => {
  test('contains side quads and two capped ends for every radial segment', () => {
    expect(CYLINDRICAL_ROD_RADIAL_SEGMENTS).toBe(12)
    expect(UNIT_CYLINDRICAL_ROD_VERTEX_COUNT).toBe(EXPECTED_VERTEX_COUNT)
    expect(UNIT_CYLINDRICAL_ROD_MESH).toHaveLength(EXPECTED_VERTEX_COUNT)
  })

  test('runs from zero to one on local Z with a unit-diameter XY section', () => {
    const positions = UNIT_CYLINDRICAL_ROD_MESH.map(vertex => vertex.position)
    const xCoordinates = positions.map(position => position[0])
    const yCoordinates = positions.map(position => position[1])
    const zCoordinates = positions.map(position => position[2])

    expect(Math.min(...xCoordinates)).toBe(-0.5)
    expect(Math.max(...xCoordinates)).toBe(0.5)
    expect(Math.min(...yCoordinates)).toBe(-0.5)
    expect(Math.max(...yCoordinates)).toBe(0.5)
    expect(Math.min(...zCoordinates)).toBe(0)
    expect(Math.max(...zCoordinates)).toBe(1)

    positions.forEach(([x, y]) => {
      expect(Math.hypot(x, y)).toBeLessThanOrEqual(0.5 + Number.EPSILON)
    })
  })

  test('uses flat outward normals on the bottom and top caps', () => {
    const capVertices = UNIT_CYLINDRICAL_ROD_MESH.slice(SIDE_VERTEX_COUNT)
    const topCap = capVertices.filter(vertex => vertex.normal[2] === 1)
    const bottomCap = capVertices.filter(vertex => vertex.normal[2] === -1)

    expect(topCap).toHaveLength(CYLINDRICAL_ROD_RADIAL_SEGMENTS * 3)
    expect(bottomCap).toHaveLength(CYLINDRICAL_ROD_RADIAL_SEGMENTS * 3)
    topCap.forEach(vertex => {
      expect(vertex.normal).toStrictEqual([0, 0, 1])
      expect(vertex.position[2]).toBe(1)
    })
    bottomCap.forEach(vertex => {
      expect(vertex.normal).toStrictEqual([0, 0, -1])
      expect(vertex.position[2]).toBe(0)
    })
  })

  test('uses smooth unit radial normals around the sides', () => {
    const sideVertices = UNIT_CYLINDRICAL_ROD_MESH.slice(0, SIDE_VERTEX_COUNT)

    sideVertices.forEach(vertex => {
      expect(vertex.normal[2]).toBe(0)
      expect(Math.hypot(vertex.normal[0], vertex.normal[1])).toBeCloseTo(1, 12)
      expect(vertex.normal[0]).toBeCloseTo(vertex.position[0] * 2, 12)
      expect(vertex.normal[1]).toBeCloseTo(vertex.position[1] * 2, 12)
    })
  })

  test('winds every triangle outward toward its declared normals', () => {
    UNIT_CYLINDRICAL_ROD_MESH.forEach((first, index) => {
      if (index % 3 !== 0) {
        return
      }

      const second = UNIT_CYLINDRICAL_ROD_MESH[index + 1]
      const third = UNIT_CYLINDRICAL_ROD_MESH[index + 2]

      if (second === undefined || third === undefined) {
        throw new Error('cylindrical rod mesh contains an incomplete triangle')
      }

      const geometricNormal = cross(
        subtract(second.position, first.position),
        subtract(third.position, first.position),
      )

      ;[first, second, third].forEach(vertex => {
        expect(dot(geometricNormal, vertex.normal)).toBeGreaterThan(0)
      })
    })
  })

  test('closes the radial seam with matching positions and smooth normals', () => {
    const firstBottom = UNIT_CYLINDRICAL_ROD_MESH[0]
    const firstTop = UNIT_CYLINDRICAL_ROD_MESH[5]
    const lastSegmentOffset = (CYLINDRICAL_ROD_RADIAL_SEGMENTS - 1) * 6
    const lastSegmentStart = UNIT_CYLINDRICAL_ROD_MESH[lastSegmentOffset]
    const lastBottom = UNIT_CYLINDRICAL_ROD_MESH[lastSegmentOffset + 1]
    const lastTop = UNIT_CYLINDRICAL_ROD_MESH[lastSegmentOffset + 2]

    expect(lastBottom?.position).toStrictEqual(firstBottom?.position)
    expect(lastBottom?.normal).toStrictEqual(firstBottom?.normal)
    expect(lastTop?.position).toStrictEqual(firstTop?.position)
    expect(lastTop?.normal).toStrictEqual(firstTop?.normal)
    expect(lastSegmentStart?.position).not.toStrictEqual(firstBottom?.position)
  })

  test('is generated once as renderer-independent plain data', () => {
    expect(JSON.stringify(UNIT_CYLINDRICAL_ROD_MESH)).not.toMatch(
      /GPU|buffer|pipeline|texture/i,
    )
    expect(Object.isFrozen(UNIT_CYLINDRICAL_ROD_MESH)).toBe(true)
  })
})
