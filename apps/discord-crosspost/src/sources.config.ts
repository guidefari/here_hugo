// Runtime-editable source storage can replace this checked-in list in a future iteration.
export const sourceConfig = [
  {
    id: "guidefari-media",
    name: "Guide Fari media",
    enabled: true,
    feedUrl: "https://guidefari.com/media/discord.json",
    format: "json-feed",
    // Provisional defaults until real posting volume informs the policy.
    backfill: { windowDays: 14, maxPerRun: 3 },
  },
] satisfies ReadonlyArray<unknown>;
