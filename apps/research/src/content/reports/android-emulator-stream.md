---
title: "How does an Android emulator stream into a terminal?"
description: "What H.264 compresses, what Rex actually draws, and how a click gets back to Android."
date: "2026-11-24"
tags: ["android", "video", "terminal"]
draft: false
---

> Agent-written working note. The screenshots are decoded frames from a synthetic test clip, not captures of a work app or the Rex desktop.

## What is compressed H.264?

**H.264 is a recipe for encoding video into fewer bytes.** It is also called AVC. It is a *codec*, not a file format like MP4. You can put H.264 video inside an MP4 file, or send its encoded bytes directly over a pipe. The emulator demo uses the pipe.

Imagine dragging an app card across the screen. Instead of sending every pixel of the next frame, an encoder can say, roughly, “this patch looks like a patch from an earlier frame, shifted a little; here is what changed.” H.264 can also predict from nearby pixels within the same frame. The decoder combines those predictions with the encoded corrections to reconstruct the picture. Typical H.264 encoding is lossy: rounding away some fine detail saves bytes. See the [ITU-T H.264 standard](https://www.itu.int/rec/T-REC-H.264) and the [FFmpeg format docs](https://ffmpeg.org/ffmpeg-formats.html).

<figure style="margin: 1.5rem 0">
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-inline-size: 28rem">
<div><img src="/images/android-emulator-stream/frame-1.webp" alt="Synthetic portrait video frame with brightly colored blocks and a moving square grid" width="432" height="960" loading="lazy"><strong>Frame 31</strong></div>
<div><img src="/images/android-emulator-stream/frame-2.webp" alt="The next synthetic frame, with most large color blocks unchanged and small details shifted" width="432" height="960" loading="lazy"><strong>Frame 32</strong></div>
</div>
<figcaption>Two adjacent frames decoded from the prototype’s test clip. The broad fields of color barely move. These stills show what the decoder reconstructed, not which prediction modes the encoder chose.</figcaption>
</figure>

The clip contains 150 frames at 1080 × 2400. As raw 24-bit RGB, that is about **1.17 GB**. The actual H.264 bitstream was **12.7 MB**, roughly 92 times smaller for this clip. The ratio depends on the content, encoder, and settings.

## Where does the codec fit?

```text
VIDEO
Linux   Android capture → H.264 → FFmpeg → RGB → Go
                              changed PNG bands ↓
Mac                                        Rex pane

INPUT
Mac                     Rex pane: click or drag
                                              ↓
Linux   Android ← ADB input ← Go maps coordinates
```

**In the remote split, H.264 does not cross to the Mac.** FFmpeg decodes and scales it on Linux, using the host GPU for decoding in this prototype. The Go program compares horizontal bands against the prior image, encodes changed bands as PNGs, and publishes them with the [Kitty graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/). Rex carries those terminal updates to its Mac client. The GPU helps decode the video, but it does not make terminal image updates free.

This is the capture boundary. The final `-` selects standard output rather than a file on Android:

```sh
adb -s emulator-5554 shell -T screenrecord \
  --output-format=h264 --bit-rate=24M --time-limit=15 -
```

That command emits binary data. Pipe it into a decoder, not into the terminal itself. This shorter example decodes the first frame into a PNG so you can see exactly where video becomes a picture:

```sh
adb -s emulator-5554 shell -T screenrecord \
  --output-format=h264 --time-limit=3 - |
  ffmpeg -f h264 -i pipe:0 -frames:v 1 frame.png
```

See the [Android `screenrecord` implementation](https://android.googlesource.com/platform/frameworks/av/+/master/cmds/screenrecord/screenrecord.cpp) for raw H.264 output, and the [ADB documentation](https://developer.android.com/tools/adb) for shell and device selection.

## Why drop frames?

For remote control, a fresh frame matters more than seeing every frame. If ten updates are waiting when you tap, drawing all ten makes the screen feel behind your hand. The viewer holds just one waiting frame and replaces it when a newer one arrives. Here is the single-producer Go pattern from the prototype:

```go
var frames = make(chan Frame, 1)

func publishLatest(frame Frame) {
    select {
    case <-frames:
    default:
    }
    frames <- frame
}
```

The renderer also asks for a Kitty acknowledgement on the last changed band of each update. That confirms the graphics command was accepted, **not** that the Mac displayed it at a particular refresh or that a tap took that long to become visible. For the latter, measure from input to the visible change.

## How does a click get back to Android?

Rex sends the terminal mouse event to the Go viewer. The viewer maps the click from a cell inside the displayed image to a device coordinate, then sends an Android input command through ADB. The same path handles navigation buttons, without changing Android’s gesture settings.

```sh
adb -s emulator-5554 shell input tap 540 1200
adb -s emulator-5554 shell input keyevent KEYCODE_BACK
```

See Android’s [input shell command implementation](https://android.googlesource.com/platform/frameworks/base/+/master/services/core/java/com/android/server/input/InputShellCommand.java). Video and input are separate paths. The stream also mirrors actions from any other controller connected to the same emulator.

## Run it in a Rex split

The [complete Go example and build instructions](https://github.com/guidefari/here_hugo/tree/main/docs/research/android-emulator-stream) are kept alongside this report in the repository. The example removes machine-specific paths and lets you configure the ADB serial, capture size, and GPU decoding.

1. **On Linux**, start your development emulator. Check its serial with `adb devices -l` and its display size with `adb -s emulator-5554 shell wm size`. Install Go and put `adb` and `ffmpeg` on the host’s `PATH`.
2. **In Rex**, connect your Mac client to the Linux host over [authenticated remote access](https://www.superlogical.com/rex/docs/linux/remote-access.md). Open your work tab and add a right-hand split. The shell in that split runs on Linux, not on the Mac.
3. **In the Linux split**, run the example from the checkout root:

```sh
cd docs/research/android-emulator-stream
go build -o /tmp/rex-android main.go video.go
/tmp/rex-android -serial emulator-5554 -width 540 \
  -device-width 1080 -device-height 2400 -seconds 180
```

Add `-cuda` if your Linux host has a supported NVIDIA driver and FFmpeg build. Start at `540×1200` for a narrow pane. The picture is downscaled, but the input coordinates still map to the original Android display. Click the image for a tap, drag and release for a swipe, or click **Back**, **Home**, and **Recents** below the feed. `Ctrl-C` exits the viewer.

## What we tried and what worked

| Setup | What crosses to the Mac | Tradeoff |
| --- | --- | --- |
| Full-frame Kitty updates in the Linux split | A new PNG for each changed frame | Real terminal pixels, but poor interactive latency |
| scrcpy in a separate Mac window | Compressed video and a control connection | Uses a purpose-built player, but misses the terminal-pane requirement |
| Go viewer in a Mac-local Rex tab | Compressed H.264 over SSH | Image encoding stays off the network, but the pane cannot sit in the remote work tab |
| Go viewer in the Linux work split | Only changed PNG bands as Kitty commands | Shares the actual work tab; motion can still be limited by capture, encoding, network, or Rex |

We verified that a synthetic Recents click through the Mac-local pane reached Android and that Back restored the original app. In one sample at `720×1600`, the Mac-local viewer decoded 34 frames per second and Rex acknowledged 27 updates per second. Those numbers do **not** establish the display refresh rate, tap-to-photon latency, or performance of the remote work split. The not-yet-solved part is smooth sustained motion, not whether Rex can show and control the same emulator.
