---
title: "Tidal UX Wishlist"
date: 2023-03-19T11:11:06+02:00
description: I'm trying to use tidal more and more. Here are some UX pain points I've been feeling.
tags: [ux, design, frontend]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Tidal%20UX%20Wishlist']
---

This commentary is guided by general UX heuristics I've picked up over the years.

# Group related information

![Screenshot of a tidal playlist](https://res.cloudinary.com/hokaspokas/image/upload/v1679217847/here-hugo/tidal_2.png)

- When in a playlist, it's a common workflow while curating to like & unlike tracks.
- With the way the `like` indicator is positioned in relation to the track name means my eyes have to do a massive horizontal scan, and hope like hell I am matching the right `heart` to the right track.
- Lots of back and forth with the eyes, can be exhausting & frustrating
- Fortunately, you can hover over the track so that the whole row gets highlighted - but that still doesn't save the eyes from that constant horizontal back and forth.
- To learn more, check out [Visual Hierarchy](https://youtu.be/8OTbyWndY9M).

# No Album cover on tracks in playlists

![](https://res.cloudinary.com/hokaspokas/image/upload/v1679219133/here-hugo/album_art_upvtdz.png)

- Strangely, when viewing liked songs on tidal, they do have an album cover.
- Lack of an album art is bad because humans are visual creatures. Adding another sense (sight) allows you to sift through the playlists easier.

### Touch as many of their senses as you can

From the book "Your Music and People by Derek Sivers"

> [The more senses you touch in someone, the more they’ll remember you.The most sensory experience is a live show, with you sweating in front of them, the sound system pounding their chest, the flashing lights, the smell of the stinky club, and the visceral feeling of pushing up against strangers. The least sensory experience is an email or a plain web page.](https://sive.rs/m)

- I think this principle can be applied to UI/UX design as well.
- Random example just came to mind, and illustrates the point: I remember that [Josh Comeau's site](https://www.joshwcomeau.com/) makes use of some sounds when interacting with it. Small thing, powerful imact. I digress, lol.

# State of UI is too heavily reliant on network

- When you like a song, sometimes the UI doesn't reflect it. If you press the like button again, the song gets removed from your collection! a frustrating experience.
  - Highlighting the importance of idempotence. This would be an interesting problem to solve!
- Sometimes pressing the `3 dots` or `more` icon, the UI completely freezes. Until the network request has been responded to, I assume. This only happens when in poor network conditions.

# Search bar

- Hitting the keyboard shortcut will only take you to the search bar, it doesn't automatically highlight the old contents of the search bar too.
- This often results in me having to press another keyboard shortcut to highlight all content before I start to type my text
- It's somewhat common UX (or just muscle memory for me because of the apps I spend multiple hours in) for the text in the search bar to be highlighted when you focus on it, especially if that focus is achieved via keyboard shortcut.

## Music Player when autoplay is off

{{<youtube 8spEBC0Wsdk>}}

- this one is more a bug than real UX concern
- when autoplay is turned off, the music player will have a loading icon, as if it's looking for something next.
- This is expected behaviour when you're still in your playlist, genuinely buffering (which can be seen at the end of a tracklist, when it's transitioning into the auto generated playlist)
- Flagging it as a bug because it causes confusion. You have to manually check the status of your tracklist, as opposed to getting information at a glance.
  - This is sort of related to the heuristic ["recognition and recall in user interfaces"](https://www.nngroup.com/articles/recognition-and-recall/).
