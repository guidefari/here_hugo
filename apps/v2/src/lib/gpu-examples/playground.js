export async function start(playground) {
  const code = playground.querySelector("[data-gpu-code]");
  const frame = playground.querySelector(".gpu-playground-preview-frame");
  const result = playground.querySelector("[data-gpu-result]");
  const buttons = playground.querySelectorAll("[data-gpu-example]");
  const highlighter = import("shiki").then(({ createHighlighter }) => createHighlighter({
    themes: ["solarized-dark"],
    langs: ["javascript"],
  }));
  let selection = 0;

  async function show(name) {
    const current = ++selection;

    try {
      const example = name === "webgl2"
        ? await Promise.all([import("./webgl2.js"), import("./webgl2.js?raw")])
        : await Promise.all([import("./webgpu.js"), import("./webgpu.js?raw")]);
      if (current !== selection) return;
      const source = example[1].default;
      const nextCode = document.createElement("pre");
      nextCode.className = "shiki gpu-example-layer";
      try {
        const shiki = await highlighter;
        if (current !== selection) return;
        const template = document.createElement("template");
        template.innerHTML = shiki.codeToHtml(source, { lang: "javascript", theme: "solarized-dark" });
        const highlighted = template.content.querySelector("pre");
        if (highlighted) {
          nextCode.innerHTML = highlighted.innerHTML;
          nextCode.style.cssText = highlighted.style.cssText;
        } else {
          nextCode.textContent = source;
        }
      } catch {
        nextCode.textContent = source;
      }
      if (current !== selection) return;

      const oldCanvas = frame.querySelector(".is-visible") ?? frame.querySelector("canvas");
      const oldCode = code.querySelector(".is-visible");
      const nextCanvas = document.createElement("canvas");
      nextCanvas.width = 640;
      nextCanvas.height = 480;
      nextCanvas.className = "gpu-example-layer";
      nextCanvas.setAttribute("aria-label", "A coloured triangle drawn by the selected GPU API");
      frame.append(nextCanvas);

      try {
        await example[0].render(nextCanvas);
      } catch (error) {
        nextCanvas.remove();
        throw error;
      }
      if (current !== selection) {
        nextCanvas.remove();
        return;
      }

      code.append(nextCode);
      for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.gpuExample === name));
      requestAnimationFrame(() => {
        nextCanvas.classList.add("is-visible");
        nextCode.classList.add("is-visible");
        oldCanvas?.classList.remove("is-visible");
        oldCode?.classList.remove("is-visible");
      });
      window.setTimeout(() => {
        oldCanvas?.remove();
        oldCode?.remove();
      }, 300);
      result.textContent = `${name === "webgl2" ? "WebGL 2" : "WebGPU"} drew this triangle on your device.`;
    } catch (error) {
      if (current === selection) result.textContent = error instanceof Error ? error.message : "Could not draw the triangle.";
    }
  }

  for (const button of buttons) button.addEventListener("click", () => { void show(button.dataset.gpuExample); });
  await show("webgl2");
}
