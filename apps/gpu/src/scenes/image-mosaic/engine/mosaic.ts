import { Array, Schema } from 'effect'

import { type BackgroundFill, transparentBackground } from './background'
import { type Motion, tileOffset } from './motion'

export const Tile = Schema.Struct({
  x: Schema.Number,
  y: Schema.Number,
  width: Schema.Number,
  height: Schema.Number,
  red: Schema.Number,
  green: Schema.Number,
  blue: Schema.Number,
  alpha: Schema.Number,
})

export const Grid = Schema.Struct({
  width: Schema.Number,
  height: Schema.Number,
  columns: Schema.Number,
  rows: Schema.Number,
  cellSize: Schema.Number,
  tiles: Schema.Array(Tile),
})

export type Grid = typeof Grid.Type

export const gridLayout = (width: number, height: number, density: number) => {
  const cellSize = Math.max(width, height) / density

  return {
    columns: Math.ceil((width * density) / Math.max(width, height)),
    rows: Math.ceil((height * density) / Math.max(width, height)),
    cellSize,
  }
}

type Raster = Readonly<{
  width: number
  height: number
  pixels: Uint8ClampedArray
}>

export const sampleGrid = (
  { width, height, pixels }: Raster,
  density: number,
) => {
  const { columns, rows, cellSize } = gridLayout(width, height, density)

  const cells = Array.makeBy(columns * rows, index => {
    const x = (index % columns) * cellSize
    const y = Math.floor(index / columns) * cellSize
    const cellWidth = Math.min(cellSize, width - x)
    const cellHeight = Math.min(cellSize, height - y)
    const sampleX = Math.min(width - 1, Math.floor(x + cellWidth / 2))
    const sampleY = Math.min(height - 1, Math.floor(y + cellHeight / 2))
    const offset = (sampleY * width + sampleX) * 4
    const red = pixels[offset] ?? 0
    const green = pixels[offset + 1] ?? 0
    const blue = pixels[offset + 2] ?? 0
    const alpha = (pixels[offset + 3] ?? 0) / 255

    return {
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      red,
      green,
      blue,
      alpha,
    }
  })

  return { width, height, columns, rows, cellSize, tiles: cells }
}

export const renderMosaic = (
  grid: Grid,
  seed: number,
  motion: Motion,
  background: BackgroundFill = transparentBackground,
): string => {
  const fill =
    background.mode === 'Solid'
      ? `<rect width="${grid.width}" height="${grid.height}" fill="${background.color}"/>`
      : ''

  const cells = grid.tiles
    .map((tile, index) => {
      const offset = tileOffset(seed, index, grid.cellSize, motion)

      return `<rect x="${tile.x + offset.x}" y="${tile.y + offset.y}" width="${tile.width}" height="${tile.height}" fill="rgb(${tile.red} ${tile.green} ${tile.blue})" fill-opacity="${tile.alpha}"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${grid.width}" height="${grid.height}" viewBox="0 0 ${grid.width} ${grid.height}" shape-rendering="crispEdges">${fill}${cells}</svg>`
}
