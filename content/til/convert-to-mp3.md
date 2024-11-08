---
title: "TIL: Converting audio files to MP3 using ffmpeg"
date: 2024-11-08T06:05:10+02:00
description: ffmpeg ftw.
tags: [til, bash]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Convert+to+Mp3']
---

I need to load up a flash stick with music for a friend.
He asked for MP3 files only. I have music in a bunch of different formats.

Couldn't be bothered to find a GUI tool to do this manually, so naturally I reached for a script.

It recursively reads files in a specified directory, looking for predefined file formats, then converts them to mp3.

A really nice thing is `ffmpeg` retains the metadata!🙌🏽


```sh
#!/bin/bash

function convert_to_mp3() {
    local input_file="$1"
    local output_file="${input_file%.*}.mp3"

    if [ ! -f "$output_file" ]; then
        echo "Converting $input_file to $output_file"
        ffmpeg -i "$input_file" -q:a 0 "$output_file"
    else
        echo "Output file $output_file already exists, skipping conversion."
    fi
}

export -f convert_to_mp3

# Recursively find all audio files and convert them
find "$1" -type f \( -iname "*.wav" -o -iname "*.flac" -o -iname "*.aac" -o -iname "*.ogg" -o -iname "*.m4a" \) -exec bash -c 'convert_to_mp3 "$0"' {} \;

echo "Conversion complete."
```