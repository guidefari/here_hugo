import { Effect, Schema } from 'effect'
import * as File from 'foldkit/file'

import { MAXIMUM_FILE_BYTES, MAXIMUM_IMAGE_EDGE } from './constants'
import { sampleGrid } from './engine/mosaic'
import type { SourceImage } from './model'

class ImageError extends Schema.TaggedError<ImageError>()('ImageError', {
  reason: Schema.String,
}) {}

const decodeImage = (dataUrl: string) =>
  Effect.tryPromise({
    try: async () => {
      const image = new Image()
      image.src = dataUrl
      await image.decode()

      return image
    },
    catch: () =>
      new ImageError({
        reason:
          'This browser could not decode that image. Try PNG, JPEG, WebP, AVIF, GIF, or SVG. HEIC and RAW support depends on your browser.',
      }),
  })

const rasterize = (image: HTMLImageElement) =>
  Effect.try({
    try: () => {
      const scale = Math.min(
        1,
        MAXIMUM_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight),
      )

      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d', { willReadFrequently: true })

      if (!context) {
        throw new Error('Canvas unavailable')
      }

      context.drawImage(image, 0, 0, width, height)

      return { canvas, context, width, height }
    },
    catch: () =>
      new ImageError({
        reason:
          'The image could not be processed. Try a smaller image or export it as PNG or JPEG.',
      }),
  })

export const loadImage = Effect.fn('ImageMosaic.loadImage')(function* (
  file: File.File,
) {
  if (file.size > MAXIMUM_FILE_BYTES) {
    return yield* new ImageError({
      reason: 'Choose an image smaller than 25 MB.',
    })
  }

  const dataUrl = yield* File.readAsDataUrl(file).pipe(
    Effect.mapError(
      () =>
        new ImageError({
          reason: 'The file could not be read. Please select it again.',
        }),
    ),
  )

  const image = yield* decodeImage(dataUrl)
  const { canvas, width, height } = yield* rasterize(image)

  const preview = yield* Effect.try({
    try: () => canvas.toDataURL('image/png'),
    catch: () =>
      new ImageError({
        reason:
          'This image cannot be sampled safely. Export it as PNG or JPEG and try again.',
      }),
  })

  return { file, name: file.name, dataUrl: preview, width, height }
})

export const sampleImage = Effect.fn('ImageMosaic.sampleImage')(function* (
  source: SourceImage,
  density: number,
) {
  const image = yield* decodeImage(source.dataUrl)
  const { context, width, height } = yield* rasterize(image)

  return yield* Effect.try({
    try: () => {
      const pixels = context.getImageData(0, 0, width, height).data

      return sampleGrid({ width, height, pixels }, density)
    },
    catch: () =>
      new ImageError({
        reason: 'The colors could not be sampled. Try another image.',
      }),
  })
})
