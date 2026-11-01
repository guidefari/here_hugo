import { Match } from 'effect'
import { Submodel } from 'foldkit'
import { Html, HtmlBuilder } from 'foldkit/html'

import * as Theme from '../../theme'
import { sceneHeader, sceneMain } from '../../ui/scene'
import { backgroundControls } from './backgroundControls'
import { densityControls } from './densityControls'
import { renderMosaic } from './engine/mosaic'
import { svgDataUrl } from './export'
import { exportActions } from './exportActions'
import { Message } from './message'
import type { Model } from './model'
import { motionControls } from './motionControls'
import {
  emptyPanel,
  outputPanel,
  pendingPanel,
  pickerPanel,
  sourcePanel,
} from './panels'

type ViewInputs = Readonly<{ palette: Theme.Palette }>

const previewPanels = (
  model: Model,
  h: HtmlBuilder<Message>,
): ReadonlyArray<Html> =>
  Match.value(model.state).pipe(
    Match.tagsExhaustive({
      WaitingImage: () => [
        pickerPanel('01 / Original', 'or drop one here', h),
        emptyPanel(
          '02 / Mosaic',
          'A little less detail. A different picture.',
          h,
        ),
      ],
      LoadingImage: () => [
        emptyPanel('01 / Original', 'Decoding your image…', h),
        emptyPanel('02 / Mosaic', 'The mosaic will appear here.', h),
      ],
      ProcessingImage: ({ source }) => [
        sourcePanel(source, model.background, h),
        pendingPanel('02 / Mosaic', source, 'Sampling the grid…', h),
      ],
      ReadyImage: ({ source, output }) => {
        const mosaicUrl = svgDataUrl(
          renderMosaic(
            output.grid,
            output.seed,
            model.motion,
            model.background,
          ),
        )

        return [
          sourcePanel(source, model.background, h),
          outputPanel(source, output, mosaicUrl, h),
          exportActions(model, source, mosaicUrl, h),
        ]
      },
      FailedImage: () => [
        pickerPanel(
          '01 / Original',
          'Try another picture, or drop one here',
          h,
        ),
        emptyPanel('02 / Mosaic', 'The mosaic will appear here.', h),
      ],
    }),
  )

const statusText = (model: Model): string =>
  Match.value(model.state).pipe(
    Match.tagsExhaustive({
      WaitingImage: () => 'No image selected',
      LoadingImage: () => 'Decoding image…',
      ProcessingImage: () => 'Sampling colors…',
      ReadyImage: ({ source, output }) =>
        `${source.name} · ${(output.grid.columns * output.grid.rows).toLocaleString()} sampled tiles`,
      FailedImage: () => 'Could not process image',
    }),
  )

const failureAlert = (model: Model, h: HtmlBuilder<Message>): Html =>
  Match.value(model.state).pipe(
    Match.tagsExhaustive({
      WaitingImage: () => h.empty,
      LoadingImage: () => h.empty,
      ProcessingImage: () => h.empty,
      ReadyImage: () => h.empty,
      FailedImage: ({ reason }) =>
        h.p(
          [
            h.Role('alert'),
            h.Class(
              'rounded-surface border border-[var(--theme-red)] p-4 text-sm text-[var(--theme-red)]',
            ),
          ],
          [reason],
        ),
    }),
  )

const controlPanel = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.aside(
    [
      h.AriaLabel('Mosaic controls'),
      h.Class(
        'divide-y divide-[var(--theme-border)] rounded-surface border border-[var(--theme-border)] ' +
          'bg-[var(--theme-surface)]',
      ),
    ],
    [
      densityControls(model, h),
      backgroundControls(model, h),
      motionControls(model, h),
    ],
  )

const footer = (h: HtmlBuilder<Message>): Html =>
  h.footer(
    [h.Class('flex flex-col gap-2 type-meta text-[var(--theme-muted)]')],
    [
      h.p([], ['Center-sampled · Square tiles · Up to 25 MB']),
      h.p(
        [h.Class('max-w-3xl font-sans text-xs leading-relaxed')],
        [
          'PNG, JPEG, WebP, AVIF, GIF, SVG, and other formats your browser can decode. Animated images become a still. Previews are fitted to 2048 px; transparency is preserved. HEIC and RAW support varies by browser.',
        ],
      ),
    ],
  )

export const view = Submodel.defineView<Model, Message, ViewInputs>(
  (model, _inputs, h): Html =>
    h.main(
      [h.Class(sceneMain)],
      [
        sceneHeader(
          {
            number: '03',
            title: 'Image Mosaic',
            description:
              'One image. A grid of sampled colors. Choose how much detail to keep.',
            status: statusText(model),
            announcesStatus: true,
          },
          h,
        ),
        h.div(
          [
            h.Class(
              'grid items-start gap-8 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]',
            ),
          ],
          [
            controlPanel(model, h),
            h.div(
              [h.Class('flex min-w-0 flex-col gap-6 xl:sticky xl:top-20')],
              [
                failureAlert(model, h),
                h.div(
                  [h.Class('grid items-start gap-6 xl:grid-cols-2')],
                  previewPanels(model, h),
                ),
                footer(h),
              ],
            ),
          ],
        ),
      ],
    ),
)
