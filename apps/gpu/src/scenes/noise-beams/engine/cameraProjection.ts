import type { Camera, Point3 } from './definition'

export type Vector3 = readonly [number, number, number]

export type CameraProjection = Readonly<{
  eye: Vector3
  right: Vector3
  up: Vector3
  forward: Vector3
  aspectRatio: number
  tangentHalfVerticalFov: number
  near: number
  far: number
}>

export type ProjectedPoint = Readonly<{
  x: number
  y: number
  z: number
  cameraDepth: number
}>

const subtract = (left: Point3, right: Point3): Vector3 => [
  left.x - right.x,
  left.y - right.y,
  left.z - right.z,
]

const cross = (left: Vector3, right: Vector3): Vector3 => [
  left[1] * right[2] - left[2] * right[1],
  left[2] * right[0] - left[0] * right[2],
  left[0] * right[1] - left[1] * right[0],
]

const dot = (left: Vector3, right: Vector3): number =>
  left[0] * right[0] + left[1] * right[1] + left[2] * right[2]

const normalize = (vector: Vector3): Vector3 => {
  const length = Math.hypot(...vector)

  return [vector[0] / length, vector[1] / length, vector[2] / length]
}

export const cameraProjection = (
  camera: Camera,
  aspectRatio: number,
): CameraProjection => {
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    throw new RangeError('camera aspect ratio must be positive and finite')
  }

  const forward = normalize(subtract(camera.target, camera.eye))
  const worldUp: Vector3 = [camera.up.x, camera.up.y, camera.up.z]
  const right = normalize(cross(forward, worldUp))
  const up = normalize(cross(right, forward))

  const eye: Vector3 = [camera.eye.x, camera.eye.y, camera.eye.z]

  return Object.freeze({
    eye,
    right,
    up,
    forward,
    aspectRatio,
    tangentHalfVerticalFov: Math.tan(camera.verticalFovRadians / 2),
    near: camera.near,
    far: camera.far,
  })
}

export const projectWorldPoint = (
  projection: CameraProjection,
  point: Point3,
): ProjectedPoint => {
  const fromEye: Vector3 = [
    point.x - projection.eye[0],
    point.y - projection.eye[1],
    point.z - projection.eye[2],
  ]

  const cameraX = dot(fromEye, projection.right)
  const cameraY = dot(fromEye, projection.up)
  const cameraDepth = dot(fromEye, projection.forward)
  const depthScale = projection.far / (projection.far - projection.near)

  return {
    x:
      cameraX /
      (cameraDepth *
        projection.tangentHalfVerticalFov *
        projection.aspectRatio),
    y: cameraY / (cameraDepth * projection.tangentHalfVerticalFov),
    z: depthScale - (projection.near * depthScale) / cameraDepth,
    cameraDepth,
  }
}
