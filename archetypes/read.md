---
title: "Reading list #{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
{{ $currentDay := time.Now.Weekday }}
{{ $daysUntilNextSunday := mod (add 7 (sub 0 (int $currentDay))) 7 }}
{{ $nextSundayFromNow := time.Now.AddDate 0 0 (int $daysUntilNextSunday) }}
publishDate: {{ $nextSundayFromNow.Format "2006-01-02T15:04:05-07:00" }}
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title={{ urlquery (printf "Reading list #%s" (replace .Name "-" " " | title  )) }}']
---
