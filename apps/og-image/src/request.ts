/** Fallback title for requests without usable title text. */
export const DEFAULT_TITLE = "Guide Fari";

/** Public path handled by the image Worker. */
export const OG_IMAGE_PATH = "/og-image";

const MAX_TITLE_LENGTH = 180;

/** Parses and bounds the title accepted by the public image endpoint. */
export function parseTitle(url: URL): string {
  const title = (url.searchParams.get("title") ?? "").replace(/\s+/g, " ").trim();
  if (!title) return DEFAULT_TITLE;

  const characters = Array.from(title);
  if (characters.length <= MAX_TITLE_LENGTH) return title;

  return `${characters.slice(0, MAX_TITLE_LENGTH - 1).join("")}…`;
}
