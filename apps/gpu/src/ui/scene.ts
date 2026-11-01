import { Html, HtmlBuilder } from 'foldkit/html'

export const sceneMain =
  'mx-auto min-h-screen max-w-[1600px] px-5 pb-12 pt-32 text-[var(--theme-text)] sm:px-10 sm:pt-20'

type SceneHeader = Readonly<{
  number: string
  title: string
  description: string
  status: string
  announcesStatus: boolean
}>

export const sceneHeader = <Message>(
  { number, title, description, status, announcesStatus }: SceneHeader,
  h: HtmlBuilder<Message>,
): Html =>
  h.header(
    [
      h.Class(
        'mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b border-[var(--theme-border)] pb-4',
      ),
    ],
    [
      h.div(
        [h.Class('min-w-0')],
        [
          h.div(
            [h.Class('flex items-baseline gap-3')],
            [
              h.h1([h.Class('text-2xl font-semibold tracking-tight')], [title]),
              h.span(
                [h.Class('type-label text-[var(--theme-muted)]')],
                [`Study / ${number}`],
              ),
            ],
          ),
          h.p(
            [h.Class('mt-1 text-sm text-[var(--theme-muted)]')],
            [description],
          ),
        ],
      ),
      h.p(
        [
          ...(announcesStatus ? [h.Role('status'), h.AriaLive('polite')] : []),
          h.Class(
            'max-w-xl break-words type-meta text-[var(--theme-muted)] sm:text-right',
          ),
        ],
        [status],
      ),
    ],
  )
