import { hexRgb } from '../engine/grid'
import type { Grid } from '../engine/grid'
import type { Settings } from '../model'

export type Artwork = Readonly<{
  grid: Grid
  levels: ReadonlyArray<number>
  settings: Settings
}>

export type Renderer = Readonly<{
  draw: (artwork: Artwork) => void
  destroy: () => void
}>

export const sizeCanvas = (canvas: HTMLCanvasElement, grid: Grid): void => {
  const scale = 960 / Math.max(grid.width, grid.height)
  const width = Math.round(grid.width * scale)
  const height = Math.round(grid.height * scale)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
}

export const createCanvasRenderer = (canvas: HTMLCanvasElement): Renderer => {
  const context = canvas.getContext('2d')

  return {
    draw: ({ grid, levels, settings }) => {
      if (context === null) {
        return
      }

      sizeCanvas(canvas, grid)
      const base = hexRgb(settings.base)
      const subject = hexRgb(settings.subject)
      context.fillStyle = `rgb(${base.map(channel => Math.round(channel * 255 * 0.8)).join(' ')})`
      context.fillRect(0, 0, canvas.width, canvas.height)
      const cellSize = Math.max(canvas.width, canvas.height) / settings.density
      const gap = cellSize * 0.06

      grid.coverage.forEach((_coverage, index) => {
        const column = index % grid.columns
        const row = Math.floor(index / grid.columns)
        const level = levels[index] ?? 0

        const rgb = base.map((channel, component) =>
          Math.round(
            (channel + ((subject[component] ?? 0) - channel) * level) * 255,
          ),
        )

        const x = column * cellSize
        const y = row * cellSize
        const width = Math.min(cellSize, canvas.width - x)

        context.fillStyle = `rgb(${rgb.join(' ')})`

        const displayX =
          settings.mirror === 'Mirrored' ? canvas.width - x - width : x

        context.fillRect(
          displayX + gap / 2,
          y + gap / 2,
          width - gap,
          Math.min(cellSize, canvas.height - y) - gap,
        )
      })
    },
    destroy: () => undefined,
  }
}
