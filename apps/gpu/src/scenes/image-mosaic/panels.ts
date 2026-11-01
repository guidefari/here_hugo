import { Html, HtmlBuilder } from 'foldkit/html'

import type { BackgroundFill } from './engine/background'
import { Message, SelectedImages } from './message'
import type { MosaicOutput, SourceImage } from './model'

const mediaClass = 'block max-h-[65vh] w-full xl:max-h-[calc(100vh-16rem)]'

const frameClass =
  'mosaic-preview flex min-h-64 items-center justify-center overflow-hidden rounded-surface border border-[var(--theme-border)]'

const fileInput = (h: HtmlBuilder<Message>) =>
  h.input([
    h.Id('mosaic-file'),
    h.Type('file'),
    h.AriaLabel('Choose a picture'),
    h.OnFileChange(files => SelectedImages({ files })),
    h.Class('sr-only'),
  ])

const caption = (
  label: string,
  detail: string,
  h: HtmlBuilder<Message>,
  action: Html = h.empty,
) =>
  h.figcaption(
    [h.Class('mb-3 flex items-baseline justify-between gap-3')],
    [
      h.span([h.Class('type-label')], [label]),
      h.span(
        [
          h.Class(
            'flex min-w-0 items-baseline gap-3 type-meta text-[var(--theme-muted)]',
          ),
        ],
        [h.span([h.Class('truncate')], [detail]), action],
      ),
    ],
  )

const replaceAction = (h: HtmlBuilder<Message>) =>
  h.label(
    [
      h.Class(
        'cursor-pointer rounded-control px-1 text-[var(--theme-text)] underline decoration-[var(--theme-border)] underline-offset-4 transition-colors hover:decoration-[var(--theme-text)] focus-within:ring-2 focus-within:ring-[var(--theme-cyan)]',
      ),
    ],
    [fileInput(h), 'Replace'],
  )

const dropImage = (h: HtmlBuilder<Message>) => [
  h.AllowDrop(),
  h.OnDropFiles(files => SelectedImages({ files })),
]

const panel = (
  label: string,
  detail: string,
  content: Html,
  h: HtmlBuilder<Message>,
  acceptsDrop = false,
  action: Html = h.empty,
): Html =>
  h.figure(
    [h.Class('min-w-0')],
    [
      caption(label, detail, h, action),
      h.div(
        [...(acceptsDrop ? dropImage(h) : []), h.Class(frameClass)],
        [content],
      ),
    ],
  )

export const pickerPanel = (
  label: string,
  prompt: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.figure(
    [h.Class('min-w-0')],
    [
      caption(label, 'Waiting for an image', h),
      h.label(
        [
          ...dropImage(h),
          h.Class(
            `${frameClass} group cursor-pointer flex-col gap-2 border-dashed transition-colors duration-200 hover:border-[var(--theme-muted)] hover:bg-[var(--theme-elevated)] focus-within:ring-2 focus-within:ring-[var(--theme-cyan)]`,
          ),
        ],
        [
          fileInput(h),
          h.span(
            [
              h.Class(
                'rounded-control border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-sm font-medium transition-colors group-hover:border-[var(--theme-muted)]',
              ),
            ],
            ['Choose a picture'],
          ),
          h.span(
            [h.Class('px-6 text-center text-sm text-[var(--theme-muted)]')],
            [prompt],
          ),
          h.span(
            [h.Class('mt-4 text-xs text-[var(--theme-muted)]')],
            ['Your images stay on this device.'],
          ),
        ],
      ),
    ],
  )

export const emptyPanel = (
  label: string,
  detail: string,
  h: HtmlBuilder<Message>,
): Html =>
  panel(
    label,
    'Waiting for an image',
    h.p(
      [h.Class('px-6 text-center text-sm text-[var(--theme-muted)]')],
      [detail],
    ),
    h,
  )

export const pendingPanel = (
  label: string,
  source: SourceImage,
  detail: string,
  h: HtmlBuilder<Message>,
): Html =>
  panel(
    label,
    `${source.width} × ${source.height}`,
    h.div(
      [
        h.Style({ aspectRatio: `${source.width} / ${source.height}` }),
        h.Class(`${mediaClass} flex items-center justify-center`),
      ],
      [
        h.p(
          [h.Class('px-6 text-center text-sm text-[var(--theme-muted)]')],
          [detail],
        ),
      ],
    ),
    h,
  )

export const sourcePanel = (
  source: SourceImage,
  background: BackgroundFill,
  h: HtmlBuilder<Message>,
): Html =>
  panel(
    '01 / Original',
    `${source.width} × ${source.height}`,
    h.img([
      h.Src(source.dataUrl),
      h.Style({
        backgroundColor:
          background.mode === 'Solid' ? background.color : 'transparent',
      }),
      h.Alt(`Original: ${source.name}`),
      h.Class(`${mediaClass} object-contain`),
      h.Attribute('width', String(source.width)),
      h.Attribute('height', String(source.height)),
    ]),
    h,
    true,
    replaceAction(h),
  )

export const outputPanel = (
  source: SourceImage,
  output: MosaicOutput,
  mosaicUrl: string,
  h: HtmlBuilder<Message>,
): Html =>
  panel(
    '02 / Mosaic',
    `${output.grid.columns} × ${output.grid.rows} cells`,
    h.img([
      h.Src(mosaicUrl),
      h.Alt(
        `Sampled mosaic, ${output.grid.columns} columns by ${output.grid.rows} rows`,
      ),
      h.Class(`${mediaClass} object-contain`),
      h.Attribute('width', String(source.width)),
      h.Attribute('height', String(source.height)),
    ]),
    h,
  )
