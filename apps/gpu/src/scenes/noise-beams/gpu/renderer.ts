import { type TgpuRoot, d, std, tgpu } from 'typegpu'

import * as Theme from '../../../theme'
import { cameraProjection } from '../engine/cameraProjection'
import type { NoiseBeamFieldDefinition } from '../engine/definition'
import {
  UNIT_CYLINDRICAL_ROD_MESH,
  UNIT_CYLINDRICAL_ROD_VERTEX_COUNT,
} from './cylindricalRodMesh'
import { premultipliedClearColor } from './premultipliedClearColor'

const HASH_PRIME_X = 374761393

const HASH_PRIME_Y = 668265263

const HASH_PRIME_FINAL_LOW = 40801

const HASH_PRIME_FINAL_HIGH = 19441

const HASH_SHIFT_INTERMIX = 13

const HASH_SHIFT_AVALANCHE = 16

const UINT16_MASK = 65535

const UINT32_MASK = 4294967295

const UINT32_RANGE = 4294967296

const TWO_PI = Math.PI * 2

const TILT_OFFSET_X = 19.31

const TILT_OFFSET_Y = -7.73

const CylindricalRodVertex = d.struct({
  position: d.vec3f,
  normal: d.vec3f,
})

const FieldUniform = d.struct({
  canvasSize: d.vec2f,
  gridSize: d.vec2f,
  paddingAndCellSize: d.vec2f,
  rodLengthAndRadius: d.vec2f,
  timeSeconds: d.f32,
  noiseSeed: d.u32,
  azimuthControls: d.vec2f,
  tiltAmplitudeRadians: d.f32,
  azimuthDrift: d.vec2f,
  tiltDrift: d.vec2f,
  cameraEyeAndTanHalfFov: d.vec4f,
  cameraRightAndAspect: d.vec4f,
  cameraUpAndNear: d.vec4f,
  cameraForwardAndFar: d.vec4f,
  groundElevation: d.f32,
  color: d.vec4f,
  groundColor: d.vec4f,
})

const WaveSample = d.struct({
  root: d.vec3f,
  azimuth: d.f32,
  tilt: d.f32,
})

const perlinFade = tgpu.fn(
  [d.f32],
  d.f32,
)(value => {
  'use gpu'

  return value * value * value * (value * (value * 6 - 15) + 10)
})

const perlinLerp = tgpu.fn(
  [d.f32, d.f32, d.f32],
  d.f32,
)((start, end, amount) => {
  'use gpu'

  return start + (end - start) * amount
})

const multiplyHashLikeJavaScript = tgpu.fn(
  [d.i32],
  d.u32,
)(value => {
  'use gpu'

  const valueBits = d.u32(value)
  const magnitude = value < 0 ? d.u32(0) - valueBits : valueBits
  const valueLow = magnitude & UINT16_MASK
  const valueHigh = magnitude >>> 16
  const productLow = valueLow * HASH_PRIME_FINAL_LOW
  const middleLow = valueHigh * HASH_PRIME_FINAL_LOW
  const middleHigh = valueLow * HASH_PRIME_FINAL_HIGH

  const carry =
    (productLow >>> 16) + (middleLow & UINT16_MASK) + (middleHigh & UINT16_MASK)

  let lowWord = (productLow & UINT16_MASK) | ((carry & UINT16_MASK) << 16)

  const highWord =
    valueHigh * HASH_PRIME_FINAL_HIGH +
    (middleLow >>> 16) +
    (middleHigh >>> 16) +
    (carry >>> 16)

  let roundingShift = d.u32(0)

  if (highWord >= 2097152) {
    roundingShift = 1
  }

  if (highWord >= 4194304) {
    roundingShift = 2
  }

  if (highWord >= 8388608) {
    roundingShift = 3
  }

  if (highWord >= 16777216) {
    roundingShift = 4
  }

  if (highWord >= 33554432) {
    roundingShift = 5
  }

  if (highWord >= 67108864) {
    roundingShift = 6
  }

  if (highWord >= 134217728) {
    roundingShift = 7
  }

  if (highWord >= 268435456) {
    roundingShift = 8
  }

  if (highWord >= 536870912) {
    roundingShift = 9
  }

  if (roundingShift > 0) {
    const roundingUnit = d.u32(1) << roundingShift
    const remainderMask = roundingUnit - 1
    const remainder = lowWord & remainderMask
    const half = roundingUnit >>> 1
    const roundedDown = lowWord & (remainderMask ^ UINT32_MASK)
    const oddQuotient = ((lowWord >>> roundingShift) & 1) === 1

    lowWord = roundedDown

    if (remainder > half || (remainder === half && oddQuotient)) {
      lowWord = lowWord + roundingUnit
    }
  }

  return value < 0 ? d.u32(0) - lowWord : lowWord
})

const perlinGradient = tgpu.fn(
  [d.i32, d.i32],
  d.vec2f,
)((latticeX, latticeY) => {
  'use gpu'

  const seeded = d.u32(latticeX) * HASH_PRIME_X + d.u32(latticeY) * HASH_PRIME_Y
  const intermixed = seeded ^ (seeded >>> HASH_SHIFT_INTERMIX)
  const mixed = multiplyHashLikeJavaScript(d.i32(intermixed))
  const avalanched = mixed ^ (mixed >>> HASH_SHIFT_AVALANCHE)
  const angle = (d.f32(avalanched) / UINT32_RANGE) * TWO_PI

  return d.vec2f(std.cos(angle), std.sin(angle))
})

const perlinDotGradient = tgpu.fn(
  [d.i32, d.i32, d.f32, d.f32],
  d.f32,
)((latticeX, latticeY, offsetX, offsetY) => {
  'use gpu'

  const gradient = perlinGradient(latticeX, latticeY)

  return gradient.x * offsetX + gradient.y * offsetY
})

export const perlin2Gpu = tgpu.fn(
  [d.vec2f],
  d.f32,
)(position => {
  'use gpu'

  const x0 = d.i32(std.floor(position.x))
  const y0 = d.i32(std.floor(position.y))
  const x1 = x0 + 1
  const y1 = y0 + 1
  const offsetX = position.x - d.f32(x0)
  const offsetY = position.y - d.f32(y0)
  const fadedX = perlinFade(offsetX)
  const fadedY = perlinFade(offsetY)
  const topLeft = perlinDotGradient(x0, y0, offsetX, offsetY)
  const topRight = perlinDotGradient(x1, y0, offsetX - 1, offsetY)
  const bottomLeft = perlinDotGradient(x0, y1, offsetX, offsetY - 1)
  const bottomRight = perlinDotGradient(x1, y1, offsetX - 1, offsetY - 1)

  return perlinLerp(
    perlinLerp(topLeft, topRight, fadedX),
    perlinLerp(bottomLeft, bottomRight, fadedX),
    fadedY,
  )
})

export type NoiseBeamRenderer = Readonly<{
  updateTime: (timeSeconds: number) => void
  updateSeed: (seed: number) => void
  resize: (width: number, height: number) => void
  updatePalette: (palette: Theme.Palette) => void
  draw: () => void
  destroy: () => void
}>

const gpuColor = (color: Theme.Color, alpha: number): d.v4f =>
  d.vec4f(color.red / 255, color.green / 255, color.blue / 255, alpha)

const configureRenderer = (
  root: TgpuRoot,
  canvas: HTMLCanvasElement,
  definition: NoiseBeamFieldDefinition,
  initialPalette: Theme.Palette,
  initialSeed: number,
): NoiseBeamRenderer => {
  const context = root.configureContext({
    canvas,
    alphaMode: 'premultiplied',
  })

  const camera = cameraProjection(
    definition.camera,
    definition.width / definition.height,
  )

  const rodVertexLayout = tgpu.vertexLayout(d.arrayOf(CylindricalRodVertex))

  const rodVertices = UNIT_CYLINDRICAL_ROD_MESH.map(vertex => ({
    position: d.vec3f(...vertex.position),
    normal: d.vec3f(...vertex.normal),
  }))

  const rodVertexBuffer = root
    .createBuffer(
      d.arrayOf(CylindricalRodVertex, UNIT_CYLINDRICAL_ROD_VERTEX_COUNT),
      rodVertices,
    )
    .$usage('vertex')

  const fieldBuffer = root
    .createBuffer(FieldUniform, {
      canvasSize: d.vec2f(definition.width, definition.height),
      gridSize: d.vec2f(definition.grid.columns, definition.grid.rows),
      paddingAndCellSize: d.vec2f(
        definition.grid.padding,
        definition.waveField.cellSize,
      ),
      rodLengthAndRadius: d.vec2f(
        definition.beam.length,
        definition.beam.radius,
      ),
      timeSeconds: 0,
      noiseSeed: initialSeed,
      azimuthControls: d.vec2f(
        definition.waveField.baseAzimuthRadians,
        definition.waveField.azimuthAmplitudeRadians,
      ),
      tiltAmplitudeRadians: definition.waveField.tiltAmplitudeRadians,
      azimuthDrift: d.vec2f(
        definition.waveField.azimuthDrift.x,
        definition.waveField.azimuthDrift.y,
      ),
      tiltDrift: d.vec2f(
        definition.waveField.tiltDrift.x,
        definition.waveField.tiltDrift.y,
      ),
      cameraEyeAndTanHalfFov: d.vec4f(
        ...camera.eye,
        camera.tangentHalfVerticalFov,
      ),
      cameraRightAndAspect: d.vec4f(...camera.right, camera.aspectRatio),
      cameraUpAndNear: d.vec4f(...camera.up, camera.near),
      cameraForwardAndFar: d.vec4f(...camera.forward, camera.far),
      groundElevation: definition.ground.elevation,
      color: gpuColor(initialPalette.green, 1),
      groundColor: gpuColor(initialPalette.surface, 1),
    })
    .$usage('uniform')

  const field = fieldBuffer.as('uniform')
  const timeOffset = d.memoryLayoutOf(FieldUniform, value => value.timeSeconds)
  const seedOffset = d.memoryLayoutOf(FieldUniform, value => value.noiseSeed)
  const timeBytes = new Float32Array(1)
  const seedBytes = new Uint32Array(1)

  const sampleWave = tgpu.fn(
    [d.u32],
    WaveSample,
  )(instanceIndex => {
    'use gpu'

    const columns = d.u32(field.$.gridSize.x)
    const column = instanceIndex % columns
    const row = d.u32(instanceIndex / columns)
    const padding = field.$.paddingAndCellSize.x
    const cellWidth = (field.$.canvasSize.x - 2 * padding) / field.$.gridSize.x
    const cellHeight = (field.$.canvasSize.y - 2 * padding) / field.$.gridSize.y
    const centerX = padding + (d.f32(column) + 0.5) * cellWidth
    const centerY = padding + (d.f32(row) + 0.5) * cellHeight
    const flowX = centerX / field.$.paddingAndCellSize.y
    const flowY = centerY / field.$.paddingAndCellSize.y
    const mixedSeed = field.$.noiseSeed * HASH_PRIME_X + HASH_PRIME_Y
    const noiseOffsetX = (d.f32(mixedSeed & UINT16_MASK) / UINT16_MASK) * 113
    const noiseOffsetY = (d.f32(mixedSeed >>> 16) / UINT16_MASK) * 127
    const timeSeconds = field.$.timeSeconds

    const azimuthNoise = perlin2Gpu(
      d.vec2f(
        flowX + noiseOffsetX + timeSeconds * field.$.azimuthDrift.x,
        flowY + noiseOffsetY + timeSeconds * field.$.azimuthDrift.y,
      ),
    )

    const tiltNoise = perlin2Gpu(
      d.vec2f(
        flowX * 0.83 +
          TILT_OFFSET_X +
          noiseOffsetY +
          timeSeconds * field.$.tiltDrift.x,
        flowY * 0.83 +
          TILT_OFFSET_Y +
          noiseOffsetX +
          timeSeconds * field.$.tiltDrift.y,
      ),
    )

    return WaveSample({
      root: d.vec3f(centerX, centerY, field.$.groundElevation),
      azimuth:
        field.$.azimuthControls.x + azimuthNoise * field.$.azimuthControls.y,
      tilt: tiltNoise * field.$.tiltAmplitudeRadians,
    })
  })

  const projectWorld = tgpu.fn(
    [d.vec3f],
    d.vec4f,
  )(worldPosition => {
    'use gpu'

    const fromEye = d.vec3f(
      worldPosition.x - field.$.cameraEyeAndTanHalfFov.x,
      worldPosition.y - field.$.cameraEyeAndTanHalfFov.y,
      worldPosition.z - field.$.cameraEyeAndTanHalfFov.z,
    )

    const cameraX = std.dot(fromEye, field.$.cameraRightAndAspect.xyz)
    const cameraY = std.dot(fromEye, field.$.cameraUpAndNear.xyz)
    const cameraDepth = std.dot(fromEye, field.$.cameraForwardAndFar.xyz)
    const near = field.$.cameraUpAndNear.w
    const far = field.$.cameraForwardAndFar.w
    const depthScale = far / (far - near)

    return d.vec4f(
      cameraX /
        (field.$.cameraEyeAndTanHalfFov.w * field.$.cameraRightAndAspect.w),
      cameraY / field.$.cameraEyeAndTanHalfFov.w,
      cameraDepth * depthScale - near * depthScale,
      cameraDepth,
    )
  })

  const quadCoordinate = tgpu.fn(
    [d.u32],
    d.vec2f,
  )(vertexIndex => {
    'use gpu'

    let coordinate = d.vec2f(-0.5, -0.5)

    if (vertexIndex === 1) {
      coordinate = d.vec2f(0.5, -0.5)
    }

    if (vertexIndex === 2 || vertexIndex === 4) {
      coordinate = d.vec2f(0.5, 0.5)
    }

    if (vertexIndex === 3) {
      coordinate = d.vec2f(-0.5, -0.5)
    }

    if (vertexIndex === 5) {
      coordinate = d.vec2f(-0.5, 0.5)
    }

    return coordinate
  })

  const beamVertex = tgpu.vertexFn({
    in: {
      position: d.vec3f,
      normal: d.vec3f,
      instanceIndex: d.builtin.instanceIndex,
    },
    out: { position: d.builtin.position },
  })(input => {
    'use gpu'

    const wave = sampleWave(input.instanceIndex)
    const cosineAzimuth = std.cos(wave.azimuth)
    const sineAzimuth = std.sin(wave.azimuth)
    const cosineTilt = std.cos(wave.tilt)
    const sineTilt = std.sin(wave.tilt)
    const rodDiameter = field.$.rodLengthAndRadius.y * 2
    const localX = input.position.x * rodDiameter
    const localY = input.position.y * rodDiameter
    const localZ = input.position.z * field.$.rodLengthAndRadius.x
    const tiltedX = localX * cosineTilt + localZ * sineTilt
    const tiltedZ = -localX * sineTilt + localZ * cosineTilt

    const worldPosition = d.vec3f(
      wave.root.x + tiltedX * cosineAzimuth - localY * sineAzimuth,
      wave.root.y + tiltedX * sineAzimuth + localY * cosineAzimuth,
      wave.root.z + tiltedZ,
    )

    return { position: projectWorld(worldPosition) }
  })

  const beamFragment = tgpu.fragmentFn({ out: d.vec4f })(() => {
    'use gpu'

    return d.vec4f(field.$.color.rgb, 1)
  })

  const groundVertex = tgpu.vertexFn({
    in: { vertexIndex: d.builtin.vertexIndex },
    out: { position: d.builtin.position },
  })(input => {
    'use gpu'

    const coordinate = quadCoordinate(input.vertexIndex)

    return {
      position: projectWorld(
        d.vec3f(
          (coordinate.x + 0.5) * field.$.canvasSize.x,
          (coordinate.y + 0.5) * field.$.canvasSize.y,
          field.$.groundElevation,
        ),
      ),
    }
  })

  const groundFragment = tgpu.fragmentFn({ out: d.vec4f })(() => {
    'use gpu'

    return d.vec4f(field.$.groundColor.rgb, 1)
  })

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

  const opaqueDepth: GPUDepthStencilState = {
    format: 'depth24plus',
    depthWriteEnabled: true,
    depthCompare: 'less',
  }

  const beamPipeline = root.createRenderPipeline({
    attribs: { ...rodVertexLayout.attrib },
    vertex: beamVertex,
    fragment: beamFragment,
    targets: { format: presentationFormat },
    primitive: {
      topology: 'triangle-list',
      cullMode: 'none',
    },
    depthStencil: opaqueDepth,
  })

  const groundPipeline = root.createRenderPipeline({
    vertex: groundVertex,
    fragment: groundFragment,
    targets: { format: presentationFormat },
    primitive: { topology: 'triangle-list' },
    depthStencil: opaqueDepth,
  })

  beamPipeline.initSync()
  groundPipeline.initSync()

  const drawingBeamPipeline = beamPipeline.with(
    rodVertexLayout,
    rodVertexBuffer,
  )

  const createDepthResources = (width: number, height: number) => {
    const texture = root
      .createTexture({ size: [width, height], format: 'depth24plus' })
      .$usage('render')

    return {
      width,
      height,
      texture,
      view: texture.createView('render'),
    }
  }

  let depthResources = createDepthResources(canvas.width, canvas.height)

  let clearColor = premultipliedClearColor({
    red: initialPalette.page.red / 255,
    green: initialPalette.page.green / 255,
    blue: initialPalette.page.blue / 255,
    alpha: 1,
  })

  const draw = () => {
    groundPipeline
      .withColorAttachment({
        view: context,
        clearValue: clearColor,
        loadOp: 'clear',
        storeOp: 'store',
      })
      .withDepthStencilAttachment({
        view: depthResources.view,
        depthClearValue: 1,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      })
      .draw(6)
    drawingBeamPipeline
      .withColorAttachment({
        view: context,
        loadOp: 'load',
        storeOp: 'store',
      })
      .withDepthStencilAttachment({
        view: depthResources.view,
        depthLoadOp: 'load',
        depthStoreOp: 'store',
      })
      .draw(
        UNIT_CYLINDRICAL_ROD_VERTEX_COUNT,
        definition.grid.columns * definition.grid.rows,
      )
  }

  return {
    updateTime: timeSeconds => {
      timeBytes[0] = timeSeconds
      fieldBuffer.write(timeBytes.buffer, { startOffset: timeOffset.offset })
    },
    updateSeed: seed => {
      seedBytes[0] = seed
      fieldBuffer.write(seedBytes.buffer, { startOffset: seedOffset.offset })
    },
    resize: (width, height) => {
      if (depthResources.width === width && depthResources.height === height) {
        draw()

        return
      }

      const replacement = createDepthResources(width, height)
      depthResources.texture.destroy()
      depthResources = replacement
      draw()
    },
    updatePalette: palette => {
      fieldBuffer.patch({
        color: gpuColor(palette.green, 1),
        groundColor: gpuColor(palette.surface, 1),
      })
      clearColor = premultipliedClearColor({
        red: palette.page.red / 255,
        green: palette.page.green / 255,
        blue: palette.page.blue / 255,
        alpha: 1,
      })
    },
    draw,
    destroy: () => {
      try {
        depthResources.texture.destroy()
      } finally {
        root.destroy()
      }
    },
  }
}

export const createNoiseBeamRenderer = async (
  canvas: HTMLCanvasElement,
  definition: NoiseBeamFieldDefinition,
  palette: Theme.Palette,
  seed: number,
): Promise<NoiseBeamRenderer> => {
  const root = await tgpu.init({
    adapter: { powerPreference: 'high-performance' },
  })

  try {
    return configureRenderer(root, canvas, definition, palette, seed)
  } catch (cause: unknown) {
    try {
      root.destroy()
    } catch {
      // NOTE: Cleanup failure must not replace the renderer configuration failure.
    }

    throw cause
  }
}
