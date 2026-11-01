import { Schema } from 'effect'
import { defineTaggedUnion } from 'foldkit/schema'

export const Model = defineTaggedUnion({
  GeneratingNoiseBeams: {},
  WaitingNoiseBeams: { seed: Schema.Int },
  DrawingNoiseBeams: {
    seed: Schema.Int,
    elapsedSeconds: Schema.Number,
  },
  UnsupportedRenderer: {},
  FailedRenderer: { reason: Schema.String },
})

export const {
  GeneratingNoiseBeams,
  WaitingNoiseBeams,
  DrawingNoiseBeams,
  UnsupportedRenderer,
  FailedRenderer,
} = Model

export type Model = typeof Model.Type
