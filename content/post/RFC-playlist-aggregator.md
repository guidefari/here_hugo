---
title: "RFC: Playlist Aggregator"
date: 2021-12-14T08:48:41+02:00
description: Trying to have a good overview of the architecture of pieces involved with building this backend service.
tags: [backend, RFC, architecture]
tldr: pls help
---

# scenario

imagine you're trying to make a playlist you can reach out to when you need music to work to. you then realise that you've got 5, 10 or even more playlists, that are small, & serve a specific purpose, but all those small & specific playlists are also appropriate to listen to when working.

### why that's a problem

It's tedious & distracting to have to continuously shift across the many, smaller playlists. would be more efficient to create a big aggregated playlist.

compose playlists using playlists.

# what I'm trying to build

the service should be able to take the state of many **smaller playlists** & propagate any actions to the main **aggregated playlist**

- I'm thinking comparisons of playlists' state, will be done with data that's been stored in a non-relational DB
- meaning if I add a track to **smaller playlist 1** & a few tracks to **smaller playlist 2**, & those two playlists are being **watched** by **big aggregated playlist1**, those tracks should be added to the **big aggregated playlist**
- delete is a little tricky, because what happens if the **big aggregated playlist** already had some tracks, that aren't in any of the smaller playlists. I want the **aggregated** playlist to also be standalone, one I can add tracks to & manage individually.

# tech stack I'd like to use

- Go ([have already started the project in Go](https://github.com/txndai/go-spotify/), integration with Spotify API is done)
- AWS (this is the area I need help with)
- [Spotify API](https://developer.spotify.com/console/playlists/)
  - [working with playlists](https://developer.spotify.com/documentation/general/guides/working-with-playlists/)

## notes

- Spotify has no event sourcing API.
- Polling for changes
- Batch processing
- how is sourcing of watcher playlist & source playlists going to be done?
