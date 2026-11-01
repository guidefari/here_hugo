import { common, d, std, tgpu } from 'typegpu'

import { hexRgb } from '../engine/grid'
import type { Renderer } from './canvas'
import { sizeCanvas } from './canvas'

const Config = d.struct({
  size: d.vec2f,
  columns: d.u32,
  density: d.f32,
  mirror: d.u32,
  base: d.vec4f,
  subject: d.vec4f,
})

export const createGpuRenderer = async (
  canvas: HTMLCanvasElement,
  onLost: () => void,
): Promise<Renderer> => {
  const root = await tgpu.init({ adapter: { powerPreference: 'low-power' } })

  try {
    const context = root.configureContext({ canvas, alphaMode: 'opaque' })
    const config = root.createUniform(Config)
    const levels = root.createReadonly(d.arrayOf(d.f32, 96 * 96))

    const fragment = tgpu.fragmentFn({ in: { uv: d.vec2f }, out: d.vec4f })(
      input => {
        'use gpu'

        const x =
          std.clamp(
            config.$.mirror === 1 ? 1 - input.uv.x : input.uv.x,
            0,
            0.999999,
          ) * config.$.size.x

        const y = std.clamp(input.uv.y, 0, 0.999999) * config.$.size.y

        const cellSize =
          std.max(config.$.size.x, config.$.size.y) / config.$.density

        const column = d.u32(std.floor(x / cellSize))
        const row = d.u32(std.floor(y / cellSize))
        const index = row * config.$.columns + column
        const localX = x - d.f32(column) * cellSize
        const localY = y - d.f32(row) * cellSize

        const width = std.min(
          cellSize,
          config.$.size.x - d.f32(column) * cellSize,
        )

        const height = std.min(
          cellSize,
          config.$.size.y - d.f32(row) * cellSize,
        )

        const gap = cellSize * 0.03

        if (
          localX < gap ||
          localY < gap ||
          localX > width - gap ||
          localY > height - gap
        ) {
          return d.vec4f(
            config.$.base.r * 0.8,
            config.$.base.g * 0.8,
            config.$.base.b * 0.8,
            1,
          )
        }

        return std.mix(config.$.base, config.$.subject, d.f32(levels.$[index]))
      },
    )

    const pipeline = root.createRenderPipeline({
      vertex: common.fullScreenTriangle,
      fragment,
      targets: { format: navigator.gpu.getPreferredCanvasFormat() },
    })

    await pipeline.initAsync()
    const lifecycle = { destroyed: false }

    root.device.lost
      .then(() => {
        if (!lifecycle.destroyed) {
          onLost()
        }
      })
      .catch(() => {
        if (!lifecycle.destroyed) {
          onLost()
        }
      })

    return {
      draw: artwork => {
        sizeCanvas(canvas, artwork.grid)
        config.write({
          size: d.vec2f(artwork.grid.width, artwork.grid.height),
          columns: artwork.grid.columns,
          density: artwork.settings.density,
          mirror: artwork.settings.mirror === 'Mirrored' ? 1 : 0,
          base: d.vec4f(...hexRgb(artwork.settings.base), 1),
          subject: d.vec4f(...hexRgb(artwork.settings.subject), 1),
        })
        levels.write(
          artwork.grid.coverage.map(
            (_value, index) => artwork.levels[index] ?? 0,
          ),
        )
        pipeline.withColorAttachment({ view: context }).draw(3)
      },
      destroy: () => {
        lifecycle.destroyed = true
        root.destroy()
      },
    }
  } catch (cause: unknown) {
    root.destroy()
    throw cause
  }
}
