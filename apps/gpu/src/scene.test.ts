import { Option } from 'effect'
import { expect, given, role, scene } from 'foldkit/scene'
import { fromString } from 'foldkit/url'
import { describe, test } from 'vitest'

import { GotNoiseBeamsMessage, init, update, view } from './app'
import { CompletedGenerateNoiseSeed } from './scenes/noise-beams/message'

const modelAt = (path: string) =>
  init(
    { theme: { preference: 'System', systemColorScheme: 'Dark' } },
    Option.getOrThrow(fromString(`https://effect-art.test${path}`)),
  ).model

describe('application view', () => {
  test('mounts Random Dots at the root route', () => {
    scene(
      { update, view },
      given(modelAt('/')),
      expect(role('heading', { name: 'Random Dots', level: 1 })).toExist(),
      expect(role('link', { name: 'Random Dots' })).toHaveAttr(
        'aria-current',
        'page',
      ),
    )
  })

  test('shows focused scene navigation and a separate theme control', () => {
    scene(
      { update, view },
      given(modelAt('/scenes/noise-beams')),
      expect(role('navigation', { name: 'Scene navigation' })).toExist(),
      expect(role('link', { name: 'Random Dots' })).toHaveAttr(
        'href',
        '/scenes/random-dots',
      ),
      expect(role('link', { name: 'Noise Beams' })).toHaveAttr(
        'aria-current',
        'page',
      ),
      expect(role('group', { name: 'Color theme' })).toExist(),
      expect(role('button', { name: 'System' })).toHaveAttr(
        'aria-pressed',
        'true',
      ),
    )
  })

  test('mounts the noise beams submodel at its route', () => {
    const seededModel = update(
      modelAt('/scenes/noise-beams'),
      GotNoiseBeamsMessage({
        message: CompletedGenerateNoiseSeed({ seed: 123_456 }),
      }),
    ).model

    scene(
      { update, view },
      given(seededModel),
      expect(role('heading', { name: 'Noise Beams', level: 1 })).toExist(),
      expect(
        role('img', {
          name: /live direct-overhead field of solid cylindrical rods/,
        }),
      ).toExist(),
    )
  })
})
