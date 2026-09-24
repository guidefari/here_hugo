import typegpu from 'unplugin-typegpu/vite'
import { defineConfig } from 'vite'

import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [typegpu(), tailwindcss(), foldkit({ devToolsMcpPort: 43988 })],
  resolve: {
    dedupe: ['effect'],
  },
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
})
