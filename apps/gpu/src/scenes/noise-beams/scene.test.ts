import { Option } from 'effect'
import {
  type SceneStep,
  Subscription,
  expect,
  find,
  given,
  role,
  scene,
  tap,
  text,
  withViewInputs,
} from 'foldkit/scene'
import { expect as assert, describe, test } from 'vitest'

import { darkPalette } from '../../theme'
import { type Message, TickedFrame } from './message'
import {
  DrawingNoiseBeams,
  FailedRenderer,
  GeneratingNoiseBeams,
  type Model,
  UnsupportedRenderer,
  WaitingNoiseBeams,
} from './model'
import { update } from './update'
import { NOISE_BEAMS_ACCESSIBLE_LABEL, view } from './view'

const testView = withViewInputs(view, { palette: darkPalette })()

const seed = 123_456

const expectGpuProperties = (
  expectedTimeSeconds: number,
): SceneStep<Model, Message, undefined> =>
  tap(simulation => {
    const gpuCanvas = Option.getOrThrow(
      find(simulation.html, 'noise-beams-gpu-canvas'),
    )

    assert(gpuCanvas.data?.props).toStrictEqual({
      timeSeconds: expectedTimeSeconds,
      seed,
      palette: darkPalette,
    })
  })

describe('noise beams view', () => {
  test('drawing exposes the rooted direct-overhead 3D field accessibly', () => {
    scene(
      { update, view: testView },
      given(DrawingNoiseBeams({ seed, elapsedSeconds: 0 })),
      expect(role('img', { name: NOISE_BEAMS_ACCESSIBLE_LABEL })).toExist(),
      expect(
        text(
          '2035 ground-rooted cylindrical rods pivoting in a direct-overhead 3D liquid field',
        ),
      ).toExist(),
    )
  })

  test('passes one elapsed-time property to the GPU element after every tick', () => {
    scene(
      { update, view: testView },
      given(DrawingNoiseBeams({ seed, elapsedSeconds: 1.25 })),
      expectGpuProperties(1.25),
      Subscription.emit(TickedFrame({ deltaTimeMs: 250 })),
      expectGpuProperties(1.5),
    )
  })

  test('waiting keeps the configured canvas composition mounted', () => {
    scene(
      { update, view: testView },
      given(WaitingNoiseBeams({ seed })),
      expect(role('img', { name: NOISE_BEAMS_ACCESSIBLE_LABEL })).toExist(),
      expectGpuProperties(0),
      expect(text('Starting WebGPU…')).toExist(),
    )
  })

  test('waits for a generated seed before mounting WebGPU', () => {
    scene(
      { update, view: testView },
      given(GeneratingNoiseBeams()),
      expect(text('Choosing a noise seed…')).toExist(),
    )
  })

  test('explains when WebGPU is unavailable', () => {
    scene(
      { update, view: testView },
      given(UnsupportedRenderer()),
      expect(role('alert')).toHaveText(
        'WebGPU is not available in this browser. Open the scene in a modern WebGPU-enabled browser.',
      ),
    )
  })

  test('explains when WebGPU initialization fails', () => {
    scene(
      { update, view: testView },
      given(FailedRenderer({ reason: 'Device request failed' })),
      expect(role('alert')).toHaveText(
        'WebGPU could not start: Device request failed',
      ),
    )
  })
})
