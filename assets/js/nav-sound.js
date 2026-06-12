(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const controls = document.querySelectorAll("[data-nav-sound]");

  if (!controls.length) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  let audioContext;
  let lastHoverAt = 0;
  let lastClickAt = 0;
  let lastFocusAt = 0;
  let lastPointerAt = 0;

  function shouldPlay() {
    return !reducedMotion.matches && document.visibilityState === "visible";
  }

  function getAudioContext() {
    audioContext ||= new AudioContext();
    return audioContext;
  }

  async function playTick(kind) {
    if (!shouldPlay()) return;

    const now = performance.now();
    const lastPlayedAt = kind === "hover" ? lastHoverAt : kind === "focus" ? lastFocusAt : lastClickAt;
    const cooldown = kind === "hover" ? 90 : kind === "focus" ? 80 : 45;

    if (now - lastPlayedAt < cooldown) return;

    if (kind === "hover") {
      lastHoverAt = now;
    } else if (kind === "focus") {
      lastFocusAt = now;
    } else {
      lastClickAt = now;
    }

    const context = getAudioContext();

    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch {
        return;
      }
    }

    const start = context.currentTime;
    const duration = kind === "click" ? 0.055 : 0.045;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(kind === "click" ? 620 : 760, start);
    oscillator.frequency.exponentialRampToValueAtTime(180, start + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, start);
    filter.frequency.exponentialRampToValueAtTime(420, start + duration);
    filter.Q.setValueAtTime(0.9, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.025 : 0.018, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  controls.forEach((control) => {
    control.addEventListener("pointerdown", () => {
      lastPointerAt = performance.now();
      playTick("click");
    });

    control.addEventListener("focus", () => {
      if (performance.now() - lastPointerAt < 160) return;
      playTick("focus");
    });

    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        playTick("click");
      }
    });

    if (hoverQuery.matches) {
      control.addEventListener("pointerenter", () => playTick("hover"));
    }
  });
})();
