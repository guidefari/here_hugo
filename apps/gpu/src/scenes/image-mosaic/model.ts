import { Schema } from 'effect'
import * as File from 'foldkit/file'
import { defineTaggedUnion } from 'foldkit/schema'

import { MAXIMUM_DENSITY } from './constants'
import { BackgroundFill } from './engine/background'
import { Grid } from './engine/mosaic'
import { Motion } from './engine/motion'

export const Density = Schema.Number.check(
  Schema.isInt(),
  Schema.isBetween({ minimum: 1, maximum: MAXIMUM_DENSITY }),
)

export const SourceImage = Schema.Struct({
  file: File.File,
  name: Schema.String,
  dataUrl: Schema.String,
  width: Schema.Number,
  height: Schema.Number,
})

export type SourceImage = typeof SourceImage.Type

export const MosaicOutput = Schema.Struct({
  grid: Grid,
  seed: Schema.Number,
})

export type MosaicOutput = typeof MosaicOutput.Type

export const ImageState = defineTaggedUnion({
  WaitingImage: {},
  LoadingImage: { file: File.File },
  ProcessingImage: { source: SourceImage },
  ReadyImage: { source: SourceImage, output: MosaicOutput },
  FailedImage: { reason: Schema.String },
})

export const {
  WaitingImage,
  LoadingImage,
  ProcessingImage,
  ReadyImage,
  FailedImage,
} = ImageState

export const ExportState = defineTaggedUnion({
  IdleExport: {},
  ExportingPng: {},
  FailedExport: { reason: Schema.String },
})

export const { IdleExport, ExportingPng, FailedExport } = ExportState

export const Model = Schema.Struct({
  background: BackgroundFill,
  motion: Motion,
  densityInput: Schema.String,
  density: Density,
  revision: Schema.Number,
  exportState: ExportState,
  state: ImageState,
})

export type Model = typeof Model.Type
