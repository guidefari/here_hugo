import { Array } from 'effect'

import type { PanelArtwork } from '../model'

export type DotInstanceValue = Readonly<{
  center: Readonly<{
    x: number
    y: number
  }>
  radius: number
}>

export const interleavePanelArtwork = (
  panels: ReadonlyArray<PanelArtwork>,
  pointCountPerPanel: number,
): ReadonlyArray<DotInstanceValue> =>
  Array.makeBy(pointCountPerPanel * panels.length, instanceIndex => {
    const panelIndex = instanceIndex % panels.length
    const pointIndex = Math.floor(instanceIndex / panels.length)
    const panel = panels[panelIndex]

    if (panel === undefined) {
      throw new RangeError(`Missing panel at index ${panelIndex}`)
    }

    const point = panel.points[pointIndex]

    if (point === undefined) {
      throw new RangeError(
        `Panel ${panel.id} has no point at reveal index ${pointIndex}`,
      )
    }

    return {
      center: {
        x: panel.origin.x + point.x,
        y: panel.origin.y + point.y,
      },
      radius: panel.dotRadius,
    }
  })

export const visibleInstanceCount = (
  visibleCountPerPanel: number,
  panelCount: number,
  pointCountPerPanel: number,
): number => {
  if (
    !Number.isFinite(visibleCountPerPanel) ||
    !Number.isFinite(panelCount) ||
    !Number.isFinite(pointCountPerPanel)
  ) {
    return 0
  }

  const safeVisibleCountPerPanel = Math.max(
    0,
    Math.min(Math.trunc(visibleCountPerPanel), Math.trunc(pointCountPerPanel)),
  )

  const safePanelCount = Math.max(0, Math.trunc(panelCount))

  return safeVisibleCountPerPanel * safePanelCount
}
