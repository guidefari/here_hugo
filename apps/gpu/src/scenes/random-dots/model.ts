import { Schema as S } from 'effect'
import { defineTaggedUnion } from 'foldkit/schema'

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

export const Model = defineTaggedUnion({
  WaitingDots: {},
  GeneratingDots: {},
  DrawingDots: {
    artworkId: S.String,
    panels: S.Array(PanelArtwork),
    visibleCountPerPanel: S.Number,
    pointCountPerPanel: S.Number,
    carryMs: S.Number,
  },
  ReadyDots: {
    artworkId: S.String,
    panels: S.Array(PanelArtwork),
    pointCountPerPanel: S.Number,
  },
  FailedDots: {},
  UnsupportedRenderer: {},
  FailedRenderer: { reason: S.String },
})

export const {
  WaitingDots,
  GeneratingDots,
  DrawingDots,
  ReadyDots,
  FailedDots,
  UnsupportedRenderer,
  FailedRenderer,
} = Model

export type DrawingDots = typeof DrawingDots.Type

export type Model = typeof Model.Type
