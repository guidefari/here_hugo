import { Schema as S } from 'effect'
import { m } from 'foldkit/message'

import { ColorScheme, ThemePreference } from './model'

export const SelectedThemePreference = m('SelectedThemePreference', {
  preference: ThemePreference,
})

export const ChangedSystemColorScheme = m('ChangedSystemColorScheme', {
  systemColorScheme: ColorScheme,
})

export const CompletedStoreThemePreference = m('CompletedStoreThemePreference')

export const Message = S.Union([
  SelectedThemePreference,
  ChangedSystemColorScheme,
  CompletedStoreThemePreference,
])

export type Message = typeof Message.Type
