---
title: vidscript
description: A local macOS CLI that turns a video into a transcript a context window, using FFmpeg, Parakeet, and a Swift worker.
topics:
  - effect
  - bun
  - swift
  - protobuf
  - parakeet
  - cli
---

## Why this project

I needed the useful context in a feature walkthrough video as text before asking an agent to plan the work. vidscript keeps that path local: video in, transcript out.

## Technical details

### A narrow, portable workflow

The Effect use case owns validation, temporary-workspace lifetime, extraction, transcription, output, and cleanup. FFmpeg and the macOS worker sit behind `AudioExtractor` and `Transcriber` contracts, so another platform can replace the worker without changing the workflow.

### Deliberately normalized audio

FFmpeg extracts no video stream and writes mono, 16 kHz, Float32 PCM WAV. The Swift worker rejects audio outside that shape, which gives the model one predictable input boundary.

### Local Parakeet through Swift

A small Swift executable uses FluidAudio and Core ML to load Parakeet TDT v2 from an explicit local model directory. The first target matches the model path used by Hex, rather than silently downloading a different model.

### Typed process boundary

TypeScript and Swift share a Buf-generated protobuf schema over a per-job Unix socket. Four-byte length-prefixed frames carry readiness, progress, results, failures, cancellation, and shutdown messages without opening a TCP port.

### Cancellation is resource cleanup

An Effect scope owns the FFmpeg process, Swift worker, socket, and temporary workspace. Ctrl-C sends cancellation to the worker, waits briefly for it to stop, then removes the socket and temporary files.

### Safe shell output

Transcript text goes to stdout and progress goes to stderr, so shell redirection works. `--output` writes a `0600` temporary file, hard-links it into place without replacing an existing file, and removes the temporary file on every exit path.
