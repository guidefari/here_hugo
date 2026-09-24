import { Predicate } from 'effect'
import { Subscription } from 'foldkit'

import { Message, TickedFrame } from './message'
import { Model } from './model'

export const subscriptions = Subscription.make<Model, Message>()(_entry => ({
  randomDotsFrame: Subscription.animationFrame({
    isActive: Predicate.isTagged('DrawingDots'),
    toMessage: deltaTimeMs => TickedFrame({ deltaTimeMs }),
  }),
}))
