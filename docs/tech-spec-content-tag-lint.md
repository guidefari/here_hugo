# Tech spec: Allowed article tags

**Status:** proposed

## Summary

Add an Effect-based content CLI command that checks article Markdown under `apps/v2/src/content` against a checked-in list of allowed tags. Seed that list once from every distinct tag already in the archive. A new tag then requires a deliberate edit to the list. Keep the list readable so authors can see what they may use.

Run the check through `bun run content:check` alongside the existing TypeScript check. Do not use an Oxlint plugin: Oxlint's JavaScript plugin API does not yet support custom Markdown parsers.[^oxlint]

## Context and constraints

- Astro loads Markdown from the whole content root; its schema accepts `tags` as an optional array of strings. Site rendering and tag links use the stored labels and `tagSlugify` in `apps/v2/src/lib/content.mjs`.
- `apps/content-cli` already has an Effect CLI, Effect Schema, Bun services, and real-filesystem tests. `content:check` currently runs only TypeScript checking. `content:new` renders archetypes, including a note template with `tags: [note]`.
- A read-only inventory of the current content root found 537 Markdown files, 270 distinct tag strings, and 17 files without a `tags` field. One file is an empty placeholder (`frontpage.md`) and another is an `AGENTS.md` instruction file, not an article.
- Existing tags include spelling and case variants. Do not silently rename tags or change URL slugs. Seed *every distinct string* as it appears today, even if two strings look redundant.
- This is static analysis only. Do not change Astro's frontmatter schema, tag URLs, article content, or the creation command's output as part of the checker.

## Goals and non-goals

The author can inspect one committed allowlist and run one command to find disallowed tags in any existing or new article. Diagnostics identify the file and offending value; the command checks all files, reports all findings, and exits nonzero on failure. A clean archive passes.

Do not enforce a series-specific vocabulary, normalize case, ban duplicates, auto-fix articles, or derive allowed tags from content at lint time. The recently agreed `[typescript, graphics]` for the GPU series is content guidance, not a global rule.

## Alternatives considered

1. **Oxlint plugin:** integrates with code linting, but the input is Markdown frontmatter and Oxlint JS plugins cannot provide a custom Markdown parser today. Reject.
2. **Astro schema refinement:** would reject disallowed tags at build/content-load time, but mixes editorial policy into the site runtime and offers poor batch diagnostics. Reject as the primary check.
3. **Separate Effect CLI in `apps/content-cli`:** reuses the existing toolchain, scans Markdown directly, and owns clear diagnostics without changing site behavior. Choose this.

## Proposed contracts

The checked-in `content-tags.json` is the **only** allowed-tag catalog:

```json
{
  "allowedTags": ["graphics", "typescript"]
}
```

The example shows the shape, not the complete 270-item initial catalog. The committed file must contain all distinct existing tag strings, sorted for review. Additions and removals are manual changes; the checker never rewrites it. In the CLI, parse it with Effect Schema as a nonempty, unique array of nonempty strings. Treat duplicates in the catalog as invalid configuration. Compare labels by exact string equality. The catalog itself exposes the allowed tags; an extra listing command is unnecessary.

```ts
type AllowedTags = ReadonlySet<string>;
type TagFinding = {
  readonly relativePath: string;
  readonly tag: string;
  readonly kind: "unknown-tag";
};
type ContentFinding =
  | TagFinding
  | { readonly relativePath: string; readonly kind: "invalid-frontmatter" | "invalid-tags"; readonly reason: string };

type TagLintReport = {
  readonly filesChecked: number;
  readonly findings: ReadonlyArray<ContentFinding>;
};

declare function parseAllowedTags(input: unknown): Effect.Effect<AllowedTags, InvalidTagCatalog>;
declare function inspectTags(relativePath: string, frontmatter: unknown, allowed: AllowedTags): ReadonlyArray<ContentFinding>;
declare function lintContentTags(repositoryRoot: string): Effect.Effect<
  TagLintReport,
  InvalidTagCatalog | ContentScanFailed,
  FileSystem.FileSystem | Path.Path
>;
```

The types are contract sketches. `InvalidTagCatalog` and `ContentScanFailed` are tagged expected failures with safe file/operation context, following `apps/content-cli/src/errors.ts`. Parse YAML as `unknown` at the file boundary, then inspect only the optional `tags` property. Missing `tags` and `tags: []` are valid, matching Astro. A present non-array or non-string member produces `invalid-tags`; an unknown string produces `unknown-tag`. A missing or malformed frontmatter block produces `invalid-frontmatter`. Do not validate unrelated frontmatter fields.

## Seams and data flow

```text
bun run content:check
  -> TypeScript check (existing)
  -> bun run content:lint-tags
     -> CLI entrypoint finds repository root
     -> read and parse content-tags.json -> AllowedTags
     -> recursively enumerate *.md under configured contentRoot, excluding AGENTS.md
     -> read each nonempty file -> extract YAML frontmatter -> Bun.YAML.parse -> unknown
     -> inspectTags -> TagLintReport
     -> sorted, readable diagnostics -> exit 0 if empty; exit 1 otherwise
```

Reuse `content-cli.config.json` to locate `contentRoot`; keep the catalog path at the repository root unless a real need for configuration arises. File enumeration/read failures become `ContentScanFailed` rather than silently skipping files. Process files in stable path order and findings in file/tag order so CI output is repeatable. The pure inspection function owns tag policy; the filesystem/YAML adapter owns boundary parsing. No retries, writes, authorization, transactions, or telemetry services are needed. CLI stderr is the diagnostic channel.

The YAML parser is `Bun.YAML.parse`, already used in `scripts/preview-discord-crossposts.ts`. Catch parser failures at this boundary; never trust its output by assertion. Use a frontmatter extractor that requires an opening and closing delimiter at the start of the file and handles LF/CRLF. Report the file path for malformed YAML rather than swallowing it. The CLI reports expected failures without dumping arbitrary parser exceptions or whole article text.

## Files

| Path | Responsibility |
| --- | --- |
| `content-tags.json` | Checked-in, human-readable allowlist, initially seeded with every existing distinct tag. |
| `apps/content-cli/src/tag-catalog.ts` | Parse the catalog and own exact-match policy. |
| `apps/content-cli/src/tag-lint.ts` | Inspect parsed frontmatter and collect findings across content files. |
| `apps/content-cli/src/tag-lint-main.ts` | Bun/Effect composition, diagnostics, exit code. |
| `apps/content-cli/src/tag-lint.test.ts` | Behavior tests through the CLI module with temporary real files. |
| `package.json` | Add `content:lint-tags`; make `content:check` run its current typecheck and the tag check. |
| `docs/tech-spec-content-cli.md` or contributor instructions | Point authors at the catalog and check command. |

No site files or Markdown articles need modification to seed all current tags. Do not turn the catalog into an automatically regenerated inventory: that would let typos approve themselves.

## Red-green-refactor verification

1. Red: a fixture with one allowed tag returns a clean report; green: scan one file against a small fixture catalog.
2. Red: an unknown tag reports its path and value and yields nonzero CLI status; green: exact membership check and diagnostic formatting.
3. Red: several files yield all findings in stable order; green: full recursive scan and accumulation.
4. Red: missing tags and `[]` pass, while scalar/non-string tags and malformed YAML fail; green: boundary parsing and findings.
5. Red: duplicate/invalid catalog entries or unreadable content fail with typed errors; green: config and I/O error handling.
6. Run against the real archive, seed all existing distinct labels, and verify `bun run content:check` passes. Confirm that inserting a new tag into a temporary article makes the command fail until the catalog explicitly includes it.

Use `@effect/vitest` and temporary filesystem fixtures, as in `apps/content-cli/src/command.test.ts`. No route/page unit tests or module mocks.

## Risks and open questions

- The initial 270-entry allowlist records historical variants, including case differences. It prevents *new* values but does not make the old taxonomy tidy. Prune and retag deliberately in a separate change.
- Exact labels can yield the same URL slug via `tagSlugify`; collision detection is outside this scope.
- The current deployment workflow does not run `content:check`. This spec makes it part of the repository's static-analysis command, not automatically a deployment gate. Adding a CI gate is a separate decision.

[^oxlint]: Oxlint, [JS plugins: unsupported custom file formats and parsers](https://oxc.rs/docs/guide/usage/linter/js-plugins).
