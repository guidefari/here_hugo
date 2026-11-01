import { Schema } from 'effect'
import { defineMessageUnion } from 'foldkit/message'

export const Message = defineMessageUnion({
  TickedFrame: { deltaTimeMs: Schema.Number },
  CompletedGenerateNoiseSeed: { seed: Schema.Int },
  CompletedInitializeRenderer: {},
  DetectedUnsupportedRenderer: {},
  FailedInitializeRenderer: { reason: Schema.String },
})

export const {
  TickedFrame,
  CompletedGenerateNoiseSeed,
  CompletedInitializeRenderer,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
} = Message

export type Message = typeof Message.Type
