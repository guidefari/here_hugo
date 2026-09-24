import { Array, Number } from 'effect'

export const allocateByWeight = (
  total: number,
  weights: ReadonlyArray<number>,
): ReadonlyArray<number> => {
  const weightTotal = Array.reduce(weights, 0, Number.sum)
  const ideals = Array.map(weights, weight => (total * weight) / weightTotal)
  const floors = Array.map(ideals, Math.floor)
  const allocated = Array.reduce(floors, 0, Number.sum)
  const remainderCount = total - allocated

  const rankedCells = Array.map(ideals, (ideal, index) => ({
    index,
    remainder: ideal - Math.floor(ideal),
  }))

  rankedCells.sort(
    (left, right) =>
      right.remainder - left.remainder || left.index - right.index,
  )

  const cellsReceivingRemainders = new Set(
    Array.map(Array.take(rankedCells, remainderCount), cell => cell.index),
  )

  return Array.map(floors, (count, index) =>
    cellsReceivingRemainders.has(index) ? count + 1 : count,
  )
}
