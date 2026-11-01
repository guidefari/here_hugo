import {
  click,
  expect,
  given,
  role,
  scene,
  withViewInputs,
} from 'foldkit/scene'
import { test } from 'vitest'

import { darkPalette } from '../../theme'
import { init, update } from './update'
import { view } from './view'

const testView = withViewInputs(view, { palette: darkPalette })()

test('waits for an explicit start and lets the user cancel startup', () => {
  scene(
    { update, view: testView },
    given(init().model),
    expect(role('status')).toHaveText('Camera off'),
    expect(
      role('img', {
        name: 'Live mosaic mirror: contrasting tiles follow your silhouette',
      }),
    ).toExist(),
    click(role('button', { name: 'Start camera' })),
    expect(role('status')).toHaveText(
      'Loading the person model and waiting for camera access…',
    ),
    click(role('button', { name: 'Stop camera' })),
    expect(role('status')).toHaveText('Camera off'),
  )
})

test('supports mirror toggling and high-contrast presets', () => {
  scene(
    { update, view: testView },
    given(init().model),
    click(role('button', { name: 'Mirror: on' })),
    expect(role('button', { name: 'Mirror: off' })).toHaveAttr(
      'aria-pressed',
      'false',
    ),
    click(role('button', { name: 'Ink / Lime' })),
    expect(role('slider', { name: 'Grid density' })).toExist(),
  )
})
