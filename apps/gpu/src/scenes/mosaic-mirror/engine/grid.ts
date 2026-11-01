import { Array, Schema } from 'effect'

const Dimension = Schema.Int.check(
  Schema.isBetween({ minimum: 1, maximum: 1024 }),
)

const Unit = Schema.Number.check(Schema.isBetween({ minimum: 0, maximum: 1 }))

export const Grid = Schema.Struct({
  width: Dimension,
  height: Dimension,
  columns: Dimension,
  rows: Dimension,
  coverage: Schema.Array(Unit),
}).check(
  Schema.makeFilter(grid => grid.coverage.length === grid.columns * grid.rows),
)

export type Grid = typeof Grid.Type

export const layout = (width: number, height: number, density: number) => {
  const cellSize = Math.max(width, height) / density

  return {
    columns: Math.ceil(width / cellSize),
    rows: Math.ceil(height / cellSize),
    cellSize,
  }
}

export const sampleMask = (
  pixels: Float32Array,
  width: number,
  height: number,
  density: number,
): Grid => {
  const { columns, rows, cellSize } = layout(width, height, density)
  const totals = new Float64Array(columns * rows)
  const counts = new Uint32Array(columns * rows)

  pixels.forEach((confidence, index) => {
    const column = Math.min(columns - 1, Math.floor((index % width) / cellSize))

    const row = Math.min(
      rows - 1,
      Math.floor(Math.floor(index / width) / cellSize),
    )

    const tile = row * columns + column
    totals[tile] = (totals[tile] ?? 0) + Math.max(0, Math.min(1, confidence))
    counts[tile] = (counts[tile] ?? 0) + 1
  })

  return {
    width,
    height,
    columns,
    rows,
    coverage: Array.makeBy(
      columns * rows,
      index => (totals[index] ?? 0) / Math.max(1, counts[index] ?? 0),
    ),
  }
}

export const tileLevels = (
  grid: Grid,
  previous: ReadonlyArray<number>,
  sensitivity: number,
  smoothing: number,
  elapsedMs: number,
): ReadonlyArray<number> => {
  const threshold = 0.85 - sensitivity * 0.0075

  const weight =
    smoothing === 0
      ? 1
      : 1 - Math.exp(-Math.min(250, elapsedMs) / (smoothing * 4))

  return grid.coverage.map((coverage, index) => {
    const target = coverage >= threshold ? 1 : 0
    const before = previous[index] ?? 0
    const next = before + (target - before) * weight

    return Math.abs(next - target) < 0.005 ? target : next
  })
}

export const hexRgb = (hex: string): readonly [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16) / 255,
  Number.parseInt(hex.slice(3, 5), 16) / 255,
  Number.parseInt(hex.slice(5, 7), 16) / 255,
]
