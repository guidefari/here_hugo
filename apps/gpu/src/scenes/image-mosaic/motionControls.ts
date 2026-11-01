import { Predicate } from 'effect'
import { Html, HtmlBuilder } from 'foldkit/html'

import { hint, secondaryButton } from '../../ui/controls'
import { controlSection } from './controlSection'
import {
  ClickedReshuffle,
  Message,
  MotionControl,
  ScrolledMotionControl,
  UpdatedMotionControl,
} from './message'
import type { Model } from './model'
import { wheelControl } from './wheelControl'

const slider = (
  model: Model,
  control: MotionControl,
  label: string,
  maximum: number,
  h: HtmlBuilder<Message>,
): Html => {
  const wheel = wheelControl.withMessage(h)
  const id = `mosaic-motion-${control}`
  const value = model.motion[control]

  return h.div(
    [],
    [
      h.label(
        [h.For(id), h.Class('flex items-baseline justify-between gap-4')],
        [
          h.span([h.Class('text-sm')], [label]),
          h.span(
            [h.Class('type-meta text-[var(--theme-muted)]')],
            [`${value}%`],
          ),
        ],
      ),
      wheel(
        [
          h.Class('mt-2 block'),
          wheel.OnScrolledControl(({ direction }) =>
            ScrolledMotionControl({ control, direction }),
          ),
        ],
        [
          h.input([
            h.Id(id),
            h.AriaLabel(label),
            h.Type('range'),
            h.Attribute('min', '0'),
            h.Attribute('max', String(maximum)),
            h.Attribute('step', '1'),
            h.Value(String(value)),
            h.Disabled(!Predicate.isTagged('ReadyImage')(model.state)),
            h.OnInput(input => UpdatedMotionControl({ control, value: input })),
            h.Style({ '--range-fill': `${(value / maximum) * 100}%` }),
            h.Class('range-input block'),
          ]),
        ],
      ),
    ],
  )
}

export const motionControls = (model: Model, h: HtmlBuilder<Message>): Html =>
  controlSection(
    'Tile movement',
    h.empty,
    [
      h.div(
        [h.Class('flex flex-col gap-4')],
        [
          slider(model, 'intensity', 'Intensity', 100, h),
          slider(model, 'horizontalWeight', 'X-axis weight', 200, h),
          slider(model, 'verticalWeight', 'Y-axis weight', 200, h),
        ],
      ),
      h.button(
        [
          h.Type('button'),
          h.Disabled(!Predicate.isTagged('ReadyImage')(model.state)),
          h.OnClick(ClickedReshuffle()),
          h.Class(`${secondaryButton} mt-1 w-full`),
        ],
        ['Reshuffle movement'],
      ),
      h.p(
        [h.Class(hint)],
        [
          'Each tile gets a random axis, direction, and weight. 0% intensity restores the sampled grid; 100% moves tiles up to 4 cells. Focus a slider to adjust it with the scroll wheel or arrow keys.',
        ],
      ),
    ],
    h,
  )
