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
    expect(mosaicMirrorRouter()).toBe('/gpu/scenes/mosaic-mirror')
    expect(routeAt('/gpu/scenes/mosaic-mirror')).toStrictEqual(
      MosaicMirrorRoute(),
    )
  })
  test('parses and builds the image mosaic route', () => {
    expect(imageMosaicRouter()).toBe('/gpu/scenes/image-mosaic')
    expect(routeAt('/gpu/scenes/image-mosaic')).toStrictEqual(
      ImageMosaicRoute(),
    )
  })
  test('uses Random Dots as the root scene', () => {
    expect(routeAt('/gpu')).toStrictEqual(RandomDotsRoute())
    expect(routeAt('/gpu/')).toStrictEqual(RandomDotsRoute())
    expect(routeAt('/gpu/scenes/random-dots')).toStrictEqual(RandomDotsRoute())
    expect(routeAt('/gpu/scenes/noise-beams')).toStrictEqual(NoiseBeamsRoute())
  })

  test('builds the noise beams route and preserves unknown paths', () => {
    expect(noiseBeamsRouter()).toBe('/gpu/scenes/noise-beams')
    expect(routeAt('/gpu/scenes/prism-field')).toStrictEqual(
      NotFoundRoute({ path: '/gpu/scenes/prism-field' }),
    )
    expect(routeAt('/gpu/scenes/unknown')).toStrictEqual(
      NotFoundRoute({ path: '/gpu/scenes/unknown' }),
    )
  })
})
