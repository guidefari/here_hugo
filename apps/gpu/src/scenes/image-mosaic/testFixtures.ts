import { sampleGrid } from './engine/mosaic'

export const sampledOutput = (density = 32) => ({
  grid: sampleGrid(
    {
      width: 400,
      height: 200,
      pixels: new Uint8ClampedArray(400 * 200 * 4).fill(255),
    },
    density,
  ),
  seed: 12345,
})
