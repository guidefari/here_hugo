# Context

Ubiquitous language for this repo. Glossary only — no implementation details.

## Media asset store console

The admin console for uploading and managing media files. Separate from the public Astro site; see [Map: Media asset store console](https://github.com/guidefari/here_hugo/issues/8).

### Asset

A single uploaded media file and its record. Immutable once uploaded — the bytes never change. An asset has a **kind** (image, audio, or video) and lives in R2 under its **storage key**. Renaming or tagging an asset never alters the file or its URL; only its editable metadata changes.

### Kind

The category of an asset: `image`, `audio`, or `video`. A fixed enum. Drives nothing structural in v1 (one table holds all kinds) — it exists for filtering and future per-kind behaviour.

### Storage key (`r2_key`)

The immutable, unique identifier of the asset's bytes in R2. Set once at upload, never changed. Distinct from the **title**: renaming an asset edits the title, not the storage key, so the file's public URL stays stable and any already-pasted links keep working.

The key is the file's **original filename**, kept readable in the public URL. On a name clash it is auto-suffixed (`photo.jpg` → `photo-2.jpg`) so uploads never fail the uniqueness rule. The key is decided at upload-initiation (before the file is sent), because the public URL is derived from it and must be known up front.

### Title

The human-editable display name of an asset. What "rename" changes. Distinct from **original filename** (the name the file had when uploaded, kept for reference) and from the **storage key** (immutable).

### Public URL

The stable, hostable URL an asset is served from — what the user copies and pastes into Astro content. Stability is the point: it must not change when the asset is renamed or retagged. It is `https://media.guidefari.com/<storage-key>` — a public-read R2 bucket bound to a custom domain, CDN-cached, no Worker on the read path. The full URL is stored on the asset record (not recomputed) so records stay decoupled from the serving domain.

### Tag

A free-text label the user attaches to an asset for later filtering (e.g. `artist-photo`, `bliki-diagram`). An asset carries zero or more tags.

### Presign

The first step of the two-step upload. Given a filename, content type, and size, the console mints the asset's **storage key** (auto-suffixed on clash) and a signed URL the browser PUTs the bytes to. From this moment the **public URL** is known, before any bytes move.

### Finalize

The second step of the two-step upload. The browser confirms the PUT completed and the console creates the **asset** record, verifying against the stored object: size and type are read from the object itself, not from the client's say-so. Client-driven in place of a storage webhook. Repeating a finalize returns the existing record; it never creates a duplicate.
