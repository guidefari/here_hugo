import { Schema } from 'effect'
import * as File from 'foldkit/file'
import { defineMessageUnion } from 'foldkit/message'

import { FillMode } from './engine/background'
import { MosaicOutput, SourceImage } from './model'

export const MotionControl = Schema.Literals([
  'intensity',
  'horizontalWeight',
  'verticalWeight',
])

export type MotionControl = typeof MotionControl.Type

export const Message = defineMessageUnion({
  SelectedImages: { files: Schema.Array(File.File) },
  UpdatedBackgroundMode: {
    mode: FillMode,
  },
  UpdatedBackgroundColor: {
    value: Schema.String,
  },
  UpdatedMotionControl: {
    control: MotionControl,
    value: Schema.String,
  },
  ScrolledMotionControl: {
    control: MotionControl,
    direction: Schema.Number,
  },
  ClickedReshuffle: {},
  ClickedDownloadPng: {},
  SucceededExportMosaicPng: {},
  FailedExportMosaicPng: {
    reason: Schema.String,
  },
  CompletedGenerateMotionSeed: {
    file: File.File,
    revision: Schema.Number,
    seed: Schema.Number,
  },
  UpdatedDensity: { value: Schema.String },
  CompletedLoadImage: {
    revision: Schema.Number,
    source: SourceImage,
  },
  FailedLoadImage: {
    file: File.File,
    revision: Schema.Number,
    reason: Schema.String,
  },
  CompletedSampleImage: {
    file: File.File,
    revision: Schema.Number,
    output: MosaicOutput,
  },
  FailedSampleImage: {
    file: File.File,
    revision: Schema.Number,
    reason: Schema.String,
  },
})

export type Message = typeof Message.Type

export const {
  SelectedImages,
  UpdatedBackgroundMode,
  UpdatedBackgroundColor,
  UpdatedMotionControl,
  ScrolledMotionControl,
  ClickedReshuffle,
  ClickedDownloadPng,
  SucceededExportMosaicPng,
  FailedExportMosaicPng,
  CompletedGenerateMotionSeed,
  UpdatedDensity,
  CompletedLoadImage,
  FailedLoadImage,
  CompletedSampleImage,
  FailedSampleImage,
} = Message
