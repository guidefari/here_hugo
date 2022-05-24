---
title: "Artist: {{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: Fancy a new artist to listen to?😎
tags: [music, artist, curated]
---

{{<spotify playlist id>}}

