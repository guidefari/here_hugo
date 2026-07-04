---
title: "How Rockstar Fit an Entire City Into PlayStation 2 Memory"
date: 2026-05-16T00:00:00-04:00
description: "Game Maker's Toolkit breaks down the streaming tech Rockstar used to fit GTA 3's 130 MB Liberty City into the PS2's 32 MB of RAM."
media_type: youtube
media_url: https://www.youtube.com/watch?v=cIbCxbrBCys
youtube_id: cIbCxbrBCys
creator: Game Maker's Toolkit
tags: [media, video, gamedev, gta, ps2, programming]
images: ['https://i.ytimg.com/vi/cIbCxbrBCys/hqdefault.jpg']
---

This video from *Game Maker's Toolkit* explains the technical "magic trick" Rockstar North used to fit Grand Theft Auto 3's 130 MB Liberty City into the PlayStation 2's tiny 32 MB of system memory [[00:00:30](https://www.youtube.com/watch?v=cIbCxbrBCys&t=30s)].

---

## The Core Problem: DVD vs. RAM

* **The Hardware Bottleneck:** The PS2 DVD held a massive 4.7 GB of data, but it was painfully slow to read (5–6 MB/s). Conversely, the system's internal RAM was incredibly fast (3.2 GB/s) but minuscule at just 32 MB [[00:01:11](https://www.youtube.com/watch?v=cIbCxbrBCys&t=71s)].
* **The Budget Deficit:** A traditional game loaded an entire level into memory and used loading screens between areas. GTA 3's assets totaled roughly 130 MB, making it impossible to fit even a single island (like Portland at ~50 MB) into the 32 MB budget at once [[00:01:53](https://www.youtube.com/watch?v=cIbCxbrBCys&t=113s)], [[00:02:49](https://www.youtube.com/watch?v=cIbCxbrBCys&t=169s)].

## The Solution: "Streaming"

Rather than making a visually bland city to save space, Rockstar implemented a system called **streaming** [[00:03:56](https://www.youtube.com/watch?v=cIbCxbrBCys&t=236s)].

The game creates an invisible square around the player. It constantly loads the 3D models and textures for the sectors the player is entering, while silently deleting the world behind them [[00:04:02](https://www.youtube.com/watch?v=cIbCxbrBCys&t=242s)], [[00:06:32](https://www.youtube.com/watch?v=cIbCxbrBCys&t=392s)]. It acts like a "moving window" of reality [[00:06:46](https://www.youtube.com/watch?v=cIbCxbrBCys&t=406s)].

---

## 5 Major Technical Challenges & Solutions

### 1. Managing "Pop-in" (Level of Detail)
To prevent buildings from appearing out of thin air, the game uses a **Level of Detail (LOD)** system [[00:10:06](https://www.youtube.com/watch?v=cIbCxbrBCys&t=606s)]. For far-away sectors, it only loads low-polygon "impostor" structures with low-resolution textures [[00:09:28](https://www.youtube.com/watch?v=cIbCxbrBCys&t=568s)]. As the player gets closer, the high-quality assets gracefully fade in over them [[00:09:58](https://www.youtube.com/watch?v=cIbCxbrBCys&t=598s)].

### 2. Extreme RAM Optimization & The "Spooky" Car Phenomenon
Out of the 32 MB of RAM, only about 13.5 MB was actually dedicated to streaming the world; the rest had to handle physics, AI, and animations [[00:11:18](https://www.youtube.com/watch?v=cIbCxbrBCys&t=678s)].

* **The Car Pool:** To save memory, the game only keeps a strict pool of **eight vehicle types** in memory at one time [[00:12:16](https://www.youtube.com/watch?v=cIbCxbrBCys&t=736s)]. This explains the famous GTA phenomenon where you spend ages looking for a rare car, and once you finally find one, suddenly *everyone* is driving it, it's because that vehicle now occupies one of the active 8 memory slots [[00:12:56](https://www.youtube.com/watch?v=cIbCxbrBCys&t=776s)].

### 3. Memory Fragmentation
Constantly loading and unloading assets creates "holes" in RAM, causing fragmentation and crashes [[00:13:37](https://www.youtube.com/watch?v=cIbCxbrBCys&t=817s)]. To solve this, Rockstar made over 500 asset files exactly 2 KB and over 400 exactly 4 KB [[00:14:33](https://www.youtube.com/watch?v=cIbCxbrBCys&t=873s)]. Because they were uniform sizes, assets could seamlessly swap places without leaving fragmented gaps [[00:14:50](https://www.youtube.com/watch?v=cIbCxbrBCys&t=890s)].

### 4. Optimizing the Physical DVD Laser
Jumping around a DVD requires the physical laser head to move ("seeking"), which takes time [[00:15:56](https://www.youtube.com/watch?v=cIbCxbrBCys&t=956s)]. Rockstar duplicated common assets (like trees and lampposts) at multiple different physical points on the disc layout so the laser wouldn't have to travel far to read them [[00:16:43](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1003s)].

### 5. Intentional Design Obstacles to Slow the Player Down
If a player moved too fast, they would outrun the streaming system and fall into a void [[00:17:48](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1068s)]. To prevent this:
* Cars were given strict top speeds [[00:18:02](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1082s)].
* Air resistance was secretly increased in certain areas [[00:18:09](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1089s)].
* A massive building was deliberately placed in the middle of Portland's longest thoroughfare to break the player's straight-line speed [[00:18:49](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1129s)].

---

## Interesting Myths Debunked

> **The Legend:** For years, a popular urban legend claimed that the wings of GTA 3's "Dodo" airplane were clipped because of the September 11 attacks (to prevent players from flying into buildings) [[00:23:52](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1432s)].
>
> **The Reality:** It was a purely technical limitation. Flying would allow players to move too fast for the streaming tech, and looking down from the air would reveal that many buildings didn't have roofs or collision boxes, breaking the illusion of the city [[00:24:55](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1495s)], [[00:25:17](https://www.youtube.com/watch?v=cIbCxbrBCys&t=1517s)].
