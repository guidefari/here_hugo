import { describe, expect, test } from "bun:test";
import { DEFAULT_TITLE, parseTitle } from "./request";

describe("parseTitle", () => {
  test("uses the site name when the title is absent or blank", () => {
    expect(parseTitle(new URL("https://example.com/og-image"))).toBe(DEFAULT_TITLE);
    expect(parseTitle(new URL("https://example.com/og-image?title=%20%20"))).toBe(DEFAULT_TITLE);
  });

  test("normalizes whitespace and preserves Unicode", () => {
    expect(parseTitle(new URL("https://example.com/og-image?title=Go%20%E2%80%94%20%20defer"))).toBe(
      "Go — defer",
    );
  });

  test("bounds render work by truncating long titles", () => {
    const title = "a".repeat(200);
    const parsed = parseTitle(new URL(`https://example.com/og-image?title=${title}`));

    expect(Array.from(parsed)).toHaveLength(180);
    expect(parsed.endsWith("…")).toBe(true);
  });
});
