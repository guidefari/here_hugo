import { Schema } from 'effect'

export const FillMode = Schema.Literals(['Transparent', 'Solid'])

export const HexColor = Schema.String.check(
  Schema.isPattern(/^#[\da-fA-F]{6}$/),
)

export const BackgroundFill = Schema.Struct({ mode: FillMode, color: HexColor })

export type BackgroundFill = typeof BackgroundFill.Type

export const transparentBackground: BackgroundFill = {
  mode: 'Transparent',
  color: '#f4ecd8',
}
