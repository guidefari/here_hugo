# Android emulator in a Rex split

This is a self-contained, sanitized version of the Linux-side Go prototype. It uses the existing emulator, not a second Android device or a native Rex plugin.

```text
Android → ADB H.264 → FFmpeg RGB → changed PNG bands → Rex terminal
Android ← ADB input ← mapped touch coordinates     ← Rex mouse events
```

## Build and run

On Linux, install Go 1.22 or newer, Android Platform Tools (`adb`), and FFmpeg. Start a development emulator and run `adb devices -l` and `adb -s emulator-5554 shell wm size`. Substitute the serial and effective display dimensions for your emulator below. The example estimates the image’s proportions using terminal cells, so resize the pane if necessary.

Connect to the Linux Rex host from the Mac over [authenticated remote access](https://www.superlogical.com/rex/docs/linux/remote-access.md). In the remote Rex workspace, split your work tab to the right. In that new pane, from the repository root:

```sh
cd docs/research/android-emulator-stream
go build -o /tmp/rex-android main.go video.go
/tmp/rex-android -serial emulator-5554 -width 540 \
  -device-width 1080 -device-height 2400 -seconds 180
```

Use a foreground terminal, not a redirected non-interactive command. No new network listener is needed, and ADB stays local to Linux. For a supported Linux NVIDIA setup, add `-cuda` to use CUDA decoding and scaling. If FFmpeg reports an unsupported accelerator or filter, remove the flag. Increase `-width` if the pane has space; it increases bytes and work, not Android’s screen resolution.

Click to tap and drag then release to swipe. The footer provides Back, Home, and Recents. `Ctrl-B`, `Ctrl-G`, and `Ctrl-R` do the same from the keyboard. The prototype supports basic ASCII input, not arbitrary text input or multitouch. Use `Ctrl-C` to exit. Some Android builds may keep a disconnected `screenrecord` process until its time limit when the viewer quits, so check before starting another capture.

## Safe test without Android

In a regular Linux shell, generate a five-second test clip in the current directory. Then run the second command in the Rex split. Test mode never sends ADB input.

```sh
ffmpeg -n -f lavfi -i 'testsrc2=size=1080x2400:rate=30' \
  -t 5 -c:v libx264 -preset ultrafast -tune zerolatency -f h264 test.h264
/tmp/rex-android -test "$PWD/test.h264" -width 540
```

The status line separates decoded frames from acknowledged Rex updates. The acknowledgement is for the last graphics command in an update, not proof of physical display timing. Test mode prints a summary when it exits. If the terminal does not acknowledge Kitty graphics, the viewer stops rather than queuing frames indefinitely.

`main.go` manages FFmpeg, ADB, terminal input, and the one-frame queue. `video.go` parses FFmpeg’s RGB output and creates Kitty updates only for changed horizontal bands.
