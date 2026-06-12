# ADR 0001: Navigation Interaction Audio

## Status

Accepted

## Context

The site navigation has a terminal-inspired visual language. A subtle interaction sound can reinforce that feel, but audio on websites is easy to make annoying or inaccessible.

The goal is a warm, low-volume tick for navigation controls that works on hover, keyboard focus, and activation without adding external assets or licensing concerns.

## Decision

Use the Web Audio API to synthesize the navigation tick in `assets/js/nav-sound.js`.

Controls opt in with the `data-nav-sound` attribute. The script is loaded once from `layouts/_default/baseof.html` and attaches behavior to all matching controls.

Current opt-in controls:

- Desktop sidenav links in `layouts/partials/nav-chips.html`
- Mobile nav links in `layouts/partials/mobile-nav.html`
- Mobile nav open and close buttons in `layouts/partials/mobile-nav.html`

The sound plays on:

- `pointerenter` for hover, only on fine-pointer hover devices
- `focus` for keyboard tab navigation
- `pointerdown` for pointer activation
- `keydown` for keyboard activation with `Enter` or `Space`

The script does not use audio files. It creates a short triangle oscillator through a low-pass filter and gain envelope.

## Accessibility And UX Rules

Audio is disabled when `prefers-reduced-motion: reduce` matches. Even though the setting is named motion, it is a reasonable proxy for reducing non-essential sensory effects.

Hover audio is only enabled for devices that match `(hover: hover) and (pointer: fine)`. Touch devices should not get synthetic hover behavior.

The script uses cooldowns so moving across nav items does not create a rapid stream of ticks.

Pointer-triggered focus is suppressed briefly so clicking a link does not play both the activation tick and focus tick.

The sound fails silently if Web Audio is unavailable or blocked by browser autoplay policy. Browsers usually require user activation before audio can play, so the first audible event may be the first click rather than the first hover.

Focus styling remains visible for keyboard users. The nav chip owns its `focus-visible` state in `assets/css/tailwind.css` instead of relying on the browser's default blue outline.

## Tuning Points

Tune the sound in `assets/js/nav-sound.js`:

- `duration` controls tick length
- oscillator frequency controls perceived pitch
- low-pass filter frequency controls warmth
- gain envelope controls volume and punch
- cooldown values control how often repeated ticks can play

Keep volumes low. The current gain values are intentionally conservative:

- Hover and focus peak at `0.018`
- Activation peaks at `0.025`

## Consequences

This keeps the implementation small, dependency-free, and license-free.

The sound is not user-configurable yet. If audio becomes more prominent or expands beyond navigation, add an explicit site-level mute toggle before adding more sound effects.

The behavior depends on client-side JavaScript. Navigation remains fully functional without it.
