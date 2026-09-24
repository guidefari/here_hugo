import { writeFileSync } from 'node:fs'
import { darkColors, lightColors, type ThemeColors } from './palette'

function declarations(colors: ThemeColors, indent: string): string {
  return Object.entries(colors).map(([name, value]) => `${indent}--theme-${name}: ${value};`).join('\n')
}

const css = `:root {
${declarations(darkColors, '  ')}
}

@media (prefers-color-scheme: light) {
  :root {
${declarations(lightColors, '    ')}
  }
}
`

writeFileSync(new URL('../styles/theme.css', import.meta.url), css)
