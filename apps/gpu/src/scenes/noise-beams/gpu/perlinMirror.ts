const HASH_PRIME_X = 374761393

const HASH_PRIME_Y = 668265263

const HASH_PRIME_FINAL_LOW = 40801

const HASH_PRIME_FINAL_HIGH = 19441

const UINT16_MASK = 65535

const UINT32_MASK = 4294967295

const UINT32_RANGE = 0x100000000

const TWO_PI = Math.PI * 2

const fade = (value: number): number =>
  value * value * value * (value * (value * 6 - 15) + 10)

const lerp = (start: number, end: number, amount: number): number =>
  start + (end - start) * amount

const multiplyHashLikeJavaScript = (value: number): number => {
  const valueBits = value >>> 0
  const magnitude = value < 0 ? (0 - valueBits) >>> 0 : valueBits
  const valueLow = magnitude & UINT16_MASK
  const valueHigh = magnitude >>> 16
  const productLow = valueLow * HASH_PRIME_FINAL_LOW
  const middleLow = valueHigh * HASH_PRIME_FINAL_LOW
  const middleHigh = valueLow * HASH_PRIME_FINAL_HIGH

  const carry =
    (productLow >>> 16) + (middleLow & UINT16_MASK) + (middleHigh & UINT16_MASK)

  let lowWord =
    ((productLow & UINT16_MASK) | ((carry & UINT16_MASK) << 16)) >>> 0

  const highWord =
    valueHigh * HASH_PRIME_FINAL_HIGH +
    (middleLow >>> 16) +
    (middleHigh >>> 16) +
    (carry >>> 16)

  const roundingShift =
    highWord < 2097152 ? 0 : Math.floor(Math.log2(highWord)) - 20

  if (roundingShift > 0) {
    const roundingUnit = 1 << roundingShift
    const remainderMask = roundingUnit - 1
    const remainder = lowWord & remainderMask
    const half = roundingUnit >>> 1
    const roundedDown = (lowWord & (remainderMask ^ UINT32_MASK)) >>> 0
    const oddQuotient = ((lowWord >>> roundingShift) & 1) === 1

    lowWord = roundedDown

    if (remainder > half || (remainder === half && oddQuotient)) {
      lowWord = (lowWord + roundingUnit) >>> 0
    }
  }

  return value < 0 ? (0 - lowWord) >>> 0 : lowWord
}

export const gradientHashCpuMirror = (x: number, y: number): number => {
  const seeded = (x * HASH_PRIME_X + y * HASH_PRIME_Y) | 0
  const intermixed = seeded ^ (seeded >>> 13)
  const mixed = multiplyHashLikeJavaScript(intermixed)

  return (mixed ^ (mixed >>> 16)) >>> 0
}

const dotGradient = (
  latticeX: number,
  latticeY: number,
  offsetX: number,
  offsetY: number,
): number => {
  const angle =
    (gradientHashCpuMirror(latticeX, latticeY) / UINT32_RANGE) * TWO_PI

  return Math.cos(angle) * offsetX + Math.sin(angle) * offsetY
}

export const perlin2CpuMirror = (x: number, y: number): number => {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = x0 + 1
  const y1 = y0 + 1
  const offsetX = x - x0
  const offsetY = y - y0
  const fadedX = fade(offsetX)
  const fadedY = fade(offsetY)
  const topLeft = dotGradient(x0, y0, offsetX, offsetY)
  const topRight = dotGradient(x1, y0, offsetX - 1, offsetY)
  const bottomLeft = dotGradient(x0, y1, offsetX, offsetY - 1)
  const bottomRight = dotGradient(x1, y1, offsetX - 1, offsetY - 1)

  return lerp(
    lerp(topLeft, topRight, fadedX),
    lerp(bottomLeft, bottomRight, fadedX),
    fadedY,
  )
}
