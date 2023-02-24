# todo

- [ ] 404 page
- checking push permission

# Projects

- Search with algolia
- RSS feed

# Post tags

```html
<div class="home-tag-wrapper">
{{ range .Params.tags }}
 <a class="home-tag" href="{{ "/tags/" | relLangURL }}{{ . | urlize }}">{{ . }}</a>
{{ end }}
</div>
```

# dark mode

```html
{{- if or (eq .Site.Params.mode "auto") (eq .Site.Params.mode "dark") (eq .Site.Params.mode "toggle") -}}
  {{ $darkstyle := resources.Get "css/dark.css" | fingerprint }}
  <link id="darkModeStyle" rel="stylesheet" type="text/css" href="{{ $darkstyle.Permalink }}" {{ if eq .Site.Params.mode "auto" }}media="(prefers-color-scheme: dark)"{{ end }} {{ if eq .Site.Params.mode "toggle" }}disabled{{ end }} />
 {{ end }}
```
