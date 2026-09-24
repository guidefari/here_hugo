import {
  DotDistribution,
  Edge,
  Grid,
  Radial,
  Uniform,
} from './engine/distribution'

export const CANVAS_SIZE = 600

export const PANEL_COLUMNS = 2

export const PANEL_GAP = 60

export const PANEL_PADDING = 30

export const DOT_COUNT_PER_PANEL = 20_000

export const DOT_RADIUS_RATIO = 1 / 800

export const DOT_REVEAL_DURATION_MS = 5_000

export type DotPanelDefinition = Readonly<{
  id: string
  distribution: DotDistribution
}>

export const PANEL_DEFINITIONS: ReadonlyArray<DotPanelDefinition> = [
  {
    id: 'weighted-grid',
    distribution: Grid({
      divisions: 4,
      weights: [
        1.2, 1.2, 1.2, 1.2, 1.15, 0.12, 0.65, 1, 0.18, 0.25, 1.3, 1.15, 0.04,
        0.06, 0.75, 1,
      ],
    }),
  },
  { id: 'uniform', distribution: Uniform() },
  {
    id: 'top-heavy',
    distribution: Edge({
      from: 'Top',
      concentration: {
        spread: 0.82,
        strength: 1.5,
        background: 0.002,
      },
    }),
  },
  {
    id: 'centered',
    distribution: Radial({
      center: { x: 0.5, y: 0.5 },
      concentration: {
        spread: 0.8,
        strength: 3.2,
        background: 0.0015,
      },
    }),
  },
]
