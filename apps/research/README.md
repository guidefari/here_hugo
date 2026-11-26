# Research

A Foldkit reading app at `research.guidefari.com`, managed by the root
Alchemy stack. It shares the main blog's palette, not its content or navigation.

```sh
bun run dev:research
bun run build:research
```

Development runs at `http://localhost:1415`.

`bun run verify` checks the content compiler, Foldkit scenes, types, and production
build. The build compiles the approved Markdown into a browser content bundle and
generates RSS. The Markdown compiler retains heading anchors, citations, Shiki
highlighting, and embedded HTML figures without an Astro application runtime.

The Foldkit model owns the current URL and library filter. Direct report links,
browser back/forward, and contents anchors work through Foldkit navigation.
Major headings become short chapters with previous/next links. The reading map
stays beside the text on wide screens and collapses into a sticky button on
narrow screens. Existing subsection links select their containing chapter.
Printing includes the complete report, not just the selected chapter.
Cloudflare serves the app shell for deep links. There is no backend or database.
Only committed, reviewed Markdown enters the trusted HTML rendering boundary.

The GPU lab lives at `/gpu/`, with its scene links under `/gpu/scenes/`.
The Research Worker forwards those requests through the existing GPU Worker's
service binding; reports and the wheel atlas still use Research's own assets.
The reader and GPU app perform a full document navigation when crossing this
boundary so each keeps its own Foldkit runtime.

During development, `/gpu/` proxies to `https://gpu.localhost`. Start the GPU
app separately with `bun run dev:gpu`. `GPU_PROXY_TARGET` can point the Research
development or preview server at another local GPU server.

## Add a report

Copy `src/content/reports/example.md` to a descriptive filename. Keep `draft: true`
while reviewing it. Set `draft: false` only when it is approved for public release.
The default is draft when the field is omitted. Drafts have no generated page and
are excluded from the library and RSS, including in development.

Each report needs a title, description, and research date. Optional fields are
`updated` and `tags`. Use headings starting at `##`: the page supplies the title
and generates a table of contents from second-level headings.

Supporting source notes can set `parent` to the main report's ID. They have their
own reading pages and a link back to the report, but do not appear as separate
library or RSS entries. The main report lists them under "Supporting research".

Keep citations, evidence cutoffs, limitations, and AI attribution intact. Convert
Obsidian wikilinks to ordinary Markdown links and include only approved public
attachments. The site never reads `~/notes` directly. Do not copy private or
employer material into this repository, even as a draft.

## Imported collections

- Cloudflare/npm: two main reports, 19 source notes, and four source guides.
  Evidence cutoff: 8 November 2026. Earlier working outlines remain in the vault.
- Docker on macOS: the preserved agent-written explainer and interactive diagrams.
- Effect services and layers: the preserved agent-written explainer.

These were copied from the approved research collections in the notes vault.
Original notes were left unchanged. Vault links were converted to site links;
links to the main blog use its full domain. Importing does not reverify claims.
The SOPS explainer is also included, with a visual of the decryption boundary
and call trees for local and Flux deployments. Its local deployment appendix stays
in the notes vault, not in this repository.

## Visual explanations

The repository's `research` skill references `show-me`. Load both when authoring
reports and choose a small diagram, call tree, comparison, or HTML figure that
makes the central mechanism clear. See `AGENTS.md` for the authoring workflow.

The production domain is declared on the `Research` Worker in `alchemy.run.ts`.
Review the Alchemy plan before deploying. The root stack also owns the main blog,
GPU app, media, and Discord crossposting, so a whole-stack deploy may update them.

## Wheel atlas media

The wheel atlas uses the existing Alchemy-managed R2 bucket
`here-hugo-prod-media`, served at `https://media.guidefari.com`. Image binaries
are not stored in Git. `src/wheels/assets.json` records each immutable URL,
SHA-256 fingerprint, byte length and content type. Source credits, licences and
identification limits remain in the catalogue and its Sources panel.

Keep local upload inputs under the ignored `public/wheels/` directory. With
Cloudflare credentials supplied securely in the environment, run from the
repository root:

```sh
bun run scripts/upload-wheel-media.ts
```

The uploader uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (or
`CLOUDFLARE_DEFAULT_ACCOUNT_ID`). If no account is configured, discovery must
return exactly one account. It never replaces different bytes at an existing
key. Each successful upload is downloaded and checked before the manifest is
saved. Objects carry a one-year immutable cache policy.

The Deploy workflow supports `plan_only: true` for reviewing the production
plan with the existing CI secrets before dispatching a deployment.
