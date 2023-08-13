---
title: "Playlist: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: Here's a playlist for you...
tags: [music, playlist, curated]
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---

{{<spotify playlist id>}}
