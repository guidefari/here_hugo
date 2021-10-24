---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: More curated sounds :)
tags: [music, album, curated]
---

{{<spotifyembed album id>}}