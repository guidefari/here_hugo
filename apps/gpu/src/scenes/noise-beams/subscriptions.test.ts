import { describe, expect, test } from 'vitest'

import {
  DrawingNoiseBeams,
  FailedRenderer,
  GeneratingNoiseBeams,
  UnsupportedRenderer,
  WaitingNoiseBeams,
} from './model'
import { subscriptions } from './subscriptions'

describe('noise beams subscriptions', () => {
  test('requests animation frames only while drawing', () => {
    expect(
      subscriptions.noiseBeamsFrame.modelToDependencies(
        DrawingNoiseBeams({ seed: 123_456, elapsedSeconds: 0 }),
      ),
    ).toStrictEqual({ isActive: true })

    expect(
      subscriptions.noiseBeamsFrame.modelToDependencies(
        WaitingNoiseBeams({ seed: 123_456 }),
      ),
    ).toStrictEqual({ isActive: false })
    expect(
      subscriptions.noiseBeamsFrame.modelToDependencies(GeneratingNoiseBeams()),
    ).toStrictEqual({ isActive: false })
    expect(
      subscriptions.noiseBeamsFrame.modelToDependencies(UnsupportedRenderer()),
    ).toStrictEqual({ isActive: false })
    expect(
      subscriptions.noiseBeamsFrame.modelToDependencies(
        FailedRenderer({ reason: 'Device lost' }),
      ),
    ).toStrictEqual({ isActive: false })
  })
})
