# todo

- [ ] 404 page - amazing how I've lived so long without one.
- [ ] Search. Maybe even a semantic search?
- [ ] RSS feed
  - https://gitlab.com/jgarr/blog/-/blob/main/layouts/_default/rss.xml

## Post tags

```html
<div class="home-tag-wrapper">
{{ range .Params.tags }}
 <a class="home-tag" href="{{ "/tags/" | relLangURL }}{{ . | urlize }}">{{ . }}</a>
{{ end }}
</div>
```

## dark mode

```html
{{- if or (eq .Site.Params.mode "auto") (eq .Site.Params.mode "dark") (eq .Site.Params.mode "toggle") -}}
  {{ $darkstyle := resources.Get "css/dark.css" | fingerprint }}
  <link id="darkModeStyle" rel="stylesheet" type="text/css" href="{{ $darkstyle.Permalink }}" {{ if eq .Site.Params.mode "auto" }}media="(prefers-color-scheme: dark)"{{ end }} {{ if eq .Site.Params.mode "toggle" }}disabled{{ end }} />
 {{ end }}
```

## Raw HTML in your markdown

add this to `config.yaml`

```yaml
markup:
  goldmark:
    renderer:
      unsafe: true
```

## Running v2
Install dependencies:
```shell
bun install
```

Start the development server using Turbo:
```shell
bun run dev
```

To run the blog and GPU playground together, start `cmdz` from the repository root.
The blog is at `http://localhost:1414` and the playground is at
`https://gpu.localhost/gpu/` (via Portless). Their links point to these local URLs
in development and to `guidefari.com` and `research.guidefari.com/gpu/` in production.
Existing `gpu.guidefari.com` links redirect to the corresponding Research paths.

## Research reading room

`apps/research` is the separate agent-generated research blog at
`research.guidefari.com`, managed by the root Alchemy stack.
Run `bun run dev:research` for `http://localhost:1415`, or
`bun run build:research` to build it. See [the research guide](apps/research/README.md)
for the report format and publication rules. Notes are never published automatically.

## Browser observability

The blog, research reader, and GPU playground share Sentry error reporting and
sampled performance traces through [`@here/telemetry`](packages/telemetry/README.md).
Development is disabled; production uses the `here-hugo` Sentry project.
There is no separate OTEL exporter or session replay.
