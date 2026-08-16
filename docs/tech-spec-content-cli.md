# Tech spec: Content creation CLI

**Status:** implemented  
**Last checked:** 2026-08-10

## Summary

`bun run content:new <content-path>` creates one Markdown file using the archetype configured for the path’s first segment:

```sh
bun run content:new note/asymmetric-bets
bun run content:new til/hugo-mount-config
bun run content:new media/a-good-talk
```

It writes beneath the Astro content root, fills creation-time placeholders once, and never overwrites a file. There is no `--kind` flag: the path selects the archetype.

## Explicit configuration

Repository layout and every supported archetype are visible in the repository-root `content-cli.config.json`:

```json
{
  "contentRoot": "apps/v2/src/content",
  "archetypes": {
    "note": "apps/content-cli/archetypes/note.md",
    "til": "apps/content-cli/archetypes/til.md"
  }
}
```

The checked-in file contains all current leaf-content sections: `album`, `artist`, `bliki`, `book`, `docker-presentation`, `media`, `mix`, `note`, `playlist`, `read`, `resource`, `til`, and `track`. `writing` is excluded because it is a section index, not a content type.

Both the content root and every archetype path are repository-relative. The CLI parses the JSON with Effect Schema and refuses malformed, absolute, or repository-escaping paths. Moving the site’s content directory or an archetype requires only a config edit.

## Archetypes

Archetypes live in `apps/content-cli/archetypes`. The music, book, resource, read, and TIL templates retain the useful front matter defaults from the former Hugo archetypes. They use the active `og.guidefari.com` image URL and deliberately omit Hugo shortcodes; Astro content uses normal Markdown and embeds instead.

Each template supports these literal placeholders:

| Placeholder | Value |
| --- | --- |
| `{{title}}` | YAML-escaped filename title |
| `{{date}}` | Current local RFC 3339 timestamp |
| `{{path}}` | Content-root-relative output path, including `.md` |
| `{{urlEncodedTitle}}` | URL-encoded title |

Unknown or malformed placeholders fail before content is written.

## Safety and design

Effect Schema parses argv, configuration, and content paths. Effect `FileSystem`, `Path`, and `Clock` services supply the runtime boundary. The CLI validates a path before filesystem use, creates parent folders, and uses exclusive creation so concurrent commands cannot replace existing content.

Expected failures are typed: invalid configuration/path, unconfigured or missing archetype, invalid archetype, existing content, and filesystem errors. The entrypoint maps them to safe diagnostics and non-zero exit codes.

## Verification

```sh
bun run content:check
bun run content:test
bun run build
```

The test suite uses a fixed clock and temporary real filesystem fixtures. It covers configuration parsing, path and section selection, rendering, invalid templates, and exclusive creation.

## Astro schema

`apps/v2/src/content.config.ts` remains Zod-based. Astro 7 requires Zod internals for runtime parsing and content type generation, so it cannot infer directly from an Effect Schema. The CLI uses Effect Schema at its own configuration and argv boundaries; the Astro collection remains its own framework boundary.
