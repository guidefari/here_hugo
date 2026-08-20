// Runtime-editable source storage can replace this checked-in list in a future iteration.
export const sourceConfig = [
  {
    id: "guidefari-media",
    name: "Guide Fari media",
    enabled: true,
    feedUrl: "https://guidefari.com/media/discord.json",
    format: "json-feed",
    // This generated feed lists every published entry, so absence is meaningful.
    absenceMeansRemoved: true,
    backfill: { postCount: 10, publishHourUtc: 6 },
  },
] satisfies ReadonlyArray<unknown>;
