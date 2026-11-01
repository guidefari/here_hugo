import { Option } from 'effect'
import { fromString } from 'foldkit/url'
import { describe, expect, test } from 'vitest'

import {
  ImageMosaicRoute,
  MosaicMirrorRoute,
  NoiseBeamsRoute,
  NotFoundRoute,
  RandomDotsRoute,
  imageMosaicRouter,
  mosaicMirrorRouter,
  noiseBeamsRouter,
  urlToAppRoute,
} from './route'

const routeAt = (path: string) =>
  urlToAppRoute(Option.getOrThrow(fromString(`https://effect-art.test${path}`)))

describe('application routes', () => {
  test('parses and builds the mirror route', () => {
    expect(mosaicMirrorRouter()).toBe('/scenes/mosaic-mirror')
    expect(routeAt('/scenes/mosaic-mirror')).toStrictEqual(MosaicMirrorRoute())
  })
  test('parses and builds the image mosaic route', () => {
    expect(imageMosaicRouter()).toBe('/scenes/image-mosaic')
    expect(routeAt('/scenes/image-mosaic')).toStrictEqual(ImageMosaicRoute())
  })
  test('uses Random Dots as the root scene', () => {
    expect(routeAt('/')).toStrictEqual(RandomDotsRoute())
    expect(routeAt('/scenes/random-dots')).toStrictEqual(RandomDotsRoute())
    expect(routeAt('/scenes/noise-beams')).toStrictEqual(NoiseBeamsRoute())
  })

  test('builds the noise beams route and preserves unknown paths', () => {
    expect(noiseBeamsRouter()).toBe('/scenes/noise-beams')
    expect(routeAt('/scenes/prism-field')).toStrictEqual(
      NotFoundRoute({ path: '/scenes/prism-field' }),
    )
    expect(routeAt('/scenes/unknown')).toStrictEqual(
      NotFoundRoute({ path: '/scenes/unknown' }),
    )
  })
})
