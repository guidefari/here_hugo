import { Option } from 'effect'
import {
  Command,
  changeFiles,
  click,
  expect,
  given,
  role,
  scene,
} from 'foldkit/scene'
import { fromString } from 'foldkit/url'
import { describe, test } from 'vitest'

import { GotNoiseBeamsMessage, init, update, view } from './app'
import { FailedLoadImage } from './scenes/image-mosaic/message'
import { LoadImage } from './scenes/image-mosaic/update'
import { CompletedGenerateNoiseSeed } from './scenes/noise-beams/message'

const modelAt = (path: string) =>
  init(
    { theme: { preference: 'System', systemColorScheme: 'Dark' } },
    Option.getOrThrow(fromString(`https://effect-art.test${path}`)),
  ).model

describe('application view', () => {
  test('mounts the mirror and lifts camera controls without prompting on arrival', () => {
    scene(
      { update, view },
      given(modelAt('/scenes/mosaic-mirror')),
      expect(role('heading', { name: 'Mosaic Mirror', level: 1 })).toExist(),
      expect(role('link', { name: 'Mosaic Mirror' })).toHaveAttr(
        'aria-current',
        'page',
      ),
      expect(role('status')).toHaveText('Camera off'),
      click(role('button', { name: 'Start camera' })),
      expect(role('button', { name: 'Stop camera' })).toExist(),
      click(role('button', { name: 'Stop camera' })),
      expect(role('status')).toHaveText('Camera off'),
    )
  })
  test('lifts image selection commands and handles their results', () => {
    const file = new File(['not an image'], 'broken.txt')
    scene(
      { update, view },
      given(modelAt('/scenes/image-mosaic')),
      changeFiles('#mosaic-file', [file]),
      expect(role('status')).toHaveText('Decoding image…'),
      Command.resolve(
        LoadImage,
        FailedLoadImage({ file, revision: 1, reason: 'Unsupported image' }),
      ),
      expect(role('alert')).toHaveText('Unsupported image'),
    )
  })
  test('mounts the image mosaic scene at its route', () => {
    scene(
      { update, view },
      given(modelAt('/scenes/image-mosaic')),
      expect(role('heading', { name: 'Image Mosaic', level: 1 })).toExist(),
      expect(role('link', { name: 'Image Mosaic' })).toHaveAttr(
        'aria-current',
        'page',
      ),
    )
  })
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
      expect(role('link', { name: 'Read the graphics series' })).toHaveAttr(
        'href',
        'http://localhost:1414/webgpu-webgl-typegpu-threejs-shaders/',
      ),
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
