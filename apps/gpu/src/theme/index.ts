import type { Command } from 'foldkit'

import type { Flags } from './flags'
import type { Message as ThemeMessage } from './message'
import type { Model } from './model'

export { Flags, flags } from './flags'

export {
  ChangedSystemColorScheme,
  CompletedStoreThemePreference,
  Message,
  SelectedThemePreference,
} from './message'

export { ColorScheme, Model, ThemePreference } from './model'

export {
  Color,
  Palette,
  colorToCss,
  colorToCssWithAlpha,
  colorToUnitRgb,
  darkPalette,
  lightPalette,
  paletteFor,
  paletteStyle,
  resolveColorScheme,
  resolvePalette,
} from './palette'

export { subscriptions } from './subscriptions'

export { StoreThemePreference, update } from './update'

export { view } from './view'

export const init = (
  flags: Flags,
): readonly [Model, ReadonlyArray<Command.Command<ThemeMessage>>] => [flags, []]
