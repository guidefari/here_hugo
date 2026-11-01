export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-cyan)]'

export const segmentedTrack =
  'flex items-center gap-1 rounded-surface border border-[var(--theme-border)] bg-[var(--theme-surface)] p-1'

export const floatingSurface =
  'bg-[var(--theme-surface)]/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl'

export const segmentedItem = (isSelected: boolean): string =>
  `rounded-control px-3 py-1.5 transition-colors duration-200 ${focusRing} ` +
  (isSelected
    ? 'bg-[var(--theme-text)] text-[var(--theme-page)]'
    : 'text-[var(--theme-muted)] hover:bg-[var(--theme-elevated)] hover:text-[var(--theme-text)]')

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-control border border-[var(--theme-border)] ' +
  'bg-[var(--theme-surface)] px-3 py-2 text-sm font-medium transition-colors duration-200 ' +
  'hover:bg-[var(--theme-elevated)] disabled:cursor-not-allowed disabled:opacity-35 ' +
  focusRing

export const textField =
  'rounded-control border border-[var(--theme-border)] bg-[var(--theme-page)] px-3 py-1.5 ' +
  'type-meta text-[var(--theme-text)] aria-[invalid=true]:border-[var(--theme-red)] ' +
  focusRing

export const hint = 'text-xs leading-relaxed text-[var(--theme-muted)]'

export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-control border border-[var(--theme-text)] ' +
  'bg-[var(--theme-text)] px-3 py-2 text-sm font-medium text-[var(--theme-page)] transition-opacity duration-200 ' +
  'hover:opacity-90 disabled:cursor-wait disabled:opacity-60 ' +
  focusRing
