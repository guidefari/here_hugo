import { expect, test } from 'vitest'

import {
  ClickedStart,
  ClickedStop,
  CompletedStartCamera,
  FailedCamera,
  PausedCamera,
} from './message'
import { subscriptions } from './subscriptions'
import { init, update } from './update'

test('requests frames only during camera startup or live capture', () => {
  const idle = init().model
  const starting = update(idle, ClickedStart()).model
  const running = update(starting, CompletedStartCamera({ session: 1 })).model
  const paused = update(running, PausedCamera({ session: 1 })).model

  const failed = update(
    running,
    FailedCamera({ session: 1, reason: 'Camera disconnected' }),
  ).model

  const stopped = update(running, ClickedStop()).model
  const active = [starting, running]
  const inactive = [idle, paused, failed, stopped]

  active.forEach(model =>
    expect(subscriptions.mirrorFrame.modelToDependencies(model)).toEqual({
      isActive: true,
    }),
  )
  inactive.forEach(model =>
    expect(subscriptions.mirrorFrame.modelToDependencies(model)).toEqual({
      isActive: false,
    }),
  )
})
