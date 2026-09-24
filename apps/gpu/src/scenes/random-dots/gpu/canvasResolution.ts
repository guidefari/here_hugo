const MAX_DEVICE_PIXEL_RATIO = 4

export const canvasResolution = (
  cssSize: number,
  devicePixelRatio: number,
): number => {
  if (!Number.isFinite(cssSize) || !Number.isFinite(devicePixelRatio)) {
    return 1
  }

  const safeCssSize = Math.max(0, cssSize)

  const safeDevicePixelRatio = Math.min(
    MAX_DEVICE_PIXEL_RATIO,
    Math.max(1, devicePixelRatio),
  )

  return Math.max(1, Math.round(safeCssSize * safeDevicePixelRatio))
}
