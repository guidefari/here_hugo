import { Command, given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import {
  ChangedSystemColorScheme,
  CompletedStoreThemePreference,
  SelectedThemePreference,
} from './message'
import type { Model } from './model'
import { resolveColorScheme } from './palette'
import { StoreThemePreference, update } from './update'

const systemDark: Model = {
  preference: 'System',
  systemColorScheme: 'Dark',
}

describe('theme update', () => {
  test('system preference resolves to the current system color scheme', () => {
    expect(resolveColorScheme(systemDark)).toBe('Dark')
  })

  test('an explicit preference overrides the system color scheme', () => {
    expect(
      resolveColorScheme({ preference: 'Light', systemColorScheme: 'Dark' }),
    ).toBe('Light')
  })

  test('selecting a theme preference updates the model', () => {
    story(
      update,
      given(systemDark),
      message(SelectedThemePreference({ preference: 'Light' })),
      model(nextModel => {
        expect(nextModel).toStrictEqual({
          preference: 'Light',
          systemColorScheme: 'Dark',
        })
      }),
      Command.resolveAll([
        StoreThemePreference,
        CompletedStoreThemePreference(),
      ]),
    )
  })

  test('system changes are retained while an explicit preference is active', () => {
    story(
      update,
      given({ preference: 'Dark', systemColorScheme: 'Dark' }),
      message(ChangedSystemColorScheme({ systemColorScheme: 'Light' })),
      model(nextModel => {
        expect(nextModel).toStrictEqual({
          preference: 'Dark',
          systemColorScheme: 'Light',
        })
      }),
    )
  })
})
