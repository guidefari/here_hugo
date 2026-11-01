import { expect, test } from 'vitest'

import { transparentBackground } from './background'
import { renderMosaic, sampleGrid } from './mosaic'
import { stationaryMotion } from './motion'

test('renders solid fill underneath tiles without changing sampled colors', () => {
  const grid = sampleGrid(
    { width: 1, height: 1, pixels: new Uint8ClampedArray([255, 0, 0, 128]) },
    1,
  )

  const clear = renderMosaic(grid, 123, stationaryMotion, transparentBackground)

  const filled = renderMosaic(grid, 123, stationaryMotion, {
    mode: 'Solid',
    color: '#123456',
  })

  expect(clear).not.toContain('fill="#123456"')
  expect(filled).toContain(
    '<rect width="1" height="1" fill="#123456"/><rect x="0"',
  )
  expect(filled).toContain(
    'fill="rgb(255 0 0)" fill-opacity="0.5019607843137255"',
  )
})
