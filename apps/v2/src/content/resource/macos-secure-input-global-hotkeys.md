---
title: "When macOS Secure Input breaks global hotkeys"
date: 2026-08-04T15:46:07+02:00
description: How I diagnosed a recurring Raycast hotkey failure, traced it to Ghostty and macOS Secure Input, and fixed it without restarting my Mac.
tags: [macos, debugging]
images: ['https://og.guidefari.com/og-image?title=When%20macOS%20Secure%20Input%20breaks%20global%20hotkeys']
---

My Raycast hotkey for opening Ghostty, `Option + /`, stopped working. Pressing it in a text field produced `÷` instead.

That character was the clue: macOS received the complete combination, but Raycast could not observe it. Restarting Raycast never helped. The problem was macOS Secure Input.

Secure Input prevents other applications from observing keystrokes while passwords are being entered. This protects against keyloggers, but also blocks legitimate global-hotkey applications. [Ghostty enables it automatically](https://ghostty.org/docs/config/reference#macos-auto-secure-input) when it heuristically detects a password prompt.

## Find the owner

macOS exposes the Secure Input owner through `ioreg`:

```sh
secure_input_pid="$(
  ioreg -l -w 0 |
    rg -o 'kCGSSessionSecureInputPID"=[0-9]+' |
    head -n 1 |
    cut -d= -f2
)"

if [[ -n "$secure_input_pid" ]]; then
  ps -p "$secure_input_pid" -o pid=,lstart=,comm=
else
  echo "No process currently owns Secure Input"
fi
```

While the shortcut was broken, the owner was Ghostty:

```text
645 /Applications/Ghostty.app/Contents/MacOS/ghostty
```

Toggling **Ghostty → Secure Keyboard Entry** and restarting Ghostty did not clear it. After Ghostty restarted under a new PID, macOS still reported the dead PID `645` as the owner:

```text
kCGSSessionSecureInputPID = 645
```

The lock had become stuck in the macOS login session. Locking and unlocking the Mac cleared it without a logout or restart:

```text
Control + Command + Q
```

## iOS Simulator and Stay on Top

The failure also appeared when iOS Simulator was open, especially with **Window → Stay on Top**. That menu item changes window stacking, not Secure Input, so it is a reproduction clue rather than a proven cause.

Next time the hotkey fails, run the owner command with Simulator closed, then open, and then with Stay on Top enabled. If it reports Simulator, the correlation is real. If it reports Ghostty or another app, Simulator is incidental.

## Recovery

1. Check whether Secure Input has an owner with the command above.
2. Finish or cancel any visible password prompt in the owning application.
3. Ensure **Ghostty → Secure Keyboard Entry** is unchecked, then restart the owning application.
4. If `ioreg` still names a dead PID, lock and unlock the Mac.
5. Log out or restart only if that fails.
