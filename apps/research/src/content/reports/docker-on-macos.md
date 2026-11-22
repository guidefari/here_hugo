---
title: "How does Docker work on a Mac?"
description: "Why Linux containers need a VM on macOS, how Podman differs, and where OCI, ARM64, and instruction translation fit."
date: "2026-11-13"
tags: ["docker","macos","containers","podman"]
draft: false
---

> Archived agent-written working material, not a finished article in Guide's voice. Original explanations and sources are preserved; claims have not been freshly verified for this import.

How does Docker run Linux containers on macOS? Is Podman doing something different? And if Docker and Kubernetes can run the same images, what is the shared standard underneath them?

These questions connect to my existing [container runtimes note](https://guidefari.com/docker-presentation/container-runtimes/) and [Docker presentation](https://guidefari.com/docker-presentation/start-here/). This note focuses on how those pieces fit together on a Mac. The scope here is **Linux containers**, not Windows containers.

## Why does Docker need a Linux VM on a Mac?

A Linux container is an isolated Linux process, or group of processes. Its isolation and resource controls rely on Linux kernel features such as namespaces and cgroups. Packaging the application into an image doesn't remove that need for Linux.

macOS has a Darwin kernel, not a Linux kernel. Docker Desktop supplies the missing Linux environment through a virtual machine.

Your terminal and Docker CLI live on macOS; the Docker Engine and container processes live inside that VM. The CLI sends requests to the engine.

The containers share the VM's Linux kernel, not the Mac's kernel. Each container has its own isolated view of things like processes and files, but it does not boot its own kernel. There is a VM underneath the containers, not a separate VM for each one.

Docker Desktop also handles integration with the Mac: sharing host directories, forwarding published ports, and allocating CPU and memory to the VM. A bind mount crosses that host/guest boundary; a Docker-managed volume normally lives inside the VM's storage.

Installing the Docker CLI alone doesn't supply a local Linux engine. The CLI needs an engine to talk to, whether that's Docker Desktop's VM, another local VM setup, or a remote Linux machine.

## What is Podman?

[Podman](https://podman.io/) is another open-source container engine. It can build, pull, run, and manage container images, with commands that look familiar if you use Docker.

On Linux, Podman doesn't require a central, long-running daemon like Docker's `dockerd`. It can also run containers as an unprivileged user. Docker supports a rootless mode too, so rootless containers aren't exclusive to Podman.

**Daemonless does not mean VM-less on macOS.** Podman still needs a Linux kernel, so `podman machine` manages a Linux VM. The Mac client talks to a Podman service inside it. Podman Desktop is an optional graphical interface, not the engine itself.

The choice changes the tooling and management model, not the basic requirement for Linux. Podman isn't Docker internally, and similar CLI commands don't guarantee every Docker API, Compose workflow, or integration behaves identically.

## What's the standard they share?

**OCI, the Open Container Initiative**, maintains the main standards behind this interoperability. There isn't just one specification:

- **Image specification:** how an image's filesystem layers, configuration, and manifests are structured.
- **Runtime specification:** how an unpacked filesystem bundle and its configuration become a running container.
- **Distribution specification:** how clients and registries exchange images and other content.

Docker and Podman can work with the same OCI images without sharing the same engine. Low-level runtimes such as `runc` and `crun` implement the runtime specification. The engine manages things around that execution: images, storage, networking, and container lifecycle.

Kubernetes sits at a different level: it orchestrates workloads across nodes. Its node agent, the **kubelet**, talks to a runtime such as containerd or CRI-O through the **Container Runtime Interface (CRI)**. That runtime can then use an OCI runtime to start Linux containers.

**OCI is the shared container standards family. CRI is Kubernetes' interface to its container runtime.** Kubernetes doesn't need Docker Engine to run images built with Docker.

<figure class="docker-map not-prose">
<p class="dm-eyebrow">The ecosystem / different tools, shared contracts</p>
<h3 class="dm-title">Docker isn't the container standard.</h3>
<div class="dm-ecosystem">
<div class="dm-vm"><h4>Docker</h4><p>Docker CLI</p><div class="dm-link">↓ engine API</div><p>dockerd + containerd</p><div class="dm-link">↓ delegates execution</div><p><strong>runc</strong></p></div>
<div class="dm-vm"><h4>Podman</h4><p>Podman CLI</p><div class="dm-link">↓ local engine, or remote service on Mac</div><p>Podman / libpod</p><div class="dm-link">↓ delegates execution</div><p><strong>crun or runc</strong></p></div>
<div class="dm-vm"><h4>Kubernetes</h4><p>kubelet on each node</p><div class="dm-link">↓ CRI</div><p>containerd or CRI-O</p><div class="dm-link">↓ delegates execution</div><p><strong>OCI runtime, e.g. runc</strong></p></div>
</div>
<div class="dm-kernel">OCI runtime specification · shared execution contract</div>
<div class="dm-container" style="margin-block-start: 12px;"><strong>Images can move between these tools.</strong><p>OCI image and distribution specifications define the package and registry exchange. Platform compatibility still matters.</p></div>
<figcaption>Common Linux execution paths, simplified. These are alternatives, not stages in one pipeline. On a Mac, Docker Desktop and Podman Machine put their Linux-side engine and runtime inside a VM. Kubernetes may run on remote nodes or a local cluster; it is not a required part of either desktop setup.</figcaption>
</figure>

## What changes on an Apple Silicon Mac?

Now there are two questions: **which operating system does this program need, and which CPU architecture was it built for?** ARM64 answers the CPU question. It doesn't answer the operating-system question. Both macOS and Linux can run on ARM64, but a Linux binary is not a macOS binary.

Switch the image architecture below. The Linux VM stays in place in both cases. What changes is whether the container's machine instructions need translation.

<style>
.docker-map { --dm-ink: #202c2c; --dm-muted: #4e6261; --dm-green: #1c6554; --dm-amber: #8a431c; color: var(--dm-ink); background: #f4f1e8; border: 1px solid #c4c9bc; border-radius: 20px; padding: clamp(16px, 4vw, 32px); margin-block: 28px; font-family: system-ui, sans-serif; }
.docker-map * { box-sizing: border-box; }
.docker-map .dm-eyebrow { font: 600 11px/1.5 ui-monospace, monospace; letter-spacing: .13em; text-transform: uppercase; color: var(--dm-muted); margin: 0 0 8px; }
.docker-map .dm-title { font-size: clamp(24px, 4vw, 34px); font-weight: 700; line-height: 1.15; letter-spacing: -.04em; margin: 0 0 24px; color: var(--dm-ink); }
.docker-map strong { color: inherit; background: transparent; padding: 0; }
.docker-map .dm-ecosystem { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr)); gap: 12px; margin-block-end: 12px; }
.docker-map .dm-ecosystem h4 { font-size: 20px; color: var(--dm-green); margin: 0 0 18px; }
.docker-map .dm-ecosystem p { font-size: 13px; margin: 0; overflow-wrap: anywhere; }
.docker-map fieldset { border: 0; padding: 0; margin: 0 0 24px; min-inline-size: 0; }
.docker-map legend { font-size: 13px; margin-block-end: 10px; color: var(--dm-muted); }
.docker-map .dm-options { display: flex; flex-wrap: wrap; gap: 10px; }
.docker-map label { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fffdf7; border: 1px solid #9ba9a0; border-radius: 10px; font: 600 13px/1.4 ui-monospace, monospace; cursor: pointer; }
.docker-map label:has(input:checked) { background: #dcece3; border-color: var(--dm-green); }
.docker-map input { accent-color: var(--dm-green); inline-size: 16px; block-size: 16px; margin: 0; }
.docker-map label:focus-within { outline: 3px solid var(--dm-green); outline-offset: 3px; }
.docker-map .dm-host { border: 2px solid #8c9f98; background: #e6e9df; border-radius: 16px; padding: clamp(12px, 3vw, 22px); box-shadow: 0 8px 0 #c7cec2; }
.docker-map .dm-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-block-end: 16px; }
.docker-map .dm-label { font-size: 17px; font-weight: 700; }
.docker-map .dm-badge { font: 600 11px/1.5 ui-monospace, monospace; border: 1px solid #9ba9a0; border-radius: 5px; padding: 3px 7px; background: #f4f1e8; }
.docker-map .dm-cli { padding: 12px 14px; border-radius: 8px; background: #263a36; color: #f4f1e8; font: 13px/1.6 ui-monospace, monospace; overflow-wrap: anywhere; }
.docker-map .dm-link { border-inline-start: 2px dashed #789087; margin-inline-start: 18px; padding: 12px 16px; color: var(--dm-muted); font-size: 12px; }
.docker-map .dm-vm { border: 2px solid #327664; background: #f9fbf4; border-radius: 12px; padding: clamp(12px, 3vw, 20px); }
.docker-map .dm-engine { margin: 0 0 16px; font-size: 12px; color: var(--dm-muted); }
.docker-map .dm-container { padding: 16px; border: 1px solid #74a390; border-radius: 9px; background: #e0eee3; }
.docker-map .dm-container p { margin: 6px 0 0; font-size: 13px; color: var(--dm-muted); }
.docker-map .dm-translation { border: 1px dashed #ad6634; border-radius: 8px; padding: 12px; background: #fff0dc; color: var(--dm-amber); font-size: 13px; margin-block-start: 12px; }
.docker-map .dm-kernel { margin-block-start: 12px; padding: 12px; border-radius: 8px; background: #286451; color: #fffdf7; text-align: center; font: 600 13px/1.5 ui-monospace, monospace; }
.docker-map .dm-hardware { border-block-start: 1px solid #a5b3a7; margin-block-start: 18px; padding-block-start: 14px; display: flex; gap: 12px; align-items: center; }
.docker-map .dm-chip { background: #263a36; color: #f4f1e8; padding: 12px; border-radius: 8px; font: 700 13px/1.2 ui-monospace, monospace; box-shadow: 3px 3px 0 #92a99b; }
.docker-map .dm-hardware p { margin: 0; font-size: 13px; color: var(--dm-muted); }
.docker-map .dm-conclusion { margin: 26px 0 0; font-size: 14px; line-height: 1.6; }
.docker-map .dm-amd { display: none; }
.docker-map:has(#dm-amd:checked) .dm-arm { display: none; }
.docker-map:has(#dm-amd:checked) .dm-amd { display: block; }
.docker-map:has(#dm-amd:checked) .dm-container { background: #fff0dc; border-color: #ad6634; }
.docker-map figcaption { color: var(--dm-muted); font-size: 12px; margin-block-start: 18px; line-height: 1.6; }
</style>

<figure class="docker-map not-prose">
<p class="dm-eyebrow">Under the hood / Apple Silicon</p>
<h3 class="dm-title">Same Mac. Different instructions.</h3>
<fieldset>
<legend>Choose the Linux image architecture</legend>
<div class="dm-options">
<label for="dm-arm"><input id="dm-arm" type="radio" name="dm-platform" checked>linux/arm64</label>
<label for="dm-amd"><input id="dm-amd" type="radio" name="dm-platform">linux/amd64</label>
</div>
</fieldset>
<div class="dm-host">
<div class="dm-row"><span class="dm-label">Your Mac · macOS</span><span class="dm-badge">Darwin kernel</span></div>
<div class="dm-cli"><span class="dm-arm">$ docker run --platform linux/arm64 …</span><span class="dm-amd">$ docker run --platform linux/amd64 …</span></div>
<div class="dm-link">↓ CLI sends a request to the engine inside the VM</div>
<div class="dm-vm">
<div class="dm-row"><span class="dm-label">Linux virtual machine</span><span class="dm-badge">ARM64 guest</span></div>
<p class="dm-engine">Docker Engine creates and manages the container here.</p>
<div class="dm-container">
<strong class="dm-arm">Container · ARM64 Linux app</strong>
<strong class="dm-amd">Container · AMD64 Linux app</strong>
<p>App + libraries + isolated filesystem and processes</p>
</div>
<div class="dm-amd dm-translation"><strong>Instruction translation</strong><br>AMD64 userspace runs through Rosetta or QEMU, depending on the backend and settings. The Linux kernel stays ARM64.</div>
<div class="dm-kernel">Shared Linux kernel · ARM64</div>
</div>
<div class="dm-link">↓ hardware-assisted virtualisation</div>
<div class="dm-hardware"><span class="dm-chip">ARM64</span><p><strong>Apple Silicon</strong><br>The physical CPU beneath both operating systems</p></div>
</div>
<p class="dm-conclusion dm-arm"><strong>Virtualisation, without CPU emulation.</strong> The app's instructions match the chip. Linux still needs its own kernel inside the VM.</p>
<p class="dm-conclusion dm-amd"><strong>Virtualisation + instruction translation.</strong> The VM provides Linux; the translator handles the CPU mismatch. Compute-heavy work can be much slower.</p>
<figcaption>Simplified Docker Desktop model for local Linux containers on Apple Silicon. Containers share the Linux VM's kernel, never the macOS kernel. Translation is a userspace execution mechanism, not a separate VM or a replacement kernel.</figcaption>
</figure>

### ARM64 is the straightforward path

Apple Silicon uses ARM64, also called AArch64. If an image contains ARM64 Linux binaries, their CPU instructions can run without cross-architecture translation inside the ARM64 Linux VM.

That's hardware-assisted **virtualisation**: running another operating system on the same CPU architecture. There is still overhead from the VM, file sharing, networking, and resource limits. Native architecture doesn't mean zero overhead.

### What if the image is AMD64?

`amd64` means x86-64, used by both Intel and AMD processors. It doesn't mean an AMD-only image.

An Apple Silicon CPU cannot directly execute those x86-64 instructions. Docker Desktop can run many AMD64 Linux programs through translation or emulation. The mechanism depends on the virtualisation backend and settings: Rosetta is available with Apple's Virtualization framework when enabled; other configurations use QEMU. Docker's own VMM currently does not support Rosetta.

This can be useful for compatibility, but compilation and other CPU-heavy work can be much slower. Some workloads may not work correctly. Selecting `--platform linux/amd64` asks for AMD64; it does not turn those binaries into ARM64 or guarantee compatibility.

**Virtualisation solves the operating-system boundary. Translation solves the instruction-set mismatch.** They are different jobs, and you can need both at once.

## One image name can cover both

A tag such as `alpine:latest` can point to a multi-platform image index: a list of separate images for different platforms. With a local Apple Silicon Docker Desktop engine, Docker normally selects the `linux/arm64` variant if one exists, unless you override the platform.

The tag is shared. The machine code is not. An AMD64 server can pull the same tag and select the AMD64 variant instead.

If a tag only has an AMD64 image, Docker cannot invent an ARM64 build. You need to use the AMD64 image with compatible emulation, find an ARM64 alternative, or build one yourself.

## Where this shows up in practice

- **Native dependencies:** Node addons, Python wheels, and compiled tools must match the container's OS and architecture. Copying macOS `node_modules` into a Linux container can fail even when both machines use ARM64. Install dependencies inside the target environment instead.
- **Local versus production:** A local build on Apple Silicon commonly targets ARM64. If your deployment machine is AMD64, build for that platform, or publish both variants. Don't assume the server uses your laptop's architecture.
- **Slow builds:** Check whether you're building AMD64 under emulation before blaming Docker as a whole. File-sharing performance and VM resource limits are separate possible causes.

These commands inspect the selected Docker engine and an image's available platforms without starting a workload:

```sh
docker info --format '{{.OSType}}/{{.Architecture}}'
docker buildx imagetools inspect alpine:latest
```

The first describes the engine you are connected to, which may be remote. The second queries the registry for the tag's manifests. It doesn't measure performance or inspect an existing container.

## Sources

- [OCI: image, runtime, and distribution specifications](https://opencontainers.org/about/overview/)
- [Podman: what it is and how it runs containers](https://docs.podman.io/en/latest/)
- [Podman Machine: the VM on macOS](https://docs.podman.io/en/latest/markdown/podman-machine.1.html)
- [Kubernetes: Container Runtime Interface](https://kubernetes.io/docs/concepts/containers/cri/)
- [Docker: multi-platform builds](https://docs.docker.com/build/building/multi-platform/)
- [Docker Desktop: virtual machine managers](https://docs.docker.com/desktop/features/vmm/)

## Related notes

- [Container runtimes](https://guidefari.com/docker-presentation/container-runtimes/): OCI, containerd, runc, and crun.
- [Docker presentation](https://guidefari.com/docker-presentation/start-here/): the broader series, including hands-on isolation demos.
- [K8s crash course](https://guidefari.com/k8s-crash-course/): notes on the orchestration layer.
