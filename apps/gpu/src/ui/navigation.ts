import { Predicate } from 'effect'
import { Html, HtmlBuilder } from 'foldkit/html'

import type { AppRoute } from '../route'
import {
  imageMosaicRouter,
  mosaicMirrorRouter,
  noiseBeamsRouter,
  randomDotsRouter,
} from '../route'
import * as Theme from '../theme'
import { floatingSurface, segmentedItem, segmentedTrack } from './controls'

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
  {
    label: 'Image Mosaic',
    shortLabel: 'Mosaic',
    href: imageMosaicRouter(),
    routeTag: 'ImageMosaic',
  },
  {
    label: 'Mosaic Mirror',
    shortLabel: 'Mirror',
    href: mosaicMirrorRouter(),
    routeTag: 'MosaicMirror',
  },
]

const blogUrl = import.meta.env.DEV
  ? 'http://localhost:1414/webgpu-webgl-typegpu-threejs-shaders/'
  : 'https://guidefari.com/webgpu-webgl-typegpu-threejs-shaders/'

const navigationLinkView = <Message>(
  item: NavigationItem,
  route: AppRoute,
  h: HtmlBuilder<Message>,
): Html => {
  const isCurrent = Predicate.isTagged(item.routeTag)(route)
  const currentAttributes = isCurrent ? [h.AriaCurrent('page')] : []

  return h.a(
    [
      h.Href(item.href),
      h.AriaLabel(item.label),
      ...currentAttributes,
      h.Class(
        `block whitespace-nowrap py-2 type-label ${segmentedItem(isCurrent)}`,
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
        'pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-wrap items-start justify-between gap-3 p-3 pb-6 ' +
          'bg-linear-to-b from-[var(--theme-page)] via-[var(--theme-page)]/85 to-transparent',
      ),
    ],
    [
      h.nav(
        [h.AriaLabel('Scene navigation'), h.Class('pointer-events-auto')],
        [
          h.ul(
            [
              h.Class(
                `${segmentedTrack} ${floatingSurface} flex-wrap text-[var(--theme-text)]`,
              ),
            ],
            [
              ...navigationItems.map(item =>
                h.keyed('li')(
                  item.routeTag,
                  [],
                  [navigationLinkView(item, route, h)],
                ),
              ),
              h.li(
                [],
                [
                  h.a(
                    [
                      h.Href(blogUrl),
                      h.AriaLabel('Read the graphics series'),
                      h.Class(
                        `block whitespace-nowrap py-2 type-label ${segmentedItem(false)}`,
                      ),
                    ],
                    [
                      h.span([h.Class('sm:hidden')], ['Read ↗']),
                      h.span(
                        [h.Class('hidden sm:inline')],
                        ['Read the series ↗'],
                      ),
                    ],
                  ),
                ],
              ),
            ],
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
