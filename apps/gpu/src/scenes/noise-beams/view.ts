import { Match } from 'effect'
import { Submodel } from 'foldkit'
import { Html } from 'foldkit/html'

import * as Theme from '../../theme'
import { sceneHeader, sceneMain } from '../../ui/scene'
import { NOISE_BEAM_FIELD } from './constants'
import { noiseBeamsGpuCanvas } from './gpu/element'
import {
  CompletedInitializeRenderer,
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
  Message,
} from './message'
import type { Model } from './model'

export const NOISE_BEAMS_ACCESSIBLE_LABEL =
  'A live direct-overhead field of solid cylindrical rods pivoting from fixed roots across every direction'

const statusText = (model: Model): string =>
  Match.value(model).pipe(
    Match.tagsExhaustive({
      GeneratingNoiseBeams: () => 'Choosing a noise seed…',
      WaitingNoiseBeams: () => 'Starting WebGPU…',
      DrawingNoiseBeams: () =>
        `${NOISE_BEAM_FIELD.grid.columns * NOISE_BEAM_FIELD.grid.rows} ground-rooted cylindrical rods pivoting in a direct-overhead 3D liquid field`,
      UnsupportedRenderer: () => 'WebGPU unavailable',
      FailedRenderer: () => 'Could not initialize WebGPU',
    }),
  )

type ViewInputs = Readonly<{ palette: Theme.Palette }>

export const view = Submodel.defineView<Model, Message, ViewInputs>(
  (model, { palette }, h): Html => {
    const gpuCanvas = noiseBeamsGpuCanvas.withMessage(h)

    const gpuArtworkView = (timeSeconds: number, seed: number) =>
      h.div(
        [
          h.Role('img'),
          h.AriaLabel(NOISE_BEAMS_ACCESSIBLE_LABEL),
          h.Class(
            'w-[1000px] max-w-full overflow-hidden rounded-surface border border-[var(--theme-border)]',
          ),
        ],
        [
          gpuCanvas([
            h.Class('block w-full'),
            gpuCanvas.TimeSeconds(timeSeconds),
            gpuCanvas.Seed(seed),
            gpuCanvas.Palette(palette),
            gpuCanvas.OnRendererReady(() => CompletedInitializeRenderer()),
            gpuCanvas.OnRendererUnsupported(() =>
              DetectedUnsupportedRenderer(),
            ),
            gpuCanvas.OnRendererFailed(({ reason }) =>
              FailedInitializeRenderer({ reason }),
            ),
          ]),
        ],
      )

    const unsupportedRendererView = () =>
      h.p(
        [h.Role('alert'), h.Class('max-w-lg text-center text-sm')],
        [
          'WebGPU is not available in this browser. Open the scene in a modern WebGPU-enabled browser.',
        ],
      )

    const failedRendererView = (reason: string) =>
      h.p(
        [h.Role('alert'), h.Class('max-w-lg text-center text-sm')],
        [`WebGPU could not start: ${reason}`],
      )

    const sceneContent = Match.value(model).pipe(
      Match.tagsExhaustive({
        GeneratingNoiseBeams: () => h.empty,
        WaitingNoiseBeams: ({ seed }) => gpuArtworkView(0, seed),
        DrawingNoiseBeams: ({ elapsedSeconds, seed }) =>
          gpuArtworkView(elapsedSeconds, seed),
        UnsupportedRenderer: unsupportedRendererView,
        FailedRenderer: ({ reason }) => failedRendererView(reason),
      }),
    )

    return h.main(
      [h.Class(sceneMain)],
      [
        sceneHeader(
          {
            number: '02',
            title: 'Noise Beams',
            description:
              'A field of rods, each one leaning wherever the noise flows.',
            status: statusText(model),
            announcesStatus: false,
          },
          h,
        ),
        h.div([h.Class('flex flex-col items-center')], [sceneContent]),
      ],
    )
  },
)
