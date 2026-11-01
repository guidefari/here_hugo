import { Runtime } from 'foldkit'

import {
  ChangedUrl,
  ClickedLink,
  Flags,
  Message,
  Model,
  flags,
  init,
  subscriptions,
  update,
  view,
} from './app'
import { registerMosaicWheelControl } from './scenes/image-mosaic'
import { registerMirrorElement } from './scenes/mosaic-mirror'
import { registerNoiseBeamsGpuElement } from './scenes/noise-beams'
import { registerRandomDotsGpuElement } from './scenes/random-dots'

registerNoiseBeamsGpuElement()

registerRandomDotsGpuElement()

registerMosaicWheelControl()

registerMirrorElement()

const application = Runtime.makeApplication({
  Flags,
  Model,
  init,
  update,
  view,
  subscriptions,
  container: document.getElementById('root'),
  routing: {
    onUrlRequest: request => ClickedLink({ request }),
    onUrlChange: url => ChangedUrl({ url }),
  },
  devTools: {
    Message,
    excludeFromHistory: [
      'GotRandomDotsMessage',
      'GotNoiseBeamsMessage',
      'GotImageMosaicMessage',
      'GotMosaicMirrorMessage',
    ],
  },
})

Runtime.run(application, { flags })
