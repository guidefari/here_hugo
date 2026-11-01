import { Schema } from 'effect'
import { defineTaggedUnion } from 'foldkit/schema'

import { Grid } from '../engine/grid'
import { Density } from '../model'

export const Response = defineTaggedUnion({
  Ready: {},
  Segmented: { density: Density, grid: Grid },
  Failure: { reason: Schema.String },
})

export const { Ready, Segmented, Failure } = Response

export type Response = typeof Response.Type
