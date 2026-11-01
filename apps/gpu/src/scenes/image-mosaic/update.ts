import { Array, Effect, Match, Option, Predicate, Random, Schema } from 'effect'
import { Command, Runtime, Update } from 'foldkit'
import * as File from 'foldkit/file'
import { modifyFields } from 'foldkit/struct'

import { HexColor, transparentBackground } from './engine/background'
import { renderMosaic } from './engine/mosaic'
import { stationaryMotion } from './engine/motion'
import { downloadMosaicPng, mosaicFileName } from './export'
import { loadImage, sampleImage } from './image'
import {
  CompletedGenerateMotionSeed,
  CompletedLoadImage,
  CompletedSampleImage,
  FailedExportMosaicPng,
  FailedLoadImage,
  FailedSampleImage,
  Message,
  MotionControl,
  SucceededExportMosaicPng,
} from './message'
import {
  Density,
  ExportingPng,
  FailedExport,
  FailedImage,
  IdleExport,
  LoadingImage,
  Model,
  ProcessingImage,
  ReadyImage,
  SourceImage,
  WaitingImage,
} from './model'

export const LoadImage = Command.define('LoadImage', {
  args: { file: File.File, revision: Schema.Number },
  messages: [CompletedLoadImage, FailedLoadImage],
  execute: ({ file, revision }) =>
    loadImage(file).pipe(
      Effect.map(source => CompletedLoadImage({ revision, source })),
      Effect.catch(({ reason }) =>
        Effect.succeed(FailedLoadImage({ file, revision, reason })),
      ),
    ),
})

export const SampleImage = Command.define('SampleImage', {
  args: { source: SourceImage, density: Density, revision: Schema.Number },
  messages: [CompletedSampleImage, FailedSampleImage],
  execute: ({ source, density, revision }) =>
    sampleImage(source, density).pipe(
      Effect.flatMap(grid =>
        Random.nextIntBetween(0, 2_147_483_647).pipe(
          Effect.map(seed =>
            CompletedSampleImage({
              file: source.file,
              revision,
              output: { grid, seed },
            }),
          ),
        ),
      ),
      Effect.catch(({ reason }) =>
        Effect.succeed(
          FailedSampleImage({ file: source.file, revision, reason }),
        ),
      ),
    ),
})

export const GenerateMotionSeed = Command.define('GenerateMotionSeed', {
  args: { file: File.File, revision: Schema.Number },
  messages: [CompletedGenerateMotionSeed],
  execute: ({ file, revision }) =>
    Random.nextIntBetween(0, 2_147_483_647).pipe(
      Effect.map(seed => CompletedGenerateMotionSeed({ file, revision, seed })),
      Effect.catch(() =>
        Effect.succeed(
          CompletedGenerateMotionSeed({ file, revision, seed: 0 }),
        ),
      ),
    ),
})

export const ExportMosaicPng = Command.define('ExportMosaicPng', {
  args: {
    svg: Schema.String,
    width: Schema.Number,
    height: Schema.Number,
    fileName: Schema.String,
  },
  messages: [SucceededExportMosaicPng, FailedExportMosaicPng],
  execute: args =>
    downloadMosaicPng(args).pipe(
      Effect.as(SucceededExportMosaicPng()),
      Effect.catch(({ reason }) =>
        Effect.succeed(FailedExportMosaicPng({ reason })),
      ),
    ),
})

export const init: Runtime.ApplicationInit<Model, Message> = () => ({
  model: {
    background: transparentBackground,
    motion: stationaryMotion,
    densityInput: '32',
    density: 32,
    revision: 0,
    exportState: IdleExport(),
    state: WaitingImage(),
  },
})

type UpdateReturn = Update.Return<Model, Message>

const withUpdateReturn = Match.withReturnType<UpdateReturn>()

const changeMotion = (
  model: Model,
  control: MotionControl,
  value: number,
): Model => {
  if (!Predicate.isTagged('ReadyImage')(model.state)) {
    return model
  }

  const maximum = control === 'intensity' ? 100 : 200

  if (!Number.isFinite(value)) {
    return model
  }

  const weight = Math.max(0, Math.min(maximum, Math.round(value)))

  return modifyFields(model, {
    motion: motion =>
      Match.value(control).pipe(
        Match.when('intensity', () =>
          modifyFields(motion, { intensity: () => weight }),
        ),
        Match.when('horizontalWeight', () =>
          modifyFields(motion, { horizontalWeight: () => weight }),
        ),
        Match.when('verticalWeight', () =>
          modifyFields(motion, { verticalWeight: () => weight }),
        ),
        Match.exhaustive,
      ),
  })
}

export const update = (model: Model, message: Message): UpdateReturn =>
  Match.value(message).pipe(
    withUpdateReturn,
    Match.tagsExhaustive({
      UpdatedBackgroundMode: ({ mode }) => ({
        model: modifyFields(model, {
          background: background =>
            modifyFields(background, { mode: () => mode }),
        }),
      }),
      UpdatedBackgroundColor: ({ value }) =>
        Option.match(Schema.decodeUnknownOption(HexColor)(value), {
          onNone: () => ({ model: model }),
          onSome: color => ({
            model: modifyFields(model, {
              background: () => ({ mode: 'Solid', color }),
            }),
          }),
        }),
      UpdatedMotionControl: ({ control, value }) => ({
        model: changeMotion(model, control, Number(value)),
      }),
      ScrolledMotionControl: ({ control, direction }) => ({
        model: changeMotion(
          model,
          control,
          model.motion[control] + Math.sign(direction),
        ),
      }),
      ClickedReshuffle: () => {
        if (!Predicate.isTagged('ReadyImage')(model.state)) {
          return { model: model }
        }

        const revision = model.revision + 1

        return {
          model: modifyFields(model, { revision: () => revision }),
          commands: [
            GenerateMotionSeed({ file: model.state.source.file, revision }),
          ],
        }
      },
      ClickedDownloadPng: () => {
        if (
          !Predicate.isTagged('ReadyImage')(model.state) ||
          Predicate.isTagged('ExportingPng')(model.exportState)
        ) {
          return { model: model }
        }

        const { source, output } = model.state

        return {
          model: modifyFields(model, { exportState: () => ExportingPng() }),
          commands: [
            ExportMosaicPng({
              svg: renderMosaic(
                output.grid,
                output.seed,
                model.motion,
                model.background,
              ),
              width: output.grid.width,
              height: output.grid.height,
              fileName: mosaicFileName(source.name, 'png'),
            }),
          ],
        }
      },
      SucceededExportMosaicPng: () => ({
        model: modifyFields(model, { exportState: () => IdleExport() }),
      }),
      FailedExportMosaicPng: ({ reason }) => ({
        model: modifyFields(model, {
          exportState: () => FailedExport({ reason }),
        }),
      }),
      CompletedGenerateMotionSeed: ({ file, revision, seed }) => {
        if (
          revision !== model.revision ||
          !Predicate.isTagged('ReadyImage')(model.state) ||
          model.state.source.file !== file
        ) {
          return { model: model }
        }

        const state = modifyFields(model.state, {
          output: output => modifyFields(output, { seed: () => seed }),
        })

        return { model: modifyFields(model, { state: () => state }) }
      },
      SelectedImages: ({ files }) =>
        Option.match(Array.head(files), {
          onNone: () => ({ model: model }),
          onSome: file => {
            const revision = model.revision + 1

            return {
              model: modifyFields(model, {
                revision: () => revision,
                exportState: () => IdleExport(),
                state: () => LoadingImage({ file }),
              }),
              commands: [LoadImage({ file, revision })],
            }
          },
        }),
      UpdatedDensity: ({ value }) =>
        Option.match(Schema.decodeUnknownOption(Density)(Number(value)), {
          onNone: () => ({
            model: modifyFields(model, { densityInput: () => value }),
          }),
          onSome: density => {
            if (density === model.density) {
              return {
                model: modifyFields(model, { densityInput: () => value }),
              }
            }

            if (
              Predicate.isTagged('ReadyImage')(model.state) ||
              Predicate.isTagged('ProcessingImage')(model.state)
            ) {
              const revision = model.revision + 1
              const source = model.state.source

              return {
                model: modifyFields(model, {
                  densityInput: () => value,
                  density: () => density,
                  revision: () => revision,
                  state: () => ProcessingImage({ source }),
                }),
                commands: [SampleImage({ source, density, revision })],
              }
            }

            return {
              model: modifyFields(model, {
                densityInput: () => value,
                density: () => density,
              }),
            }
          },
        }),
      CompletedLoadImage: ({ revision, source }) =>
        revision === model.revision &&
        Predicate.isTagged('LoadingImage')(model.state) &&
        model.state.file === source.file
          ? {
              model: modifyFields(model, {
                state: () => ProcessingImage({ source }),
              }),
              commands: [
                SampleImage({ source, density: model.density, revision }),
              ],
            }
          : { model: model },
      FailedLoadImage: ({ file, revision, reason }) =>
        revision === model.revision &&
        Predicate.isTagged('LoadingImage')(model.state) &&
        model.state.file === file
          ? {
              model: modifyFields(model, {
                state: () => FailedImage({ reason }),
              }),
            }
          : { model: model },
      CompletedSampleImage: ({ file, revision, output }) => {
        if (
          revision !== model.revision ||
          !Predicate.isTagged('ProcessingImage')(model.state) ||
          model.state.source.file !== file
        ) {
          return { model: model }
        }

        const source = model.state.source

        return {
          model: modifyFields(model, {
            state: () => ReadyImage({ source, output }),
          }),
        }
      },
      FailedSampleImage: ({ file, revision, reason }) =>
        revision === model.revision &&
        Predicate.isTagged('ProcessingImage')(model.state) &&
        model.state.source.file === file
          ? {
              model: modifyFields(model, {
                state: () => FailedImage({ reason }),
              }),
            }
          : { model: model },
    }),
  )
