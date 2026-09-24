const MAX_DEVICE_PIXEL_RATIO = 4

export type CanvasBackingResolution = Readonly<{
  width: number
  height: number
}>

export const canvasBackingResolution = (
  cssWidth: number,
  logicalWidth: number,
  logicalHeight: number,
  devicePixelRatio: number,
): CanvasBackingResolution => {
  if (
    !Number.isFinite(cssWidth) ||
    !Number.isFinite(logicalWidth) ||
    !Number.isFinite(logicalHeight) ||
    !Number.isFinite(devicePixelRatio) ||
    logicalWidth <= 0 ||
    logicalHeight <= 0
  ) {
    return { width: 1, height: 1 }
  }

  const safeCssWidth = Math.max(0, cssWidth)

  const safeDevicePixelRatio = Math.min(
    MAX_DEVICE_PIXEL_RATIO,
    Math.max(1, devicePixelRatio),
  )

  const backingWidth = Math.max(
    1,
    Math.round(safeCssWidth * safeDevicePixelRatio),
  )

  const backingHeight = Math.max(
    1,
    Math.round(
      safeCssWidth * (logicalHeight / logicalWidth) * safeDevicePixelRatio,
    ),
  )

  return { width: backingWidth, height: backingHeight }
}
