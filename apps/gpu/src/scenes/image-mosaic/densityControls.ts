import { Option, Schema } from 'effect'
import { Html, HtmlBuilder } from 'foldkit/html'

import {
  hint,
  segmentedItem,
  segmentedTrack,
  textField,
} from '../../ui/controls'
import { GRID_PRESETS, MAXIMUM_DENSITY } from './constants'
import { controlSection, sectionValue } from './controlSection'
import { Message, UpdatedDensity } from './message'
import { Density, type Model } from './model'

const presetButton = (
  model: Model,
  density: number,
  h: HtmlBuilder<Message>,
): Html =>
  h.keyed('button')(
    density,
    [
      h.Type('button'),
      h.AriaPressed(String(model.density === density)),
      h.OnClick(UpdatedDensity({ value: String(density) })),
      h.Class(`flex-1 type-meta ${segmentedItem(model.density === density)}`),
    ],
    [String(density)],
  )

export const densityControls = (
  model: Model,
  h: HtmlBuilder<Message>,
): Html => {
  const invalidDensity = Option.isNone(
    Schema.decodeUnknownOption(Density)(Number(model.densityInput)),
  )

  return controlSection(
    'Grid density',
    sectionValue(`${model.density} cells`, h),
    [
      h.div(
        [h.Class(segmentedTrack)],
        GRID_PRESETS.map(density => presetButton(model, density, h)),
      ),
      h.div(
        [h.Class('flex items-center justify-between gap-3')],
        [
          h.label(
            [
              h.For('mosaic-density'),
              h.Class('text-sm text-[var(--theme-muted)]'),
            ],
            ['Custom'],
          ),
          h.input([
            h.Id('mosaic-density'),
            h.Type('number'),
            h.Attribute('min', '1'),
            h.Attribute('max', String(MAXIMUM_DENSITY)),
            h.Attribute('step', '1'),
            h.Value(model.densityInput),
            h.Attribute('aria-invalid', String(invalidDensity)),
            h.Attribute('aria-describedby', 'mosaic-density-hint'),
            h.OnInput(value => UpdatedDensity({ value })),
            h.Class(`w-24 text-right ${textField}`),
          ]),
        ],
      ),
      h.p(
        [
          h.Id('mosaic-density-hint'),
          h.Class(
            invalidDensity
              ? 'text-xs leading-relaxed text-[var(--theme-red)]'
              : hint,
          ),
        ],
        [
          invalidDensity
            ? 'Enter a whole number from 1 to 256. The last valid grid is still shown.'
            : 'Cells across the longest edge. Lower is chunkier.',
        ],
      ),
    ],
    h,
  )
}
