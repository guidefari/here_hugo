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
import { registerNoiseBeamsGpuElement } from './scenes/noise-beams'
import { registerRandomDotsGpuElement } from './scenes/random-dots'

registerNoiseBeamsGpuElement()

registerRandomDotsGpuElement()

const application = Runtime.makeApplication({
  Flags,
  flags,
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
    excludeFromHistory: ['GotRandomDotsMessage', 'GotNoiseBeamsMessage'],
  },
})

Runtime.run(application)
