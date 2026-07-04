---
title: "Designing for astigmatism"
date: 2026-06-25
description: A reading-first design checklist for users with astigmatism
tags: [accessibility, design, ux, frontend]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Designing%20for%20astigmatism']
full_width: true
---

I have astigmatism. Dark mode is unreadable in daylight. Light mode flashbangs me at night. This is a design checklist as I explore how to create more pleasant experiences for my fellow astigmatics🫡.

# The day/night flip

Astigmatism = irregular cornea. Light scatters instead of focusing. The blur turns bright edges into halos and streaks.

- In daylight, pupils constrict, screen blacks wash out, dark UI loses effective contrast.
- At night, pupils dilate, white backgrounds scatter into halos.

One mode can't win both. Design for the transition, not the toggle.

# Checklist

## Contrast & color

- Off-pure pairs beat pure pairs. `#121212` on `#E8E8E8` reads cleaner than `#000` on `#FFF`. Pure extremes maximize perceived aberration.
- Target WCAG AAA (7:1) for body. Use [APCA](https://github.com/Myndex/SAPC-APCA) or L\* for perceptual accuracy.
- No pure white in dark mode, no pure black in light mode.
- Never convey state with color alone. Pair with icon, weight, or border.

The demos below are toggleable. Click the buttons to feel each rule instead of just reading it.

### Off-pure beats pure

Pure extremes maximize perceived aberration. There's a kind of optical shimmer when `#000` sits directly on `#FFF` — the eye struggles to resolve the boundary, especially at body size. Pulling both colors slightly inward gives you a pair that still hits AAA contrast but reads cleaner.

`#121212` on `#E8E8E8` is the textbook off-pure pair. Lower raw ratio (15.3:1) than pure (21:1), better perceived comfort.

<div class="cp-section" data-purity-section>
<div class="cp-compare cp-compare-2">
  <div class="cp-card cp-card-light" style="background:#FFFFFF;color:#000000">
    <div class="cp-card-head">
      <span class="cp-tag">Pure</span>
      <span class="cp-ratio">21.0 : 1</span>
    </div>
    <div class="cp-swatch-row">
      <span class="cp-swatch" style="background:#000000"></span>
      <code>#000000</code>
      <span class="cp-sep">on</span>
      <span class="cp-swatch" style="background:#FFFFFF;border:1px solid #888"></span>
      <code>#FFFFFF</code>
    </div>
    <div class="cp-text-sample">
      <div style="font-size:14px;line-height:1.5">The quick brown fox jumps over the lazy dog. 14px body text on a pure pair.</div>
      <div style="font-size:16px;line-height:1.5">The quick brown fox jumps over the lazy dog. 16px body text on a pure pair.</div>
      <div style="font-size:18px;line-height:1.5">The quick brown fox jumps over the lazy dog. 18px body text on a pure pair.</div>
    </div>
  </div>

  <div class="cp-card cp-card-light" style="background:#E8E8E8;color:#121212">
    <div class="cp-card-head">
      <span class="cp-tag">Off-pure</span>
      <span class="cp-ratio">15.3 : 1</span>
    </div>
    <div class="cp-swatch-row">
      <span class="cp-swatch" style="background:#121212"></span>
      <code>#121212</code>
      <span class="cp-sep">on</span>
      <span class="cp-swatch" style="background:#E8E8E8;border:1px solid #888"></span>
      <code>#E8E8E8</code>
    </div>
    <div class="cp-text-sample">
      <div style="font-size:14px;line-height:1.5">The quick brown fox jumps over the lazy dog. 14px body text on an off-pure pair.</div>
      <div style="font-size:16px;line-height:1.5">The quick brown fox jumps over the lazy dog. 16px body text on an off-pure pair.</div>
      <div style="font-size:18px;line-height:1.5">The quick brown fox jumps over the lazy dog. 18px body text on an off-pure pair.</div>
    </div>
  </div>
</div>

<div class="cp-controls">
  <span class="cp-controls-label">Simulate eye stress:</span>
  <button class="cp-btn cp-btn-active" data-blur="0">Sharp</button>
  <button class="cp-btn" data-blur="0.4">Slight blur</button>
  <button class="cp-btn" data-blur="0.8">Blurred</button>
</div>
</div>

At sharp rendering the pairs look similar. Crank the blur and the pure pair starts to vibrate at the edges while the off-pure pair stays steady. The off-pure pair is forgiving at small sizes and on lower-quality displays.

### Target WCAG AAA, measure perceptually

WCAG's contrast ratio is a rough proxy. The math works, but it isn't perceptual. [APCA](https://github.com/Myndex/SAPC-APCA) or CIE L\* gets closer to what the eye actually sees, especially in dark mode where the WCAG formula overstates dark-on-darker contrast.

<div class="cp-section" data-checker>
<div class="cp-checker">
  <div class="cp-checker-pick">
    <label for="cp-fg">Foreground</label>
    <input type="color" id="cp-fg" data-fg value="#E8E8E8" />
    <code data-fg-hex>#E8E8E8</code>
  </div>
  <div class="cp-checker-pick cp-checker-swap">
    <button type="button" class="cp-swap-btn" data-swap>⇄ Swap</button>
  </div>
  <div class="cp-checker-pick">
    <label for="cp-bg">Background</label>
    <input type="color" id="cp-bg" data-bg value="#121212" />
    <code data-bg-hex>#121212</code>
  </div>
</div>

<div class="cp-checker-sample" data-sample>
  <div style="font-size:18px;font-weight:700;margin-bottom:0.5rem">Body text at 18px</div>
  <div style="font-size:16px;margin-bottom:0.5rem">Body text at 16px — the common reading size.</div>
  <div style="font-size:14px">Body text at 14px — the small print, captions, fine print.</div>
</div>

<div class="cp-checker-stats">
  <div class="cp-stat">
    <div class="cp-stat-label">Contrast ratio</div>
    <div class="cp-stat-value" data-ratio>15.3 : 1</div>
  </div>
  <div class="cp-stat">
    <div class="cp-stat-label">APCA Lc (approx)</div>
    <div class="cp-stat-value" data-lc>-83</div>
  </div>
  <div class="cp-stat">
    <div class="cp-stat-label">AA (4.5:1)</div>
    <div class="cp-stat-value" data-aa><span class="cp-pass">PASS</span></div>
  </div>
  <div class="cp-stat">
    <div class="cp-stat-label">AAA (7:1)</div>
    <div class="cp-stat-value" data-aaa><span class="cp-pass">PASS</span></div>
  </div>
</div>

<div class="cp-controls">
  <span class="cp-controls-label">Quick presets:</span>
  <button class="cp-btn" data-preset='{"fg":"#FFFFFF","bg":"#000000"}'>Pure (white/black)</button>
  <button class="cp-btn" data-preset='{"fg":"#E8E8E8","bg":"#121212"}'>Off-pure</button>
  <button class="cp-btn" data-preset='{"fg":"#777777","bg":"#FFFFFF"}'>Borderline gray</button>
  <button class="cp-btn" data-preset='{"fg":"#000000","bg":"#FFEB3B"}'>High chroma</button>
</div>
</div>

The defaults are the off-pure pair from the rule above. Try pure black on pure white — same content, similar ratio, more fatigue. Try a high-chroma pair like black on `#FFEB3B` — the WCAG ratio is fine, but the color saturation makes the text harder to focus on.

APCA reading guide: Lc 90+ excellent for body, 75+ good, 60+ minimum for body, 45+ large text only, below 45 don't use for text. Sign convention: positive = dark text on light bg, negative = light text on dark.

### No extremes in dark/light mode

Pure white in dark mode is the same problem as pure black in light mode: maximum luminance jump, maximum halation. The off-pure version (off-white in dark, off-black in light) keeps the contrast high without the optical sting.

<div class="cp-section" data-theme-section>
<div class="cp-controls">
  <span class="cp-controls-label">View in:</span>
  <button class="cp-btn cp-btn-active" data-theme="dark">Dark mode</button>
  <button class="cp-btn" data-theme="light">Light mode</button>
</div>

<div class="cp-compare cp-compare-2" data-theme-grid data-theme="dark">
  <div class="cp-card cp-card-dark" data-pair="problem">
    <div class="cp-card-head">
      <span class="cp-tag">The problem</span>
      <span class="cp-ratio" data-pure-ratio>21.0 : 1</span>
    </div>
    <div class="cp-swatch-row">
      <span class="cp-swatch" data-swatch-fg style="background:#FFFFFF"></span>
      <code data-fg-hex-dark>#FFFFFF</code>
      <span class="cp-sep">on</span>
      <span class="cp-swatch" data-swatch-bg style="background:#000000;border:1px solid #444"></span>
      <code data-bg-hex-dark>#000000</code>
    </div>
    <div class="cp-text-sample">
      <div style="font-size:18px;line-height:1.5">Body text at 18px on a pure extreme pair.</div>
      <div style="font-size:14px;line-height:1.5">Body text at 14px on a pure extreme pair — this is where it stings.</div>
    </div>
  </div>

  <div class="cp-card cp-card-dark" data-pair="fix">
    <div class="cp-card-head">
      <span class="cp-tag">The fix</span>
      <span class="cp-ratio" data-offpure-ratio>15.3 : 1</span>
    </div>
    <div class="cp-swatch-row">
      <span class="cp-swatch" data-swatch-fg-off style="background:#E8E8E8"></span>
      <code data-fg-hex-off>#E8E8E8</code>
      <span class="cp-sep">on</span>
      <span class="cp-swatch" data-swatch-bg-off style="background:#121212;border:1px solid #444"></span>
      <code data-bg-hex-off>#121212</code>
    </div>
    <div class="cp-text-sample">
      <div style="font-size:18px;line-height:1.5">Body text at 18px on an off-pure pair.</div>
      <div style="font-size:14px;line-height:1.5">Body text at 14px on an off-pure pair — comfortable at every size.</div>
    </div>
  </div>
</div>
</div>

In dark mode the "problem" pair is `#FFF` on `#000`. Toggle to light mode and the same principle flips: `#000` on `#FFF` becomes the offender, and `#121212` on `#E8E8E8` is the fix. The off-pure direction is the same — pull both colors away from the extreme.

### Never convey state with color alone

Pair color with icon, weight, or border. Color-only state is invisible to the ~8% of men with some form of color vision deficiency, and weak in bright sunlight for everyone.

<div class="cp-section" data-state-section>
<div class="cp-controls">
  <span class="cp-controls-label">View as:</span>
  <button class="cp-btn cp-btn-active" data-vision="normal">Normal vision</button>
  <button class="cp-btn" data-vision="grayscale">Achromatopsia (grayscale)</button>
</div>

<div class="cp-state-grid" data-grayscale-target>
  <div class="cp-state-col">
    <h3>Color only</h3>
    <div class="cp-state-item">
      <span class="cp-state-dot" style="background:#3b82f6"></span>
      <span>Active</span>
    </div>
    <div class="cp-state-item">
      <span class="cp-state-dot" style="background:#10b981"></span>
      <span>Success</span>
    </div>
    <div class="cp-state-item">
      <span class="cp-state-dot" style="background:#f59e0b"></span>
      <span>Warning</span>
    </div>
    <div class="cp-state-item">
      <span class="cp-state-dot" style="background:#ef4444"></span>
      <span>Error</span>
    </div>
  </div>

  <div class="cp-state-col">
    <h3>Color + icon + weight + border</h3>
    <div class="cp-state-item cp-state-item-strong">
      <span class="cp-state-dot" style="background:#3b82f6"></span>
      <span class="cp-state-icon">●</span>
      <span style="font-weight:700">Active</span>
    </div>
    <div class="cp-state-item cp-state-item-strong" style="border-color:#10b981">
      <span class="cp-state-dot" style="background:#10b981"></span>
      <span class="cp-state-icon">✓</span>
      <span style="font-weight:700">Success</span>
    </div>
    <div class="cp-state-item cp-state-item-strong" style="border-color:#f59e0b">
      <span class="cp-state-dot" style="background:#f59e0b"></span>
      <span class="cp-state-icon">!</span>
      <span style="font-weight:700">Warning</span>
    </div>
    <div class="cp-state-item cp-state-item-strong" style="border-color:#ef4444">
      <span class="cp-state-dot" style="background:#ef4444"></span>
      <span class="cp-state-icon">✕</span>
      <span style="font-weight:700">Error</span>
    </div>
  </div>
</div>
</div>

Toggle to grayscale to see what a user with achromatopsia (or anyone in a glare-heavy environment, or on a subpar LCD) actually sees. The color-only column collapses into ambiguity. The multi-cue column still parses — different icons, different border colors (in greyscale those become different shades), different text weight.

## Type

- No weights below 400. Body at 500 if the face supports it.
- Screen-designed faces: Inter, Atkinson Hyperlegible, IBM Plex Sans, Recursive.
- 16px body minimum, 18px for long-form.
- Line-height 1.5 to 1.7, line length 60 to 75ch.
- Generous letter-spacing. Tight tracking merges adjacent characters when edges blur.
- Avoid italics for emphasis. Use weight or color. Avoid long all-caps runs.
- Variable fonts with an optical-size axis (Inter, Recursive) for size-specific tuning.

The type demos share a single astigmatism toggle. Click "Blurred" once to apply the same edge-softening to all three.

<div class="cp-section" data-type-section>
<div class="cp-controls">
  <span class="cp-controls-label">Simulate astigmatism:</span>
  <button class="cp-btn cp-btn-active" data-tp-blur="0">Normal</button>
  <button class="cp-btn" data-tp-blur="0.8">Blurred</button>
</div>

<div class="tp-demo">
  <div class="tp-card">
    <div class="tp-head">Weight</div>
    <div class="tp-text-sample" style="font-weight:300"><span class="tp-label">300</span>The quick brown fox jumps over the lazy dog.</div>
    <div class="tp-text-sample" style="font-weight:400"><span class="tp-label">400</span>The quick brown fox jumps over the lazy dog.</div>
    <div class="tp-text-sample" style="font-weight:500"><span class="tp-label">500</span>The quick brown fox jumps over the lazy dog.</div>
    <div class="tp-text-sample" style="font-weight:700"><span class="tp-label">700</span>The quick brown fox jumps over the lazy dog.</div>
  </div>
</div>

<div class="tp-demo">
  <div class="tp-card">
    <div class="tp-head">Line height</div>
    <div class="tp-text-sample" style="font-size:16px;line-height:1.2"><span class="tp-label">1.2</span>Body text needs room to breathe. When astigmatism blurs the edges, tight line heights merge adjacent lines and the eye loses its place on the way back from the end of one line to the start of the next.</div>
    <div class="tp-text-sample" style="font-size:16px;line-height:1.5"><span class="tp-label">1.5</span>Body text needs room to breathe. When astigmatism blurs the edges, tight line heights merge adjacent lines and the eye loses its place on the way back from the end of one line to the start of the next.</div>
    <div class="tp-text-sample" style="font-size:16px;line-height:1.7"><span class="tp-label">1.7</span>Body text needs room to breathe. When astigmatism blurs the edges, tight line heights merge adjacent lines and the eye loses its place on the way back from the end of one line to the start of the next.</div>
  </div>
</div>

<div class="tp-demo">
  <div class="tp-card">
    <div class="tp-head">Letter spacing</div>
    <div class="tp-text-sample" style="font-size:24px;letter-spacing:-0.02em"><span class="tp-label">tight</span>READING</div>
    <div class="tp-text-sample" style="font-size:24px;letter-spacing:0"><span class="tp-label">normal</span>READING</div>
    <div class="tp-text-sample" style="font-size:24px;letter-spacing:0.08em"><span class="tp-label">generous</span>READING</div>
  </div>
</div>
</div>

Under blur, weight 300 starts to fade into the background, the 1.2 line-height sample merges its lines, and the tight-tracked word "READING" runs together. Weight 500+, line-height 1.5+, and generous tracking all hold up. The variable-font optical-size axis matters for the same reason — letter shapes get wider and stroke contrast softens at small sizes, compensating for the blur.

## Anti-aliasing

- Grayscale AA, not subpixel. Subpixel fringing reads as a colored haze to astigmatic eyes.
  - `font-smooth: never; -webkit-font-smoothing: antialiased;`
- Browser defaults are usually fine; opt out of any OS-level subpixel mode.

## Mode switching

- Three states, not two: light, dark, follow ambient. The third is what astigmatic and photophobic users actually want.
- Tie dark mode to ambient light (lux sensor, time-of-day fallback), not just OS preference.
- Add a dim/warm mode for late-night reading: lower blue, lower brightness, off-white background. Not the same as dark mode.

## UI chrome

- Focus rings 2px+ in both modes.
- Borders on interactive elements, not just color fill.
- Hit targets 44px+. Generous padding inside buttons.
- Whitespace between elements. Blur makes dense layouts unreadable.

## Images & overlays

- No text on busy backgrounds. Use a solid scrim or panel.
- No low-opacity text on solid color. It disappears in the blur radius.
- Hero images: blur, darken, or shift hue behind any caption.

## Motion

- No autoplay carousels. They're unreadable when edges blur.
- Respect `prefers-reduced-motion`.
- Transitions under 200ms, easing-light.

# Environment (the half you can't CSS)

These belong in the design system docs, not the stylesheet.

- Match screen brightness to ambient light. Biggest single win, most apps ignore it.
- Matte display or matte protector. Glare adds a second scatter layer on top of the eye's.
- Bias lighting behind the monitor at night. Reduces pupil dilation and the resulting halos.
- Enable OS blue-light filter after sunset.
- 20-20-20 rule still applies. Astigmatic eyes fatigue faster.

# What this also fixes for everyone

Presbyopia (everyone past ~40), reading in sunlight, migraine and dry-eye flares, long screen-time users, low-quality displays and projectors. Off-pure, off-thin, off-bright defaults are calmer for every visual cortex. The astigmatism constraints are just a tighter version of constraints that already exist for everyone.

# Sources

- [APCA - Accessible Perceptual Contrast Algorithm](https://github.com/Myndex/SAPC-APCA)
- [Atkinson Hyperlegible - Braille Institute](https://www.brailleinstitute.org/freefont/)
- [WCAG 2.2 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [MDN - font-smooth](https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth)

<style>
  .cp-section { margin: 2.5rem 0; }
  .cp-section h2,
  .cp-section h3 { margin-bottom: 0.5rem; }

  .cp-compare {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  .cp-compare-2 { grid-template-columns: 1fr 1fr; }
  @media (max-width: 768px) {
    .cp-compare-2 { grid-template-columns: 1fr; }
  }

  .cp-card {
    border-radius: 6px;
    padding: 1.25rem;
    border: 1px solid color-mix(in oklab, var(--text) 15%, transparent);
    font-family: 'JetBrains Mono', monospace;
  }
  .cp-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
  }
  .cp-tag {
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
  }
  .cp-card-light .cp-tag { color: rgba(0,0,0,0.7); background: rgba(0,0,0,0.08); }
  .cp-card-dark .cp-tag { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.1); }
  .cp-ratio { font-weight: 700; font-size: 0.85rem; }
  .cp-card-light .cp-ratio { color: rgba(0,0,0,0.7); }
  .cp-card-dark .cp-ratio { color: rgba(255,255,255,0.85); }

  .cp-swatch-row {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.8rem;
    flex-wrap: wrap;
  }
  .cp-swatch {
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.25);
    flex-shrink: 0;
  }
  .cp-card-dark .cp-swatch-row code,
  .cp-card-light .cp-swatch-row code {
    background: transparent;
    color: inherit;
  }
  .cp-sep { opacity: 0.4; }
  .cp-text-sample {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .cp-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
    margin: 1rem 0;
    font-size: 0.85rem;
  }
  .cp-controls-label {
    color: color-mix(in oklab, var(--text) 70%, transparent);
    font-family: 'JetBrains Mono', monospace;
    margin-right: 0.25rem;
  }
  .cp-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid color-mix(in oklab, var(--text) 25%, transparent);
    background: color-mix(in oklab, var(--text) 5%, transparent);
    color: var(--text);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .cp-btn:hover {
    background: color-mix(in oklab, var(--text) 12%, transparent);
  }
  .cp-btn-active {
    background: var(--color-highlight);
    color: #000;
    border-color: var(--color-highlight);
  }

  .cp-checker {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: end;
    margin: 1.5rem 0 1rem;
  }
  @media (max-width: 640px) {
    .cp-checker { grid-template-columns: 1fr; }
  }
  .cp-checker-pick {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .cp-checker-pick label {
    font-size: 0.85rem;
    color: color-mix(in oklab, var(--text) 80%, transparent);
    font-family: 'JetBrains Mono', monospace;
  }
  .cp-checker-pick input[type="color"] {
    width: 100%;
    height: 48px;
    border: 1px solid color-mix(in oklab, var(--text) 25%, transparent);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    padding: 2px;
  }
  .cp-checker-pick code {
    font-size: 0.85rem;
    color: var(--text);
    background: transparent;
  }
  .cp-swap-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid color-mix(in oklab, var(--text) 25%, transparent);
    background: color-mix(in oklab, var(--text) 5%, transparent);
    color: var(--text);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .cp-swap-btn:hover { background: color-mix(in oklab, var(--text) 12%, transparent); }

  .cp-checker-sample {
    margin-top: 1rem;
    padding: 1.5rem;
    border-radius: 6px;
    border: 1px solid color-mix(in oklab, var(--text) 15%, transparent);
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.6;
  }

  .cp-checker-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
  }
  @media (max-width: 640px) {
    .cp-checker-stats { grid-template-columns: repeat(2, 1fr); }
  }
  .cp-stat {
    padding: 0.75rem;
    background: color-mix(in oklab, var(--text) 5%, transparent);
    border-radius: 4px;
    border: 1px solid color-mix(in oklab, var(--text) 12%, transparent);
  }
  .cp-stat-label {
    font-size: 0.7rem;
    color: color-mix(in oklab, var(--text) 60%, transparent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'JetBrains Mono', monospace;
  }
  .cp-stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    margin-top: 0.25rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .cp-pass { color: #4ade80; }
  .cp-fail { color: #f87171; }

  .cp-state-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  @media (max-width: 768px) {
    .cp-state-grid { grid-template-columns: 1fr; }
  }
  .cp-state-col {
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid color-mix(in oklab, var(--text) 15%, transparent);
    background: color-mix(in oklab, var(--text) 4%, transparent);
    font-family: 'JetBrains Mono', monospace;
  }
  .cp-state-col h3 {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: color-mix(in oklab, var(--text) 80%, transparent);
    font-weight: 700;
  }
  .cp-state-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    margin-bottom: 0.4rem;
    border-radius: 4px;
    background: color-mix(in oklab, var(--text) 4%, transparent);
    border: 1px solid transparent;
    font-size: 0.95rem;
  }
  .cp-state-item-strong {
    font-weight: 700;
    background: color-mix(in oklab, var(--text) 6%, transparent);
  }
  .cp-state-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .cp-state-icon {
    width: 16px;
    text-align: center;
    flex-shrink: 0;
    font-weight: 700;
  }
  [data-grayscale-target] { transition: filter 0.2s ease; }
  [data-grayscale-target].cp-grayscale { filter: grayscale(1); }

  .tp-demo { margin: 1.25rem 0; }
  .tp-card {
    border-radius: 6px;
    padding: 1.25rem 1.5rem;
    border: 1px solid color-mix(in oklab, var(--text) 15%, transparent);
    background: color-mix(in oklab, var(--text) 4%, transparent);
  }
  .tp-head {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: color-mix(in oklab, var(--text) 70%, transparent);
    font-weight: 700;
    margin-bottom: 0.85rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .tp-text-sample {
    font-family: 'JetBrains Mono', monospace;
    color: var(--text);
    margin-bottom: 0.6rem;
    transition: filter 0.2s ease;
  }
  .tp-text-sample:last-child { margin-bottom: 0; }
  .tp-label {
    display: inline-block;
    min-width: 4.5em;
    font-size: 0.7em;
    color: color-mix(in oklab, var(--text) 50%, transparent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    margin-right: 0.5em;
  }
</style>

<script>
  (function () {
    function hexToRgb(hex) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    }
    function relLum(hex) {
      const { r, g, b } = hexToRgb(hex);
      const lin = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    }
    function contrastRatio(a, b) {
      const l1 = relLum(a);
      const l2 = relLum(b);
      const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hi + 0.05) / (lo + 0.05);
    }
    function apcaLc(textHex, bgHex) {
      const tY = relLum(textHex);
      const bY = relLum(bgHex);
      return bY > tY
        ? Math.round((Math.pow(bY, 0.56) - Math.pow(tY, 0.57)) * 100)
        : Math.round((Math.pow(bY, 0.62) - Math.pow(tY, 0.65)) * 100);
    }
    function fmtRatio(r) {
      return r >= 10 ? r.toFixed(1) : r.toFixed(2);
    }

    document.querySelectorAll("[data-purity-section]").forEach((section) => {
      const buttons = section.querySelectorAll("[data-blur]");
      const samples = section.querySelectorAll(".cp-text-sample");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("cp-btn-active"));
          btn.classList.add("cp-btn-active");
          const blur = parseFloat(btn.dataset.blur);
          samples.forEach((s) => {
            s.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
          });
        });
      });
    });

    const checker = document.querySelector("[data-checker]");
    if (checker) {
      const fgInput = checker.querySelector("[data-fg]");
      const bgInput = checker.querySelector("[data-bg]");
      const fgHex = checker.querySelector("[data-fg-hex]");
      const bgHex = checker.querySelector("[data-bg-hex]");
      const swapBtn = checker.querySelector("[data-swap]");
      const sample = checker.querySelector("[data-sample]");
      const ratioEl = checker.querySelector("[data-ratio]");
      const lcEl = checker.querySelector("[data-lc]");
      const aaEl = checker.querySelector("[data-aa]");
      const aaaEl = checker.querySelector("[data-aaa]");

      function update() {
        const fg = fgInput.value;
        const bg = bgInput.value;
        const ratio = contrastRatio(fg, bg);
        const lc = apcaLc(fg, bg);
        sample.style.background = bg;
        sample.style.color = fg;
        ratioEl.textContent = `${fmtRatio(ratio)} : 1`;
        lcEl.textContent = `Lc ${lc > 0 ? "+" : ""}${lc}`;
        fgHex.textContent = fg.toUpperCase();
        bgHex.textContent = bg.toUpperCase();
        const aaPass = ratio >= 4.5;
        const aaaPass = ratio >= 7;
        aaEl.innerHTML = aaPass
          ? '<span class="cp-pass">PASS</span>'
          : '<span class="cp-fail">FAIL</span>';
        aaaEl.innerHTML = aaaPass
          ? '<span class="cp-pass">PASS</span>'
          : '<span class="cp-fail">FAIL</span>';
      }

      fgInput.addEventListener("input", update);
      bgInput.addEventListener("input", update);
      swapBtn.addEventListener("click", () => {
        const tmp = fgInput.value;
        fgInput.value = bgInput.value;
        bgInput.value = tmp;
        update();
      });
      checker.querySelectorAll("[data-preset]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const preset = JSON.parse(btn.dataset.preset);
          fgInput.value = preset.fg;
          bgInput.value = preset.bg;
          update();
        });
      });
      update();
    }

    const themeSection = document.querySelector("[data-theme-section]");
    if (themeSection) {
      const buttons = themeSection.querySelectorAll("[data-theme]");
      const grid = themeSection.querySelector("[data-theme-grid]");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("cp-btn-active"));
          btn.classList.add("cp-btn-active");
          const theme = btn.dataset.theme;
          grid.dataset.theme = theme;
          const problemCard = grid.querySelector('[data-pair="problem"]');
          const fixCard = grid.querySelector('[data-pair="fix"]');
          if (theme === "light") {
            problemCard.style.background = "#FFFFFF";
            problemCard.style.color = "#000000";
            problemCard.classList.remove("cp-card-dark");
            problemCard.classList.add("cp-card-light");
            problemCard.querySelector("[data-swatch-fg]").style.background = "#000000";
            problemCard.querySelector("[data-swatch-bg]").style.background = "#FFFFFF";
            problemCard.querySelector("[data-fg-hex-dark]").textContent = "#000000";
            problemCard.querySelector("[data-bg-hex-dark]").textContent = "#FFFFFF";
            problemCard.querySelector("[data-pure-ratio]").textContent = "21.0 : 1";

            fixCard.style.background = "#E8E8E8";
            fixCard.style.color = "#121212";
            fixCard.classList.remove("cp-card-dark");
            fixCard.classList.add("cp-card-light");
            fixCard.querySelector("[data-swatch-fg-off]").style.background = "#121212";
            fixCard.querySelector("[data-swatch-bg-off]").style.background = "#E8E8E8";
            fixCard.querySelector("[data-fg-hex-off]").textContent = "#121212";
            fixCard.querySelector("[data-bg-hex-off]").textContent = "#E8E8E8";
            fixCard.querySelector("[data-offpure-ratio]").textContent = "15.3 : 1";
          } else {
            problemCard.style.background = "#000000";
            problemCard.style.color = "#FFFFFF";
            problemCard.classList.remove("cp-card-light");
            problemCard.classList.add("cp-card-dark");
            problemCard.querySelector("[data-swatch-fg]").style.background = "#FFFFFF";
            problemCard.querySelector("[data-swatch-bg]").style.background = "#000000";
            problemCard.querySelector("[data-fg-hex-dark]").textContent = "#FFFFFF";
            problemCard.querySelector("[data-bg-hex-dark]").textContent = "#000000";
            problemCard.querySelector("[data-pure-ratio]").textContent = "21.0 : 1";

            fixCard.style.background = "#121212";
            fixCard.style.color = "#E8E8E8";
            fixCard.classList.remove("cp-card-light");
            fixCard.classList.add("cp-card-dark");
            fixCard.querySelector("[data-swatch-fg-off]").style.background = "#E8E8E8";
            fixCard.querySelector("[data-swatch-bg-off]").style.background = "#121212";
            fixCard.querySelector("[data-fg-hex-off]").textContent = "#E8E8E8";
            fixCard.querySelector("[data-bg-hex-off]").textContent = "#121212";
            fixCard.querySelector("[data-offpure-ratio]").textContent = "15.3 : 1";
          }
        });
      });
    }

    const stateSection = document.querySelector("[data-state-section]");
    if (stateSection) {
      const buttons = stateSection.querySelectorAll("[data-vision]");
      const target = stateSection.querySelector("[data-grayscale-target]");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("cp-btn-active"));
          btn.classList.add("cp-btn-active");
          if (btn.dataset.vision === "grayscale") {
            target.classList.add("cp-grayscale");
          } else {
            target.classList.remove("cp-grayscale");
          }
        });
      });
    }

    document.querySelectorAll("[data-type-section]").forEach((section) => {
      const buttons = section.querySelectorAll("[data-tp-blur]");
      const samples = section.querySelectorAll(".tp-text-sample");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("cp-btn-active"));
          btn.classList.add("cp-btn-active");
          const blur = parseFloat(btn.dataset.tpBlur);
          samples.forEach((s) => {
            s.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
          });
        });
      });
    });
  })();
</script>
