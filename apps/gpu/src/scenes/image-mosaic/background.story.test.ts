import { Command, given, message, model, story } from 'foldkit/story'
import { expect, test } from 'vitest'

import { UpdatedBackgroundColor, UpdatedBackgroundMode } from './message'
import { init, update } from './update'

test('sets a solid fill and remembers its color when transparency is restored', () => {
  const initial = init().model
  story(
    update,
    given(initial),
    message(UpdatedBackgroundColor({ value: '#123456' })),
    model(next => {
      expect(next.background).toEqual({ mode: 'Solid', color: '#123456' })
      expect(next.state).toBe(initial.state)
    }),
    message(UpdatedBackgroundMode({ mode: 'Transparent' })),
    model(next =>
      expect(next.background).toEqual({
        mode: 'Transparent',
        color: '#123456',
      }),
    ),
    Command.expectNone(),
  )
})

test.each(['red', '#fff', '#1234567', '"><script/>'])(
  'rejects invalid fill color %s',
  value => {
    const initial = init().model
    expect(update(initial, UpdatedBackgroundColor({ value })).model).toEqual(
      initial,
    )
  },
)
