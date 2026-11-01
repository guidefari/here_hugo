import { Effect, Option, Schema } from 'effect'

import { ImageSegmenter } from '@mediapipe/tasks-vision'
import wasmLoaderPath from '@mediapipe/tasks-vision/vision_wasm_module_internal.js?url'
import wasmBinaryPath from '@mediapipe/tasks-vision/vision_wasm_module_internal.wasm?url'

import { sampleMask } from '../engine/grid'
import { Density } from '../model'
import { Failure, Ready, Segmented } from './protocol'

const Frame = Schema.Struct({
  bitmap: Schema.instanceOf(ImageBitmap),
  density: Density,
  timestamp: Schema.Number,
})

const initialize = Effect.tryPromise({
  try: () =>
    ImageSegmenter.createFromOptions(
      { wasmLoaderPath, wasmBinaryPath },
      {
        baseOptions: {
          modelAssetPath: new URL(
            '/models/selfie_segmenter.tflite',
            self.location.origin,
          ).href,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      },
    ),
  catch: () =>
    Failure({
      reason:
        'The person model could not load. Check your connection and try again.',
    }),
})

const task = Effect.runPromise(
  initialize.pipe(
    Effect.match({
      onFailure: failure => {
        self.postMessage(failure)

        return Option.none<ImageSegmenter>()
      },
      onSuccess: segmenter => {
        self.postMessage(Ready())

        return Option.some(segmenter)
      },
    }),
  ),
)

self.onmessage = (event: MessageEvent<unknown>): void => {
  const maybeFrame = Schema.decodeUnknownOption(Frame)(event.data)

  Option.match(maybeFrame, {
    onNone: () =>
      self.postMessage(
        Failure({
          reason: 'The camera sent an invalid frame. Please restart it.',
        }),
      ),
    onSome: frame => {
      Effect.runFork(
        Effect.promise(() => task).pipe(
          Effect.flatMap(maybeSegmenter =>
            Effect.sync(() => {
              try {
                Option.match(maybeSegmenter, {
                  onNone: () => undefined,
                  onSome: segmenter =>
                    segmenter.segmentForVideo(
                      frame.bitmap,
                      frame.timestamp,
                      result => {
                        const mask = result.confidenceMasks?.[0]

                        if (mask === undefined) {
                          self.postMessage(
                            Failure({
                              reason:
                                'No person mask was returned. Please restart the camera.',
                            }),
                          )

                          return
                        }

                        self.postMessage(
                          Segmented({
                            density: frame.density,
                            grid: sampleMask(
                              mask.getAsFloat32Array(),
                              mask.width,
                              mask.height,
                              frame.density,
                            ),
                          }),
                        )
                      },
                    ),
                })
              } catch {
                self.postMessage(
                  Failure({
                    reason:
                      'Person detection stopped. Please restart the camera.',
                  }),
                )
              } finally {
                frame.bitmap.close()
              }
            }),
          ),
        ),
      )
    },
  })
}
