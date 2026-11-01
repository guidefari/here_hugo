import { Html, HtmlBuilder } from 'foldkit/html'

import {
  focusRing,
  hint,
  segmentedItem,
  segmentedTrack,
} from '../../ui/controls'
import { controlSection, sectionValue } from './controlSection'
import { FillMode } from './engine/background'
import {
  Message,
  UpdatedBackgroundColor,
  UpdatedBackgroundMode,
} from './message'
import type { Model } from './model'

const modeButton = (
  model: Model,
  mode: typeof FillMode.Type,
  h: HtmlBuilder<Message>,
): Html =>
  h.keyed('button')(
    mode,
    [
      h.Type('button'),
      h.AriaLabel(`${mode} background`),
      h.AriaPressed(String(model.background.mode === mode)),
      h.OnClick(UpdatedBackgroundMode({ mode })),
      h.Class(
        `flex-1 text-sm ${segmentedItem(model.background.mode === mode)}`,
      ),
    ],
    [mode],
  )

export const backgroundControls = (
  model: Model,
  h: HtmlBuilder<Message>,
): Html =>
  controlSection(
    'Background',
    sectionValue(
      model.background.mode === 'Solid' ? model.background.color : 'No fill',
      h,
    ),
    [
      h.div(
        [h.Class('flex items-center gap-2')],
        [
          h.div(
            [h.Class(`flex-1 ${segmentedTrack}`)],
            FillMode.literals.map(mode => modeButton(model, mode, h)),
          ),
          h.input([
            h.Id('mosaic-background-color'),
            h.Type('color'),
            h.AriaLabel('Fill color'),
            h.Value(model.background.color),
            h.OnInput(value => UpdatedBackgroundColor({ value })),
            h.Class(
              `color-swatch h-[42px] w-[42px] shrink-0 cursor-pointer rounded-surface border border-[var(--theme-border)] bg-[var(--theme-surface)] p-1 ${focusRing}`,
            ),
          ]),
        ],
      ),
      h.p(
        [h.Class(hint)],
        ['Fills transparent pixels and the gaps between tiles.'],
      ),
    ],
    h,
  )
