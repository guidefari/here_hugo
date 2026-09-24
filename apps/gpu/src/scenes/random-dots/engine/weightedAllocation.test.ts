import { describe, expect, test } from 'vitest'

import { allocateByWeight } from './weightedAllocation'

describe('allocateByWeight', () => {
  test('allocates every dot with row-major tie breaking', () => {
    expect(allocateByWeight(10, [1, 1, 1, 1])).toStrictEqual([3, 3, 2, 2])
  })

  test('leaves zero-weight cells empty', () => {
    expect(allocateByWeight(10, [1, 0, 3, 0])).toStrictEqual([3, 0, 7, 0])
  })
})
