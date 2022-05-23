---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: More curated sounds :)
tags: [music, album, curated]
---

{{<spotify album id>}}