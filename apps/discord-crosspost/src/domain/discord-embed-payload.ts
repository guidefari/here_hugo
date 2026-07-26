import type { MediaEntry } from "./media-entry";

const truncate = (value: string, limit: number): string =>
  value.length <= limit
    ? value
    : limit <= 3
      ? value.slice(0, limit)
      : `${value.slice(0, limit - 3)}...`;

export interface DiscordEmbedPayload {
  readonly allowed_mentions: { readonly parse: readonly [] };
  readonly embeds: ReadonlyArray<{
    readonly title: string;
    readonly url: string;
    readonly description?: string;
    readonly author?: { readonly name: string };
    readonly fields?: ReadonlyArray<{
      readonly name: string;
      readonly value: string;
      readonly inline?: boolean;
    }>;
    readonly thumbnail?: { readonly url: string };
    readonly timestamp: string;
  }>;
}

export const fromMediaEntry = (entry: MediaEntry): DiscordEmbedPayload => {
  let remaining = 6_000;
  const take = (value: string, limit: number): string => {
    const output = truncate(value, Math.min(limit, remaining));
    remaining -= output.length;
    return output;
  };
  const title = take(entry.title, 256);
  const description = entry.description ? take(entry.description, 3_500) : "";
  const author = entry.creator ? take(entry.creator, 256) : "";
  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];
  const addField = (name: string, value: string, inline?: boolean): void => {
    if (!value || remaining <= name.length) return;
    remaining -= name.length;
    const fieldValue = take(value, 1_024);
    if (fieldValue) fields.push({ name, value: fieldValue, ...(inline ? { inline } : {}) });
  };
  addField("Media type", entry.mediaType, true);
  addField("Media URL", entry.mediaUrl);
  addField("Tags", entry.tags.join(", "));

  return {
    allowed_mentions: { parse: [] },
    embeds: [{
      title,
      url: entry.entryUrl,
      ...(description ? { description } : {}),
      ...(author ? { author: { name: author } } : {}),
      ...(fields.length > 0 ? { fields } : {}),
      ...(entry.thumbnailUrl ? { thumbnail: { url: entry.thumbnailUrl } } : {}),
      timestamp: entry.publishedAt,
    }],
  };
};
