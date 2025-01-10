---
title: "Somewhat Regular Digest #{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
publishDate: {{ .Date }}
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (printf "Somewhat Regular Digest #%s" (replace .Name "-" " " | title  )) }}']
---
