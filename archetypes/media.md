---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description:
media_type: youtube
media_url:
youtube_id:
creator:
tags: [media]
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---
