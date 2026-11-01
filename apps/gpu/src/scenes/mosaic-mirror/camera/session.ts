import { Effect, Match, Option, Schema } from 'effect'

import { Grid } from '../engine/grid'
import { Response } from './protocol'

export type CameraCallbacks = Readonly<{
  ready: () => void
  mask: (density: number, grid: Grid) => void
  failed: (reason: string) => void
}>

export type CameraSession = Readonly<{
  capture: (timestamp: number, density: number) => void
  stop: () => void
}>

const cameraReason = (cause: unknown): string => {
  if (cause instanceof DOMException) {
    if (cause.name === 'NotAllowedError' || cause.name === 'SecurityError') {
      return 'Allow camera access in your browser, then try again. Camera access needs HTTPS or localhost.'
    }

    if (cause.name === 'NotFoundError') {
      return 'No camera was found. Connect a camera and try again.'
    }

    if (cause.name === 'NotReadableError') {
      return 'The camera is busy or unavailable. Close other camera apps and try again.'
    }
  }

  return 'The camera could not start. Check camera permissions and try again.'
}

export const openCamera = (
  callbacks: CameraCallbacks,
  signal: AbortSignal,
): Effect.Effect<CameraSession, string> =>
  Effect.tryPromise({
    try: async () => {
      const video = document.createElement('video')
      const capture = document.createElement('canvas')
      const context = capture.getContext('2d')

      const worker = new Worker(
        new URL('./segment.worker.ts', import.meta.url),
        { type: 'module' },
      )

      const state = {
        stopped: false,
        ready: false,
        busy: false,
        lastFrame: -1,
        lastVideoTime: -1,
        interval: 67,
        maybeStream: Option.none<MediaStream>(),
      }

      const stop = (): void => {
        state.stopped = true
        worker.terminate()
        Option.match(state.maybeStream, {
          onNone: () => undefined,
          onSome: stream => stream.getTracks().forEach(track => track.stop()),
        })
        video.pause()
        video.srcObject = null
        signal.removeEventListener('abort', stop)
      }

      signal.addEventListener('abort', stop, { once: true })
      worker.onerror = () => {
        if (!state.stopped) {
          stop()
          callbacks.failed(
            'The person-detection worker could not start. Try a current Safari or Chrome browser.',
          )
        }
      }

      worker.onmessage = (event: MessageEvent<unknown>) => {
        if (state.stopped) {
          return
        }

        Option.match(Schema.decodeUnknownOption(Response)(event.data), {
          onNone: () => {
            stop()
            callbacks.failed(
              'Person detection returned an invalid result. Please restart the camera.',
            )
          },
          onSome: response =>
            Match.value(response).pipe(
              Match.tagsExhaustive({
                Ready: () => {
                  state.ready = true

                  if (Option.isSome(state.maybeStream)) {
                    callbacks.ready()
                  }
                },
                Failure: ({ reason }) => {
                  stop()
                  callbacks.failed(reason)
                },
                Segmented: ({ density, grid }) => {
                  state.busy = false
                  state.interval = Math.max(
                    67,
                    Math.min(250, (performance.now() - state.lastFrame) * 1.1),
                  )

                  if (!document.hidden) {
                    callbacks.mask(density, grid)
                  }
                },
              }),
            ),
        })
      }

      try {
        if (
          signal.aborted ||
          context === null ||
          !navigator.mediaDevices?.getUserMedia
        ) {
          throw new DOMException('Camera unavailable', 'NotAllowedError')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        })

        state.maybeStream = Option.some(stream)

        if (state.stopped || signal.aborted) {
          stop()

          return { stop, capture: () => undefined }
        }

        stream.getVideoTracks().forEach(track =>
          track.addEventListener(
            'ended',
            () => {
              if (!state.stopped) {
                stop()
                callbacks.failed(
                  'Camera access ended. Start the camera to reconnect.',
                )
              }
            },
            { once: true },
          ),
        )
        video.muted = true
        video.playsInline = true
        video.srcObject = stream
        await video.play()

        if (state.stopped || signal.aborted) {
          stop()

          return { stop, capture: () => undefined }
        }

        if (state.ready) {
          callbacks.ready()
        }

        return {
          stop,
          capture: (timestamp: number, density: number) => {
            if (
              state.stopped ||
              !state.ready ||
              state.busy ||
              document.hidden ||
              video.readyState < 2 ||
              video.currentTime === state.lastVideoTime ||
              performance.now() - state.lastFrame < state.interval
            ) {
              return
            }

            state.busy = true
            state.lastFrame = performance.now()
            state.lastVideoTime = video.currentTime
            Effect.runFork(
              Effect.tryPromise({
                try: async () => {
                  const scale =
                    256 / Math.max(video.videoWidth, video.videoHeight)

                  capture.width = Math.max(
                    1,
                    Math.round(video.videoWidth * scale),
                  )
                  capture.height = Math.max(
                    1,
                    Math.round(video.videoHeight * scale),
                  )
                  context.drawImage(video, 0, 0, capture.width, capture.height)
                  const bitmap = await createImageBitmap(capture)

                  if (state.stopped || signal.aborted) {
                    bitmap.close()

                    return
                  }

                  try {
                    worker.postMessage({ bitmap, density, timestamp }, [bitmap])
                  } catch (cause: unknown) {
                    bitmap.close()
                    throw cause
                  }
                },
                catch: () =>
                  'This browser could not capture a camera frame. Please restart the camera.',
              }).pipe(
                Effect.match({
                  onFailure: reason => {
                    if (!state.stopped) {
                      stop()
                      callbacks.failed(reason)
                    }
                  },
                  onSuccess: () => undefined,
                }),
              ),
            )
          },
        }
      } catch (cause: unknown) {
        stop()
        throw cause
      }
    },
    catch: cameraReason,
  })
