---
title: "Reading list #{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: 
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (printf "Reading list #%s" (replace .Name "-" " " | title  )) }}']
---
