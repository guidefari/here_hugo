import { Effect } from 'effect'
import { Command, given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import { MAXIMUM_FILE_BYTES } from './constants'
import { transparentBackground } from './engine/background'
import { stationaryMotion } from './engine/motion'
import {
  CompletedLoadImage,
  CompletedSampleImage,
  FailedLoadImage,
  FailedSampleImage,
  SelectedImages,
  UpdatedDensity,
} from './message'
import {
  FailedImage,
  IdleExport,
  LoadingImage,
  Model,
  ProcessingImage,
  ReadyImage,
  WaitingImage,
} from './model'
import { sampledOutput } from './testFixtures'
import { LoadImage, SampleImage, init, update } from './update'

const source = {
  file: new File(['image'], 'test.png'),
  name: 'test.png',
  dataUrl: 'data:image/png;base64,test',
  width: 400,
  height: 200,
}

const output = sampledOutput()

describe('image mosaic update', () => {
  test('rejects oversized files through the real loading command', async () => {
    const file = new File([new Uint8Array(MAXIMUM_FILE_BYTES + 1)], 'large.png')

    const result = await Effect.runPromise(
      LoadImage({ file, revision: 1 }).effect,
    )

    expect(result).toEqual(
      FailedLoadImage({
        file,
        revision: 1,
        reason: 'Choose an image smaller than 25 MB.',
      }),
    )
  })
  test('starts empty with a suggested density', () => {
    expect(init().model).toEqual({
      background: transparentBackground,
      motion: stationaryMotion,
      densityInput: '32',
      density: 32,
      revision: 0,
      exportState: IdleExport(),
      state: WaitingImage(),
    })
  })

  test('loads and samples a selected file', () => {
    const initial = init().model
    story(
      update,
      given(initial),
      message(SelectedImages({ files: [source.file] })),
      model(next =>
        expect(next.state).toEqual(LoadingImage({ file: source.file })),
      ),
      Command.resolve(LoadImage, CompletedLoadImage({ revision: 1, source })),
      model(next => {
        expect(next.state).toEqual(ProcessingImage({ source }))
      }),
      Command.resolve(
        SampleImage,
        CompletedSampleImage({ file: source.file, revision: 1, output }),
      ),
      model(next => expect(next.state).toEqual(ReadyImage({ source, output }))),
    )
  })

  test('resamples a ready image', () => {
    story(
      update,
      given({
        background: transparentBackground,
        motion: stationaryMotion,
        densityInput: '32',
        density: 32,
        revision: 2,
        exportState: IdleExport(),
        state: ReadyImage({ source, output }),
      }),
      message(UpdatedDensity({ value: '64' })),
      model(next => expect(next.state).toEqual(ProcessingImage({ source }))),
      Command.resolve(
        SampleImage,
        CompletedSampleImage({
          file: source.file,
          revision: 3,
          output: sampledOutput(64),
        }),
      ),
      model(next => expect(next.state._tag).toBe('ReadyImage')),
    )
  })

  test('uses the latest density when decoding finishes', () => {
    const { model: next } = update(
      {
        background: transparentBackground,
        motion: stationaryMotion,
        densityInput: '32',
        density: 32,
        revision: 1,
        exportState: IdleExport(),
        state: LoadingImage({ file: source.file }),
      },
      UpdatedDensity({ value: '64' }),
    )

    const { model: processing, commands: commands = [] } = update(
      next,
      CompletedLoadImage({ revision: 1, source }),
    )

    expect(processing.density).toBe(64)
    expect(commands[0]?.args).toEqual({ source, density: 64, revision: 1 })
  })

  test('ignores stale sampling successes and failures', () => {
    const initial: Model = {
      background: transparentBackground,
      motion: stationaryMotion,
      densityInput: '64',
      density: 64,
      revision: 3,
      exportState: IdleExport(),
      state: ProcessingImage({ source }),
    }

    expect(
      update(
        initial,
        CompletedSampleImage({ file: source.file, revision: 2, output }),
      ).model,
    ).toEqual(initial)
    expect(
      update(
        initial,
        FailedSampleImage({
          file: source.file,
          revision: 2,
          reason: 'old failure',
        }),
      ).model,
    ).toEqual(initial)
  })

  test('surfaces loading and sampling failures', () => {
    expect(
      update(
        {
          background: transparentBackground,
          motion: stationaryMotion,
          densityInput: '32',
          density: 32,
          revision: 1,
          exportState: IdleExport(),
          state: LoadingImage({ file: source.file }),
        },
        FailedLoadImage({
          file: source.file,
          revision: 1,
          reason: 'bad image',
        }),
      ).model.state,
    ).toEqual(FailedImage({ reason: 'bad image' }))
    expect(
      update(
        {
          background: transparentBackground,
          motion: stationaryMotion,
          densityInput: '32',
          density: 32,
          revision: 2,
          exportState: IdleExport(),
          state: ProcessingImage({ source }),
        },
        FailedSampleImage({
          file: source.file,
          revision: 2,
          reason: 'bad sample',
        }),
      ).model.state,
    ).toEqual(FailedImage({ reason: 'bad sample' }))
  })

  test('rejects results for a previous selection even when revisions match after reentering the scene', () => {
    const file = new File(['new'], 'test.png')

    const loading: Model = {
      background: transparentBackground,
      motion: stationaryMotion,
      densityInput: '32',
      density: 32,
      revision: 1,
      exportState: IdleExport(),
      state: LoadingImage({ file }),
    }

    expect(
      update(loading, CompletedLoadImage({ revision: 1, source })).model,
    ).toEqual(loading)
    expect(
      update(
        loading,
        FailedLoadImage({
          file: source.file,
          revision: 1,
          reason: 'old error',
        }),
      ).model,
    ).toEqual(loading)

    const currentSource = {
      file,
      name: source.name,
      dataUrl: source.dataUrl,
      width: source.width,
      height: source.height,
    }

    const processing: Model = {
      background: transparentBackground,
      motion: stationaryMotion,
      densityInput: '32',
      density: 32,
      revision: 1,
      exportState: IdleExport(),
      state: ProcessingImage({ source: currentSource }),
    }

    expect(
      update(
        processing,
        CompletedSampleImage({ file: source.file, revision: 1, output }),
      ).model,
    ).toEqual(processing)
  })

  test.each(['', '0', '257', 'NaN', '2.5'])(
    'keeps the last valid density while editing invalid input %s',
    value => {
      const initial = init().model

      const { model: next, commands: commands = [] } = update(
        initial,
        UpdatedDensity({ value }),
      )

      expect(next.density).toBe(initial.density)
      expect(next.densityInput).toBe(value)
      expect(commands).toEqual([])
    },
  )

  test('ignores canceled file selection and stale loads', () => {
    const initial = init().model
    expect(update(initial, SelectedImages({ files: [] })).model).toEqual(
      initial,
    )
    expect(
      update(initial, CompletedLoadImage({ revision: 0, source })).model,
    ).toEqual(initial)
  })
})
