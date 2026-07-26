# Discord media cross-posting

Exploratory design for Linear issue [OPS-137](https://linear.app/guidefari/issue/OPS-137): cross-post new media entries to a Discord channel, with an opt-in path for media sourced from external feeds (not just this site's own content).

Status: shaped and decided on the points below via PR review. Still not implemented.

## Decisions from review

These were open questions in the previous revision of this doc. Answers below are settled; implementation should follow them rather than re-litigate.

1. **Naming**: "external feed" / "feed", not "friend feed". The feature is opt-in per feed, sourced from anyone, not specifically friends.
2. **Parsing/validation**: Effect Schema, throughout. See [Effect shape](#effect-shape).
3. **Channel + secrets**: the Discord webhook URL (which encodes the channel) is provided as a deploy-time secret, bound into the Worker via Alchemy. See [Secrets](#secrets).
4. **Cron frequency**: every 5 minutes to start.
5. **Backfill**: fixed time window on first sync, trickled out on a schedule rather than posted all at once, so enabling a feed doesn't flood the channel. Configurable at deploy time or runtime. See [Backfill](#backfill).
6. **Feed formats**: support all of JSON Feed, RSS, and Atom from the start.
7. **Drafts**: never post a draft. When an entry transitions from draft to published, it posts normally at that point, as a new discovery (dedupe identity is stable across the transition; see [D1 delivery ledger](#d1-delivery-ledger)).
8. **Malformed entries**: never fail silently. Quarantine for review (persisted, visible, inspectable), not a silent skip and not a hard failure of the whole feed.
9. **Runtime**: the Worker is an Effect application. D1 is approved as added infrastructure.

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
- `SourceConfig`: resolves first-party + external feed configuration (see [Feed configuration](#feed-configuration)) into parsed `FeedSource[]` at startup/composition, not re-read per run.
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
  readonly backfill: BackfillPolicy;
};
```

`id` is the stable source namespace used in dedupe keys and must not change when the display name or feed URL changes.

This should be an Effect Schema (`FeedSourceConfig`), parsed once at Worker startup/composition from wherever it's stored (see open question 1), not re-validated per run.

## Backfill

When a source is newly enabled, entries within a fixed lookback window (e.g. the last N days: exact window is an open question) are claimed into the ledger as `queued` rather than `pending`, instead of either posting nothing or posting the whole backlog at once. Each Cron run, a small bounded number of `queued` rows are promoted to `pending` and sent, trickling the backfill out over multiple runs rather than flooding the channel in one burst.

Promotion selects directly from the ledger by `source_id` and `state = 'queued'`, ordered by `created_at`, with no dependency on whether an entry still appears in the current run's live feed fetch. A feed only returning its most recent N items (the normal case for RSS/Atom/JSON feeds) must not be able to strand a backfilled entry that has since scrolled out of that window: the ledger, not the current poll, is the source of truth for what's still owed. To make that possible without re-fetching or re-parsing the original feed, the ledger row stores the full normalized `MediaEntry` payload at claim time (see [D1 delivery ledger](#d1-delivery-ledger)), so a promoted row carries everything needed to build its Discord embed.

```ts
type BackfillPolicy = {
  readonly windowDays: number;
  readonly maxPerRun: number;
};
```

This needs to be configurable per source at deploy time, with a sensible runtime override for one-off cases (an open question below is whether runtime configurability is worth the added surface, or deploy-time-only is enough to start).

## D1 delivery ledger

```sql
CREATE TABLE discord_deliveries (
  dedupe_key TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  entry_identity TEXT NOT NULL,
  entry_url TEXT NOT NULL,
  payload TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('queued', 'pending', 'sent', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  discord_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT
);
```

`payload` is the claimed entry's full normalized `MediaEntry`, stored as JSON at claim time. This is what makes the ledger a genuine source of truth for promotion and delivery: a `queued` row can be promoted and sent using only what's stored on the row, without needing the entry to still be present in whatever the most recent feed poll happened to return.

The dedupe key is a deterministic encoding of `source_id + entry_identity`. For the first-party source, entry identity can be the canonical URL or a stable feed ID derived from it. External feeds should prefer a feed GUID or JSON Feed item ID, falling back to the canonical item URL only when its stability is trustworthy.

Because drafts are excluded from the first-party feed entirely (constraint above), a draft entry has no `entry_identity` until it's published: the draft-to-published transition is not a ledger state change, it's the entry's first appearance in the feed, claimed fresh like any new entry.

State meanings:

- `queued`: claimed under backfill policy, not yet due to send.
- `pending`: claimed for delivery or currently being attempted.
- `sent`: Discord accepted the payload; normal polling must not send it again.
- `failed`: the last attempt failed and may be retried under policy.

The initial insert (claiming `queued` or `pending`) is the atomic guard, per the async/workflow standard on atomic transition guards: an `INSERT ... ON CONFLICT DO NOTHING` on `dedupe_key`, not a stale read followed by an unconditional write, so overlapping Cron invocations can't both claim and send the same entry.

## Malformed entries

A feed entry that fails `MediaEntry` schema decoding is never silently dropped and never fails the entire feed/run. It's written to a `QuarantineStore` (D1-backed) with the raw source payload, the source ID, and the schema decode error, then surfaces in an inspectable list (a small internal page, a log-based alert, or a periodic digest: the presentation is an open question below; the requirement is that it's visible, not that it's paged immediately).

A feed that is entirely unreachable or entirely unparseable (e.g. the URL 404s, or the body isn't valid XML/JSON at all) is a `FeedUnreachable`/`FeedFormatUnsupported` failure for that source only; other sources in the same run are unaffected.

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

## Open questions

Narrowed down from the previous revision now that the architecture and most policy choices are settled:

1. Where does `FeedSource` configuration live: checked into the repo (e.g. a config file read at build/deploy time), or a runtime-editable store (D1 table, KV)? Deploy-time-only is simpler; runtime-editable makes enabling a new external feed not require a redeploy.
2. Exact backfill lookback window (`windowDays`) and trickle rate (`maxPerRun`): what feels right, given posts happen every 5 minutes?
3. Where should quarantined entries actually surface: a log line picked up by existing alerting, a small internal-only page, a periodic digest, something else?
4. What retry limit and backoff should apply to `failed` deliveries before they stop retrying automatically?
5. Should an edited entry (title/description changed after it already posted) update its Discord message via `PATCH`, post a correction, or remain unchanged? Not decided yet: only draft-to-published timing was.
6. How should an entry that was published and cross-posted, then later deleted or reverted to draft, be handled on the Discord side: leave the message, or attempt to delete/edit it?
