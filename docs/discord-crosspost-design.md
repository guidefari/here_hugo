# Discord media cross-posting

Exploratory design for Linear issue [OPS-137](https://linear.app/guidefari/issue/OPS-137): cross-post new media entries to a Discord channel, with an opt-in path for media sourced from external feeds (not just this site's own content).

Status: shaped through PR review and implemented on this branch.

## Decisions from review

These were open questions in the previous revision of this doc. Answers below are settled; implementation should follow them rather than re-litigate.

1. **Naming**: "external feed" / "feed", not "friend feed". The feature is opt-in per feed, sourced from anyone, not specifically friends.
2. **Parsing/validation**: Effect Schema, throughout. See [Effect shape](#effect-shape).
3. **Channel + secrets**: the Discord webhook URL (which encodes the channel) is provided as a deploy-time secret, bound into the Worker via Alchemy. See [Secrets](#secrets).
4. **Cron frequency**: every 5 minutes to start.
5. **Backfill**: queue the latest 10 posts on first sync, then publish one queued post each day at noon UTC. See [Backfill](#backfill).
6. **Feed formats**: support all of JSON Feed, RSS, and Atom from the start.
7. **Drafts**: never post a draft. When an entry transitions from draft to published, it posts normally at that point, as a new discovery (dedupe identity is stable across the transition; see [D1 delivery ledger](#d1-delivery-ledger)).
8. **Malformed entries**: never fail silently. Quarantine for review (persisted, visible, inspectable), not a silent skip and not a hard failure of the whole feed.
9. **Runtime**: the Worker is an Effect application. D1 is approved as added infrastructure.
10. **Feed configuration**: start with a checked-in, deploy-time config file behind the `SourceConfig` service seam, so a D1- or KV-backed adapter can replace it later.
11. **Quarantine visibility**: write a structured warning for each quarantined entry to Cloudflare Workers Logs, which is already enabled for this Worker. D1 keeps the full quarantine record for inspection. There is no automated alert yet; a Tail Worker or OpenTelemetry export can add one later.
12. **Retries**: retry a failed Discord delivery up to five times after the first attempt, with exponential backoff starting at five minutes.
13. **Edits**: when a sent entry changes, update its Discord message with `PATCH` and store the new payload after Discord accepts it.
14. **Removed entries**: leave the Discord message in place when a sent entry is deleted or returns to draft. Emit a structured warning once when a complete feed first shows that change.

## Current constraints

- Infrastructure is declared with Alchemy in `alchemy.run.ts` and deployed to Cloudflare.
- The site is an Astro static build. Alchemy runs the build and serves `apps/v2/dist` through `apps/v2/src/site-worker.ts`.
- Media entries are Markdown files under `apps/v2/src/content/media/*.md`. Their shared Astro frontmatter schema includes `title`, `date`, `description`, `creator`, `media_type`, `media_url`, `tags`, `images`, and `draft`.
- `media` is a flattened content section. A file such as `media/should-you-read-the-code.md` has the canonical entry URL `https://guidefari.com/should-you-read-the-code/`, not a URL nested under `/media/`.
- Astro already generates `/media/index.xml`, but its current RSS items contain the title, canonical link, description, publication date, and rendered body rather than every media-specific field.
- A static build cannot initiate a cross-post when an entry becomes public. The trigger must run in deployment automation or in separate runtime infrastructure.
- `effect` and `@effect/platform-*` are already repo dependencies (see root `package.json`); this Worker is the first Effect-native runtime responsibility in the repo, so it sets local convention rather than following one.

## Recommendation

Deploy a dedicated Cloudflare Worker with a Cron Trigger, separate from the site Worker, built as an Effect application. On each run it polls a first-party media feed generated from Astro content and every enabled external feed, normalizes all entries through one ingestion path, and delivers unseen entries to Discord.

The first-party feed should expose stable entry identity and the media metadata needed for the Discord payload, and must exclude drafts. This can be an enriched version of the existing media feed or a dedicated JSON Feed generated at build time. Keeping it build-generated means published Astro content remains the source of truth while the cross-posting Worker stays independent from the static site request path.

The Worker uses D1 as a delivery ledger. Discord webhooks do not accept an idempotency key, so the Worker must decide whether an entry has already been attempted or sent before making a request. The ledger also makes retries, backfill drip state, and operational inspection explicit instead of relying on an in-memory feed cursor.

The processing path is:

1. Load the first-party source and enabled external feed configuration.
2. Fetch each feed and parse its declared format (JSON Feed, RSS, or Atom) with a format-specific Effect Schema, projecting into one normalized `MediaEntry` shape.
3. Reject entries that fail schema validation into quarantine (see [Malformed entries](#malformed-entries)); do not drop them silently and do not let one bad entry fail the whole feed.
4. Derive a dedupe key from the source ID and stable entry identity.
5. Claim unseen entries into the D1 ledger as `pending` (or `queued`, for entries subject to backfill trickle, see [Backfill](#backfill)).
6. For entries due now, send the Discord payload, then mark `sent` with the Discord message ID when available.
7. Mark an unsuccessful delivery `failed` with safe failure metadata and retry it according to an explicit retry policy.

The webhook request and D1 update cannot be one atomic transaction. A crash after Discord accepts the message but before D1 records `sent` can still produce a duplicate on retry. The ledger reduces routine duplication and makes this narrow ambiguity visible, but cannot provide exactly-once delivery without support from Discord.

## Effect shape

This section sketches the module boundaries, not final code. Names are illustrative.

**Domain Modules** (pure, no I/O):

- `MediaEntry`: the normalized Effect Schema struct every feed format decodes into: `sourceId`, `entryIdentity`, `title`, `entryUrl`, `description`, `creator`, `mediaType`, `mediaUrl`, `tags`, `thumbnailUrl`, `publishedAt`, `draft`.
- `DedupeKey`: a branded value derived from `sourceId` + `entryIdentity`, with a pure `DedupeKey.make(sourceId, entryIdentity)` constructor.
- `DiscordEmbedPayload`: a projection function `MediaEntry -> DiscordEmbedPayload`, pure, owns embed field mapping and truncation to Discord's limits.
- Feed-format decoders: `JsonFeedEntry`, `RssItem`, `AtomEntry` Effect Schemas, each with a pure normalizer into `MediaEntry`. A decode failure produces a typed `MediaEntryRejected` value (not thrown), carrying enough context to quarantine.

**Service Modules** (orchestration, explicit dependencies via Effect Tags):

- `FeedIngestion`: given a `FeedSource` (first-party or external), fetches and decodes it into `ReadonlyArray<Result<MediaEntry, MediaEntryRejected>>`. Depends on an `HttpClient` capability (Effect's platform HTTP client) and the per-format Domain Module decoders.
- `CrossPostRun`: the top-level use case invoked by the Cron trigger: load enabled sources, run `FeedIngestion` across them with bounded concurrency, claim new entries via `DeliveryLedger`, send due entries via `DiscordPublisher`, apply backfill trickle policy. Depends on `SourceConfig`, `FeedIngestion`, `DeliveryLedger`, `DiscordPublisher`, `Clock`.

**External Adapter Modules** (Cloudflare/framework/third-party translation, Layers own construction):

- `DeliveryLedger`: D1-backed, exposes service-shaped methods (`claim(dedupeKey, entry): Effect<ClaimResult, LedgerUnavailable>`, `markSent(...)`, `markFailed(...)`, `promoteQueued(...)`), not raw D1 queries. Parses D1 rows at the seam per boundary-parsing standards; rejects contradictory persisted rows (e.g. `state = 'sent'` with no `sentAt`).
- `DiscordPublisher`: wraps the webhook `fetch` call, returns `Effect<DiscordMessageId, DiscordDeliveryFailed>`. Classifies HTTP/network failures before returning; does not leak the raw webhook URL into error values.
- `SourceConfig`: resolves the checked-in first-party and external feed configuration (see [Feed configuration](#feed-configuration)) into parsed `FeedSource[]` at startup/composition, not re-read per run. Its service interface does not depend on file storage, so a D1- or KV-backed Layer can replace the first adapter later.
- `QuarantineStore`: D1-backed, records rejected entries for later review (see [Malformed entries](#malformed-entries)).

**Composition seam**: the Cron handler (`scheduled(event, env, ctx)`) is the only place raw `Env`/D1 bindings/secrets are touched. It builds the Layer stack (`DeliveryLedgerLive`, `DiscordPublisherLive`, `SourceConfigLive`, ...) and runs `CrossPostRun` through it. No Service Module or Domain Module imports Cloudflare binding types directly.

**Errors**: each Service/Adapter method returns a precise union via `Schema.TaggedErrorClass`, e.g. `FeedUnreachable`, `FeedFormatUnsupported`, `LedgerUnavailable`, `DiscordDeliveryFailed`, `MediaEntryRejected`. `CrossPostRun`'s own surface (what the Cron handler catches to decide whether to alert) is the only place these can widen into a broader run-summary type; that summary should not be a broad `AppError`, but a `CrossPostRunFailure` struct listing which sources/entries failed and why, since a partial-source failure should not fail the whole run.

## Secrets

The Discord webhook URL is provided as a deploy-time secret and bound into the Worker's `Env` through Alchemy: the equivalent of a `Secret()` resource wired into the Worker binding, matching how Alchemy is already used for the rest of this stack's Cloudflare resources. Exact Alchemy API surface (`alchemy/Secret` or the Cloudflare-provider-specific secret binding) should be confirmed against the installed Alchemy version (`2.0.0-beta.64` per root `package.json`) at implementation time, since Alchemy's secret API is not yet exercised anywhere else in this repo.

Inside the Worker, the raw webhook URL is wrapped in Effect's `Redacted` immediately at the composition seam and only unwrapped inside `DiscordPublisher`, per the repo-wide secrets standard: it must never enter logs, D1 rows, quarantine records, or error values.

## Feed configuration

Sources are explicit and opt-in, whether first-party or external:

```ts
type FeedSource = {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly feedUrl: string;
  readonly format: "json-feed" | "rss" | "atom";
  readonly absenceMeansRemoved: boolean;
  readonly backfill: BackfillPolicy;
};
```

`id` is the stable source namespace used in dedupe keys and must not change when the display name or feed URL changes. `absenceMeansRemoved` is true only for complete feeds where a missing item means the publisher removed or unpublished it; it must stay false for rolling feeds that drop old items.

`apps/discord-crosspost/src/sources.config.ts` holds the deploy-time configuration. The composition root parses it once with the `FeedSourceConfig` Effect Schema and provides it through the `SourceConfig` service. Service logic depends on that interface, not the checked-in file, so a runtime-editable D1 or KV adapter can replace the current Layer without changing ingestion or delivery code.

## Backfill

When a source is first enabled, the Worker sorts its published entries by publication date and claims the latest 10 as `queued`. It claims older entries as `ignored` so later polls do not mistake them for new posts. It does not use an age window because author cadence varies. The noon UTC Cron run promotes at most one queued row per source; all other five-minute runs leave the backfill queue alone.

Promotion selects the oldest queued post directly from the ledger by `source_id`, `state = 'queued'`, and `published_at`, with no dependency on whether an entry still appears in the current live feed. A rolling feed must not strand a queued entry after it scrolls out of the feed. The ledger stores the full normalized `MediaEntry` payload at claim time, so a promoted row has everything needed to build its Discord embed.

```ts
type BackfillPolicy = {
  readonly postCount: number;
  readonly publishHourUtc: number;
};
```

The checked-in config keeps these values explicit per source, though the initial policy uses 10 posts and noon UTC for every source.

## D1 delivery ledger

```sql
CREATE TABLE discord_deliveries (
  dedupe_key TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  entry_identity TEXT NOT NULL,
  entry_url TEXT NOT NULL,
  published_at TEXT NOT NULL,
  payload TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('ignored', 'queued', 'pending', 'sent', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  discord_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT,
  source_missing_at TEXT
);
```

`payload` is the claimed entry's full normalized `MediaEntry`, stored as JSON at claim time. This is what makes the ledger a genuine source of truth for promotion and delivery: a `queued` row can be promoted and sent using only what's stored on the row, without needing the entry to still be present in whatever the most recent feed poll happened to return.

The dedupe key is a deterministic encoding of `source_id + entry_identity`. For the first-party source, entry identity can be the canonical URL or a stable feed ID derived from it. External feeds should prefer a feed GUID or JSON Feed item ID, falling back to the canonical item URL only when its stability is trustworthy.

Because drafts are excluded from the first-party feed entirely (constraint above), a draft entry has no `entry_identity` until it's published: the draft-to-published transition is not a ledger state change, it's the entry's first appearance in the feed, claimed fresh like any new entry.

State meanings:

- `ignored`: older than the latest posts selected during the source's first sync; never sent.
- `queued`: claimed under backfill policy, not yet due to send.
- `pending`: claimed for delivery or currently being attempted.
- `sent`: Discord accepted the payload; normal polling must not send it again.
- `failed`: the last attempt failed and may be retried under policy.

The initial insert (claiming `ignored`, `queued`, or `pending`) is the atomic guard, per the async/workflow standard on atomic transition guards: an `INSERT ... ON CONFLICT DO NOTHING` on `dedupe_key`, not a stale read followed by an unconditional write, so overlapping Cron invocations can't both claim and send the same entry.

## Malformed entries

A feed entry that fails `MediaEntry` schema decoding is never silently dropped and never fails the entire feed/run. `QuarantineStore` writes the raw source payload, source ID, and schema decode error to D1. The run also emits a structured `Feed entry quarantined` warning with the safe source ID. Cloudflare Workers Logs is enabled in `alchemy.run.ts`, so the warning is searchable in the Workers Observability dashboard without adding another service.

Workers Logs does not provide a domain-specific alert for this event. If search-only visibility stops being enough, add a Tail Worker that filters these warnings and calls a notification endpoint, or export Worker telemetry through OpenTelemetry to an alerting system. Do not put the raw quarantined payload or webhook secret in logs.

A feed that is entirely unreachable or entirely unparseable (e.g. the URL 404s, or the body isn't valid XML/JSON at all) is a `FeedUnreachable`/`FeedFormatUnsupported` failure for that source only; other sources in the same run are unaffected.

## Retries, edits, and removals

A failed Discord delivery gets up to five retries after its first attempt. The first retry is due after five minutes; later delays double to 10, 20, 40, and 80 minutes. D1 stores the attempt count and last failure time, and the atomic retry update prevents two overlapping Cron runs from claiming the same retry.

For a sent entry, the ledger compares the stored normalized payload with the current payload. If it changed, `DiscordPublisher` sends `PATCH /webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`. The ledger stores the new payload only after Discord accepts the edit, so a failed patch remains due on the next poll.

The Worker never deletes a Discord message when its source entry disappears or returns to draft. For a source with `absenceMeansRemoved: true`, it compares the complete feed with sent ledger rows, records `source_missing_at`, and writes one structured warning for the transition. If the entry appears again, the Worker clears that marker. Rolling external feeds must set `absenceMeansRemoved: false`, because absence there only means that an old item fell out of the feed.

## Discord payload

```json
{
  "allowed_mentions": {
    "parse": []
  },
  "embeds": [
    {
      "title": "Should You Read the Code?",
      "url": "https://guidefari.com/should-you-read-the-code/",
      "description": "The Primeagen on when to ignore code, when to read every line, and when to design the interface and let AI fill in the rest.",
      "author": {
        "name": "The Primeagen"
      },
      "fields": [
        {
          "name": "Media type",
          "value": "youtube",
          "inline": true
        },
        {
          "name": "Media URL",
          "value": "https://www.youtube.com/watch?v=k13q6ecZLrw"
        },
        {
          "name": "Tags",
          "value": "media, video"
        }
      ],
      "thumbnail": {
        "url": "https://i.ytimg.com/vi/k13q6ecZLrw/hqdefault.jpg"
      },
      "timestamp": "2026-07-25T22:00:00.000Z"
    }
  ]
}
```

`allowed_mentions.parse` remains empty so titles, descriptions, creator names, and tags cannot ping Discord users or roles. Production code enforces Discord's embed length limits and omits optional empty fields rather than sending invalid values. This projection is the `DiscordEmbedPayload` Domain Module described above.

## Alternatives considered

### GitHub Actions git diff on push

This is the fastest first-party-only implementation because a deployment can diff commits and post newly added media files. It is not the recommendation because it cannot discover external feed entries, and workflow retries can repeat a successful webhook call because Discord offers no idempotency key. It also ties delivery history to transient CI runs rather than a queryable ledger, and doesn't support backfill trickling.

The dry-run script in this change is useful for payload exploration, but it is deliberately not the production delivery path.

### Cron logic on the existing site Worker

Cloudflare could attach scheduled handling and D1 bindings to the existing site Worker. This is not the recommendation because it mixes feed ingestion, retry policy, delivery state, and webhook secrets with the static site's serving responsibility. A dedicated Worker keeps deployment and failures isolated while still allowing both resources to be managed by Alchemy.
