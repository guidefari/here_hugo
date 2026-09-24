import { Schema as S } from 'effect'
import { m } from 'foldkit/message'

import { PanelArtwork } from './model'

export const TickedFrame = m('TickedFrame', {
  deltaTimeMs: S.Number,
})

export const CompletedGenerateDots = m('CompletedGenerateDots', {
  artworkId: S.String,
  panels: S.Array(PanelArtwork),
})

export const FailedGenerateDots = m('FailedGenerateDots')

export const DetectedUnsupportedRenderer = m('DetectedUnsupportedRenderer')

export const FailedInitializeRenderer = m('FailedInitializeRenderer', {
  reason: S.String,
})

export const Message = S.Union([
  TickedFrame,
  CompletedGenerateDots,
  FailedGenerateDots,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
])

export type Message = typeof Message.Type
