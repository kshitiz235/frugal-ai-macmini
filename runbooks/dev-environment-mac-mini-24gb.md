# Runbook: Dev Environment — Mac Mini 24 GB

> **Scope:** Complete development environment on Mac Mini M4 (24 GB)
> **Prerequisites:** macOS 15 (Sequoia) or later, admin access

Everything you need to go from a fresh Mac Mini to a working local AI development environment. After initial setup, use this runbook for day-to-day operations, troubleshooting, and maintenance.

## Overview

The dev environment runs three layers:
1. **System tools** — Homebrew, Docker Desktop
2. **Inference runtime** — Ollama (Metal-accelerated)
3. **Applications** — Open WebUI and other frameworks via Docker

Steady state: Ollama runs as a background service, Docker hosts application containers, ~8 GB memory used by the AI stack leaving ~16 GB for macOS and other apps.

## Initial Setup

### 1. Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Add to PATH (Apple Silicon default):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Verify:
```bash
brew --version
```

### 2. Install Docker Desktop
```bash
brew install --cask docker
```

Open Docker Desktop from Applications to complete first-run setup. Allocate at least 8 GB memory in Docker Desktop → Settings → Resources.

Verify:
```bash
docker --version
docker run hello-world
```

### 3. Install Ollama
```bash
brew install ollama
```

Start the service:
```bash
brew services start ollama
```

This registers Ollama as a background service that starts on login.

Verify:
```bash
ollama --version
curl -s http://localhost:11434/api/tags | head -c 100
```

### 4. Pull a starter model

Follow the stack doc for model-specific setup: [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md)

Quick smoke test with a small model:
```bash
ollama pull qwen3.5:1.5b
ollama run qwen3.5:1.5b "Say hello in one sentence."
```

### 5. Install common tools
```bash
brew install curl jq git
```

## Day-to-Day Operations

### Start
Ollama starts automatically via `brew services`. To start manually:
```bash
brew services start ollama
```

Start Docker Desktop from Applications, or:
```bash
open -a Docker
```

Start application containers:
```bash
docker start open-webui
```

### Stop
```bash
# Stop application containers
docker stop open-webui

# Stop Ollama (frees model memory)
brew services stop ollama

# Quit Docker Desktop (frees ~2 GB)
osascript -e 'quit app "Docker Desktop"'
```

### Restart
```bash
brew services restart ollama
docker restart open-webui
```

Restart Ollama when: model gets stuck, memory pressure is high, after macOS update.

### Check Status
```bash
# Ollama service
brew services list | grep ollama

# Loaded models and memory
ollama ps

# Docker containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Health Check

| Check | Command | Expected |
|-------|---------|----------|
| Ollama running | `curl -s http://localhost:11434/api/tags \| jq '.models \| length'` | `≥1` |
| Model loaded | `ollama ps` | Shows model name, size, processor |
| Inference works | `ollama run qwen3.5-dev "Say hi" --verbose 2>&1 \| grep "eval rate"` | `≥20 tokens/s` |
| Docker running | `docker info --format '{{.ContainersRunning}}'` | `≥1` (if apps deployed) |
| Open WebUI up | `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000` | `200` |
| Memory OK | `memory_pressure` | `The system has *** free` |
| Disk space | `df -h / \| awk 'NR==2{print $4}'` | `≥20 GB free` |

## Troubleshooting

### Ollama not responding
**Symptom:** `curl: (7) Failed to connect to localhost port 11434`
**Cause:** Ollama service not running or crashed.
**Fix:**
```bash
brew services restart ollama
# Check logs if it keeps crashing
cat ~/.ollama/logs/server.log | tail -20
```

### High memory pressure / swapping
**Symptom:** System sluggish, Activity Monitor shows yellow/red memory pressure.
**Cause:** Model + apps exceed available memory.
**Fix:**
```bash
# Unload all models from memory
curl -X DELETE http://localhost:11434/api/generate -d '{"model": "qwen3.5-dev", "keep_alive": 0}'

# Or stop Ollama entirely
brew services stop ollama

# Check what's using memory
ps aux --sort=-%mem | head -10
```

Prevent by using the memory scaling reference in the [stack doc](../stacks/dev-ollama-qwen3.5.md) to choose appropriate context lengths.

### Docker container won't start
**Symptom:** `docker start open-webui` fails or container exits immediately.
**Cause:** Port conflict, Docker Desktop not running, or corrupted state.
**Fix:**
```bash
# Check if Docker is running
docker info

# Check port conflict
lsof -i :3000

# Remove and recreate (data preserved in volume)
docker rm open-webui
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

### Model download stuck or corrupted
**Symptom:** `ollama pull` hangs or model gives garbage output.
**Cause:** Interrupted download or disk full.
**Fix:**
```bash
# Remove and re-pull
ollama rm qwen3.5:9b
ollama pull qwen3.5:9b

# Check disk space if pull fails
df -h ~/.ollama
```

### Port 11434 already in use
**Symptom:** `Error: listen tcp 127.0.0.1:11434: bind: address already in use`
**Cause:** Another Ollama instance (possibly from .app and brew simultaneously).
**Fix:**
```bash
# Find what's using the port
lsof -i :11434

# Kill the other process
kill $(lsof -ti :11434)

# Restart
brew services restart ollama
```

## Recovery

### Ollama data corrupted
If models fail to load or produce errors after a crash:
```bash
# Remove all models and re-download
rm -rf ~/.ollama/models
brew services restart ollama
ollama pull qwen3.5:9b
# Re-run stack setup to recreate custom modelfiles
```

### Docker volume data loss
If Open WebUI loses chat history or settings:
```bash
# Check if volume exists
docker volume inspect open-webui

# If volume is gone, recreate (chat history is lost)
docker volume create open-webui
docker restart open-webui
```

To prevent: see Backup section below.

### Full environment reset
Nuclear option — removes everything and starts fresh:
```bash
# Stop everything
brew services stop ollama
docker stop $(docker ps -q)

# Remove Ollama data
rm -rf ~/.ollama

# Remove Docker containers and volumes
docker system prune -a --volumes

# Reinstall
brew reinstall ollama
brew services start ollama
# Then re-run stack setup from scratch
```

## Maintenance

### Updates

**Ollama:**
```bash
brew upgrade ollama
brew services restart ollama
```

**Docker Desktop:**
Docker Desktop auto-updates. Or manually: `brew upgrade --cask docker`.

**Open WebUI:**
```bash
docker pull ghcr.io/open-webui/open-webui:main
docker stop open-webui && docker rm open-webui
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

**Models:**
```bash
# Re-pull to get updated quants
ollama pull qwen3.5:9b
# Recreate custom modelfiles after update
```

### Cleanup

**Unused models:**
```bash
# List all models
ollama list

# Remove models you no longer need
ollama rm <model-name>
```

**Docker:**
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes (careful — this deletes data)
docker volume prune
```

**Disk usage check:**
```bash
# Ollama models
du -sh ~/.ollama/models

# Docker
docker system df
```

### Backup

**What to back up:**
- Open WebUI data: `docker volume inspect open-webui` shows the mountpoint
- Custom Ollama modelfiles: save your `Modelfile-*` files in this repo or dotfiles

**Quick backup:**
```bash
# Back up Open WebUI SQLite database
docker cp open-webui:/app/backend/data/webui.db ~/backups/webui-$(date +%Y%m%d).db
```

Run backups weekly, or before any major update.
