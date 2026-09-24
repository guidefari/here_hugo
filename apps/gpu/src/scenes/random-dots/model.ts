import { Schema as S } from 'effect'
import { ts } from 'foldkit/schema'

export const Point = S.Struct({
  x: S.Number,
  y: S.Number,
})

export type Point = typeof Point.Type

export const PanelArtwork = S.Struct({
  id: S.String,
  origin: Point,
  size: S.Number,
  dotRadius: S.Number,
  points: S.Array(Point),
})

export type PanelArtwork = typeof PanelArtwork.Type

export const WaitingDots = ts('WaitingDots')

export const GeneratingDots = ts('GeneratingDots')

export const DrawingDots = ts('DrawingDots', {
  artworkId: S.String,
  panels: S.Array(PanelArtwork),
  visibleCountPerPanel: S.Number,
  pointCountPerPanel: S.Number,
  carryMs: S.Number,
})

export type DrawingDots = typeof DrawingDots.Type

export const ReadyDots = ts('ReadyDots', {
  artworkId: S.String,
  panels: S.Array(PanelArtwork),
  pointCountPerPanel: S.Number,
})

export const FailedDots = ts('FailedDots')

export const UnsupportedRenderer = ts('UnsupportedRenderer')

export const FailedRenderer = ts('FailedRenderer', { reason: S.String })

export const Model = S.Union([
  WaitingDots,
  GeneratingDots,
  DrawingDots,
  ReadyDots,
  FailedDots,
  UnsupportedRenderer,
  FailedRenderer,
])

export type Model = typeof Model.Type
