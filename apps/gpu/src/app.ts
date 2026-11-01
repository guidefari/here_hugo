import { Effect, Match, Predicate, Schema } from 'effect'
import { Command, Runtime, Subscription, Update } from 'foldkit'
import { Document, Html, HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'
import { UrlRequest, load, pushUrl } from 'foldkit/navigation'
import { defineTaggedUnion } from 'foldkit/schema'
import { modifyFields } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import {
  AppRoute,
  ImageMosaicRoute,
  MosaicMirrorRoute,
  NoiseBeamsRoute,
  NotFoundRoute,
  RandomDotsRoute,
  randomDotsRouter,
  urlToAppRoute,
} from './route'
import * as ImageMosaic from './scenes/image-mosaic'
import * as MosaicMirror from './scenes/mosaic-mirror'
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

export const Flags = Schema.Struct({ theme: Theme.Flags })

export type Flags = typeof Flags.Type

export const ActivePage = defineTaggedUnion({
  RandomDotsPage: { model: RandomDots.Model },
  NoiseBeamsPage: { model: NoiseBeams.Model },
  ImageMosaicPage: { model: ImageMosaic.Model },
  MosaicMirrorPage: { model: MosaicMirror.Model },
  NotFoundPage: { path: Schema.String },
})

export const {
  RandomDotsPage,
  NoiseBeamsPage,
  ImageMosaicPage,
  MosaicMirrorPage,
  NotFoundPage,
} = ActivePage

export type ActivePage = typeof ActivePage.Type

export const Model = Schema.Struct({
  page: ActivePage,
  theme: Theme.Model,
})

export type Model = typeof Model.Type

export const Message = defineMessageUnion({
  CompletedNavigateInternal: {},
  CompletedLoadExternal: {},
  ClickedLink: { request: UrlRequest },
  ChangedUrl: { url: Url },
  GotThemeMessage: { message: Theme.Message },
  GotRandomDotsMessage: { message: RandomDots.Message },
  GotNoiseBeamsMessage: { message: NoiseBeams.Message },
  GotImageMosaicMessage: { message: ImageMosaic.Message },
  GotMosaicMirrorMessage: { message: MosaicMirror.Message },
})

export const {
  CompletedNavigateInternal,
  CompletedLoadExternal,
  ClickedLink,
  ChangedUrl,
  GotThemeMessage,
  GotRandomDotsMessage,
  GotNoiseBeamsMessage,
  GotImageMosaicMessage,
  GotMosaicMirrorMessage,
} = Message

export type Message = typeof Message.Type

export const flags = Effect.map(Theme.flags, theme => ({ theme }))

type PageInitReturn = Update.Return<ActivePage, Message>

const withPageInitReturn = Match.withReturnType<PageInitReturn>()

const initPage = (route: AppRoute): PageInitReturn =>
  Match.value(route).pipe(
    withPageInitReturn,
    Match.tagsExhaustive({
      RandomDots: () => {
        const childInit = RandomDots.init()

        return {
          model: RandomDotsPage({ model: childInit.model }),
          commands: Command.mapMessages(childInit.commands ?? [], message =>
            Message.GotRandomDotsMessage({ message }),
          ),
        }
      },
      NoiseBeams: () => {
        const childInit = NoiseBeams.init()

        return {
          model: NoiseBeamsPage({ model: childInit.model }),
          commands: Command.mapMessages(childInit.commands ?? [], message =>
            Message.GotNoiseBeamsMessage({ message }),
          ),
        }
      },
      NotFound: ({ path }) => ({ model: NotFoundPage({ path }) }),
      ImageMosaic: () => {
        const childInit = ImageMosaic.init()

        return {
          model: ImageMosaicPage({ model: childInit.model }),
          commands: Command.mapMessages(childInit.commands ?? [], message =>
            Message.GotImageMosaicMessage({ message }),
          ),
        }
      },
      MosaicMirror: () => {
        const childInit = MosaicMirror.init()

        return {
          model: MosaicMirrorPage({ model: childInit.model }),
          commands: Command.mapMessages(childInit.commands ?? [], message =>
            Message.GotMosaicMirrorMessage({ message }),
          ),
        }
      },
    }),
  )

export const init: Runtime.RoutingApplicationInit<Model, Message, Flags> = (
  { theme: themeFlags },
  url: Url,
) => {
  const themeInit = Theme.init(themeFlags)
  const pageInit = initPage(urlToAppRoute(url))

  return {
    model: { page: pageInit.model, theme: themeInit.model },
    commands: pageInit.commands ?? [],
  }
}

const NavigateInternal = Command.define('NavigateInternal', {
  args: { url: Schema.String },
  messages: [CompletedNavigateInternal],
  execute: ({ url }) =>
    pushUrl(url).pipe(Effect.as(CompletedNavigateInternal())),
})

const LoadExternal = Command.define('LoadExternal', {
  args: { href: Schema.String },
  messages: [CompletedLoadExternal],
  execute: ({ href }) => load(href).pipe(Effect.as(CompletedLoadExternal())),
})

type UpdateReturn = Update.Return<Model, Message>

const withUpdateReturn = Match.withReturnType<UpdateReturn>()

export const update = (model: Model, message: Message): UpdateReturn =>
  Match.value(message).pipe(
    withUpdateReturn,
    Match.tagsExhaustive({
      CompletedNavigateInternal: () => ({ model }),
      CompletedLoadExternal: () => ({ model }),
      ClickedLink: ({ request }) =>
        Match.value(request).pipe(
          withUpdateReturn,
          Match.tagsExhaustive({
            Internal: ({ url }) => ({
              model,
              commands: [NavigateInternal({ url: urlToString(url) })],
            }),
            External: ({ href }) => ({
              model,
              commands: [LoadExternal({ href })],
            }),
          }),
        ),
      GotThemeMessage: ({ message: childMessage }) => {
        const childUpdate = Theme.update(model.theme, childMessage)

        return {
          model: modifyFields(model, { theme: () => childUpdate.model }),
          commands: Command.mapMessages(childUpdate.commands ?? [], message =>
            Message.GotThemeMessage({ message }),
          ),
        }
      },
      ChangedUrl: ({ url }) => {
        const route = urlToAppRoute(url)

        const remainsOnPage =
          (Predicate.isTagged('ImageMosaic')(route) &&
            Predicate.isTagged('ImageMosaicPage')(model.page)) ||
          (Predicate.isTagged('MosaicMirror')(route) &&
            Predicate.isTagged('MosaicMirrorPage')(model.page)) ||
          (Predicate.isTagged('RandomDots')(route) &&
            Predicate.isTagged('RandomDotsPage')(model.page)) ||
          (Predicate.isTagged('NoiseBeams')(route) &&
            Predicate.isTagged('NoiseBeamsPage')(model.page))

        if (remainsOnPage) {
          return { model }
        }

        const pageInit = initPage(route)

        return {
          model: modifyFields(model, { page: () => pageInit.model }),
          commands: pageInit.commands ?? [],
        }
      },
      GotRandomDotsMessage: ({ message: childMessage }) => {
        if (!Predicate.isTagged('RandomDotsPage')(model.page)) {
          return { model }
        }

        const childUpdate = RandomDots.update(model.page.model, childMessage)

        return {
          model: modifyFields(model, {
            page: () => RandomDotsPage({ model: childUpdate.model }),
          }),
          commands: Command.mapMessages(childUpdate.commands ?? [], message =>
            Message.GotRandomDotsMessage({ message }),
          ),
        }
      },
      GotImageMosaicMessage: ({ message: childMessage }) => {
        if (!Predicate.isTagged('ImageMosaicPage')(model.page)) {
          return { model }
        }

        const childUpdate = ImageMosaic.update(model.page.model, childMessage)

        return {
          model: modifyFields(model, {
            page: () => ImageMosaicPage({ model: childUpdate.model }),
          }),
          commands: Command.mapMessages(childUpdate.commands ?? [], message =>
            Message.GotImageMosaicMessage({ message }),
          ),
        }
      },
      GotMosaicMirrorMessage: ({ message: childMessage }) => {
        if (!Predicate.isTagged('MosaicMirrorPage')(model.page)) {
          return { model }
        }

        const childUpdate = MosaicMirror.update(model.page.model, childMessage)

        return {
          model: modifyFields(model, {
            page: () => MosaicMirrorPage({ model: childUpdate.model }),
          }),
          commands: Command.mapMessages(childUpdate.commands ?? [], message =>
            Message.GotMosaicMirrorMessage({ message }),
          ),
        }
      },
      GotNoiseBeamsMessage: ({ message: childMessage }) => {
        if (!Predicate.isTagged('NoiseBeamsPage')(model.page)) {
          return { model }
        }

        const childUpdate = NoiseBeams.update(model.page.model, childMessage)

        return {
          model: modifyFields(model, {
            page: () => NoiseBeamsPage({ model: childUpdate.model }),
          }),
          commands: Command.mapMessages(childUpdate.commands ?? [], message =>
            Message.GotNoiseBeamsMessage({ message }),
          ),
        }
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
  toParentMessage: message => Message.GotThemeMessage({ message }),
})

const randomDotsSubscriptions = Subscription.lift(RandomDots.subscriptions)<
  Model,
  Message
>({
  toChildModel: randomDotsModel,
  toParentMessage: message => Message.GotRandomDotsMessage({ message }),
  when: model => Predicate.isTagged('RandomDotsPage')(model.page),
})

const noiseBeamsSubscriptions = Subscription.lift(NoiseBeams.subscriptions)<
  Model,
  Message
>({
  toChildModel: noiseBeamsModel,
  toParentMessage: message => Message.GotNoiseBeamsMessage({ message }),
  when: model => Predicate.isTagged('NoiseBeamsPage')(model.page),
})

const mirrorSubscriptions = Subscription.lift(MosaicMirror.subscriptions)<
  Model,
  Message
>({
  toChildModel: model => {
    if (!Predicate.isTagged('MosaicMirrorPage')(model.page)) {
      throw new Error('Mirror subscriptions evaluated while inactive')
    }

    return model.page.model
  },
  toParentMessage: message => Message.GotMosaicMirrorMessage({ message }),
  when: model => Predicate.isTagged('MosaicMirrorPage')(model.page),
})

export const subscriptions = Subscription.aggregate<Model, Message>()(
  mirrorSubscriptions,
  themeSubscriptions,
  randomDotsSubscriptions,
  noiseBeamsSubscriptions,
)

const pageRoute = (page: ActivePage): AppRoute =>
  Match.value(page).pipe(
    Match.tagsExhaustive({
      RandomDotsPage: () => RandomDotsRoute(),
      ImageMosaicPage: () => ImageMosaicRoute(),
      MosaicMirrorPage: () => MosaicMirrorRoute(),
      NoiseBeamsPage: () => NoiseBeamsRoute(),
      NotFoundPage: ({ path }) => NotFoundRoute({ path }),
    }),
  )

const pageTitle = (page: ActivePage): string =>
  Match.value(page).pipe(
    Match.tagsExhaustive({
      RandomDotsPage: () => 'Random Dots · GPU Playground',
      ImageMosaicPage: () => 'Image Mosaic · GPU Playground',
      MosaicMirrorPage: () => 'Mosaic Mirror · GPU Playground',
      NoiseBeamsPage: () => 'Noise Beams · GPU Playground',
      NotFoundPage: () => 'Not Found · GPU Playground',
    }),
  )

export const view = (model: Model, h: HtmlBuilder<Message>): Document => {
  const palette = Theme.resolvePalette(model.theme)

  const routeContent: Html = Match.value(model.page).pipe(
    Match.tagsExhaustive({
      RandomDotsPage: ({ model: childModel }) =>
        h.submodel({
          slotId: 'random-dots',
          model: childModel,
          view: RandomDots.view,
          viewInputs: { palette },
          toParentMessage: message => Message.GotRandomDotsMessage({ message }),
        }),
      ImageMosaicPage: ({ model: childModel }) =>
        h.submodel({
          slotId: 'image-mosaic',
          model: childModel,
          view: ImageMosaic.view,
          viewInputs: { palette },
          toParentMessage: message =>
            Message.GotImageMosaicMessage({ message }),
        }),
      MosaicMirrorPage: ({ model: childModel }) =>
        h.submodel({
          slotId: 'mosaic-mirror',
          model: childModel,
          view: MosaicMirror.view,
          viewInputs: { palette },
          toParentMessage: message =>
            Message.GotMosaicMirrorMessage({ message }),
        }),
      NoiseBeamsPage: ({ model: childModel }) =>
        h.submodel({
          slotId: 'noise-beams',
          model: childModel,
          view: NoiseBeams.view,
          viewInputs: { palette },
          toParentMessage: message => Message.GotNoiseBeamsMessage({ message }),
        }),
      NotFoundPage: ({ path }) =>
        h.div(
          [
            h.Class(
              'flex min-h-screen flex-col items-center justify-center bg-[var(--theme-page)] ' +
                'px-8 pb-8 pt-36 sm:pt-24 text-[var(--theme-text)]',
            ),
          ],
          [
            h.h1(
              [h.Class('mb-4 text-2xl font-semibold tracking-tight')],
              ['Scene not found'],
            ),
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
          message => Message.GotThemeMessage({ message }),
          h,
        ),
        routeContent,
      ],
    ),
  }
}
