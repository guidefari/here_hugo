# Discord media cross-posting

Exploratory design for Linear issue OPS-137: cross-post new media entries to a Discord channel, with an eventual opt-in path for media from friends' blogs.

## Current constraints

- Infrastructure is declared with Alchemy in `alchemy.run.ts` and deployed to Cloudflare.
- The site is an Astro static build. Alchemy runs the build and serves `apps/v2/dist` through `apps/v2/src/site-worker.ts`.
- Media entries are Markdown files under `apps/v2/src/content/media/*.md`. Their shared Astro frontmatter schema includes `title`, `date`, `description`, `creator`, `media_type`, `media_url`, `tags`, and `images`.
- `media` is a flattened content section. A file such as `media/should-you-read-the-code.md` has the canonical entry URL `https://guidefari.com/should-you-read-the-code/`, not a URL nested under `/media/`.
- Astro already generates `/media/index.xml`, but its current RSS items contain the title, canonical link, description, publication date, and rendered body rather than every media-specific field.
- A static build cannot initiate a cross-post when an entry becomes public. The trigger must run in deployment automation or in separate runtime infrastructure.

## Recommendation

Deploy a dedicated Cloudflare Worker with a Cron Trigger, separate from the site Worker. On each run it should poll a first-party media feed generated from Astro content and every enabled friend feed, normalize all entries through one ingestion path, and deliver unseen entries to Discord.

The first-party feed should expose stable entry identity and the media metadata needed for the Discord payload. This can be an enriched version of the existing media feed or a dedicated JSON Feed. Keeping it build-generated means published Astro content remains the source of truth while the cross-posting Worker remains independent from the static site request path.

The Worker should use D1 as a delivery ledger. Discord webhooks do not accept an idempotency key, so the Worker must decide whether an entry has already been attempted or sent before making a request. The ledger also makes retries and operational inspection explicit instead of relying on a feed cursor held in memory.

The processing path is:

1. Load the first-party source and enabled friend feed configuration.
2. Fetch each feed and parse its declared format.
3. Normalize each feed item into one internal media-entry shape.
4. Derive a dedupe key from the source ID and stable entry identity.
5. Insert or inspect the D1 delivery row.
6. Mark a new row `pending`, send its Discord payload, then mark it `sent` with the Discord message ID when available.
7. Mark an unsuccessful delivery `failed` with safe failure metadata and retry it according to an explicit retry policy.

The webhook request and D1 update cannot be one atomic transaction. A crash after Discord accepts the message but before D1 records `sent` can still produce a duplicate on retry. The ledger reduces routine duplication and makes this narrow ambiguity visible, but cannot provide exactly-once delivery without support from Discord.

## Friend feed configuration

Friend sources should be explicit and opt-in. A minimal configuration shape is:

```ts
type FriendFeed = {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly feedUrl: string;
  readonly format: "json-feed" | "rss" | "atom";
  readonly initialSync: "skip-existing";
};
```

`id` is the stable source namespace used in dedupe keys and must not change when the display name or feed URL changes. `initialSync: "skip-existing"` records the initial contents without posting them, preventing an accidental channel flood when a source is enabled. Other backfill modes should only be added after the owner chooses a policy.

All formats should normalize into the same internal fields: source ID, source entry identity, title, canonical entry URL, description, creator, media type, media URL, tags, thumbnail URL, and publication timestamp. A source item should be rejected or quarantined if it cannot supply a stable identity and canonical URL.

## D1 delivery ledger

A minimal table shape is:

```sql
CREATE TABLE discord_deliveries (
  dedupe_key TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  entry_identity TEXT NOT NULL,
  entry_url TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'sent', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  discord_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT
);
```

The dedupe key should be a deterministic hash or unambiguous encoding of `source_id + entry_identity`. For the first-party source, entry identity can be the canonical URL or a stable feed ID derived from it. Friend feeds should prefer a feed GUID or JSON Feed item ID, falling back to the canonical item URL only when its stability is trustworthy.

State meanings:

- `pending`: claimed for delivery or currently being attempted.
- `sent`: Discord accepted the payload; normal polling must not send it again.
- `failed`: the last attempt failed and may be retried under policy.

An atomic insert of the initial `pending` row should be the claim operation so overlapping Cron invocations do not both send the same newly discovered entry.

## Discord payload

The production ingestion path should project normalized entries into a webhook payload like this. The preview script uses the same shape for first-party frontmatter.

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

`allowed_mentions.parse` remains empty so titles, descriptions, creator names, and tags cannot ping Discord users or roles. Production code should enforce Discord's embed length limits and omit optional empty fields rather than sending invalid values.

## Alternatives considered

### GitHub Actions git diff on push

This is the fastest first-party-only implementation because a deployment can diff commits and post newly added media files. It is not the primary recommendation because it cannot discover friend feed entries, and workflow retries can repeat a successful webhook call because Discord offers no idempotency key. It also ties delivery history to transient CI runs rather than a queryable ledger.

The dry-run script in this change is useful for payload exploration, but it is deliberately not the production delivery path.

### Cron logic on the existing site Worker

Cloudflare could attach scheduled handling and D1 bindings to the existing site Worker. This is not the primary recommendation because it mixes feed ingestion, retry policy, delivery state, and webhook secrets with the static site's serving responsibility. A dedicated Worker keeps deployment and failures isolated while still allowing both resources to be managed by Alchemy.

## Open questions

1. Which Discord channel should receive posts, and is one embed per entry the desired presentation?
2. How much delay between site publication and Discord delivery is acceptable? This determines the Cron frequency.
3. Should the first sync skip all existing entries, backfill a fixed time window, or post a fixed number of recent entries?
4. Which friend feed formats should be supported first: JSON Feed, RSS, Atom, or a smaller initial subset?
5. Should an edited entry update its prior Discord message, post a correction, or remain unchanged?
6. How should drafts, entries deleted after publication, and entries removed from a friend feed be handled?
7. Should malformed feeds or malformed individual entries fail the whole source, be skipped with diagnostics, or be quarantined for review?
8. What retry limit, backoff, and owner notification should apply to failed deliveries?
9. Is D1 acceptable as added infrastructure for the delivery ledger?
