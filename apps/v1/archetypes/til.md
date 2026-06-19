---
title: "TIL: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: Something I learnt today. Maybe more than one thing👾
tags: [til]
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---

