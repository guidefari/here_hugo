import { Predicate } from 'effect'
import { given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import { DOT_REVEAL_DURATION_MS } from './constants'
import {
  CompletedGenerateDots,
  DetectedUnsupportedRenderer,
  TickedFrame,
} from './message'
import {
  DrawingDots,
  GeneratingDots,
  ReadyDots,
  UnsupportedRenderer,
} from './model'
import { update } from './update'

const panels = [
  {
    id: 'weighted-grid',
    origin: { x: 0, y: 0 },
    size: 290,
    dotRadius: 0.5,
    points: [
      { x: 12, y: 34 },
      { x: 56, y: 78 },
    ],
  },
  {
    id: 'uniform',
    origin: { x: 310, y: 0 },
    size: 290,
    dotRadius: 0.5,
    points: [
      { x: 90, y: 12 },
      { x: 34, y: 56 },
    ],
  },
]

const artworkId = 'artwork-1'

const pointCountPerPanel = 2

const drawingDots = (visibleCountPerPanel: number) =>
  DrawingDots({
    artworkId,
    panels,
    visibleCountPerPanel,
    pointCountPerPanel,
    carryMs: 0,
  })

describe('update', () => {
  test('DetectedUnsupportedRenderer enters the unsupported state', () => {
    story(
      update,
      given(GeneratingDots()),
      message(DetectedUnsupportedRenderer()),
      model(nextModel => {
        expect(nextModel).toStrictEqual(UnsupportedRenderer())
      }),
    )
  })

  test('CompletedGenerateDots cannot replace an unsupported renderer state', () => {
    story(
      update,
      given(UnsupportedRenderer()),
      message(CompletedGenerateDots({ artworkId, panels })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(UnsupportedRenderer())
      }),
    )
  })

  test('CompletedGenerateDots starts with one point visible in every panel', () => {
    story(
      update,
      given(GeneratingDots()),
      message(CompletedGenerateDots({ artworkId, panels })),
      model(nextModel => {
        expect(nextModel).toStrictEqual(drawingDots(1))

        if (Predicate.isTagged('DrawingDots')(nextModel)) {
          expect(nextModel.artworkId).toBe(artworkId)
        }
      }),
    )
  })

  test('TickedFrame reveals the next point in every panel together', () => {
    story(
      update,
      given(drawingDots(0)),
      message(
        TickedFrame({
          deltaTimeMs: DOT_REVEAL_DURATION_MS / pointCountPerPanel,
        }),
      ),
      model(nextModel => {
        expect(nextModel).toStrictEqual(drawingDots(1))
      }),
    )
  })

  test('TickedFrame completes every panel after its last point', () => {
    story(
      update,
      given(drawingDots(1)),
      message(
        TickedFrame({
          deltaTimeMs: DOT_REVEAL_DURATION_MS / pointCountPerPanel,
        }),
      ),
      model(nextModel => {
        expect(nextModel).toStrictEqual(
          ReadyDots({ artworkId, panels, pointCountPerPanel }),
        )
      }),
    )
  })
})
