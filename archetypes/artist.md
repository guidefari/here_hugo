---
title: "Artist: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: Fancy a new artist to listen to?😎
tags: [music, artist, curated]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=']
---

{{<spotify playlist id>}}

