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
{{<spotifyembed track 1DYgRR2Crqkb4CDJhoQrFO "80%" 90px>}}

# colloboh - entity relation
### album
{{<spotifyembed album 30Ibl9SKa6jRohwsTOV9Bn >}}


### playlist
{{<spotifyembed playlist 6ieAqkjWrvFWH8Z0smXeL7 >}}


### artist
{{<spotifyembed artist 4wyNyxs74Ux8UIDopNjIai >}}
