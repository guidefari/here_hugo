type Color = Readonly<{
  red: number
  green: number
  blue: number
  alpha: number
}>

export const premultipliedClearColor = (
  color: Color,
): readonly [number, number, number, number] => [
  color.red * color.alpha,
  color.green * color.alpha,
  color.blue * color.alpha,
  color.alpha,
]
