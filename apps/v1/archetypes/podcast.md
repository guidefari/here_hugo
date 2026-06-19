---
title: "Podcast: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: You might find this podcast useful👇
tags: [podcast]
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---

{{<spotify episode id "100%" 232 >}}

