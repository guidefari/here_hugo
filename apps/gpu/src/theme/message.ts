import { defineMessageUnion } from 'foldkit/message'

import { ColorScheme, ThemePreference } from './model'

export const Message = defineMessageUnion({
  SelectedThemePreference: { preference: ThemePreference },
  ChangedSystemColorScheme: { systemColorScheme: ColorScheme },
  CompletedStoreThemePreference: {},
})

export const {
  SelectedThemePreference,
  ChangedSystemColorScheme,
  CompletedStoreThemePreference,
} = Message

export type Message = typeof Message.Type
