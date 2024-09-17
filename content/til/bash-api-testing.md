---
title: "Bash + jq for API development & testing"
date: 2024-09-16T21:38:22+02:00
description: 
tags: [bash]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Bash+Api+Testing']
---

## Acknowledgements
Big shout out to Dandre for putting me onto this.

## Examples
- [Curl requests in the goosebumps repo](https://github.com/guidefari/gbfm/tree/prod/curl)

```sh
#! /bin/bash

curl -X POST https://openapi.guidefari.dev.goosebumps.fm/spotify/playlist \
  -H "Content-Type: application/json" \
  -d '{"id": "1QWp1dZFkp1FR9e4w0THxW"}' | jq .

```

## Testing input/output at a glance
So far, this is the main thing I'm using this workflow for. Rapid validation of input & output of endpoints as I develop.

## Why not any of the GUI clients?
I also use
- Postman
- Insomnia
- Thunder client in VSC*de `⌘ + shift + R`

Shortcomings of the GUI apps :
GUI's come with lots of noise, visual clutter, distractions, things that slow me down because I have to learn the tool.
What happens when I spend a week or two mostly on client side work? I kind of forget how to quickly move around these tools.

- I don't have that feeling with bash.
- I like the portability & version controlled nature of bash scripts
- It's very quick for me to open my terminal and hop around to the correct window. `option + /` takes me into the terminal.

## What to learn next
I want to figure out how to do assertions and eventually, actual test runs. 

## Related links
- [jq](https://github.com/bobbyiliev/introduction-to-bash-scripting/blob/main/ebook/en/content/018-working-with-json-in-bash-using-jq.md)