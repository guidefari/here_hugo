# todo
- [ ] 404 page

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