import { Match, Predicate } from 'effect'
import { Html, HtmlBuilder } from 'foldkit/html'

import { primaryButton, secondaryButton } from '../../ui/controls'
import { mosaicFileName } from './export'
import { ClickedDownloadPng, Message } from './message'
import type { Model, SourceImage } from './model'

const exportFailure = (model: Model, h: HtmlBuilder<Message>): Html =>
  Match.value(model.exportState).pipe(
    Match.tagsExhaustive({
      IdleExport: () => h.empty,
      ExportingPng: () => h.empty,
      FailedExport: ({ reason }) =>
        h.p(
          [h.Role('alert'), h.Class('mr-auto text-sm text-[var(--theme-red)]')],
          [reason],
        ),
    }),
  )

export const exportActions = (
  model: Model,
  source: SourceImage,
  mosaicUrl: string,
  h: HtmlBuilder<Message>,
): Html => {
  const isExporting = Predicate.isTagged('ExportingPng')(model.exportState)

  return h.div(
    [
      h.AriaLabel('Download mosaic'),
      h.Role('group'),
      h.Class('flex flex-wrap items-center justify-end gap-2 xl:col-span-2'),
    ],
    [
      exportFailure(model, h),
      h.a(
        [
          h.Href(mosaicUrl),
          h.Download(mosaicFileName(source.name, 'svg')),
          h.Class(secondaryButton),
        ],
        ['Download SVG'],
      ),
      h.button(
        [
          h.Type('button'),
          h.Disabled(isExporting),
          h.OnClick(ClickedDownloadPng()),
          h.Class(primaryButton),
        ],
        [isExporting ? 'Preparing PNG…' : 'Download PNG'],
      ),
    ],
  )
}
