import { Schema } from 'effect'
import { defineMessageUnion } from 'foldkit/message'

import { Grid } from './engine/grid'
import { MirrorMode } from './model'

export const Control = Schema.Literals(['Density', 'Sensitivity', 'Smoothing'])

export const ColorControl = Schema.Literals(['Base', 'Subject'])

export const Message = defineMessageUnion({
  ClickedStart: {},
  ClickedStop: {},
  UpdatedControl: {
    control: Control,
    value: Schema.String,
  },
  UpdatedColor: {
    control: ColorControl,
    value: Schema.String,
  },
  SelectedMirror: { mode: MirrorMode },
  ClickedPalette: {
    base: Schema.String,
    subject: Schema.String,
  },
  CompletedStartCamera: {
    session: Schema.Int,
  },
  FailedCamera: {
    session: Schema.Int,
    reason: Schema.String,
  },
  PausedCamera: { session: Schema.Int },
  ReceivedMask: {
    session: Schema.Int,
    density: Schema.Int,
    grid: Grid,
  },
  TickedFrame: { deltaTimeMs: Schema.Number },
})

export type Message = typeof Message.Type

export const {
  ClickedStart,
  ClickedStop,
  UpdatedControl,
  UpdatedColor,
  SelectedMirror,
  ClickedPalette,
  CompletedStartCamera,
  FailedCamera,
  PausedCamera,
  ReceivedMask,
  TickedFrame,
} = Message
