import { Schema as S } from 'effect'
import { defineTaggedUnion } from 'foldkit/schema'

export const Model = defineTaggedUnion({
  GeneratingNoiseBeams: {},
  WaitingNoiseBeams: { seed: S.Int },
  DrawingNoiseBeams: {
    seed: S.Int,
    elapsedSeconds: S.Number,
  },
  UnsupportedRenderer: {},
  FailedRenderer: { reason: S.String },
})

export const {
  GeneratingNoiseBeams,
  WaitingNoiseBeams,
  DrawingNoiseBeams,
  UnsupportedRenderer,
  FailedRenderer,
} = Model

export type Model = typeof Model.Type
