import { Array, Data, Match as M, Number as Num } from 'effect'

export type NormalizedPoint = Readonly<{
  x: number
  y: number
}>

export type Concentration = Readonly<{
  spread: number
  strength: number
  background: number
}>

export type Uniform = Readonly<{
  _tag: 'Uniform'
}>

export type Grid = Readonly<{
  _tag: 'Grid'
  divisions: number
  weights: ReadonlyArray<number>
}>

export type EdgeName = 'Top' | 'Right' | 'Bottom' | 'Left'

export type Edge = Readonly<{
  _tag: 'Edge'
  from: EdgeName
  concentration: Concentration
}>

export type Radial = Readonly<{
  _tag: 'Radial'
  center: NormalizedPoint
  concentration: Concentration
}>

export type DotDistribution = Uniform | Grid | Edge | Radial

const Distribution = Data.taggedEnum<DotDistribution>()

const validateConcentration = ({
  spread,
  strength,
  background,
}: Concentration): void => {
  if (!Number.isFinite(spread) || spread <= 0) {
    throw new RangeError('spread must be greater than 0')
  }

  if (!Number.isFinite(strength) || strength <= 0) {
    throw new RangeError('strength must be greater than 0')
  }

  if (background < 0 || background > 1) {
    throw new RangeError('background must be between 0 and 1')
  }
}

export const Uniform = Distribution.Uniform

export const Grid = ({ divisions, weights }: Omit<Grid, '_tag'>): Grid => {
  if (!Number.isInteger(divisions) || divisions < 1 || divisions > 32) {
    throw new RangeError('divisions must be an integer between 1 and 32')
  }

  const requiredWeightCount = divisions * divisions

  if (weights.length !== requiredWeightCount) {
    throw new RangeError(
      `A ${divisions} × ${divisions} grid requires exactly ${requiredWeightCount} weights`,
    )
  }

  if (
    Array.some(weights, weight => !Number.isFinite(weight) || weight < 0) ||
    Array.reduce(weights, 0, Num.sum) <= 0
  ) {
    throw new RangeError(
      'grid weights must be finite, non-negative, and contain a positive weight',
    )
  }

  return Distribution.Grid({ divisions, weights })
}

export const Edge = (input: Omit<Edge, '_tag'>): Edge => {
  validateConcentration(input.concentration)

  return Distribution.Edge(input)
}

export const Radial = (input: Omit<Radial, '_tag'>): Radial => {
  validateConcentration(input.concentration)

  return Distribution.Radial(input)
}

const concentrationDensity = (
  distance: number,
  concentration: Concentration,
): number => {
  const normalizedDistance = Math.min(
    1,
    Math.max(0, distance / concentration.spread),
  )

  return (
    concentration.background +
    (1 - concentration.background) *
      Math.pow(1 - normalizedDistance, concentration.strength)
  )
}

const edgeDistance: Record<EdgeName, (point: NormalizedPoint) => number> = {
  Top: point => point.y,
  Right: point => 1 - point.x,
  Bottom: point => 1 - point.y,
  Left: point => point.x,
}

const gridDensityAt = (distribution: Grid, point: NormalizedPoint): number => {
  const column = Math.min(
    distribution.divisions - 1,
    Math.floor(point.x * distribution.divisions),
  )

  const row = Math.min(
    distribution.divisions - 1,
    Math.floor(point.y * distribution.divisions),
  )

  return distribution.weights[row * distribution.divisions + column] ?? 0
}

export const relativeDensityAt = (
  distribution: DotDistribution,
  point: NormalizedPoint,
): number =>
  M.value(distribution).pipe(
    M.tagsExhaustive({
      Uniform: () => 1,
      Grid: grid => gridDensityAt(grid, point),
      Edge: edge =>
        concentrationDensity(
          edgeDistance[edge.from](point),
          edge.concentration,
        ),
      Radial: radial =>
        concentrationDensity(
          Math.hypot(point.x - radial.center.x, point.y - radial.center.y),
          radial.concentration,
        ),
    }),
  )
