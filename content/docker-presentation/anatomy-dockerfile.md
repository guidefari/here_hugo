---
title: "Anatomy of a Dockerfile"
date: 2024-09-22
description: "Complete guide to Dockerfile instructions, multi-stage builds, and container optimization"
tags: ["docker","containers"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Anatomy%20of%20a%20Dockerfile']
---

# Anatomy of a Dockerfile
A Dockerfile is a text file containing instructions to build a Docker image. Each instruction creates a new layer in the image. 

A layer in Docker is essentially a set of filesystem changes that represent a specific instruction (like FROM, RUN, COPY, ADD(which I've never had to use) )  in a Dockerfile. 
Layers are cacheable units, and can be shared across multiple containers

### Essential Dockerfile Instructions

#### FROM - The Foundation
```dockerfile
# Always start with a base image
FROM node:18-alpine
# Use specific tags, avoid 'latest' in production
FROM ubuntu:22.04
# Multi-stage builds start here
FROM golang:1.21 AS builder
```

#### WORKDIR - Set Working Directory
```dockerfile
# Sets the working directory for subsequent instructions
WORKDIR /app
# Creates the directory if it doesn't exist
# Much better than using RUN cd /app, allegedly
```

#### COPY vs ADD
```dockerfile
# COPY - preferred for simple file copying
COPY package*.json ./
COPY src/ ./src/

# ADD - has extra features (auto-extraction, URLs)
ADD https://example.com/file.tar.gz /tmp/
ADD archive.tar.gz /extracted/  # Auto-extracts
```

#### RUN - Execute Commands
```dockerfile
# Each RUN creates a new layer - combine commands to reduce layers
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN npm ci --only=production
```

#### EXPOSE - Document Ports
```dockerfile
# EXPOSE is purely documentation - it does NOT publish ports!
EXPOSE 3000
EXPOSE 80 443

# Think of it as a hint to other developers about what ports your app uses
# To actually publish ports, you need:
# docker run -p 3000:80 myapp  (maps host:container)
# or in docker-compose:
# ports:
#   - "3000:3000"

# EXPOSE helps with:
# 1. Documentation - shows intended ports
# 2. Container linking (legacy Docker feature)
# 3. Random port assignment: docker run -P myapp
#    (publishes all EXPOSEd ports to random host ports)
```

#### ENV - Environment Variables
```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgresql://localhost:5432/myapp
```

#### USER - Security Best Practice
```dockerfile
# Don't run as root!
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

#### CMD vs ENTRYPOINT - The Execution Difference

**CMD** - Provides defaults that can be overridden:
```dockerfile
CMD ["npm", "start"]

# Running the container:
docker run myapp                    # Runs: npm start
docker run myapp npm run dev        # Runs: npm run dev (CMD is ignored!)
docker run myapp /bin/bash          # Runs: /bin/bash (CMD is ignored!)
```

**ENTRYPOINT** - Always executes, can't be easily overridden:
```dockerfile
ENTRYPOINT ["npm"]

# Running the container:
docker run myapp                    # Runs: npm (probably errors)
docker run myapp start              # Runs: npm start
docker run myapp run dev            # Runs: npm run dev
docker run myapp /bin/bash          # Runs: npm /bin/bash (probably errors!)
```

**Combined Pattern** - Best of both worlds:
```dockerfile
ENTRYPOINT ["npm"]
CMD ["start"]

# Running the container:
docker run myapp                    # Runs: npm start
docker run myapp run dev            # Runs: npm run dev
docker run myapp test               # Runs: npm test

# The ENTRYPOINT is always "npm", CMD provides the default argument
# You can override the argument, but npm will always be the command
```

**Shell vs Exec Form**:
CMD runs in shell, while 

```dockerfile
# Shell form - runs in shell, can use shell features, but doesn't handle signals well
CMD npm start
ENTRYPOINT npm start
```
**What actually happens:**
- Runs as: ⁠/bin/sh -c "npm start"
- Creates a shell process that then runs your command


```dockerfile
# Exec form - runs directly, better for containers, handles signals properly
CMD ["npm", "start"]
ENTRYPOINT ["npm", "start"]

# PID 1 problem: Shell form creates a shell process as PID 1, 
# which doesn't properly forward signals to your app.
# Exec form makes your app PID 1, so it gets signals directly.
```

### Complete Example - Node.js App (Multi-stage Explained)
```dockerfile
# DEPS stage - Production dependencies only
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Only install production deps and clean cache to minimize layer size
RUN npm ci --only=production && npm cache clean --force

# BUILDER stage - Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including devDependencies for building)
RUN npm ci
COPY . .
# Build the application (needs devDependencies like TypeScript, bundlers, etc.)
RUN npm run build

# RUNNER stage - Final production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
# Copy ONLY production dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs package.json ./

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

**Why separate deps and builder stages?**

The key insight is that we need different dependencies at different stages:

- **DEPS stage**: Only production dependencies (`--only=production`)
  - These are needed to RUN the app in production
  - Examples: express, react, lodash
  
- **BUILDER stage**: ALL dependencies (production + dev)
  - DevDependencies are needed to BUILD the app
  - Examples: typescript, webpack, @types packages, testing libraries
  - We don't want these in our final image (bloat + security)

**Alternative (less optimal) approach:**
```dockerfile
# This works but creates a larger final image
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci  # Installs ALL deps
COPY . .
RUN npm run build
RUN npm prune --production  # Remove devDeps after build
CMD ["npm", "start"]

# Problems:
# 1. Final image contains build artifacts and temp files
# 2. npm prune doesn't always clean everything
# 3. Larger attack surface
# 4. Less cacheable layers
```

