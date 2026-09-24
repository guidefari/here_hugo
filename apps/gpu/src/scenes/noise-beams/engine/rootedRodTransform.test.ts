import { describe, expect, test } from 'vitest'

import { rootedRodEndpoints } from './rootedRodTransform'

const root = { x: 17.5, y: -8.25, z: -10.5 }

const length = 10.5

const poses: ReadonlyArray<
  Readonly<{ azimuthRadians: number; tiltRadians: number }>
> = [
  { azimuthRadians: 0, tiltRadians: 0 },
  { azimuthRadians: 0.75, tiltRadians: 0.4 },
  { azimuthRadians: -1.6, tiltRadians: -0.7 },
  { azimuthRadians: Math.PI * 2.3, tiltRadians: 0.9 },
]

describe('rooted rod transform', () => {
  test('keeps the local bottom endpoint at the fixed root for every pose', () => {
    poses.forEach(pose => {
      const endpoints = rootedRodEndpoints({ root, length, ...pose })

      expect(endpoints.bottom).toStrictEqual(root)
    })
  })

  test('keeps the top endpoint one rod length from the root', () => {
    poses.forEach(pose => {
      const { top } = rootedRodEndpoints({ root, length, ...pose })

      expect(
        Math.hypot(top.x - root.x, top.y - root.y, top.z - root.z),
      ).toBeCloseTo(length, 12)
    })
  })

  test('points straight up when tilt is zero for every azimuth', () => {
    ;[0, 0.75, -2.4, Math.PI * 3].forEach(azimuthRadians => {
      const endpoints = rootedRodEndpoints({
        root,
        length,
        azimuthRadians,
        tiltRadians: 0,
      })

      expect(endpoints.top).toStrictEqual({
        x: root.x,
        y: root.y,
        z: root.z + length,
      })
    })
  })

  test('changing azimuth and tilt moves only the top endpoint', () => {
    const first = rootedRodEndpoints({
      root,
      length,
      azimuthRadians: 0.2,
      tiltRadians: 0.3,
    })

    const second = rootedRodEndpoints({
      root,
      length,
      azimuthRadians: 1.4,
      tiltRadians: -0.65,
    })

    expect(first.bottom).toStrictEqual(second.bottom)
    expect(first.top).not.toStrictEqual(second.top)
  })
})
