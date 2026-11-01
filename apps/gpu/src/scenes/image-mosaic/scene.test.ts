import {
  Command,
  changeFiles,
  click,
  dropFiles,
  expect,
  given,
  role,
  scene,
  text,
  type as typeInput,
  withViewInputs,
} from 'foldkit/scene'
import { test } from 'vitest'

import { darkPalette } from '../../theme'
import { transparentBackground } from './engine/background'
import { stationaryMotion } from './engine/motion'
import {
  CompletedLoadImage,
  CompletedSampleImage,
  SucceededExportMosaicPng,
} from './message'
import { FailedImage, IdleExport, ReadyImage } from './model'
import { sampledOutput } from './testFixtures'
import { ExportMosaicPng, LoadImage, SampleImage, init, update } from './update'
import { view } from './view'

const testView = withViewInputs(view, { palette: darkPalette })()

test('selects a canvas fill and switches back to transparency', () => {
  scene(
    { update, view: testView },
    given(init().model),
    typeInput('#mosaic-background-color', '#123456'),
    expect(role('button', { name: 'Solid background' })).toHaveAttr(
      'aria-pressed',
      'true',
    ),
    click(role('button', { name: 'Transparent background' })),
    expect(role('button', { name: 'Transparent background' })).toHaveAttr(
      'aria-pressed',
      'true',
    ),
  )
})

const source = {
  file: new File(['image'], 'test.png'),
  name: 'test.png',
  dataUrl: 'data:image/png,test',
  width: 400,
  height: 200,
}

test('shows progress and both previews through the image picker', () => {
  scene(
    { update, view: testView },
    given(init().model),
    changeFiles('#mosaic-file', [source.file]),
    expect(role('status')).toHaveText('Decoding image…'),
    Command.resolve(LoadImage, CompletedLoadImage({ revision: 1, source })),
    expect(role('status')).toHaveText('Sampling colors…'),
    expect(role('img', { name: 'Original: test.png' })).toExist(),
    Command.resolve(
      SampleImage,
      CompletedSampleImage({
        file: source.file,
        revision: 1,
        output: sampledOutput(),
      }),
    ),
    expect(
      role('img', { name: 'Sampled mosaic, 32 columns by 16 rows' }),
    ).toExist(),
  )
})

test('validates custom density and lets a preset restore valid input', () => {
  scene(
    { update, view: testView },
    given(init().model),
    typeInput(role('spinbutton', { name: 'Custom' }), '257'),
    expect(role('spinbutton', { name: 'Custom' })).toHaveAttr(
      'aria-invalid',
      'true',
    ),
    expect(
      text(
        'Enter a whole number from 1 to 256. The last valid grid is still shown.',
      ),
    ).toExist(),
    click(role('button', { name: '64' })),
    expect(role('spinbutton', { name: 'Custom' })).toHaveAttr(
      'aria-invalid',
      'false',
    ),
    expect(role('button', { name: '64' })).toHaveAttr('aria-pressed', 'true'),
  )
})

test('offers an image picker and suggested grid sizes', () => {
  scene(
    { update, view: testView },
    given(init().model),
    expect(role('heading', { name: 'Image Mosaic', level: 1 })).toExist(),
    expect(role('button', { name: '32' })).toExist(),
    expect(text('Your images stay on this device.')).toExist(),
    expect(role('slider', { name: 'Intensity' })).toHaveAttr('disabled'),
  )
})

test('shows both the original and the sampled mosaic', () => {
  scene(
    { update, view: testView },
    given({
      background: transparentBackground,
      motion: stationaryMotion,
      densityInput: '32',
      density: 32,
      revision: 1,
      exportState: IdleExport(),
      state: ReadyImage({
        source: {
          file: new File(['image'], 'test.png'),
          name: 'test.png',
          dataUrl: 'data:image/png,test',
          width: 400,
          height: 200,
        },
        output: sampledOutput(),
      }),
    }),
    expect(role('img', { name: 'Original: test.png' })).toExist(),
    expect(
      role('img', { name: 'Sampled mosaic, 32 columns by 16 rows' }),
    ).toExist(),
    expect(role('link', { name: 'Download SVG' })).toHaveAttr(
      'download',
      'test-mosaic.svg',
    ),
    click(role('button', { name: 'Download PNG' })),
    expect(role('button', { name: 'Preparing PNG…' })).toHaveAttr('disabled'),
    Command.resolve(ExportMosaicPng, SucceededExportMosaicPng()),
    expect(role('button', { name: 'Download PNG' })).toExist(),
  )
})

test('explains decoding failures', () => {
  scene(
    { update, view: testView },
    given({
      background: transparentBackground,
      motion: stationaryMotion,
      densityInput: '32',
      density: 32,
      revision: 1,
      exportState: IdleExport(),
      state: FailedImage({ reason: 'Try PNG or JPEG.' }),
    }),
    expect(role('alert')).toHaveText('Try PNG or JPEG.'),
  )
})

test('loads a picture dropped onto the empty original panel', () => {
  scene(
    { update, view: testView },
    given(init().model),
    expect(text('or drop one here')).toExist(),
    dropFiles('label.mosaic-preview', [source.file]),
    expect(role('status')).toHaveText('Decoding image…'),
    Command.resolve(LoadImage, CompletedLoadImage({ revision: 1, source })),
    Command.resolve(
      SampleImage,
      CompletedSampleImage({
        file: source.file,
        revision: 1,
        output: sampledOutput(),
      }),
    ),
    expect(role('img', { name: 'Original: test.png' })).toExist(),
  )
})
