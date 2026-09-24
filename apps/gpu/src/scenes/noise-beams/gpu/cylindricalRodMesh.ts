export type CylindricalRodMeshVertex = Readonly<{
  position: readonly [number, number, number]
  normal: readonly [number, number, number]
}>

export const CYLINDRICAL_ROD_RADIAL_SEGMENTS = 12

const radialPosition = (segmentIndex: number): readonly [number, number] => {
  const angle =
    ((segmentIndex % CYLINDRICAL_ROD_RADIAL_SEGMENTS) /
      CYLINDRICAL_ROD_RADIAL_SEGMENTS) *
    Math.PI *
    2

  return [Math.cos(angle), Math.sin(angle)]
}

const sideVertices = (
  segmentIndex: number,
): ReadonlyArray<CylindricalRodMeshVertex> => {
  const [startX, startY] = radialPosition(segmentIndex)
  const [endX, endY] = radialPosition(segmentIndex + 1)
  const startPosition: readonly [number, number] = [startX * 0.5, startY * 0.5]
  const endPosition: readonly [number, number] = [endX * 0.5, endY * 0.5]
  const startNormal: readonly [number, number, number] = [startX, startY, 0]
  const endNormal: readonly [number, number, number] = [endX, endY, 0]

  return [
    { position: [...startPosition, 0], normal: startNormal },
    { position: [...endPosition, 0], normal: endNormal },
    { position: [...endPosition, 1], normal: endNormal },
    { position: [...startPosition, 0], normal: startNormal },
    { position: [...endPosition, 1], normal: endNormal },
    { position: [...startPosition, 1], normal: startNormal },
  ]
}

const capVertices = (
  segmentIndex: number,
): ReadonlyArray<CylindricalRodMeshVertex> => {
  const [startX, startY] = radialPosition(segmentIndex)
  const [endX, endY] = radialPosition(segmentIndex + 1)
  const startPosition: readonly [number, number] = [startX * 0.5, startY * 0.5]
  const endPosition: readonly [number, number] = [endX * 0.5, endY * 0.5]
  const topNormal: readonly [number, number, number] = [0, 0, 1]
  const bottomNormal: readonly [number, number, number] = [0, 0, -1]

  return [
    { position: [0, 0, 1], normal: topNormal },
    { position: [...startPosition, 1], normal: topNormal },
    { position: [...endPosition, 1], normal: topNormal },
    { position: [0, 0, 0], normal: bottomNormal },
    { position: [...endPosition, 0], normal: bottomNormal },
    { position: [...startPosition, 0], normal: bottomNormal },
  ]
}

const segmentIndices = Array.from(
  { length: CYLINDRICAL_ROD_RADIAL_SEGMENTS },
  (_, segmentIndex) => segmentIndex,
)

export const UNIT_CYLINDRICAL_ROD_MESH: ReadonlyArray<CylindricalRodMeshVertex> =
  Object.freeze([
    ...segmentIndices.flatMap(sideVertices),
    ...segmentIndices.flatMap(capVertices),
  ])

export const UNIT_CYLINDRICAL_ROD_VERTEX_COUNT =
  UNIT_CYLINDRICAL_ROD_MESH.length
