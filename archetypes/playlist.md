---
title: "Playlist: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: Here's a playlist for you...
tags: [music, playlist, curated]
---

{{<spotify playlist id>}}
