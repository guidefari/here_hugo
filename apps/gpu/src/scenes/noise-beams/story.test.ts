import { given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import {
  CompletedGenerateNoiseSeed,
  CompletedInitializeRenderer,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
  TickedFrame,
} from './message'
import {
  DrawingNoiseBeams,
  FailedRenderer,
  GeneratingNoiseBeams,
  UnsupportedRenderer,
  WaitingNoiseBeams,
} from './model'
import { GenerateNoiseSeed, init, update } from './update'

const seed = 123_456

const waiting = WaitingNoiseBeams({ seed })

const drawing = (elapsedSeconds: number) =>
  DrawingNoiseBeams({ seed, elapsedSeconds })

describe('noise beams update', () => {
  test('init generates a fresh noise seed before mounting the renderer', () => {
    expect(init()).toStrictEqual([
      GeneratingNoiseBeams(),
      [GenerateNoiseSeed()],
    ])
  })

  test('generated seed is preserved when the renderer starts drawing', () => {
    story(
      update,
      given(GeneratingNoiseBeams()),
      message(CompletedGenerateNoiseSeed({ seed })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(waiting)
      }),
      message(CompletedInitializeRenderer()),
      model(nextModel => {
        expect(nextModel).toStrictEqual(drawing(0))
      }),
    )
  })

  test('frame ticks advance elapsed seconds accurately', () => {
    story(
      update,
      given(drawing(1.25)),
      message(TickedFrame({ deltaTimeMs: 250 })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(drawing(1.5))
      }),
    )
  })

  test('frame ticks cap long pauses before advancing elapsed time', () => {
    story(
      update,
      given(drawing(1.25)),
      message(TickedFrame({ deltaTimeMs: 10_000 })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(drawing(1.5))
      }),
    )
  })

  test('unsupported renderer enters the terminal unsupported state', () => {
    story(
      update,
      given(waiting),
      message(DetectedUnsupportedRenderer()),
      model(nextModel => {
        expect(nextModel).toStrictEqual(UnsupportedRenderer())
      }),
    )
  })

  test('renderer failure preserves its reason', () => {
    story(
      update,
      given(waiting),
      message(FailedInitializeRenderer({ reason: 'Device request failed' })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(
          FailedRenderer({ reason: 'Device request failed' }),
        )
      }),
    )
  })

  test('frame ticks are ignored before drawing and in terminal states', () => {
    story(
      update,
      given(waiting),
      message(TickedFrame({ deltaTimeMs: 1_000 })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(waiting)
      }),
    )
    story(
      update,
      given(UnsupportedRenderer()),
      message(TickedFrame({ deltaTimeMs: 1_000 })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(UnsupportedRenderer())
      }),
    )
    story(
      update,
      given(FailedRenderer({ reason: 'Device lost' })),
      message(TickedFrame({ deltaTimeMs: 1_000 })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(
          FailedRenderer({ reason: 'Device lost' }),
        )
      }),
    )
  })

  test('late results cannot replace either terminal renderer state', () => {
    story(
      update,
      given(UnsupportedRenderer()),
      message(CompletedGenerateNoiseSeed({ seed })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(UnsupportedRenderer())
      }),
      message(CompletedInitializeRenderer()),
      model(nextModel => {
        expect(nextModel).toStrictEqual(UnsupportedRenderer())
      }),
    )
    story(
      update,
      given(FailedRenderer({ reason: 'Device lost' })),
      message(CompletedInitializeRenderer()),
      model(nextModel => {
        expect(nextModel).toStrictEqual(
          FailedRenderer({ reason: 'Device lost' }),
        )
      }),
    )
  })
})
