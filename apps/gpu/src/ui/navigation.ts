import { Predicate } from 'effect'
import { Html, HtmlBuilder } from 'foldkit/html'

import type { AppRoute } from '../route'
import { noiseBeamsRouter, randomDotsRouter } from '../route'
import * as Theme from '../theme'

type NavigationItem = Readonly<{
  label: string
  shortLabel: string
  href: string
  routeTag: AppRoute['_tag']
}>

const navigationItems: ReadonlyArray<NavigationItem> = [
  {
    label: 'Random Dots',
    shortLabel: 'Dots',
    href: randomDotsRouter(),
    routeTag: 'RandomDots',
  },
  {
    label: 'Noise Beams',
    shortLabel: 'Beams',
    href: noiseBeamsRouter(),
    routeTag: 'NoiseBeams',
  },
]

const navigationLinkView = <Message>(
  item: NavigationItem,
  route: AppRoute,
  h: HtmlBuilder<Message>,
): Html => {
  const isCurrent = Predicate.isTagged(item.routeTag)(route)
  const currentAttributes = isCurrent ? [h.AriaCurrent('page')] : []

  const stateClass = isCurrent
    ? 'bg-[var(--theme-text)] text-[var(--theme-page)] shadow-sm'
    : 'text-[var(--theme-muted)] hover:bg-[var(--theme-elevated)] hover:text-[var(--theme-text)]'

  return h.a(
    [
      h.Href(item.href),
      h.AriaLabel(item.label),
      ...currentAttributes,
      h.Class(
        'block whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-medium ' +
          'uppercase tracking-[0.14em] transition-colors duration-200 ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-cyan)] ' +
          stateClass,
      ),
    ],
    [
      h.span([h.Class('sm:hidden')], [item.shortLabel]),
      h.span([h.Class('hidden sm:inline')], [item.label]),
    ],
  )
}

export const navigationView = <Message>(
  route: AppRoute,
  theme: Theme.Model,
  toThemeMessage: (message: Theme.Message) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        'pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-3 p-3',
      ),
    ],
    [
      h.nav(
        [h.AriaLabel('Scene navigation'), h.Class('pointer-events-auto')],
        [
          h.ul(
            [
              h.Class(
                'flex items-center gap-1 rounded-full border border-[var(--theme-border)] ' +
                  'bg-[var(--theme-surface)]/90 p-1.5 text-[var(--theme-text)] ' +
                  'shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl',
              ),
            ],
            navigationItems.map(item =>
              h.keyed('li')(
                item.routeTag,
                [],
                [navigationLinkView(item, route, h)],
              ),
            ),
          ),
        ],
      ),
      h.submodel({
        slotId: 'theme-control',
        model: theme,
        view: Theme.view,
        toParentMessage: toThemeMessage,
      }),
    ],
  )
