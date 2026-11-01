import { Schema } from 'effect'
import { defineTaggedUnion } from 'foldkit/schema'

import { Grid } from './engine/grid'

export const HexColor = Schema.String.check(
  Schema.isPattern(/^#[\da-fA-F]{6}$/),
)

export const Density = Schema.Int.check(
  Schema.isBetween({ minimum: 8, maximum: 96 }),
)

export const Percentage = Schema.Number.check(
  Schema.isBetween({ minimum: 0, maximum: 100 }),
)

export const MirrorMode = Schema.Literals(['Mirrored', 'Natural'])

export const Settings = Schema.Struct({
  density: Density,
  base: HexColor,
  subject: HexColor,
  sensitivity: Percentage,
  smoothing: Percentage,
  mirror: MirrorMode,
})

export type Settings = typeof Settings.Type

export const State = defineTaggedUnion({
  Idle: {},
  Starting: {},
  Running: {},
  Paused: {},
  Failed: { reason: Schema.String },
})

export const { Idle, Starting, Running, Paused, Failed } = State

export const Model = Schema.Struct({
  state: State,
  session: Schema.Int,
  settings: Settings,
  grid: Grid,
  levels: Schema.Array(Schema.Number),
  timeMs: Schema.Number,
  lastMaskMs: Schema.Number,
})

export type Model = typeof Model.Type

export const defaultSettings: Settings = {
  density: 48,
  base: '#142b36',
  subject: '#f4ecd8',
  sensitivity: 50,
  smoothing: 35,
  mirror: 'Mirrored',
}
