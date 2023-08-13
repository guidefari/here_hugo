---
title: "Book Notes: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: "highlights, quotes, & other interesting bits from {{ replace .Name "-" " " | title }}"
tags: [book, notes]
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (replace .Name "-" " " | title) }}']
---

