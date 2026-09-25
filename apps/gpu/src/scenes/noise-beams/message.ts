import { Schema as S } from 'effect'
import { defineMessageUnion } from 'foldkit/message'

export const Message = defineMessageUnion({
  TickedFrame: { deltaTimeMs: S.Number },
  CompletedGenerateNoiseSeed: { seed: S.Int },
  CompletedInitializeRenderer: {},
  DetectedUnsupportedRenderer: {},
  FailedInitializeRenderer: { reason: S.String },
})

export const {
  TickedFrame,
  CompletedGenerateNoiseSeed,
  CompletedInitializeRenderer,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
} = Message

export type Message = typeof Message.Type
