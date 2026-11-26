import { describe, expect, test } from "vitest";
import gpu from "../../gpu/src/site-worker";
import research from "./site-worker";

const environment = {
  ASSETS: { fetch: async (request: Request) => new Response(`Research: ${new URL(request.url).pathname}`) },
  GPU: {
    fetch: async (request: Request) => gpu.fetch(request, {
      ASSETS: { fetch: async (asset: Request) => new Response(`GPU: ${new URL(asset.url).pathname}${new URL(asset.url).search}`) },
    }),
  },
};

describe("Research hosting", () => {
  test("GPU scene and asset requests reach the GPU handler with the correct asset path", async () => {
    const scene = await research.fetch(new Request("https://research.guidefari.com/gpu/scenes/noise-beams?seed=12"), environment);
    expect(await scene.text()).toBe("GPU: /?seed=12");
    const model = await research.fetch(new Request("https://research.guidefari.com/gpu/models/selfie_segmenter.tflite"), environment);
    expect(await model.text()).toBe("GPU: /models/selfie_segmenter.tflite");
  });

  test("the GPU landing URL canonicalizes its trailing slash without losing queries", async () => {
    const response = await research.fetch(new Request("https://research.guidefari.com/gpu?source=blog"), environment);
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://research.guidefari.com/gpu/?source=blog");
  });

  test("the library, wheel atlas, reports and similarly named paths remain Research assets", async () => {
    await Promise.all(["/", "/wheels/", "/reports/sops/", "/gpu-not-a-scene/"].map(async (path) => {
      const response = await research.fetch(new Request(`https://research.guidefari.com${path}`), environment);
      expect(await response.text()).toBe(`Research: ${path}`);
    }));
  });
});
