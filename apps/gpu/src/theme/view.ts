import { Submodel } from 'foldkit'
import { Html, HtmlBuilder } from 'foldkit/html'

import { Message, SelectedThemePreference } from './message'
import type { Model, ThemePreference } from './model'

const preferences: ReadonlyArray<ThemePreference> = ['System', 'Light', 'Dark']

const preferenceButton = (
  preference: ThemePreference,
  model: Model,
  h: HtmlBuilder<Message>,
): Html => {
  const isSelected = preference === model.preference

  const stateClass = isSelected
    ? 'bg-[var(--theme-text)] text-[var(--theme-page)]'
    : 'text-[var(--theme-muted)] hover:bg-[var(--theme-elevated)] hover:text-[var(--theme-text)]'

  return h.button(
    [
      h.Type('button'),
      h.AriaLabel(preference),
      h.AriaPressed(isSelected ? 'true' : 'false'),
      h.OnClick(SelectedThemePreference({ preference })),
      h.Class(
        'rounded-full px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] ' +
          'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
          'focus-visible:ring-[var(--theme-cyan)] ' +
          stateClass,
      ),
    ],
    [preference === 'System' ? 'Sys' : preference],
  )
}

export const view = Submodel.defineView<Model, Message>((model, h): Html =>
  h.div(
    [
      h.Role('group'),
      h.AriaLabel('Color theme'),
      h.Class(
        'pointer-events-auto flex items-center gap-0.5 rounded-full border ' +
          'border-[var(--theme-border)] bg-[var(--theme-surface)]/90 p-1.5 ' +
          'shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl',
      ),
    ],
    preferences.map(preference =>
      h.keyed('span')(preference, [], [preferenceButton(preference, model, h)]),
    ),
  ),
)
