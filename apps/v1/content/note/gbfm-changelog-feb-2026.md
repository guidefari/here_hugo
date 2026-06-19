---
title: "goosebumps.fm changelog - feb 2026"
date: 2026-02-01T00:38:15+02:00
description: "Kapil asked me what I've been doing in the goosebumps codebase lately."
tags: [retro, strategy]
images:
  [
    "https://images-here-hugo.vercel.app/api/og-image?title=gbfm+changelog+Feb+2026",
  ]
---

After I mentioned that a lot of my energy's been getting spent on the goosebumps codebase,
Kapil asked me what's been cooking in there. I figured it'd be a good moment to get my head out the gutter and take stock.

## Overview

The work spans multiple areas: **Radio Shows**, **User Profiles**, **QR Code Generation**, **Admin Tooling**, **Observability**, and **Platform Infrastructure**.

---

## Major Features

### 1. Radio Shows System (Full Implementation)

Perhaps the **main thing**, a radio shows feature was built to support a new resident DJ, [\[kimetsu.\]](https://goosebumps.fm/kimetsu) on the platform.

**Commits:** [`0436146`](https://github.com/guidefari/gbfm/commit/0436146), [`132fabf`](https://github.com/guidefari/gbfm/commit/132fabf), [`834ed96`](https://github.com/guidefari/gbfm/commit/834ed96), [`d13262d`](https://github.com/guidefari/gbfm/commit/d13262d), [`33edb38`](https://github.com/guidefari/gbfm/commit/33edb38), [`196161f`](https://github.com/guidefari/gbfm/commit/196161f), [`6135572`](https://github.com/guidefari/gbfm/commit/6135572), [`eba130d`](https://github.com/guidefari/gbfm/commit/eba130d), [`a658638`](https://github.com/guidefari/gbfm/commit/a658638)

- **Backend:** New `show.service.ts`, `show.schema.ts`, routes for CRUD operations on shows
- **Database:** Multiple migrations adding shows table, show slugs, banner images, host relationships
- **Frontend:** Show listing pages, show detail pages with banners, episode grids, subscribe buttons
- **User Subscriptions:** Users can subscribe to shows and manage subscriptions
- **Slug Resolution:** Dynamic routing system (`$slug.tsx`) that resolves slugs to either shows or user profiles, like `twitter.com/username`
- **Favourites:** Added `show` support to the favourites system

---

### 2. User Profiles & Identity System

**Commits:** [`dca8d78`](https://github.com/guidefari/gbfm/commit/dca8d78), [`3ff6b33`](https://github.com/guidefari/gbfm/commit/3ff6b33), [`fd308bd`](https://github.com/guidefari/gbfm/commit/fd308bd), [`86676b4`](https://github.com/guidefari/gbfm/commit/86676b4)

- **Username system:** Added `username` field to auth schema with migration
- **Display names:** Separate display names from usernames (I still need to clean this up, there's display name, name (which better-auth **needs** ??), and username)
- **Public profiles:** New profile routes (`/profile/$username`) with profile header and content grid components
- **Reserved slugs:** System to prevent users from claiming reserved slugs (like "admin", "api", etc.) - implemented in `lib/reserved-slugs.ts`. I want to automate this in the future.
- **Username availability checks:** Real-time validation in admin and signup flows (basically built into the `better-auth` package)
- **Admin user creation:** Admins can now create and edit users with full control over username, display name, profile image, and email verification status

---

### 3. QR Code Service & Access Control

**Commits:** [`75b6394`](https://github.com/guidefari/gbfm/commit/75b6394), [`ba9e646`](https://github.com/guidefari/gbfm/commit/ba9e646), [`4847842`](https://github.com/guidefari/gbfm/commit/4847842), [`c84d587`](https://github.com/guidefari/gbfm/commit/c84d587)

- **New QR Service:** Full QR code generation service (`qrcode.service.ts` - 561 lines)
- **S3 Operations:** Extracted S3 operations into dedicated `s3.service.ts` with object listing capability (separate refactor - S3 is used across multiple services)
- **Cron Job Cleanup:** Automated cleanup of expired QR PDF files from S3 (`qr-cache-cleanup.ts`). Effect's [Schedule](https://effect.website/docs/scheduling/introduction/) and [runFork](https://effect.website/docs/concurrency/fibers/#forking-effects) makes it trivial to add cron jobs to my app.
- **Access Control:** QR download functionality restricted to admin and creator roles only

**Reasoning:** The QR codes allow physical distribution (flyers, posters, social media) that link to digital content. The cleanup cron prevents S3 bloat, and access control protects premium/paid features.

---

### 4. Mix Upload Flow

**Commits:** [`db49d8f`](https://github.com/guidefari/gbfm/commit/db49d8f), [`376862e`](https://github.com/guidefari/gbfm/commit/376862e)

- Enhanced mix upload UI with improved HTTP client integration
- Simplified upload interface
- Audio player with timestamp support for tracklist editing (UI only for now, I still want to make proper time to polish the editing/cms experience)

---

### 5. Newsletter Subscription System

**Commits:** [`834ed96`](https://github.com/guidefari/gbfm/commit/834ed96)

- New `newsletter.schema.ts` with database table
- Newsletter API routes (`/newsletter/*`)
- Frontend subscription page redesign (`subscribe.tsx`)
- Added to command palette navigation

**Reasoning:** Standard growth/retention feature to keep users engaged.

I need to come back to this one for a proper round of testing. I squeezed it in while busy with other stuff.

---

### 6. Admin Dashboard Enhancements

**Commits:** [`834ed96`](https://github.com/guidefari/gbfm/commit/834ed96), [`86676b4`](https://github.com/guidefari/gbfm/commit/86676b4), [`3ff6b33`](https://github.com/guidefari/gbfm/commit/3ff6b33), [`fd308bd`](https://github.com/guidefari/gbfm/commit/fd308bd)

- **Shows Tab:** Full admin management for radio shows (509 lines of UI)
- **User Search:** Searchable user list with autocomplete (`UserSearch.tsx`)
- **User Editing:** Enhanced editing including username, display name, profile image, email verification
- **Sessions Tab:** Session management improvements

---

### 7. Observability & Monitoring

Spent a lot of time on this one. next steps:

- Grafana cloud integration
- Posthog logs
- Analytics abstraction layer, plus the conforming posthog implementation
  - might be worth doing a FE logging abstraction layer as well

**Commits:** [`3723b98`](https://github.com/guidefari/gbfm/commit/3723b98), [`08e8d4a`](https://github.com/guidefari/gbfm/commit/08e8d4a), [`951ae11`](https://github.com/guidefari/gbfm/commit/951ae11)

- **Performance Monitoring:** Enhanced `performance-monitoring.ts` with more metrics
- **Structured Logging:** Added logging spans throughout services (audio, email, favorite, label, profile, publication, release, s3, show, spotify, user)
- **Grafana Cloud:** Initial configuration work (`config.service.ts`)
- **Documentation:** Updated `logging-implementation-progress.md` and `opentelemetry-stack.md`

**Reasoning:** The platform is maturing and needs proper observability for production reliability and debugging.

---

## Refactoring & Code Quality

### Effect Type System Fixes

**Commits:** [`593c21f`](https://github.com/guidefari/gbfm/commit/593c21f), and others

- Massive refactoring of services to fix Effect type errors across 26+ files
- Changes in audio, email, favorite, label, music-reminder, profile, publication, release, show, spotify, user services
- Documentation added: `effect-language-service-typecheck-ci-mismatch.md`

### Infrastructure Consolidation

**Commits:** [`eda9476`](https://github.com/guidefari/gbfm/commit/eda9476)

- Consolidated GitHub workflows: merged `quality-gate.yml` into `release.yml`

### Development Experience

**Commits:** [`726d864`](https://github.com/guidefari/gbfm/commit/726d864), [`f629703`](https://github.com/guidefari/gbfm/commit/f629703)

- SSL handling improvements for local vs production database connections
- Database mirroring from prod to local for development

---

## Bug Fixes

| Commit                                                        | Description                                                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`da3c9a3`](https://github.com/guidefari/gbfm/commit/da3c9a3) | Fixed play mix button functionality                                                           |
| [`cbbc976`](https://github.com/guidefari/gbfm/commit/cbbc976) | Reverted to absolute positioning for music player (not happy about this one, I'll be back...) |
| [`d1ae448`](https://github.com/guidefari/gbfm/commit/d1ae448) | Fixed mobile responsive mixes page                                                            |

---

## CI/CD & Tooling

**Commits:** [`cec8c41`](https://github.com/guidefari/gbfm/commit/cec8c41), [`eda9476`](https://github.com/guidefari/gbfm/commit/eda9476), [`c95b6ca`](https://github.com/guidefari/gbfm/commit/c95b6ca)

- Lefthook: Format on commit hooks. I kept getting too many pipeline failures, triggered by formatting. waste of time.
- Consolidated deployment pipeline
- Claude Code workflow added (`.github/workflows/claude.yml`)

---

## Documentation

**Commits:** [`8197f44`](https://github.com/guidefari/gbfm/commit/8197f44), [`ab4262b`](https://github.com/guidefari/gbfm/commit/ab4262b)

- Documentation reorganized into subdirectories
- Image processing service documentation added (840 lines)
- OpenTelemetry stack documentation updates (had to pause this work mid flight to move attention to radio shows due to the looming deadline.)

---

## Summary Statistics

- **Total Releases:** 8 (v2.4.0 → v2.12.0)
- **Feature Commits:** ~25
- **Bug Fix Commits:** ~6
- **Chore/Refactor Commits:** ~15
- **Key Files Changed:** 677+ across the major restructure
- **Primary Focus Areas:** Radio Shows, User Profiles, QR Codes, Admin Tools, Observability
