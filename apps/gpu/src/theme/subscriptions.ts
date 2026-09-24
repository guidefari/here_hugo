import { Subscription } from 'foldkit'

import { ChangedSystemColorScheme, Message } from './message'
import type { Model } from './model'

const colorSchemeChanges = Subscription.fromEvent<MediaQueryListEvent, Message>(
  {
    target: () => window.matchMedia('(prefers-color-scheme: dark)'),
    type: 'change',
    toMessage: event =>
      ChangedSystemColorScheme({
        systemColorScheme: event.matches ? 'Dark' : 'Light',
      }),
  },
)

export const subscriptions = Subscription.make<Model, Message>()(() => ({
  colorSchemeChanges: Subscription.persistent(colorSchemeChanges),
}))
