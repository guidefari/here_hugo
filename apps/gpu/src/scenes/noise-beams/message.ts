import { Schema as S } from 'effect'
import { m } from 'foldkit/message'

export const TickedFrame = m('TickedFrame', {
  deltaTimeMs: S.Number,
})

export const CompletedGenerateNoiseSeed = m('CompletedGenerateNoiseSeed', {
  seed: S.Int,
})

export const CompletedInitializeRenderer = m('CompletedInitializeRenderer')

export const DetectedUnsupportedRenderer = m('DetectedUnsupportedRenderer')

export const FailedInitializeRenderer = m('FailedInitializeRenderer', {
  reason: S.String,
})

export const Message = S.Union([
  TickedFrame,
  CompletedGenerateNoiseSeed,
  CompletedInitializeRenderer,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
])

export type Message = typeof Message.Type
