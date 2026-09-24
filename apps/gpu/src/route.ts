import { Schema as S, pipe } from 'effect'
import { Route } from 'foldkit'
import { defineRouteUnion, literal, slash } from 'foldkit/route'

export const AppRoute = defineRouteUnion({
  RandomDots: {},
  NoiseBeams: {},
  NotFound: { path: S.String },
})

export const { RandomDots, NoiseBeams, NotFound } = AppRoute

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

const routeParser = Route.oneOf(
  noiseBeamsRouter,
  randomDotsRouter,
  rootRandomDotsRouter,
)

export const urlToAppRoute = Route.parseUrlWithFallback(
  routeParser,
  NotFoundRoute,
)
