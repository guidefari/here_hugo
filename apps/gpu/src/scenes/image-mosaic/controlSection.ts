import { Html, HtmlBuilder } from 'foldkit/html'

import type { Message } from './message'

export const controlSection = (
  title: string,
  value: Html,
  children: ReadonlyArray<Html>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.AriaLabel(title), h.Class('flex flex-col gap-3 p-5')],
    [
      h.div(
        [h.Class('flex items-baseline justify-between gap-3')],
        [h.h2([h.Class('type-label')], [title]), value],
      ),
      ...children,
    ],
  )

export const sectionValue = (text: string, h: HtmlBuilder<Message>): Html =>
  h.span([h.Class('type-meta text-[var(--theme-muted)]')], [text])
