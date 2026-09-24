import { Option } from 'effect'
import { given, message, model, story } from 'foldkit/story'
import { fromString } from 'foldkit/url'
import { describe, expect, test } from 'vitest'

import {
  ChangedUrl,
  GotNoiseBeamsMessage,
  GotRandomDotsMessage,
  NoiseBeamsPage,
  init,
  update,
} from './app'
import {
  CompletedGenerateNoiseSeed,
  CompletedInitializeRenderer,
} from './scenes/noise-beams/message'
import {
  DrawingNoiseBeams,
  GeneratingNoiseBeams,
} from './scenes/noise-beams/model'
import { GenerateNoiseSeed } from './scenes/noise-beams/update'
import { CompletedGenerateDots } from './scenes/random-dots/message'

const urlAt = (path: string) =>
  Option.getOrThrow(fromString(`https://effect-art.test${path}`))

const modelAt = (path: string) =>
  init(
    { theme: { preference: 'System', systemColorScheme: 'Dark' } },
    urlAt(path),
  ).model

describe('application update', () => {
  test('folds lifted noise beams messages into the child model', () => {
    const initialModel = modelAt('/scenes/noise-beams')
    const seed = 123_456

    story(
      update,
      given(initialModel),
      message(
        GotNoiseBeamsMessage({
          message: CompletedGenerateNoiseSeed({ seed }),
        }),
      ),
      message(GotNoiseBeamsMessage({ message: CompletedInitializeRenderer() })),
      model(nextModel => {
        expect(nextModel.page).toStrictEqual(
          NoiseBeamsPage({
            model: DrawingNoiseBeams({ seed, elapsedSeconds: 0 }),
          }),
        )
      }),
    )
  })

  test('reinitializes noise beams only when entering its route', () => {
    const initialModel = modelAt('/scenes/noise-beams')
    const seed = 123_456

    const waitingModel = update(
      initialModel,
      GotNoiseBeamsMessage({
        message: CompletedGenerateNoiseSeed({ seed }),
      }),
    ).model

    const drawingModel = update(
      waitingModel,
      GotNoiseBeamsMessage({ message: CompletedInitializeRenderer() }),
    ).model

    const randomDotsModel = update(
      drawingModel,
      ChangedUrl({ url: urlAt('/') }),
    ).model

    const nextUpdate = update(
      randomDotsModel,
      ChangedUrl({ url: urlAt('/scenes/noise-beams') }),
    )

    expect(nextUpdate.model.page).toStrictEqual(
      NoiseBeamsPage({ model: GeneratingNoiseBeams() }),
    )
    expect(nextUpdate.commands?.map(command => command.name)).toStrictEqual([
      GenerateNoiseSeed.name,
    ])
  })

  test('ignores late child messages from an inactive scene', () => {
    const initialModel = modelAt('/scenes/noise-beams')

    const nextUpdate = update(
      initialModel,
      GotRandomDotsMessage({
        message: CompletedGenerateDots({ artworkId: 'late', panels: [] }),
      }),
    )

    expect(nextUpdate.model).toBe(initialModel)
    expect(nextUpdate.commands).toBeUndefined()
  })
})
