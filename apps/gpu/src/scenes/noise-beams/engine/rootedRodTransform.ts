import type { Point3 } from './definition'

/** The fixed bottom and moving top endpoints of a rooted rod. */
export type RootedRodEndpoints = Readonly<{
  bottom: Point3
  top: Point3
}>

/** Inputs for a rod that tilts from local +Z, then turns around world Z. */
export type RootedRodTransform = Readonly<{
  root: Point3
  length: number
  azimuthRadians: number
  tiltRadians: number
}>

/**
 * Returns the endpoints for a circular rod rooted at one world point.
 * Azimuth is its compass direction around world Z. Tilt is its signed angle
 * away from vertical. Roll around the rod axis does not change a cylinder.
 */
export const rootedRodEndpoints = ({
  root,
  length,
  azimuthRadians,
  tiltRadians,
}: RootedRodTransform): RootedRodEndpoints => {
  const horizontalLength = length * Math.sin(tiltRadians)

  return {
    bottom: root,
    top: {
      x: root.x + horizontalLength * Math.cos(azimuthRadians),
      y: root.y + horizontalLength * Math.sin(azimuthRadians),
      z: root.z + length * Math.cos(tiltRadians),
    },
  }
}
