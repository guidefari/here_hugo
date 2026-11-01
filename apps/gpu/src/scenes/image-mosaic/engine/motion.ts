import { Schema } from 'effect'

export const Motion = Schema.Struct({
  intensity: Schema.Number,
  horizontalWeight: Schema.Number,
  verticalWeight: Schema.Number,
})

export type Motion = typeof Motion.Type

export const stationaryMotion: Motion = {
  intensity: 0,
  horizontalWeight: 100,
  verticalWeight: 100,
}

const hash = (seed: number, index: number): number => {
  const value = Math.imul(seed ^ Math.imul(index + 1, 0x9e3779b9), 0x85ebca6b)
  const mixed = Math.imul(value ^ (value >>> 16), 0xc2b2ae35)

  return (mixed ^ (mixed >>> 16)) >>> 0
}

export const tileMovement = (seed: number, index: number) => {
  const axis = hash(seed, index * 3) % 2 === 0 ? 'X' : 'Y'
  const direction = hash(seed, index * 3 + 1) % 2 === 0 ? -1 : 1
  const weight = hash(seed, index * 3 + 2) / 0xffffffff

  return { axis, direction, weight }
}

export const tileOffset = (
  seed: number,
  index: number,
  cellSize: number,
  motion: Motion,
) => {
  if (motion.intensity === 0) {
    return { x: 0, y: 0 }
  }

  const { axis, direction, weight } = tileMovement(seed, index)
  const distance = (motion.intensity / 100) * cellSize * 4 * direction * weight

  return {
    x:
      axis === 'X' && motion.horizontalWeight > 0 && motion.intensity > 0
        ? (distance * motion.horizontalWeight) / 100
        : 0,
    y:
      axis === 'Y' && motion.verticalWeight > 0 && motion.intensity > 0
        ? (distance * motion.verticalWeight) / 100
        : 0,
  }
}
