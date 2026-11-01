import { Predicate } from 'effect'
import { Command, given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import { transparentBackground } from './engine/background'
import { stationaryMotion } from './engine/motion'
import {
  ClickedReshuffle,
  CompletedGenerateMotionSeed,
  ScrolledMotionControl,
  UpdatedMotionControl,
} from './message'
import { IdleExport, Model, ReadyImage } from './model'
import { sampledOutput } from './testFixtures'
import { GenerateMotionSeed, init, update } from './update'

const source = {
  file: new File(['image'], 'test.png'),
  name: 'test.png',
  dataUrl: 'data:image/png,test',
  width: 400,
  height: 200,
}

const output = sampledOutput()

const readyState = ReadyImage({ source, output })

const ready: Model = {
  background: transparentBackground,
  motion: stationaryMotion,
  densityInput: '32',
  density: 32,
  revision: 1,
  exportState: IdleExport(),
  state: readyState,
}

describe('post-sampling movement', () => {
  test('changes intensity and axis weights without sampling again', () => {
    story(
      update,
      given(ready),
      message(UpdatedMotionControl({ control: 'intensity', value: '65' })),
      message(
        UpdatedMotionControl({ control: 'horizontalWeight', value: '0' }),
      ),
      model(next => {
        expect(next.motion).toEqual({
          intensity: 65,
          horizontalWeight: 0,
          verticalWeight: 100,
        })
        expect(next.state).toBe(ready.state)
      }),
      Command.expectNone(),
    )
  })

  test('reshuffles movement without changing the sampled colors or intensity', () => {
    story(
      update,
      given(ready),
      message(ClickedReshuffle()),
      Command.resolve(
        GenerateMotionSeed,
        CompletedGenerateMotionSeed({
          file: source.file,
          revision: 2,
          seed: 456,
        }),
      ),
      model(next => {
        if (!Predicate.isTagged('ReadyImage')(next.state)) {
          throw new Error('Expected ready mosaic')
        }

        expect(next.state.output.seed).toBe(456)
        expect(next.state.output.grid).toBe(readyState.output.grid)
        expect(next.motion).toBe(ready.motion)
      }),
      Command.expectNone(),
    )
  })

  test('clamps wheel values and ignores motion until sampling has completed', () => {
    expect(
      update(
        init().model,
        UpdatedMotionControl({ control: 'intensity', value: '50' }),
      ).model,
    ).toEqual(init().model)

    const { model: next } = update(
      ready,
      ScrolledMotionControl({ control: 'intensity', direction: -1 }),
    )

    expect(next.motion.intensity).toBe(0)

    const { model: increased } = update(
      next,
      ScrolledMotionControl({ control: 'intensity', direction: 1 }),
    )

    expect(increased.motion.intensity).toBe(1)
    expect(
      update(
        ready,
        UpdatedMotionControl({ control: 'intensity', value: '500' }),
      ).model.motion.intensity,
    ).toBe(100)
  })
})
