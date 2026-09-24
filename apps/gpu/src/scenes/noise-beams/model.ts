import { Schema as S } from 'effect'
import { ts } from 'foldkit/schema'

export const GeneratingNoiseBeams = ts('GeneratingNoiseBeams')

export const WaitingNoiseBeams = ts('WaitingNoiseBeams', { seed: S.Int })

export const DrawingNoiseBeams = ts('DrawingNoiseBeams', {
  seed: S.Int,
  elapsedSeconds: S.Number,
})

export const UnsupportedRenderer = ts('UnsupportedRenderer')

export const FailedRenderer = ts('FailedRenderer', { reason: S.String })

export const Model = S.Union([
  GeneratingNoiseBeams,
  WaitingNoiseBeams,
  DrawingNoiseBeams,
  UnsupportedRenderer,
  FailedRenderer,
])

export type Model = typeof Model.Type
