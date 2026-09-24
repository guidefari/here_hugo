import { Schema as S, pipe } from 'effect'
import { Route } from 'foldkit'
import { literal, r, slash } from 'foldkit/route'

export const RandomDotsRoute = r('RandomDots')

export const NoiseBeamsRoute = r('NoiseBeams')

export const NotFoundRoute = r('NotFound', { path: S.String })

export const AppRoute = S.Union([
  RandomDotsRoute,
  NoiseBeamsRoute,
  NotFoundRoute,
])

export type RandomDotsRoute = typeof RandomDotsRoute.Type

export type NoiseBeamsRoute = typeof NoiseBeamsRoute.Type

export type NotFoundRoute = typeof NotFoundRoute.Type

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
