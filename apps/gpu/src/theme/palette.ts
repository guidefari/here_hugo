import { Schema as S } from 'effect'
import { darkColors, lightColors, type ThemeColors } from '@here/theme'

import type { ColorScheme, Model } from './model'

export const Color = S.Struct({
  red: S.Number,
  green: S.Number,
  blue: S.Number,
})

export type Color = typeof Color.Type

export const Palette = S.Struct({
  page: Color,
  surface: Color,
  elevated: Color,
  text: Color,
  muted: Color,
  border: Color,
  amber: Color,
  green: Color,
  cyan: Color,
  red: Color,
})

export type Palette = typeof Palette.Type

const fromHex = (hex: string): Color => ({
  red: Number.parseInt(hex.slice(1, 3), 16),
  green: Number.parseInt(hex.slice(3, 5), 16),
  blue: Number.parseInt(hex.slice(5, 7), 16),
})

const blend = (start: Color, end: Color, fraction: number): Color => ({
  red: Math.round(start.red + (end.red - start.red) * fraction),
  green: Math.round(start.green + (end.green - start.green) * fraction),
  blue: Math.round(start.blue + (end.blue - start.blue) * fraction),
})

const fromTheme = (colors: ThemeColors, warning: Color): Palette => {
  const page = fromHex(colors.bg)
  const surface = fromHex(colors.panel)
  const text = fromHex(colors.text)

  return {
    page,
    surface,
    elevated: fromHex(colors['panel-sunken']),
    text,
    muted: blend(page, text, 0.6),
    border: blend(surface, text, 0.2),
    amber: fromHex(colors.highlight),
    green: fromHex(colors.darkMaincolor),
    cyan: fromHex(colors['quote-rule']),
    red: warning,
  }
}

export const darkPalette: Palette = fromTheme(darkColors, { red: 235, green: 111, blue: 102 })

export const lightPalette: Palette = fromTheme(lightColors, { red: 160, green: 55, blue: 48 })

export const resolveColorScheme = (model: Model): ColorScheme =>
  model.preference === 'System' ? model.systemColorScheme : model.preference

export const paletteFor = (colorScheme: ColorScheme): Palette =>
  colorScheme === 'Dark' ? darkPalette : lightPalette

export const resolvePalette = (model: Model): Palette =>
  paletteFor(resolveColorScheme(model))

export const colorToCss = (color: Color): string =>
  `rgb(${color.red} ${color.green} ${color.blue})`

export const colorToCssWithAlpha = (color: Color, alpha: number): string =>
  `rgb(${color.red} ${color.green} ${color.blue} / ${alpha})`

export const colorToUnitRgb = (
  color: Color,
): readonly [number, number, number] => [
  color.red / 255,
  color.green / 255,
  color.blue / 255,
]

export const paletteStyle = (model: Model) => {
  const palette = resolvePalette(model)
  const colorScheme = resolveColorScheme(model)

  return {
    colorScheme: colorScheme.toLowerCase(),
    '--theme-page': colorToCss(palette.page),
    '--theme-surface': colorToCss(palette.surface),
    '--theme-elevated': colorToCss(palette.elevated),
    '--theme-text': colorToCss(palette.text),
    '--theme-muted': colorToCss(palette.muted),
    '--theme-border': colorToCss(palette.border),
    '--theme-amber': colorToCss(palette.amber),
    '--theme-green': colorToCss(palette.green),
    '--theme-cyan': colorToCss(palette.cyan),
    '--theme-red': colorToCss(palette.red),
  }
}
