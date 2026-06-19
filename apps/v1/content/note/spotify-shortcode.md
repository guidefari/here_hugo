---
title: "Spotify Shortcode"
date: 2021-10-11T07:28:32+02:00
description: experimenting with Hugo shortcodes - implementing a way to embed spotify tracks
tags: [til, hugo]
---

- [src](https://gist.github.com/j-un/e7d0b3118556479392bd2269f7059242) shortcode
- hugo shortcode [docs](https://gohugo.io/content-management/shortcodes/)

## snippet of the shortcode in use
```html
<!--
Parameters:
    type - (Required) album / track / playlist / artist
    id - (Required) Target ID
    width - (Optional) width
    height - (Optional) height
-->

{{ if .IsNamedParams }}
<iframe src="https://open.spotify.com/embed/{{ .Get "type" }}/{{ .Get "id" }}"
    width="{{ default "100%" (.Get "width") }}"
    height="{{ default "380" (.Get "height") }}"
    frameborder="0"
    allowtransparency="true"
    allow="encrypted-media"></iframe>
{{ else }}
<iframe src="https://open.spotify.com/embed/{{ .Get 0 }}/{{ .Get 1 }}"
    width="{{ default "100%" (.Get 2) }}"
    height="{{ default "380" (.Get 3) }}"
    frameborder="0"
    allowtransparency="true"
    allow="encrypted-media"></iframe>
{{ end }}
```

`portable_sunsets` `track` `deep`
### track
<iframe src="https://open.spotify.com/embed/track/1DYgRR2Crqkb4CDJhoQrFO" width="80%" height="90px" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify track embed"></iframe>

# colloboh - entity relation
### album
<iframe src="https://open.spotify.com/embed/album/30Ibl9SKa6jRohwsTOV9Bn" width="100%" height="250" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify album embed"></iframe>


### playlist
<iframe src="https://open.spotify.com/embed/playlist/6ieAqkjWrvFWH8Z0smXeL7" width="100%" height="250" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify playlist embed"></iframe>


### artist
<iframe src="https://open.spotify.com/embed/artist/4wyNyxs74Ux8UIDopNjIai" width="100%" height="250" frameborder="0" allowtransparency="true" allow="encrypted-media" title="Spotify artist embed"></iframe>
