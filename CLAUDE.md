# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run build` - Build Tailwind CSS styles (input: assets/css/tailwind.css → output: assets/css/style.css)
- `npm run watch` - Watch for Tailwind CSS changes during development
- `npm run dev` - Start Hugo dev server with live reload and watch CSS changes concurrently
- `hugo server` - Start Hugo development server (manual CSS build required)
- `hugo` - Build static site for production

### Content Creation
Use Hugo archetypes in `/archetypes/` for new content:
- `hugo new album/name.md`
- `hugo new artist/name.md`
- `hugo new book/name.md`
- `hugo new note/name.md`
- `hugo new til/name.md`
- `hugo new read/name.md`
- `hugo new playlist/name.md`
- `hugo new track/name.md`
- `hugo new mix/name.md`
- `hugo new podcast/name.md`
- `hugo new resource/name.md`
- `hugo new bookmark/name.md`
- `hugo new tweet/name.md`
- `hugo new repost/name.md`

## Architecture Overview

This is a Hugo static site generator blog with Tailwind CSS styling focused on software engineering, music, and personal knowledge management.

### Content Structure
- `/content/` - All blog content organized by type
  - `note/` - Technical notes and observations
  - `book/` - Book reviews and notes
  - `til/` - Today I Learned entries
  - `read/` - Reading list entries (numbered sequentially)
  - `playlist/`, `track/`, `album/`, `artist/`, `mix/` - Music-related content
  - `podcast/` - Podcast notes and reviews
  - `bliki/` - Blog/wiki hybrid posts
  - `resource/` - Resource collections and links

### Theme and Styling
- Custom Hugo theme in `/layouts/` with partials system
- Tailwind CSS configuration in `tailwind.config.js` with custom color scheme
- Dark mode support configured via `params.mode: auto` in config
- Typography plugin for enhanced content styling

### Key Features
- Git-based frontmatter dates (lastmod from git history)
- Custom permalinks structure (/:filename/ for clean URLs)
- RSS feeds for all sections
- Multiple content archetypes with custom fields
- Spotify, Bandcamp, and YouTube embeds via shortcodes
- Mermaid diagram support

### Layout System
- Base template: `layouts/_default/baseof.html`
- Content types use `layouts/_default/single.html` and `layouts/_default/list.html`
- Custom shortcodes in `/layouts/shortcodes/` for embeds and callouts
- Responsive navigation and footer in `/layouts/partials/`

### Content Guidelines
- Music content uses custom frontmatter fields (artist, album, etc.)
- All content uses filename-based permalinks (config.yaml Permalinks section)
- Reading list entries follow numbered sequence (1.md, 2.md, etc.)
- TIL entries are prefixed with dates or descriptive titles
- Auto-generated OG images via `images-here-hugo.vercel.app` API in frontmatter
- Git-based lastmod dates automatically populated from commit history

### Deployment
- Netlify deployment with Hugo 0.140.2
- Build command: `npm run build && hugo`
- Output directory: `public/`