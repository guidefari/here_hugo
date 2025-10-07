---
title: "Docker Presentation"
date: 2024-09-01
description: "A comprehensive series covering Docker from container fundamentals to production best practices"
tags: ["docker", "containers", "devops"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Docker%20Learning%20Series']
---

This series of notes comes from a Docker presentation I did for Shipping mates.
The idea was to cover the basics of docker, and a few specific questions the crew had.

Big thanks to Brian Holt's [intro container course on frontend masters](https://frontendmasters.com/courses/complete-intro-containers-v2/).
I watched both the v1 and [v2](https://frontendmasters.com/courses/complete-intro-containers-v2/) courses a few years apart, and they set a solid foundation for my docker knowledge. Can't recommend the course enough!

## Series Overview

### [Top Level Presentation doc](/docker-presentation/shipping-mates-docker-in-depth/)

- Understanding what containers really are
- The three pillars: chroot, namespaces, and cgroups
- Container daemons and runtime ecosystems
- Hands-on container crafting

### [Anatomy of a Dockerfile](/docker-presentation/anatomy-of-a-dockerfile/)

- Essential Dockerfile instructions and best practices
- Understanding layers and image optimization
- Multi-stage builds for production
- Security considerations and non-root users
- CMD vs ENTRYPOINT patterns
- [Container runtimes explained](/docker-presentation/container-runtimes/)

### [Anatomy of a Docker Compose file](/docker-presentation/anatomy-of-a-docker-compose-file/)

- When and why to use Docker Compose
- Service orchestration and dependencies
- Development vs production considerations
- Real-world full-stack application example

### Hands-On Fundamentals

**Demo Collection**: Practical exercises

- **[chroot demo](/docker-presentation/chroot-demo/)** - Building isolated environments
- **[namespaces demo](/docker-presentation/namespaces-demo/)** - Process isolation techniques
- **[cgroups demo](/docker-presentation/cgroups-demo/)** - Resource management and limits
- **[Creating the environment: dockerception!](/docker-presentation/creating-the-environment-dockerception/)**

### Part 5: Advanced Techniques & Best Practices

**[braindump & snippets](/docker-presentation/braindump-snippets/)**

- Production-ready multi-stage builds
- Container security and scanning
- Performance optimization techniques
- Comprehensive command reference

## Prerequisites

- Basic Linux command-line knowledge
- A machine with Docker installed (covered in Part 1)

---

*This series emerged from a presentation with the Shipping mates and has been expanded with additional practical content and real-world examples.*
