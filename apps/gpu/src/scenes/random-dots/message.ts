import { Schema } from 'effect'
import { defineMessageUnion } from 'foldkit/message'

import { PanelArtwork } from './model'

export const Message = defineMessageUnion({
  TickedFrame: { deltaTimeMs: Schema.Number },
  CompletedGenerateDots: {
    artworkId: Schema.String,
    panels: Schema.Array(PanelArtwork),
  },
  FailedGenerateDots: {},
  DetectedUnsupportedRenderer: {},
  FailedInitializeRenderer: { reason: Schema.String },
})

export const {
  TickedFrame,
  CompletedGenerateDots,
  FailedGenerateDots,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
} = Message

export type Message = typeof Message.Type
