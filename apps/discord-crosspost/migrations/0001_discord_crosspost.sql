CREATE TABLE discord_deliveries (
  dedupe_key TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  entry_identity TEXT NOT NULL,
  entry_url TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('queued', 'pending', 'sent', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  discord_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT
);

CREATE INDEX discord_deliveries_backfill_idx
  ON discord_deliveries (source_id, state, created_at);

CREATE TABLE discord_quarantine (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT NOT NULL,
  raw_payload TEXT NOT NULL,
  decode_error TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX discord_quarantine_source_idx
  ON discord_quarantine (source_id, created_at);
