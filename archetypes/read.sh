#!/bin/bash

function getNextMonday() {
  local currentDay=$(date +%u)
  local daysUntilNextMonday=$(( (8 - currentDay) % 7 ))
  date -d "+$daysUntilNextMonday days" +%Y-%m-%d
}

currentDate=$(date +%Y-%m-%dT%H:%M:%S%z)
nextMonday=$(getNextMonday)

filename=$1
number=$(echo $filename | grep -o '[0-9]\+')

cat <<EOF > "content/read/$filename"
---
title: "Reading list #$number"
date: $currentDate
publishDate: $nextMonday
tags: []
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Reading+list+%23$number']
---
EOF

echo "File content/read/$filename created with next Monday's publish date."
