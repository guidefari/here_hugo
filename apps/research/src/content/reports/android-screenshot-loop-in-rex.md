---
title: "How does an Android screenshot feed appear in Rex?"
description: "An inline ADB-to-Kitty screenshot loop, why it is not video, and why terminal focus is not Android input."
date: "2026-11-25"
tags: ["android", "terminal", "rex"]
draft: true
---

> Agent-written research note. Evidence cutoff: 2026-11-25. Implementation details below come from the session's supplied description of an inline command, not a tracked script or an independent runtime inspection. Linked primary sources explain the underlying interfaces.

**The feed is a sequence of PNG screenshots drawn inside a terminal, not an embedded Android window.** An inline Bash loop runs in a Linux Rex terminal's right-hand split. The macOS Rex client displays its graphics output. This note covers that screenshot loop, not an H.264 viewer or an input-forwarding prototype.

## What crosses each boundary?

```text
Linux
  Android emulator screen
    |
    v
  adb exec-out screencap -p
    |
    v
  PNG -> base64 -> Kitty chunks
    |
    v
  Rex terminal stream
    |
    v
macOS
  Rex client draws the image

  Typing in the focused pane
    |
    v
  Linux host PTY, not Android
```

The capture command is `adb -s emulator-5554 exec-out screencap -p`. Here `-s` selects the emulator, `-p` requests PNG, and omitting a filename makes `screencap` write to standard output. Android's documentation explicitly uses `exec-out` to obtain raw screenshot data. The serial is a conventional emulator identifier, not a physical device ID. [1]

The loop base64-encodes that PNG, then sends it as Kitty graphics escape sequences with payload chunks of up to **4096 characters**. The protocol requires intermediate chunks to be multiples of four bytes, marks continuation with `m=1`, and ends the transfer with `m=0`. These are pieces of one image, not separate video frames. [2]

Its graphics parameters mean:

| Parameter | Purpose |
| --- | --- |
| `a=T` | Transmit and display an image |
| `f=100` | Interpret the image data as PNG |
| `i=1` | Use image ID 1 |
| `q=2` | Suppress success and error responses |
| `c`, `r` | Set the placement width and height in terminal columns and rows |

Those meanings come from the Kitty specification. Placement dimensions control drawing size; they do **not** reduce the PNG's source resolution or transfer size. [2]

The loop reads terminal rows and columns with `stty size`, which reports rows first. It enters the alternate screen, hides the cursor, and installs a cleanup trap to restore the terminal on handled exit paths. These are terminal presentation controls, not Android state changes. [4][5]

Rex supplies the remote terminal connection and client display. Its official documentation describes Linux servers, remote macOS clients, terminal splits, and separate pane focus. The particular PNG-to-Kitty path here is supplied implementation evidence, not a claim that Rex provides a built-in Android viewer. [3]

## Why is this not guaranteed 1 FPS?

The loop sleeps for one second **after** each capture and output cycle:

```text
capture -> encode -> write image -> sleep 1 -> repeat
```

The interval therefore includes screenshot generation, encoding, and terminal writes as well as the sleep. Transport and rendering can add visible delay. It is periodic screenshot polling, not a timed video stream, and no frame-rate or latency benchmark was supplied.

## Why does clicking the picture not control Android?

**Read-only describes the Android view, not a disabled terminal.** Clicking the pictured screen can focus the Rex pane. Ordinary typing then enters the Linux host's pseudoterminal (PTY), subject to terminal shortcuts and line discipline, rather than Android's keyboard. A PTY is the bidirectional channel between a terminal and its host-side process. [3][6]

This loop has no mouse-coordinate mapping, keyboard translation, or Android input commands. Receiving a screen image does not create an input path back to the device. Hidden cursors and alternate-screen drawing do not change that distinction. This explains the ownership boundary; it does **not** diagnose any particular keyboard failure.

## Limits of the current approach

- **Repeated full screenshots:** PNG capture, base64 encoding, and complete image transfer recur even if little changes. Native capture resolution still costs bytes when displayed in a small pane. [1][2]
- **Inline configuration:** the supplied command hardcodes an ADB executable under the Nix store and an emulator serial. There is no maintained, tracked launcher to review or reuse.
- **Focus ambiguity:** a clickable-looking Android image remains a host terminal surface. A clear display-only label would help.
- **Blocking and backpressure:** a stalled capture or slow terminal output can delay the next iteration. The supplied description does not establish stdin isolation or input draining. Unread input and output backpressure are separate possible concerns, not measured faults. `q=2` suppresses Kitty replies but is not a general input-management policy. [2][6]

No private app captures or local connection details are needed to explain this mechanism.

## Primary sources

1. Android Developers, [Android Debug Bridge: device selection and screenshots](https://developer.android.com/tools/adb#screencap).
2. Kitty, [Terminal graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/), especially remote-client chunking, image placement, response suppression, and the control-data reference.
3. Superlogical, Rex official docs: [Remote Access](https://www.superlogical.com/rex/docs/linux/remote-access), [CLI split and focus controls](https://www.superlogical.com/rex/docs/reference/cli#rex-split-flags----command), and [agent location versus app focus](https://www.superlogical.com/rex/docs/automate/agent-skill#how-it-works).
4. GNU Coreutils, [`stty` special settings](https://www.gnu.org/software/coreutils/manual/html_node/Special.html), including `size`.
5. XTerm, [Control Sequences](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html), cursor visibility and alternate-screen modes.
6. Linux man-pages, [`pty(7)`](https://man7.org/linux/man-pages/man7/pty.7.html).
