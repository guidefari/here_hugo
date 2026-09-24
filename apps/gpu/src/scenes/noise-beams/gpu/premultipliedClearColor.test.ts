import { describe, expect, test } from 'vitest'

import { premultipliedClearColor } from './premultipliedClearColor'

describe('premultipliedClearColor', () => {
  test('preserves opaque color channels', () => {
    expect(
      premultipliedClearColor({ red: 0.8, green: 0.4, blue: 0.2, alpha: 1 }),
    ).toStrictEqual([0.8, 0.4, 0.2, 1])
  })

  test('premultiplies translucent color channels by alpha', () => {
    expect(
      premultipliedClearColor({
        red: 0.8,
        green: 0.4,
        blue: 0.2,
        alpha: 0.25,
      }),
    ).toStrictEqual([0.2, 0.1, 0.05, 0.25])
  })
})
