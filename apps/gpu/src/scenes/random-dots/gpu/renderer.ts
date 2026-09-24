import { Array } from 'effect'
import { type TgpuRoot, d, std, tgpu } from 'typegpu'

import * as Theme from '../../../theme'
import { DOT_COUNT_PER_PANEL, PANEL_DEFINITIONS } from '../constants'
import type { PanelArtwork } from '../model'
import { interleavePanelArtwork, visibleInstanceCount } from './dotInstance'

const LOGICAL_CANVAS_SIZE = 600

const INSTANCE_CAPACITY = DOT_COUNT_PER_PANEL * PANEL_DEFINITIONS.length

const DotInstance = d.struct({
  center: d.vec2f,
  radius: d.f32,
})

const dotInstanceLayout = tgpu.vertexLayout(d.arrayOf(DotInstance), 'instance')

const dotColor = tgpu.accessor(d.vec3f)

const dotVertex = tgpu.vertexFn({
  in: {
    center: d.vec2f,
    radius: d.f32,
    vertexIndex: d.builtin.vertexIndex,
  },
  out: {
    position: d.builtin.position,
    localPosition: d.vec2f,
  },
})(input => {
  'use gpu'

  let cornerX = d.f32(-1)
  let cornerY = d.f32(-1)

  if (input.vertexIndex === 1) {
    cornerX = 1
  } else if (input.vertexIndex === 2 || input.vertexIndex === 3) {
    cornerY = 1
  } else if (input.vertexIndex === 4) {
    cornerX = 1
  } else if (input.vertexIndex === 5) {
    cornerX = 1
    cornerY = 1
  }

  const x =
    (input.center.x + cornerX * input.radius) / (LOGICAL_CANVAS_SIZE / 2) - 1

  const y =
    1 - (input.center.y + cornerY * input.radius) / (LOGICAL_CANVAS_SIZE / 2)

  return {
    position: d.vec4f(x, y, 0, 1),
    localPosition: d.vec2f(cornerX, cornerY),
  }
})

const dotFragment = tgpu.fragmentFn({
  in: { localPosition: d.vec2f },
  out: d.vec4f,
})(input => {
  'use gpu'

  const distance = std.length(input.localPosition)
  const edgeWidth = std.fwidth(distance)
  const coverage = 1 - std.smoothstep(1 - edgeWidth, 1 + edgeWidth, distance)

  return d.vec4f(dotColor.$, coverage)
})

export type DotRenderer = Readonly<{
  uploadArtwork: (
    panels: ReadonlyArray<PanelArtwork>,
    pointCountPerPanel: number,
  ) => void
  updatePalette: (palette: Theme.Palette) => void
  draw: (visibleCountPerPanel: number, panelCount: number) => void
  destroy: () => void
}>

const configureRenderer = (
  root: TgpuRoot,
  canvas: HTMLCanvasElement,
  initialPalette: Theme.Palette,
): DotRenderer => {
  const context = root.configureContext({
    canvas,
    alphaMode: 'premultiplied',
  })

  const dotColorBuffer = root.createUniform(
    d.vec3f,
    d.vec3f(...Theme.colorToUnitRgb(initialPalette.text)),
  )

  const dotBuffer = root
    .createBuffer(dotInstanceLayout.schemaForCount(INSTANCE_CAPACITY))
    .$usage('vertex')

  const pipeline = root.with(dotColor, dotColorBuffer).createRenderPipeline({
    attribs: { ...dotInstanceLayout.attrib },
    vertex: dotVertex,
    fragment: dotFragment,
    targets: {
      format: navigator.gpu.getPreferredCanvasFormat(),
      blend: {
        color: {
          srcFactor: 'src-alpha',
          dstFactor: 'one-minus-src-alpha',
          operation: 'add',
        },
        alpha: {
          srcFactor: 'one',
          dstFactor: 'one-minus-src-alpha',
          operation: 'add',
        },
      },
    },
    primitive: { topology: 'triangle-list' },
  })

  let clearValue: GPUColor = {
    r: initialPalette.elevated.red / 255,
    g: initialPalette.elevated.green / 255,
    b: initialPalette.elevated.blue / 255,
    a: 1,
  }

  return {
    uploadArtwork: (panels, pointCountPerPanel) => {
      const instances = Array.map(
        interleavePanelArtwork(panels, pointCountPerPanel),
        instance =>
          DotInstance({
            center: d.vec2f(instance.center.x, instance.center.y),
            radius: instance.radius,
          }),
      )

      dotBuffer.write(instances)
    },
    updatePalette: palette => {
      dotColorBuffer.write(d.vec3f(...Theme.colorToUnitRgb(palette.text)))
      clearValue = {
        r: palette.elevated.red / 255,
        g: palette.elevated.green / 255,
        b: palette.elevated.blue / 255,
        a: 1,
      }
    },
    draw: (visibleCountPerPanel, panelCount) =>
      pipeline
        .with(dotInstanceLayout, dotBuffer)
        .withColorAttachment({
          view: context,
          clearValue,
          loadOp: 'clear',
          storeOp: 'store',
        })
        .draw(
          6,
          visibleInstanceCount(
            visibleCountPerPanel,
            panelCount,
            DOT_COUNT_PER_PANEL,
          ),
        ),
    destroy: () => root.destroy(),
  }
}

export const createDotRenderer = async (
  canvas: HTMLCanvasElement,
  palette: Theme.Palette,
): Promise<DotRenderer> => {
  const root = await tgpu.init({
    adapter: { powerPreference: 'high-performance' },
  })

  return configureRenderer(root, canvas, palette)
}
