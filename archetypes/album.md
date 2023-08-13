---
title: "Album: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: More curated sounds :)
tags: [music, album, curated]
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---

{{<spotify album id>}}