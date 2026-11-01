import { Match } from 'effect'
import { Submodel } from 'foldkit'
import { Html } from 'foldkit/html'

import * as Theme from '../../theme'
import { sceneHeader, sceneMain } from '../../ui/scene'
import { randomDotsGpuCanvas } from './gpu/element'
import {
  DetectedUnsupportedRenderer,
  FailedInitializeRenderer,
  Message,
} from './message'
import type { Model, PanelArtwork } from './model'

const pointCountFormatter = new Intl.NumberFormat('en-US')

type GpuCanvasInput = Readonly<{
  artworkId: string
  panels: ReadonlyArray<PanelArtwork>
  visibleCountPerPanel: number
  pointCountPerPanel: number
}>

const emptyGpuCanvasInput: GpuCanvasInput = {
  artworkId: '',
  panels: [],
  visibleCountPerPanel: 0,
  pointCountPerPanel: 0,
}

const gpuCanvasInput = (model: Model): GpuCanvasInput =>
  Match.value(model).pipe(
    Match.tagsExhaustive({
      WaitingDots: () => emptyGpuCanvasInput,
      GeneratingDots: () => emptyGpuCanvasInput,
      DrawingDots: ({
        artworkId,
        panels,
        visibleCountPerPanel,
        pointCountPerPanel,
      }) => ({
        artworkId,
        panels,
        visibleCountPerPanel,
        pointCountPerPanel,
      }),
      ReadyDots: ({ artworkId, panels, pointCountPerPanel }) => ({
        artworkId,
        panels,
        visibleCountPerPanel: pointCountPerPanel,
        pointCountPerPanel,
      }),
      FailedDots: () => emptyGpuCanvasInput,
      UnsupportedRenderer: () => emptyGpuCanvasInput,
      FailedRenderer: () => emptyGpuCanvasInput,
    }),
  )

const statusText = (model: Model): string =>
  Match.value(model).pipe(
    Match.tagsExhaustive({
      WaitingDots: () => 'Waiting to draw',
      GeneratingDots: () => 'Choosing random dot fields…',
      DrawingDots: ({ visibleCountPerPanel, pointCountPerPanel }) =>
        `${pointCountFormatter.format(visibleCountPerPanel)} / ${pointCountFormatter.format(pointCountPerPanel)} points per panel`,
      ReadyDots: ({ pointCountPerPanel }) =>
        `${pointCountFormatter.format(pointCountPerPanel)} points per panel`,
      FailedDots: () => 'Could not draw the points',
      UnsupportedRenderer: () => 'WebGPU unavailable',
      FailedRenderer: () => 'Could not initialize WebGPU',
    }),
  )

type ViewInputs = Readonly<{ palette: Theme.Palette }>

export const view = Submodel.defineView<Model, Message, ViewInputs>(
  (model, { palette }, h): Html => {
    const gpuCanvas = randomDotsGpuCanvas.withMessage(h)
    const gpuInput = gpuCanvasInput(model)

    const gpuArtworkView = () =>
      h.div(
        [
          h.Role('img'),
          h.AriaLabel(
            'Four animated random dot distribution studies on a white square canvas',
          ),
          h.Class(
            'w-[600px] max-w-full overflow-hidden rounded-surface border border-[var(--theme-border)]',
          ),
        ],
        [
          gpuCanvas([
            h.Class('block w-full'),
            gpuCanvas.ArtworkId(gpuInput.artworkId),
            gpuCanvas.Palette(palette),
            gpuCanvas.Panels(gpuInput.panels),
            gpuCanvas.VisibleCountPerPanel(gpuInput.visibleCountPerPanel),
            gpuCanvas.PointCountPerPanel(gpuInput.pointCountPerPanel),
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
        WaitingDots: gpuArtworkView,
        GeneratingDots: gpuArtworkView,
        DrawingDots: gpuArtworkView,
        ReadyDots: gpuArtworkView,
        FailedDots: gpuArtworkView,
        UnsupportedRenderer: unsupportedRendererView,
        FailedRenderer: ({ reason }) => failedRendererView(reason),
      }),
    )

    return h.main(
      [h.Class(sceneMain)],
      [
        sceneHeader(
          {
            number: '01',
            title: 'Random Dots',
            description:
              'Four random dot fields, drawn point by point on a square canvas.',
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
