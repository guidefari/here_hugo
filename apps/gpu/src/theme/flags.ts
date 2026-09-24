import { Effect, Option, Schema as S } from 'effect'

import { THEME_PREFERENCE_STORAGE_KEY } from './constants'
import { ColorScheme, ThemePreference } from './model'

export const Flags = S.Struct({
  preference: ThemePreference,
  systemColorScheme: ColorScheme,
})

export type Flags = typeof Flags.Type

const readThemePreference = Effect.try({
  try: () => localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY),
  catch: cause => cause,
}).pipe(
  Effect.map(rawPreference =>
    Option.getOrElse(
      S.decodeUnknownOption(ThemePreference)(rawPreference),
      (): ThemePreference => 'System',
    ),
  ),
  Effect.catch(() => Effect.succeed<ThemePreference>('System')),
)

const readSystemColorScheme = Effect.try({
  try: (): ColorScheme =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'Dark'
      : 'Light',
  catch: cause => cause,
}).pipe(Effect.catch(() => Effect.succeed<ColorScheme>('Dark')))

export const flags = Effect.all({
  preference: readThemePreference,
  systemColorScheme: readSystemColorScheme,
})
