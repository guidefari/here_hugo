import { Effect, Match as M, Predicate, Schema as S } from 'effect'
import { Command, Runtime, Subscription } from 'foldkit'
import { Document, Html, HtmlBuilder } from 'foldkit/html'
import { m } from 'foldkit/message'
import { UrlRequest, load, pushUrl } from 'foldkit/navigation'
import { ts } from 'foldkit/schema'
import { evo } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import {
  AppRoute,
  NoiseBeamsRoute,
  NotFoundRoute,
  RandomDotsRoute,
  randomDotsRouter,
  urlToAppRoute,
} from './route'
import * as NoiseBeams from './scenes/noise-beams'
import * as RandomDots from './scenes/random-dots'
import * as Theme from './theme'
import { navigationView } from './ui/navigation'

export {
  AppRoute,
  NoiseBeamsRoute,
  NotFoundRoute,
  RandomDotsRoute,
} from './route'

export const Flags = S.Struct({ theme: Theme.Flags })

export type Flags = typeof Flags.Type

export const RandomDotsPage = ts('RandomDotsPage', { model: RandomDots.Model })

export const NoiseBeamsPage = ts('NoiseBeamsPage', { model: NoiseBeams.Model })

export const NotFoundPage = ts('NotFoundPage', { path: S.String })

export const ActivePage = S.Union([
  RandomDotsPage,
  NoiseBeamsPage,
  NotFoundPage,
])

export type ActivePage = typeof ActivePage.Type

export const Model = S.Struct({
  page: ActivePage,
  theme: Theme.Model,
})

export type Model = typeof Model.Type

export const CompletedNavigateInternal = m('CompletedNavigateInternal')

export const CompletedLoadExternal = m('CompletedLoadExternal')

export const ClickedLink = m('ClickedLink', { request: UrlRequest })

export const ChangedUrl = m('ChangedUrl', { url: Url })

export const GotThemeMessage = m('GotThemeMessage', {
  message: Theme.Message,
})

export const GotRandomDotsMessage = m('GotRandomDotsMessage', {
  message: RandomDots.Message,
})

export const GotNoiseBeamsMessage = m('GotNoiseBeamsMessage', {
  message: NoiseBeams.Message,
})

export const Message = S.Union([
  CompletedNavigateInternal,
  CompletedLoadExternal,
  ClickedLink,
  ChangedUrl,
  GotThemeMessage,
  GotRandomDotsMessage,
  GotNoiseBeamsMessage,
])

export type Message = typeof Message.Type

export const flags = Effect.map(Theme.flags, theme => ({ theme }))

type PageInitReturn = readonly [
  ActivePage,
  ReadonlyArray<Command.Command<Message>>,
]

const withPageInitReturn = M.withReturnType<PageInitReturn>()

const initPage = (route: AppRoute): PageInitReturn =>
  M.value(route).pipe(
    withPageInitReturn,
    M.tagsExhaustive({
      RandomDots: () => {
        const [model, commands] = RandomDots.init()

        return [
          RandomDotsPage({ model }),
          Command.mapMessages(commands, message =>
            GotRandomDotsMessage({ message }),
          ),
        ]
      },
      NoiseBeams: () => {
        const [model, commands] = NoiseBeams.init()

        return [
          NoiseBeamsPage({ model }),
          Command.mapMessages(commands, message =>
            GotNoiseBeamsMessage({ message }),
          ),
        ]
      },
      NotFound: ({ path }) => [NotFoundPage({ path }), []],
    }),
  )

export const init: Runtime.RoutingApplicationInit<Model, Message, Flags> = (
  { theme: themeFlags },
  url: Url,
) => {
  const [theme, themeCommands] = Theme.init(themeFlags)
  const [page, pageCommands] = initPage(urlToAppRoute(url))

  return [
    { page, theme },
    [
      ...Command.mapMessages(themeCommands, message =>
        GotThemeMessage({ message }),
      ),
      ...pageCommands,
    ],
  ]
}

const NavigateInternal = Command.define('NavigateInternal', {
  args: { url: S.String },
  messages: [CompletedNavigateInternal],
  execute: ({ url }) =>
    pushUrl(url).pipe(Effect.as(CompletedNavigateInternal())),
})

const LoadExternal = Command.define('LoadExternal', {
  args: { href: S.String },
  messages: [CompletedLoadExternal],
  execute: ({ href }) => load(href).pipe(Effect.as(CompletedLoadExternal())),
})

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const withUpdateReturn = M.withReturnType<UpdateReturn>()

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      CompletedNavigateInternal: () => [model, []],
      CompletedLoadExternal: () => [model, []],
      ClickedLink: ({ request }) =>
        M.value(request).pipe(
          withUpdateReturn,
          M.tagsExhaustive({
            Internal: ({ url }) => [
              model,
              [NavigateInternal({ url: urlToString(url) })],
            ],
            External: ({ href }) => [model, [LoadExternal({ href })]],
          }),
        ),
      GotThemeMessage: ({ message: childMessage }) => {
        const [theme, commands] = Theme.update(model.theme, childMessage)

        return [
          evo(model, { theme: () => theme }),
          Command.mapMessages(commands, message =>
            GotThemeMessage({ message }),
          ),
        ]
      },
      ChangedUrl: ({ url }) => {
        const route = urlToAppRoute(url)

        const remainsOnPage =
          (Predicate.isTagged('RandomDots')(route) &&
            Predicate.isTagged('RandomDotsPage')(model.page)) ||
          (Predicate.isTagged('NoiseBeams')(route) &&
            Predicate.isTagged('NoiseBeamsPage')(model.page))

        if (remainsOnPage) {
          return [model, []]
        }

        const [page, commands] = initPage(route)

        return [evo(model, { page: () => page }), commands]
      },
      GotRandomDotsMessage: ({ message: childMessage }) => {
        if (!Predicate.isTagged('RandomDotsPage')(model.page)) {
          return [model, []]
        }

        const [childModel, commands] = RandomDots.update(
          model.page.model,
          childMessage,
        )

        return [
          evo(model, { page: () => RandomDotsPage({ model: childModel }) }),
          Command.mapMessages(commands, message =>
            GotRandomDotsMessage({ message }),
          ),
        ]
      },
      GotNoiseBeamsMessage: ({ message: childMessage }) => {
        if (!Predicate.isTagged('NoiseBeamsPage')(model.page)) {
          return [model, []]
        }

        const [childModel, commands] = NoiseBeams.update(
          model.page.model,
          childMessage,
        )

        return [
          evo(model, { page: () => NoiseBeamsPage({ model: childModel }) }),
          Command.mapMessages(commands, message =>
            GotNoiseBeamsMessage({ message }),
          ),
        ]
      },
    }),
  )

const randomDotsModel = (model: Model): RandomDots.Model => {
  if (!Predicate.isTagged('RandomDotsPage')(model.page)) {
    throw new Error('Random Dots subscriptions were evaluated while inactive')
  }

  return model.page.model
}

const noiseBeamsModel = (model: Model): NoiseBeams.Model => {
  if (!Predicate.isTagged('NoiseBeamsPage')(model.page)) {
    throw new Error('Noise Beams subscriptions were evaluated while inactive')
  }

  return model.page.model
}

const themeSubscriptions = Subscription.lift(Theme.subscriptions)<
  Model,
  Message
>({
  toChildModel: model => model.theme,
  toParentMessage: message => GotThemeMessage({ message }),
})

const randomDotsSubscriptions = Subscription.lift(RandomDots.subscriptions)<
  Model,
  Message
>({
  toChildModel: randomDotsModel,
  toParentMessage: message => GotRandomDotsMessage({ message }),
  when: model => Predicate.isTagged('RandomDotsPage')(model.page),
})

const noiseBeamsSubscriptions = Subscription.lift(NoiseBeams.subscriptions)<
  Model,
  Message
>({
  toChildModel: noiseBeamsModel,
  toParentMessage: message => GotNoiseBeamsMessage({ message }),
  when: model => Predicate.isTagged('NoiseBeamsPage')(model.page),
})

export const subscriptions = Subscription.aggregate<Model, Message>()(
  themeSubscriptions,
  randomDotsSubscriptions,
  noiseBeamsSubscriptions,
)

const pageRoute = (page: ActivePage): AppRoute =>
  M.value(page).pipe(
    M.tagsExhaustive({
      RandomDotsPage: () => RandomDotsRoute(),
      NoiseBeamsPage: () => NoiseBeamsRoute(),
      NotFoundPage: ({ path }) => NotFoundRoute({ path }),
    }),
  )

const pageTitle = (page: ActivePage): string =>
  M.value(page).pipe(
    M.tagsExhaustive({
      RandomDotsPage: () => 'Random Dots · GPU Playground',
      NoiseBeamsPage: () => 'Noise Beams · GPU Playground',
      NotFoundPage: () => 'Not Found · GPU Playground',
    }),
  )

export const view = (model: Model, h: HtmlBuilder<Message>): Document => {
  const palette = Theme.resolvePalette(model.theme)

  const routeContent: Html = M.value(model.page).pipe(
    M.tagsExhaustive({
      RandomDotsPage: ({ model: childModel }) =>
        h.submodel({
          slotId: 'random-dots',
          model: childModel,
          view: RandomDots.view,
          viewInputs: { palette },
          toParentMessage: message => GotRandomDotsMessage({ message }),
        }),
      NoiseBeamsPage: ({ model: childModel }) =>
        h.submodel({
          slotId: 'noise-beams',
          model: childModel,
          view: NoiseBeams.view,
          viewInputs: { palette },
          toParentMessage: message => GotNoiseBeamsMessage({ message }),
        }),
      NotFoundPage: ({ path }) =>
        h.div(
          [
            h.Class(
              'flex min-h-screen flex-col items-center justify-center bg-[var(--theme-page)] ' +
                'px-8 pb-8 pt-24 text-[var(--theme-text)] font-mono',
            ),
          ],
          [
            h.h1([h.Class('mb-4 text-2xl')], ['Scene not found']),
            h.p(
              [h.Class('mb-6 text-[var(--theme-muted)]')],
              [`No scene at "${path}".`],
            ),
            h.a(
              [
                h.Href(randomDotsRouter()),
                h.Class('text-[var(--theme-green)] hover:underline'),
              ],
              ['Go to Random Dots'],
            ),
          ],
        ),
    }),
  )

  return {
    title: pageTitle(model.page),
    body: h.div(
      [
        h.Class(
          'relative min-h-screen bg-[var(--theme-page)] text-[var(--theme-text)]',
        ),
        h.Style(Theme.paletteStyle(model.theme)),
      ],
      [
        navigationView(
          pageRoute(model.page),
          model.theme,
          message => GotThemeMessage({ message }),
          h,
        ),
        routeContent,
      ],
    ),
  }
}
