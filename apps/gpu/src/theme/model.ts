import { Schema } from 'effect'

export const ThemePreference = Schema.Literals(['System', 'Light', 'Dark'])

export type ThemePreference = typeof ThemePreference.Type

export const ColorScheme = Schema.Literals(['Light', 'Dark'])

export type ColorScheme = typeof ColorScheme.Type

export const Model = Schema.Struct({
  preference: ThemePreference,
  systemColorScheme: ColorScheme,
})

export type Model = typeof Model.Type
