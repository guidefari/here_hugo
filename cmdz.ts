import { Command } from 'cmdz'

export default [
  Command('Blog', { command: 'bun run dev', cwd: 'apps/v2' }),
  Command('GPU playground', { command: 'bun run dev', cwd: 'apps/gpu' }),
]
