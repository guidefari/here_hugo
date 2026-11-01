import { Submodel } from 'foldkit'
import { Html, HtmlBuilder } from 'foldkit/html'

import { floatingSurface, segmentedItem, segmentedTrack } from '../ui/controls'
import { Message, SelectedThemePreference } from './message'
import type { Model, ThemePreference } from './model'

const preferences: ReadonlyArray<ThemePreference> = ['System', 'Light', 'Dark']

const preferenceButton = (
  preference: ThemePreference,
  model: Model,
  h: HtmlBuilder<Message>,
): Html => {
  const isSelected = preference === model.preference

  return h.button(
    [
      h.Type('button'),
      h.AriaLabel(preference),
      h.AriaPressed(isSelected ? 'true' : 'false'),
      h.OnClick(SelectedThemePreference({ preference })),
      h.Class(`py-2 type-label ${segmentedItem(isSelected)}`),
    ],
    [preference === 'System' ? 'Sys' : preference],
  )
}

export const view = Submodel.defineView<Model, Message>((model, h): Html =>
  h.div(
    [
      h.Role('group'),
      h.AriaLabel('Color theme'),
      h.Class(`pointer-events-auto ${segmentedTrack} ${floatingSurface}`),
    ],
    preferences.map(preference =>
      h.keyed('span')(preference, [], [preferenceButton(preference, model, h)]),
    ),
  ),
)
