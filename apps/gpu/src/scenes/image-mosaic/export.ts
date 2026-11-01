import { Effect, Schema } from 'effect'

class ExportError extends Schema.TaggedError<ExportError>()('ExportError', {
  reason: Schema.String,
}) {}

type PngExport = Readonly<{
  svg: string
  width: number
  height: number
  fileName: string
}>

export const mosaicFileName = (sourceName: string, extension: string) =>
  `${sourceName.replace(/\.[^.]+$/, '') || 'image'}-mosaic.${extension}`

export const svgDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

const rasterizeSvg = ({ svg, width, height }: PngExport) =>
  Effect.tryPromise({
    try: async () => {
      const image = new Image()
      image.src = svgDataUrl(svg)
      await image.decode()

      const canvas = document.createElement('canvas')
      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Canvas unavailable')
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      return await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          blob => (blob ? resolve(blob) : reject(new Error('Empty PNG'))),
          'image/png',
        ),
      )
    },
    catch: () =>
      new ExportError({
        reason: 'The PNG could not be created. Try the SVG download instead.',
      }),
  })

const saveBlob = Effect.fn('ImageMosaic.saveBlob')(function* (
  blob: Blob,
  fileName: string,
) {
  const url = yield* Effect.sync(() => URL.createObjectURL(blob))

  yield* Effect.try({
    try: () => {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
    },
    catch: () =>
      new ExportError({ reason: 'The browser blocked the download.' }),
  }).pipe(
    Effect.ensuring(
      Effect.sleep(1000).pipe(
        Effect.andThen(Effect.sync(() => URL.revokeObjectURL(url))),
      ),
    ),
  )
})

export const downloadMosaicPng = Effect.fn('ImageMosaic.downloadMosaicPng')(
  function* (pngExport: PngExport) {
    const blob = yield* rasterizeSvg(pngExport)
    yield* saveBlob(blob, pngExport.fileName)
  },
)
