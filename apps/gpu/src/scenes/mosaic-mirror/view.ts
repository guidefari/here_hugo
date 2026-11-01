import { Match } from 'effect'
import { Submodel } from 'foldkit'
import { Html } from 'foldkit/html'

import type { Palette } from '../../theme'
import { hint } from '../../ui/controls'
import { sceneHeader, sceneMain } from '../../ui/scene'
import { cameraControls, controls } from './controls'
import { mirrorCanvas } from './element'
import {
  CompletedStartCamera,
  FailedCamera,
  Message,
  PausedCamera,
  ReceivedMask,
} from './message'
import type { Model } from './model'
import { isActive } from './update'

const status = (model: Model): string =>
  Match.value(model.state).pipe(
    Match.tagsExhaustive({
      Idle: () => 'Camera off',
      Starting: () => 'Loading the person model and waiting for camera access…',
      Running: () => 'Live · Processed on this device',
      Paused: () =>
        'Camera paused while this tab was hidden. Resume when ready.',
      Failed: () => 'Camera unavailable',
    }),
  )

export const view = Submodel.defineView<
  Model,
  Message,
  Readonly<{ palette: Palette }>
>((model, _inputs, h): Html => {
  const canvas = mirrorCanvas.withMessage(h)

  return h.main(
    [h.Class(sceneMain)],
    [
      sceneHeader(
        {
          number: '04',
          title: 'Mosaic Mirror',
          description:
            'Step into the grid. A live, two-color reflection of you.',
          status: status(model),
          announcesStatus: true,
        },
        h,
      ),
      h.div(
        [h.Class('grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]')],
        [
          controls(model, h),
          h.div(
            [h.Class('min-w-0 space-y-5')],
            [
              cameraControls(model, h),
              Match.value(model.state).pipe(
                Match.tagsExhaustive({
                  Idle: () => h.empty,
                  Starting: () => h.empty,
                  Running: () => h.empty,
                  Paused: () => h.empty,
                  Failed: ({ reason }) =>
                    h.p(
                      [
                        h.Role('alert'),
                        h.Class(
                          'rounded-control border border-[var(--theme-red)] p-4 text-sm',
                        ),
                      ],
                      [reason],
                    ),
                }),
              ),
              h.div(
                [
                  h.Role('img'),
                  h.AriaLabel(
                    'Live mosaic mirror: contrasting tiles follow your silhouette',
                  ),
                  h.Class(
                    'overflow-hidden rounded-surface border border-[var(--theme-border)]',
                  ),
                ],
                [
                  canvas([
                    h.Class('block w-full'),
                    canvas.Artwork({
                      grid: model.grid,
                      levels: model.levels,
                      settings: model.settings,
                    }),
                    canvas.Request({
                      mode: isActive(model) ? 'Active' : 'Stopped',
                      session: model.session,
                    }),
                    canvas.TimeMs(model.timeMs),
                    canvas.OnCameraStarted(detail =>
                      CompletedStartCamera(detail),
                    ),
                    canvas.OnCameraFailed(detail => FailedCamera(detail)),
                    canvas.OnCameraPaused(detail => PausedCamera(detail)),
                    canvas.OnMaskReceived(detail => ReceivedMask(detail)),
                  ]),
                ],
              ),
              h.div(
                [
                  h.Class(
                    'flex flex-wrap justify-between gap-2 type-meta text-[var(--theme-muted)]',
                  ),
                ],
                [
                  h.p([], [`${model.grid.columns} × ${model.grid.rows} tiles`]),
                  h.p([], ['Person segmentation · Adaptive frame rate']),
                ],
              ),
              h.p(
                [h.Class(hint)],
                [
                  'Your camera stays on this device. No recording, uploads, or microphone. Camera access needs HTTPS or localhost. Leaving this scene or hiding the tab stops the camera.',
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )
})
