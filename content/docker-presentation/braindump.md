---
title: "braindump & snippets"
date: 2024-09-01
description: "Docker command reference, examples, and best practices collection"
tags: ["docker", "reference", "commands"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Docker%20braindump%20%26%20snippets']
---

# braindump & snippets

## Anatomy of a Docker Compose File

Docker Compose uses YAML to define multi-container applications.

### Basic Structure
```yaml
version: '3.8'  # Compose file format version

services:       # Define your containers
  web:
    # Service definition
  database:
    # Another service

volumes:        # Named volumes (optional)
  data:

networks:       # Custom networks (optional)
  app-network:
```

### Service Configuration Options

#### Image vs Build
```yaml
services:
  web:
    # Use existing image
    image: nginx:alpine
    
  app:
    # Build from Dockerfile
    build:
      context: .
      dockerfile: Dockerfile.dev
      args:
        NODE_ENV: development
```

#### Ports and Networking
```yaml
services:
  web:
    ports:
      - "3000:3000"    # host:container
      - "80:8080"
    expose:
      - "3000"         # Only to other containers
```

#### Environment Variables
```yaml
services:
  app:
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://db:5432/myapp
    env_file:
      - .env           # Load from file
      - .env.local
```

#### Volumes and Persistence
```yaml
services:
  database:
    volumes:
      - db_data:/var/lib/postgresql/data  # Named volume
      - ./config:/etc/config:ro           # Bind mount (read-only)
      - /tmp                              # Anonymous volume
      
volumes:
  db_data:  # Define named volume
```

#### Dependencies
```yaml
services:
  web:
    depends_on:
      - database
      - redis
    restart: unless-stopped
```

### Complete Example - Full Stack App
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:4000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@database:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - database
      - redis

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: myapp-network
```

---

## Demo Commands & Snippets

### Container Crafting by Hand Demo

#### 1. Basic chroot Demo


#### 2. Namespaces Demo


#### 3. cgroups Demo


### Docker Build & Run Demos

#### Building Images
```bash
# Build with tag
docker build -t myapp:v1.0 .

# Build with build args
docker build --build-arg NODE_ENV=production -t myapp:prod .

# Build specific stage
docker build --target builder -t myapp:builder .

# See build layers
docker history myapp:v1.0
```

#### Running Containers
```bash
# Basic run
docker run -d -p 3000:3000 --name myapp myapp:v1.0

# Run with environment variables
docker run -d -p 3000:3000 -e NODE_ENV=production myapp:v1.0

# Run with volume
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data myapp:v1.0

# Run interactively
docker run -it --rm myapp:v1.0 /bin/bash

# Run with resource limits
docker run -d --memory=512m --cpus=0.5 myapp:v1.0
```

#### Docker Compose Demos
```bash
# Start all services
docker-compose up -d

# Build and start
docker-compose up --build

# View logs
docker-compose logs -f web

# Scale a service
docker-compose up -d --scale web=3

# Stop and remove
docker-compose down

# Stop and remove with volumes
docker-compose down -v
```

### Slim Container Techniques

#### Multi-stage Build Benefits
```dockerfile
# Bad - Large image with build tools
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Good - Small production image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
USER 1000
CMD ["npm", "start"]
```

#### Size Comparison Commands
```bash
# Compare image sizes
docker images | grep myapp

# Dive into image layers
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive myapp:v1.0

# Inspect image
docker inspect myapp:v1.0
```

### Security Best Practices Demo
```bash
# Scan for vulnerabilities
docker scout quickview myapp:v1.0

# Run as non-root user
docker run --user 1000:1000 myapp:v1.0

# Read-only filesystem
docker run --read-only myapp:v1.0

# Drop capabilities
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp:v1.0
```

This extended content should give you plenty of material for demos and explanations. The hands-on examples will really help your audience understand the concepts!