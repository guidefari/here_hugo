import { Schema, pipe } from 'effect'
import { Route } from 'foldkit'
import { defineRouteUnion, literal, slash } from 'foldkit/route'

export const AppRoute = defineRouteUnion({
  RandomDots: {},
  NoiseBeams: {},
  ImageMosaic: {},
  MosaicMirror: {},
  NotFound: { path: Schema.String },
})

export const { RandomDots, NoiseBeams, ImageMosaic, MosaicMirror, NotFound } =
  AppRoute

export const ImageMosaicRoute = ImageMosaic

export const MosaicMirrorRoute = MosaicMirror

export const RandomDotsRoute = RandomDots

export const NoiseBeamsRoute = NoiseBeams

export const NotFoundRoute = NotFound

export type AppRoute = typeof AppRoute.Type

const rootRandomDotsRouter = pipe(Route.root, Route.mapTo(RandomDotsRoute))

export const randomDotsRouter = pipe(
  literal('scenes'),
  slash(literal('random-dots')),
  Route.mapTo(RandomDotsRoute),
)

export const noiseBeamsRouter = pipe(
  literal('scenes'),
  slash(literal('noise-beams')),
  Route.mapTo(NoiseBeamsRoute),
)

export const imageMosaicRouter = pipe(
  literal('scenes'),
  slash(literal('image-mosaic')),
  Route.mapTo(ImageMosaicRoute),
)

export const mosaicMirrorRouter = pipe(
  literal('scenes'),
  slash(literal('mosaic-mirror')),
  Route.mapTo(MosaicMirrorRoute),
)

const routeParser = Route.oneOf(
  mosaicMirrorRouter,
  imageMosaicRouter,
  noiseBeamsRouter,
  randomDotsRouter,
  rootRandomDotsRouter,
)

export const urlToAppRoute = Route.parseUrlWithFallback(
  routeParser,
  NotFoundRoute,
)
