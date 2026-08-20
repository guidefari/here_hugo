ALTER TABLE discord_deliveries
  ADD COLUMN backfill_released_at TEXT;

CREATE INDEX discord_deliveries_backfill_release_idx
  ON discord_deliveries (source_id, backfill_released_at);
