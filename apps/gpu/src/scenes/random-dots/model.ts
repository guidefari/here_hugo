import { Schema } from 'effect'
import { defineTaggedUnion } from 'foldkit/schema'

export const Point = Schema.Struct({
  x: Schema.Number,
  y: Schema.Number,
})

export type Point = typeof Point.Type

export const PanelArtwork = Schema.Struct({
  id: Schema.String,
  origin: Point,
  size: Schema.Number,
  dotRadius: Schema.Number,
  points: Schema.Array(Point),
})

export type PanelArtwork = typeof PanelArtwork.Type

export const Model = defineTaggedUnion({
  WaitingDots: {},
  GeneratingDots: {},
  DrawingDots: {
    artworkId: Schema.String,
    panels: Schema.Array(PanelArtwork),
    visibleCountPerPanel: Schema.Number,
    pointCountPerPanel: Schema.Number,
    carryMs: Schema.Number,
  },
  ReadyDots: {
    artworkId: Schema.String,
    panels: Schema.Array(PanelArtwork),
    pointCountPerPanel: Schema.Number,
  },
  FailedDots: {},
  UnsupportedRenderer: {},
  FailedRenderer: { reason: Schema.String },
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
