import {
  PerlinWaveField,
  defineBeamGrid,
  defineBeamStyle,
  defineCamera,
  defineGroundStyle,
  defineNoiseBeamField,
} from './engine/definition'

export const NOISE_BEAM_FIELD = defineNoiseBeamField({
  width: 1_000,
  height: 700,
  grid: defineBeamGrid({
    columns: 55,
    rows: 37,
    padding: 40,
  }),
  beam: defineBeamStyle({
    length: 18,
    radius: 1.8,
  }),
  waveField: PerlinWaveField({
    cellSize: 145,
    baseAzimuthRadians: 0,
    azimuthAmplitudeRadians: Math.PI,
    tiltAmplitudeRadians: 0.72,
    azimuthDrift: { x: 0.36, y: 0.24 },
    tiltDrift: { x: -0.27, y: 0.33 },
  }),
  camera: defineCamera({
    eye: { x: 500, y: 350, z: 750 },
    target: { x: 500, y: 350, z: 0 },
    up: { x: 0, y: -1, z: 0 },
    verticalFovRadians: (55 * Math.PI) / 180,
    near: 50,
    far: 2_500,
  }),
  ground: defineGroundStyle({
    elevation: -10.5,
  }),
})
