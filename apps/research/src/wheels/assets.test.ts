import { describe, expect, test } from "vitest";
import manifest from "./assets.json";
import { catalogue, chartSheet } from "./catalogue";

describe("wheel media delivery", () => {
  test("every displayed asset uses the existing media CDN", () => {
    const urls = [chartSheet.src, ...catalogue.flatMap((wheel) => [
      wheel.tile, ...wheel.media.map((media) => media.src),
    ])];
    urls.forEach((url) => {
      expect(url).toMatch(/^https:\/\/media\.guidefari\.com\/research\/wheels\//);
    });
  });

  test("immutable object names include the recorded content fingerprint", () => {
    Object.values(manifest).forEach((asset) => {
      expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(new URL(asset.url).pathname).toContain(`-${asset.sha256.slice(0, 16)}.`);
      expect(asset.bytes).toBeGreaterThan(0);
      expect(asset.contentType).toMatch(/^image\/(jpeg|png|webp)$/);
    });
  });
});
