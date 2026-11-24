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

<figure class="diagram" aria-labelledby="oci-stacks-caption">
<p class="diagram-title">Three tools, two shared contracts</p>
<div class="d-stacks">
<p class="d-band">OCI image and distribution specifications: the same image can be pulled by all three</p>
<ol class="d-stack" aria-label="Docker">
<li class="d-stack-name">Docker</li>
<li>Docker CLI</li>
<li class="d-edge">engine API</li>
<li>dockerd + containerd</li>
<li class="d-edge">delegates execution</li>
<li><b>runc</b></li>
</ol>
<ol class="d-stack" aria-label="Podman">
<li class="d-stack-name">Podman</li>
<li>Podman CLI</li>
<li class="d-edge">local engine, or remote service on a Mac</li>
<li>Podman / libpod</li>
<li class="d-edge">delegates execution</li>
<li><b>crun or runc</b></li>
</ol>
<ol class="d-stack" aria-label="Kubernetes">
<li class="d-stack-name">Kubernetes</li>
<li>kubelet on each node</li>
<li class="d-edge">CRI</li>
<li>containerd or CRI-O</li>
<li class="d-edge">delegates execution</li>
<li><b>OCI runtime, e.g. runc</b></li>
</ol>
<p class="d-band is-strong">OCI runtime specification: the shared execution contract</p>
</div>
<figcaption id="oci-stacks-caption">Common Linux execution paths, simplified. These are alternatives, not stages in one pipeline. Images still need a compatible platform. On a Mac, Docker Desktop and Podman Machine put their Linux-side engine and runtime inside a VM. Kubernetes may run on remote nodes or a local cluster; it is not a required part of either desktop setup.</figcaption>
</figure>

## What changes on an Apple Silicon Mac?

Now there are two questions: **which operating system does this program need, and which CPU architecture was it built for?** ARM64 answers the CPU question. It doesn't answer the operating-system question. Both macOS and Linux can run on ARM64, but a Linux binary is not a macOS binary.

Switch the image architecture below. The Linux VM stays in place in both cases. What changes is whether the container's machine instructions need translation.

<figure class="docker-map">
<p class="dm-eyebrow">Apple Silicon: same Mac, different instructions</p>
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
