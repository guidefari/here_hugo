---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: 
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---

