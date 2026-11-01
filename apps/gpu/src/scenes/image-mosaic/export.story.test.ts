import { Command, given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import { transparentBackground } from './engine/background'
import { stationaryMotion } from './engine/motion'
import { mosaicFileName } from './export'
import {
  ClickedDownloadPng,
  FailedExportMosaicPng,
  SucceededExportMosaicPng,
} from './message'
import {
  ExportingPng,
  FailedExport,
  IdleExport,
  Model,
  ReadyImage,
} from './model'
import { sampledOutput } from './testFixtures'
import { ExportMosaicPng, init, update } from './update'

const source = {
  file: new File(['image'], 'holiday.photo.png'),
  name: 'holiday.photo.png',
  dataUrl: 'data:image/png,test',
  width: 400,
  height: 200,
}

const ready: Model = {
  background: transparentBackground,
  motion: stationaryMotion,
  densityInput: '32',
  density: 32,
  revision: 1,
  exportState: IdleExport(),
  state: ReadyImage({ source, output: sampledOutput() }),
}

describe('mosaic download', () => {
  test('exports the rendered mosaic as a PNG at the sampled size', () => {
    const { model: next, commands: commands = [] } = update(
      ready,
      ClickedDownloadPng(),
    )

    expect(next.exportState).toEqual(ExportingPng())
    expect(commands[0]?.args).toMatchObject({
      width: 400,
      height: 200,
      fileName: 'holiday.photo-mosaic.png',
    })
    expect(commands[0]?.args).toHaveProperty(
      'svg',
      expect.stringContaining('<svg'),
    )
  })

  test('returns to idle after a successful export', () => {
    story(
      update,
      given(ready),
      message(ClickedDownloadPng()),
      Command.resolve(ExportMosaicPng, SucceededExportMosaicPng()),
      model(next => expect(next.exportState).toEqual(IdleExport())),
      Command.expectNone(),
    )
  })

  test('keeps the failure reason when the export fails', () => {
    story(
      update,
      given(ready),
      message(ClickedDownloadPng()),
      Command.resolve(
        ExportMosaicPng,
        FailedExportMosaicPng({ reason: 'No canvas' }),
      ),
      model(next =>
        expect(next.exportState).toEqual(FailedExport({ reason: 'No canvas' })),
      ),
    )
  })

  test('ignores downloads before a mosaic exists or while one is running', () => {
    expect(update(init().model, ClickedDownloadPng()).model).toEqual(
      init().model,
    )

    const exporting = { ...ready, exportState: ExportingPng() }
    expect(update(exporting, ClickedDownloadPng()).commands ?? []).toEqual([])
  })

  test('names downloads after the source file', () => {
    expect(mosaicFileName('cat.jpeg', 'svg')).toBe('cat-mosaic.svg')
    expect(mosaicFileName('.png', 'png')).toBe('image-mosaic.png')
  })
})
