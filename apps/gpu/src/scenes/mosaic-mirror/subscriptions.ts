import { Subscription } from 'foldkit'

import { Message, TickedFrame } from './message'
import { Model } from './model'
import { isActive } from './update'

export const subscriptions = Subscription.make<Model, Message>()(() => ({
  mirrorFrame: Subscription.animationFrame({
    isActive,
    toMessage: deltaTimeMs => TickedFrame({ deltaTimeMs }),
  }),
}))
