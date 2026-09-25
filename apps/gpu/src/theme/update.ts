import { Effect, Match as M } from 'effect'
import { Command, Update } from 'foldkit'
import { modifyFields } from 'foldkit/struct'

import { THEME_PREFERENCE_STORAGE_KEY } from './constants'
import { CompletedStoreThemePreference, Message } from './message'
import type { Model } from './model'
import { ThemePreference } from './model'

export const StoreThemePreference = Command.define('StoreThemePreference', {
  args: { preference: ThemePreference },
  messages: [CompletedStoreThemePreference],
  execute: ({ preference }) =>
    Effect.try({
      try: () => localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference),
      catch: cause => cause,
    }).pipe(
      Effect.as(CompletedStoreThemePreference()),
      Effect.catch(() => Effect.succeed(CompletedStoreThemePreference())),
    ),
})

type UpdateReturn = Update.Return<Model, Message>

const withUpdateReturn = M.withReturnType<UpdateReturn>()

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      SelectedThemePreference: ({ preference }) => ({
        model: modifyFields(model, { preference: () => preference }),
        commands: [StoreThemePreference({ preference })],
      }),
      ChangedSystemColorScheme: ({ systemColorScheme }) => ({
        model: modifyFields(model, {
          systemColorScheme: () => systemColorScheme,
        }),
      }),
      CompletedStoreThemePreference: () => ({ model }),
    }),
  )
