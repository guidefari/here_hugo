import { Command, given, message, model, story } from 'foldkit/story'
import { expect, test } from 'vitest'

import { sampleMask } from './engine/grid'
import {
  ClickedStart,
  ClickedStop,
  CompletedStartCamera,
  FailedCamera,
  PausedCamera,
  ReceivedMask,
  TickedFrame,
  UpdatedColor,
  UpdatedControl,
} from './message'
import { Failed } from './model'
import { init, update } from './update'

test('starts only on request, stops, and ignores late camera results', () => {
  expect(init().model.state._tag).toBe('Idle')
  story(
    update,
    given(init().model),
    message(ClickedStart()),
    model(next => expect(next.state._tag).toBe('Starting')),
    message(CompletedStartCamera({ session: 1 })),
    model(next => expect(next.state._tag).toBe('Running')),
    message(ClickedStop()),
    message(CompletedStartCamera({ session: 1 })),
    message(FailedCamera({ session: 1, reason: 'Late failure' })),
    model(next => expect(next.state._tag).toBe('Idle')),
    Command.expectNone(),
  )
})

test('discards masks from stopped sessions and stale densities', () => {
  const grid = sampleMask(new Float32Array([1]), 1, 1, 1)
  story(
    update,
    given(init().model),
    message(ClickedStart()),
    message(CompletedStartCamera({ session: 1 })),
    message(UpdatedControl({ control: 'Smoothing', value: '0' })),
    message(TickedFrame({ deltaTimeMs: 67 })),
    message(ReceivedMask({ session: 1, density: 48, grid })),
    model(next => expect(next.levels).toEqual([1])),
    message(UpdatedControl({ control: 'Density', value: '32' })),
    message(ReceivedMask({ session: 1, density: 48, grid })),
    model(next => expect(next.levels).toEqual([])),
    message(ClickedStop()),
    message(ClickedStart()),
    message(CompletedStartCamera({ session: 2 })),
    message(ReceivedMask({ session: 1, density: 32, grid })),
    model(next => expect(next.levels).toEqual([])),
  )
})

test('pauses on backgrounding and requires a fresh start', () => {
  story(
    update,
    given(init().model),
    message(ClickedStart()),
    message(PausedCamera({ session: 1 })),
    model(next => expect(next.state._tag).toBe('Paused')),
    message(ClickedStart()),
    model(next => expect(next.session).toBe(2)),
    message(
      FailedCamera({
        session: 2,
        reason: 'Allow camera access in your browser.',
      }),
    ),
    model(next =>
      expect(next.state).toEqual(
        Failed({
          reason: 'Allow camera access in your browser.',
        }),
      ),
    ),
  )
})

test.each(['', 'NaN', 'Infinity', '-1', '101', 'hello'])(
  'rejects invalid slider input %s',
  value => {
    const initial = init().model
    expect(
      update(initial, UpdatedControl({ control: 'Sensitivity', value })).model,
    ).toEqual(initial)
  },
)

test('validates colors and density at the input boundary', () => {
  const initial = init().model
  expect(
    update(initial, UpdatedColor({ control: 'Base', value: 'red' })).model,
  ).toEqual(initial)
  expect(
    update(initial, UpdatedControl({ control: 'Density', value: '32.5' }))
      .model,
  ).toEqual(initial)
  expect(
    update(initial, UpdatedControl({ control: 'Density', value: '256' })).model,
  ).toEqual(initial)
  expect(
    update(initial, UpdatedColor({ control: 'Base', value: '#ff0000' })).model
      .settings.base,
  ).toBe('#ff0000')
})

test('keeps portrait proportions while the grid density changes', () => {
  const started = update(init().model, ClickedStart()).model
  const running = update(started, CompletedStartCamera({ session: 1 })).model
  const grid = sampleMask(new Float32Array(192 * 256), 192, 256, 48)

  const portrait = update(
    running,
    ReceivedMask({ session: 1, density: 48, grid }),
  ).model

  const changed = update(
    portrait,
    UpdatedControl({ control: 'Density', value: '32' }),
  ).model

  expect(changed.grid.width).toBe(192)
  expect(changed.grid.height).toBe(256)
  expect(changed.grid.columns).toBe(24)
  expect(changed.grid.rows).toBe(32)
  expect(changed.levels).toEqual([])
})
