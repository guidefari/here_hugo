import { Schema as S } from 'effect'

export const ThemePreference = S.Literals(['System', 'Light', 'Dark'])

export type ThemePreference = typeof ThemePreference.Type

export const ColorScheme = S.Literals(['Light', 'Dark'])

export type ColorScheme = typeof ColorScheme.Type

export const Model = S.Struct({
  preference: ThemePreference,
  systemColorScheme: ColorScheme,
})

export type Model = typeof Model.Type
