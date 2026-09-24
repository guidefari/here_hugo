import { Data } from 'effect'

export type Point = Readonly<{
  x: number
  y: number
}>

export type Point3 = Readonly<{
  x: number
  y: number
  z: number
}>

export type BeamGrid = Readonly<{
  columns: number
  rows: number
  padding: number
}>

export type BeamStyle = Readonly<{
  length: number
  radius: number
}>

export type PerlinWaveField = Readonly<{
  _tag: 'PerlinWaveField'
  cellSize: number
  baseAzimuthRadians: number
  azimuthAmplitudeRadians: number
  tiltAmplitudeRadians: number
  azimuthDrift: Point
  tiltDrift: Point
}>

export type WaveField = PerlinWaveField

const WaveField = Data.taggedEnum<WaveField>()

export type Camera = Readonly<{
  eye: Point3
  target: Point3
  up: Point3
  verticalFovRadians: number
  near: number
  far: number
}>

export type GroundStyle = Readonly<{
  elevation: number
}>

export type NoiseBeamFieldDefinition = Readonly<{
  width: number
  height: number
  grid: BeamGrid
  beam: BeamStyle
  waveField: WaveField
  camera: Camera
  ground: GroundStyle
}>

const assertFinite = (name: string, value: number): void => {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`)
  }
}

const assertPositive = (name: string, value: number): void => {
  assertFinite(name, value)

  if (value <= 0) {
    throw new RangeError(`${name} must be positive`)
  }
}

const definePoint = (name: string, point: Point): Point => {
  assertFinite(`${name} x`, point.x)
  assertFinite(`${name} y`, point.y)

  return Object.freeze({ x: point.x, y: point.y })
}

const definePoint3 = (name: string, point: Point3): Point3 => {
  assertFinite(`${name} x`, point.x)
  assertFinite(`${name} y`, point.y)
  assertFinite(`${name} z`, point.z)

  return Object.freeze({ x: point.x, y: point.y, z: point.z })
}

export const defineBeamGrid = (grid: BeamGrid): BeamGrid => {
  assertPositive('columns', grid.columns)
  assertPositive('rows', grid.rows)
  assertFinite('padding', grid.padding)

  if (!Number.isInteger(grid.columns) || !Number.isInteger(grid.rows)) {
    throw new RangeError('columns and rows must be integers')
  }

  if (grid.padding < 0) {
    throw new RangeError('padding must be non-negative')
  }

  return Object.freeze({
    columns: grid.columns,
    rows: grid.rows,
    padding: grid.padding,
  })
}

export const defineBeamStyle = (beam: BeamStyle): BeamStyle => {
  assertPositive('beam length', beam.length)
  assertPositive('beam radius', beam.radius)

  return Object.freeze({
    length: beam.length,
    radius: beam.radius,
  })
}

export const PerlinWaveField = (
  waveField: Omit<PerlinWaveField, '_tag'>,
): PerlinWaveField => {
  assertPositive('Perlin cell size', waveField.cellSize)
  assertFinite('base azimuth', waveField.baseAzimuthRadians)
  assertFinite('azimuth amplitude', waveField.azimuthAmplitudeRadians)
  assertFinite('tilt amplitude', waveField.tiltAmplitudeRadians)

  if (
    waveField.azimuthAmplitudeRadians < 0 ||
    waveField.azimuthAmplitudeRadians > Math.PI
  ) {
    throw new RangeError('azimuth amplitude must be between 0 and pi')
  }

  if (
    waveField.tiltAmplitudeRadians < 0 ||
    waveField.tiltAmplitudeRadians > Math.PI / 2
  ) {
    throw new RangeError('tilt amplitude must be between 0 and pi / 2')
  }

  return Object.freeze(
    WaveField.PerlinWaveField({
    cellSize: waveField.cellSize,
    baseAzimuthRadians: waveField.baseAzimuthRadians,
    azimuthAmplitudeRadians: waveField.azimuthAmplitudeRadians,
    tiltAmplitudeRadians: waveField.tiltAmplitudeRadians,
    azimuthDrift: definePoint('azimuth drift', waveField.azimuthDrift),
    tiltDrift: definePoint('tilt drift', waveField.tiltDrift),
    }),
  )
}

export const defineCamera = (camera: Camera): Camera => {
  const eye = definePoint3('camera eye', camera.eye)
  const target = definePoint3('camera target', camera.target)
  const up = definePoint3('camera up', camera.up)
  assertFinite('camera vertical FOV', camera.verticalFovRadians)
  assertPositive('camera near', camera.near)
  assertPositive('camera far', camera.far)

  if (camera.verticalFovRadians <= 0 || camera.verticalFovRadians >= Math.PI) {
    throw new RangeError('camera vertical FOV must be between 0 and pi')
  }

  if (camera.far <= camera.near) {
    throw new RangeError('camera far must be greater than camera near')
  }

  const forward = {
    x: target.x - eye.x,
    y: target.y - eye.y,
    z: target.z - eye.z,
  }

  const forwardLength = Math.hypot(forward.x, forward.y, forward.z)
  const upLength = Math.hypot(up.x, up.y, up.z)

  const crossLength = Math.hypot(
    forward.y * up.z - forward.z * up.y,
    forward.z * up.x - forward.x * up.z,
    forward.x * up.y - forward.y * up.x,
  )

  if (forwardLength === 0) {
    throw new RangeError('camera eye and target must differ')
  }

  if (upLength === 0 || crossLength === 0) {
    throw new RangeError('camera up must not be zero or parallel to its view')
  }

  return Object.freeze({
    eye,
    target,
    up,
    verticalFovRadians: camera.verticalFovRadians,
    near: camera.near,
    far: camera.far,
  })
}

export const defineGroundStyle = (ground: GroundStyle): GroundStyle => {
  assertFinite('ground elevation', ground.elevation)

  return Object.freeze({ elevation: ground.elevation })
}

export const defineNoiseBeamField = (
  definition: NoiseBeamFieldDefinition,
): NoiseBeamFieldDefinition => {
  assertPositive('canvas width', definition.width)
  assertPositive('canvas height', definition.height)

  const grid = defineBeamGrid(definition.grid)
  const beam = defineBeamStyle(definition.beam)
  const waveField = PerlinWaveField(definition.waveField)
  const camera = defineCamera(definition.camera)
  const ground = defineGroundStyle(definition.ground)
  const drawableWidth = definition.width - 2 * grid.padding
  const drawableHeight = definition.height - 2 * grid.padding

  if (drawableWidth <= 0 || drawableHeight <= 0) {
    throw new RangeError('padding must leave a positive drawable interior')
  }

  const cellWidth = drawableWidth / grid.columns
  const cellHeight = drawableHeight / grid.rows

  const maximumHorizontalReach =
    beam.length * Math.sin(waveField.tiltAmplitudeRadians)

  if (maximumHorizontalReach > Math.min(cellWidth, cellHeight)) {
    throw new RangeError(
      'beam horizontal reach must not exceed the smaller grid cell dimension',
    )
  }

  return Object.freeze({
    width: definition.width,
    height: definition.height,
    grid,
    beam,
    waveField,
    camera,
    ground,
  })
}
