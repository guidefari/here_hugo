import { Match } from 'effect'
import { Html, HtmlBuilder } from 'foldkit/html'

import {
  focusRing,
  hint,
  primaryButton,
  secondaryButton,
} from '../../ui/controls'
import {
  ClickedPalette,
  ClickedStart,
  ClickedStop,
  Message,
  SelectedMirror,
  UpdatedColor,
  UpdatedControl,
} from './message'
import type { ColorControl, Control } from './message'
import type { Model } from './model'
import { isActive } from './update'

const slider = (
  label: string,
  control: typeof Control.Type,
  value: number,
  min: number,
  max: number,
  help: string,
  h: HtmlBuilder<Message>,
): Html => {
  const id = `mirror-${control.toLowerCase()}`

  return h.div(
    [h.Class('space-y-2')],
    [
      h.div(
        [h.Class('flex items-center justify-between gap-3')],
        [
          h.label([h.For(id), h.Class('text-sm')], [label]),
          h.span(
            [h.Class('type-meta text-[var(--theme-muted)]')],
            [String(value)],
          ),
        ],
      ),
      h.input([
        h.Id(id),
        h.Type('range'),
        h.Min(String(min)),
        h.Max(String(max)),
        h.Step('1'),
        h.Value(String(value)),
        h.OnInput(value => UpdatedControl({ control, value })),
        h.AriaDescribedBy(`${id}-hint`),
        h.Class(
          `min-h-11 w-full cursor-pointer accent-[var(--theme-cyan)] ${focusRing}`,
        ),
      ]),
      h.p([h.Id(`${id}-hint`), h.Class(hint)], [help]),
    ],
  )
}

const colorInput = (
  label: string,
  control: typeof ColorControl.Type,
  value: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.label(
    [h.Class('flex items-center justify-between gap-3 text-sm')],
    [
      label,
      h.input([
        h.Type('color'),
        h.AriaLabel(label),
        h.Value(value),
        h.OnInput(value => UpdatedColor({ control, value })),
        h.Class(
          `h-11 w-16 cursor-pointer rounded-control border border-[var(--theme-border)] bg-transparent p-1 ${focusRing}`,
        ),
      ]),
    ],
  )

const palettes = [
  { name: 'Midnight / Cream', base: '#142b36', subject: '#f4ecd8' },
  { name: 'Ink / Lime', base: '#161b18', subject: '#d5f578' },
  { name: 'Paper / Cobalt', base: '#eee9df', subject: '#203fba' },
]

export const cameraControls = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-wrap items-center gap-3')],
    [
      h.button(
        [
          h.Type('button'),
          h.Class(`${primaryButton} min-h-11 cursor-pointer`),
          h.Disabled(isActive(model)),
          h.OnClick(ClickedStart()),
        ],
        [
          Match.value(model.state).pipe(
            Match.tagsExhaustive({
              Idle: () => 'Start camera',
              Starting: () => 'Starting camera…',
              Running: () => 'Camera is live',
              Paused: () => 'Resume camera',
              Failed: () => 'Try camera again',
            }),
          ),
        ],
      ),
      isActive(model)
        ? h.button(
            [
              h.Type('button'),
              h.Class(`${secondaryButton} min-h-11 cursor-pointer`),
              h.OnClick(ClickedStop()),
            ],
            ['Stop camera'],
          )
        : h.empty,
    ],
  )

export const controls = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.aside(
    [
      h.AriaLabel('Mirror controls'),
      h.Class(
        'order-2 space-y-6 rounded-surface border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 lg:order-none',
      ),
    ],
    [
      h.div(
        [h.Class('space-y-2')],
        [
          h.h2([h.Class('type-label')], ['Make it yours']),
          h.p(
            [h.Class(hint)],
            ['Two colors. Your silhouette. No camera image in the artwork.'],
          ),
        ],
      ),
      slider(
        'Grid density',
        'Density',
        model.settings.density,
        8,
        96,
        'Cells across the longest edge. Smaller grids make bolder silhouettes.',
        h,
      ),
      h.div(
        [h.Class('space-y-3')],
        [
          colorInput('Base color', 'Base', model.settings.base, h),
          colorInput('Subject color', 'Subject', model.settings.subject, h),
          h.div(
            [h.Class('flex flex-wrap gap-2')],
            palettes.map(palette =>
              h.keyed('button')(
                palette.name,
                [
                  h.Type('button'),
                  h.AriaLabel(palette.name),
                  h.Title(palette.name),
                  h.OnClick(
                    ClickedPalette({
                      base: palette.base,
                      subject: palette.subject,
                    }),
                  ),
                  h.Class(
                    `flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1 rounded-control border border-[var(--theme-border)] p-2 ${focusRing}`,
                  ),
                ],
                [
                  h.span([
                    h.Class('h-5 w-5 rounded-sm'),
                    h.Style({ backgroundColor: palette.base }),
                  ]),
                  h.span([
                    h.Class('h-5 w-5 rounded-sm'),
                    h.Style({ backgroundColor: palette.subject }),
                  ]),
                ],
              ),
            ),
          ),
        ],
      ),
      slider(
        'Sensitivity',
        'Sensitivity',
        model.settings.sensitivity,
        0,
        100,
        'Higher values pick up more of the silhouette at its edges.',
        h,
      ),
      slider(
        'Smoothing',
        'Smoothing',
        model.settings.smoothing,
        0,
        100,
        'Zero is crisp. Higher values soften changes between frames.',
        h,
      ),
      h.button(
        [
          h.Type('button'),
          h.AriaPressed(String(model.settings.mirror === 'Mirrored')),
          h.OnClick(
            SelectedMirror({
              mode:
                model.settings.mirror === 'Mirrored' ? 'Natural' : 'Mirrored',
            }),
          ),
          h.Class(`${secondaryButton} min-h-11 w-full cursor-pointer`),
        ],
        [`Mirror: ${model.settings.mirror === 'Mirrored' ? 'on' : 'off'}`],
      ),
    ],
  )
