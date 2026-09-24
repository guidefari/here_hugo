import { Schema as S } from 'effect'
import { defineMessageUnion } from 'foldkit/message'

import { PanelArtwork } from './model'

export const Message = defineMessageUnion({
  TickedFrame: { deltaTimeMs: S.Number },
  CompletedGenerateDots: {
    artworkId: S.String,
    panels: S.Array(PanelArtwork),
  },
  FailedGenerateDots: {},
  DetectedUnsupportedRenderer: {},
  FailedInitializeRenderer: { reason: S.String },
})

export const {
  TickedFrame,
  CompletedGenerateDots,
  FailedGenerateDots,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
} = Message

export type Message = typeof Message.Type
