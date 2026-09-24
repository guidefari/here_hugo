import { Array, Effect, Match as M, Predicate, Random } from 'effect'
import { Command, Runtime, Update } from 'foldkit'
import { modifyFields } from 'foldkit/struct'

import {
  CANVAS_SIZE,
  DOT_COUNT_PER_PANEL,
  DOT_RADIUS_RATIO,
  DOT_REVEAL_DURATION_MS,
  DotPanelDefinition,
  PANEL_COLUMNS,
  PANEL_DEFINITIONS,
  PANEL_GAP,
  PANEL_PADDING,
} from './constants'
import { DotDistribution, Grid, relativeDensityAt } from './engine/distribution'
import { PanelRect, definePanelLayout } from './engine/layout'
import { allocateByWeight } from './engine/weightedAllocation'
import { CompletedGenerateDots, FailedGenerateDots, Message } from './message'
import {
  DrawingDots,
  FailedDots,
  FailedRenderer,
  GeneratingDots,
  Model,
  PanelArtwork,
  Point,
  ReadyDots,
  UnsupportedRenderer,
} from './model'

const randomPointInPanel = (
  panelSize: number,
  dotRadius: number,
): Effect.Effect<Point> =>
  Effect.all({
    x: Random.nextBetween(dotRadius, panelSize - dotRadius),
    y: Random.nextBetween(dotRadius, panelSize - dotRadius),
  })

const sampleByDensity = (
  distribution: DotDistribution,
  panelSize: number,
  dotRadius: number,
): Effect.Effect<Point> =>
  Effect.suspend(() =>
    Effect.gen(function* () {
      const point = yield* randomPointInPanel(panelSize, dotRadius)
      const threshold = yield* Random.next

      const density = relativeDensityAt(distribution, {
        x: point.x / panelSize,
        y: point.y / panelSize,
      })

      if (threshold <= density) {
        return point
      }

      return yield* sampleByDensity(distribution, panelSize, dotRadius)
    }),
  )

const randomPointInGridCell = (
  grid: Grid,
  cellIndex: number,
  panelSize: number,
  dotRadius: number,
): Effect.Effect<Point> => {
  const cellSize = panelSize / grid.divisions
  const column = cellIndex % grid.divisions
  const row = Math.floor(cellIndex / grid.divisions)
  const leftInset = column === 0 ? dotRadius : 0
  const rightInset = column === grid.divisions - 1 ? dotRadius : 0
  const topInset = row === 0 ? dotRadius : 0
  const bottomInset = row === grid.divisions - 1 ? dotRadius : 0

  return Effect.all({
    x: Random.nextBetween(
      column * cellSize + leftInset,
      (column + 1) * cellSize - rightInset,
    ),
    y: Random.nextBetween(
      row * cellSize + topInset,
      (row + 1) * cellSize - bottomInset,
    ),
  })
}

const generateGridPoints = (
  grid: Grid,
  dotCount: number,
  panelSize: number,
  dotRadius: number,
): Effect.Effect<ReadonlyArray<Point>> => {
  const allocation = allocateByWeight(dotCount, grid.weights)

  const pointEffects = Array.flatMap(allocation, (count, cellIndex) =>
    Array.makeBy(count, () =>
      randomPointInGridCell(grid, cellIndex, panelSize, dotRadius),
    ),
  )

  return Effect.all(pointEffects).pipe(Effect.flatMap(Random.shuffle))
}

const generatePanelPoints = (
  definition: DotPanelDefinition,
  panel: PanelRect,
  dotCount: number,
  dotRadius: number,
): Effect.Effect<ReadonlyArray<Point>> =>
  M.value(definition.distribution).pipe(
    M.tagsExhaustive({
      Grid: grid => generateGridPoints(grid, dotCount, panel.size, dotRadius),
      Uniform: uniform =>
        Effect.all(
          Array.makeBy(dotCount, () =>
            sampleByDensity(uniform, panel.size, dotRadius),
          ),
        ).pipe(Effect.flatMap(Random.shuffle)),
      Edge: edge =>
        Effect.all(
          Array.makeBy(dotCount, () =>
            sampleByDensity(edge, panel.size, dotRadius),
          ),
        ).pipe(Effect.flatMap(Random.shuffle)),
      Radial: radial =>
        Effect.all(
          Array.makeBy(dotCount, () =>
            sampleByDensity(radial, panel.size, dotRadius),
          ),
        ).pipe(Effect.flatMap(Random.shuffle)),
    }),
  )

const panelLayout = definePanelLayout({
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
  columns: PANEL_COLUMNS,
  gap: PANEL_GAP,
  padding: PANEL_PADDING,
  panelCount: PANEL_DEFINITIONS.length,
})

const generatePointPanels: Effect.Effect<ReadonlyArray<PanelArtwork>> =
  Effect.all(
    Array.map(
      Array.zip(PANEL_DEFINITIONS, panelLayout),
      ([definition, panel]) => {
        const dotRadius = panel.size * DOT_RADIUS_RATIO

        return generatePanelPoints(
          definition,
          panel,
          DOT_COUNT_PER_PANEL,
          dotRadius,
        ).pipe(
          Effect.map(points => ({
            id: definition.id,
            origin: { x: panel.x, y: panel.y },
            size: panel.size,
            dotRadius,
            points,
          })),
        )
      },
    ),
  )

export const GenerateDots = Command.define('GenerateDots', {
  messages: [CompletedGenerateDots, FailedGenerateDots],
  execute: generatePointPanels.pipe(
    Effect.flatMap(panels =>
      Random.next.pipe(
        Effect.map(randomValue =>
          CompletedGenerateDots({
            artworkId: `random-dots-${randomValue}`,
            panels,
          }),
        ),
      ),
    ),
    Effect.catch(() => Effect.succeed(FailedGenerateDots())),
  ),
})

export const init: Runtime.ApplicationInit<Model, Message> = () => ({
  model: GeneratingDots(),
  commands: [GenerateDots()],
})

type UpdateReturn = Update.Return<Model, Message>

const withUpdateReturn = M.withReturnType<UpdateReturn>()

const revealPoints = (model: DrawingDots, deltaTimeMs: number): Model => {
  const dotIntervalMs = DOT_REVEAL_DURATION_MS / model.pointCountPerPanel
  const elapsedMs = model.carryMs + deltaTimeMs
  const revealCount = Math.floor(elapsedMs / dotIntervalMs)

  const nextVisibleCountPerPanel = Math.min(
    model.pointCountPerPanel,
    model.visibleCountPerPanel + revealCount,
  )

  if (nextVisibleCountPerPanel >= model.pointCountPerPanel) {
    return ReadyDots({
      artworkId: model.artworkId,
      panels: model.panels,
      pointCountPerPanel: model.pointCountPerPanel,
    })
  }

  return modifyFields(model, {
    visibleCountPerPanel: () => nextVisibleCountPerPanel,
    carryMs: () => elapsedMs % dotIntervalMs,
  })
}

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      TickedFrame: ({ deltaTimeMs }) =>
        M.value(model).pipe(
          withUpdateReturn,
          M.tagsExhaustive({
            WaitingDots: () => ({ model }),
            GeneratingDots: () => ({ model }),
            DrawingDots: drawingDots => ({
              model: revealPoints(drawingDots, deltaTimeMs),
            }),
            ReadyDots: () => ({ model }),
            FailedDots: () => ({ model }),
            UnsupportedRenderer: () => ({ model }),
            FailedRenderer: () => ({ model }),
          }),
        ),
      CompletedGenerateDots: ({ artworkId, panels }) => {
        if (
          Predicate.isTagged('UnsupportedRenderer')(model) ||
          Predicate.isTagged('FailedRenderer')(model)
        ) {
          return { model }
        }

        const pointCountPerPanel = Array.match(panels, {
          onEmpty: () => 0,
          onNonEmpty: panelArtwork =>
            Array.reduce(
              panelArtwork,
              Number.POSITIVE_INFINITY,
              (minimum, panel) => Math.min(minimum, panel.points.length),
            ),
        })

        return {
          model:
            pointCountPerPanel === 0
              ? ReadyDots({ artworkId, panels, pointCountPerPanel })
              : DrawingDots({
                  artworkId,
                  panels,
                  visibleCountPerPanel: 1,
                  pointCountPerPanel,
                  carryMs: 0,
                }),
        }
      },
      FailedGenerateDots: () => ({ model: FailedDots() }),
      DetectedUnsupportedRenderer: () => ({ model: UnsupportedRenderer() }),
      FailedInitializeRenderer: ({ reason }) => ({
        model: FailedRenderer({ reason }),
      }),
    }),
  )
