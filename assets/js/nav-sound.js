(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controls = document.querySelectorAll("[data-nav-sound]");

  if (!controls.length) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  let audioContext;
  let lastClickAt = 0;

  function shouldPlay() {
    return !reducedMotion.matches && document.visibilityState === "visible";
  }

  function getAudioContext() {
    audioContext ||= new AudioContext();
    return audioContext;
  }

  async function playTick() {
    if (!shouldPlay()) return;

    const now = performance.now();
    if (now - lastClickAt < 45) return;
    lastClickAt = now;

    const context = getAudioContext();

    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch {
        return;
      }
    }

    const start = context.currentTime;
    const duration = 0.032;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(3200, start);
    oscillator.frequency.exponentialRampToValueAtTime(1800, start + duration);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2400, start);
    filter.frequency.exponentialRampToValueAtTime(1400, start + duration);
    filter.Q.setValueAtTime(3.2, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  controls.forEach((control) => {
    control.addEventListener("pointerdown", () => {
      playTick();
    });

    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        playTick();
      }
    });
  });
})();
