import { Array } from 'effect'

export type PanelRect = Readonly<{
  x: number
  y: number
  size: number
}>

export type PanelLayoutDefinition = Readonly<{
  width: number
  height: number
  columns: number
  gap: number
  padding: number
  panelCount: number
}>

export const definePanelLayout = ({
  width,
  height,
  columns,
  gap,
  padding,
  panelCount,
}: PanelLayoutDefinition): ReadonlyArray<PanelRect> => {
  const rows = Math.ceil(panelCount / columns)
  const contentWidth = width - padding * 2
  const contentHeight = height - padding * 2
  const panelWidth = (contentWidth - gap * (columns - 1)) / columns
  const panelHeight = (contentHeight - gap * (rows - 1)) / rows
  const size = Math.min(panelWidth, panelHeight)

  return Array.makeBy(panelCount, index => ({
    x: padding + (index % columns) * (size + gap),
    y: padding + Math.floor(index / columns) * (size + gap),
    size,
  }))
}
