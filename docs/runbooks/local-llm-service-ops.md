# Runbook: Local LLM Service

> **Scope:** Core LLM inference service (Ollama runtime + models)
> **Prerequisites:** [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)

Day-to-day operation, monitoring, failure handling, and recovery for your local LLM inference service.

## Overview

The local LLM service consists of:

1. **Ollama runtime** — Manages model loading, inference, and the OpenAI-compatible API
2. **Models** — Qwen3.5-9B (or others) served via GGUF quantisation
3. **API endpoint** — `http://localhost:11434` serving the OpenAI-compatible API

Steady state: Ollama running in background, one model loaded, ~6 GB memory used (Qwen3.5-9B Q4_K_M).

## Setup

Initial setup is covered by the [stack doc](../stacks/dev-ollama-qwen3.5.md). This section covers verification that the service is ready for production use.

### Verify installation

```bash
ollama --version
curl -s http://localhost:11434/api/tags | jq '.models'
```

### Configure for auto-start

macOS:
```bash
brew services start ollama
```

Linux (systemd):
```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

Windows: Ollama installs as a Windows service automatically.

## Day-to-Day Operations

### Start

```bash
# macOS
brew services start ollama

# Linux
sudo systemctl start ollama

# Windows (PowerShell)
Start-Service Ollama
```

Wait 5 seconds, then verify:
```bash
curl -s http://localhost:11434/api/tags | jq '.models | length'
```

### Stop

```bash
# macOS
brew services stop ollama

# Linux
sudo systemctl stop ollama

# Windows
Stop-Service Ollama
```

> Stopping Ollama unloads all models and frees memory.

### Restart

```bash
# macOS
brew services restart ollama

# Linux
sudo systemctl restart ollama

# Windows
Restart-Service Ollama
```

Restart when: model produces garbage output, memory pressure is high, after system update, or after Ollama update.

### Check Status

```bash
# Service status
brew services list | grep ollama  # macOS
systemctl status ollama            # Linux

# Loaded models and memory
ollama ps

# API endpoint health
curl -s http://localhost:11434/api/tags | jq '.models[].name'
```

## Monitoring

### Real-time resource usage

```bash
# Memory pressure (macOS)
memory_pressure

# Memory usage breakdown
ps aux --sort=-%mem | head -5

# Ollama-specific memory
ollama ps
```

### API request monitoring

```bash
# Test API endpoint
curl -s http://localhost:11434/api/chat -d '{
  "model": "qwen3.5-dev",
  "messages": [{"role": "user", "content": "Hi"}],
  "stream": false
}' | jq '.message.content'

# Check server info
curl -s http://localhost:11434/api/show -d '{"name": "qwen3.5-dev"}' | jq '.parameters'
```

### Performance benchmarking

```bash
# Quick token rate test
time ollama run qwen3.5-dev "Write a haiku about coding." 2>&1 | grep "eval rate"

# Full benchmark (requires python)
pip install ollama
python3 << 'EOF'
import ollama
import time

model = "qwen3.5-dev"
prompt = "Explain what local AI means in three sentences."

start = time.time()
response = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}], stream=False)
elapsed = time.time() - start

tokens = len(response["message"]["content"].split())
tok_per_sec = tokens / elapsed

print(f"Tokens: {tokens}, Time: {elapsed:.2f}s, Rate: {tok_per_sec:.1f} tok/s")
EOF
```

## Health Check

Run this before starting work or after troubleshooting:

| Check | Command | Expected |
|-------|---------|----------|
| Service running | `curl -s -o /dev/null -w '%{http_code}' http://localhost:11434` | `200` |
| Model loaded | `ollama ps --format '{{.Name}}'` | `qwen3.5-dev` |
| Model responsive | `ollama run qwen3.5-dev "Hi" --verbose 2>&1 \| grep "eval rate"` | `≥20 tokens/s` |
| Memory OK | `memory_pressure` (macOS) | `The system has *** free` |
| Disk space | `df -h ~/.ollama` | `≥15 GB free` |

## Troubleshooting

### Ollama service won't start

**Symptom:** `brew services start ollama` succeeds but service is not running.

**Cause:** Port 11434 already in use, or crash on startup.

**Fix:**
```bash
# Check port conflict
lsof -i :11434

# Kill conflicting process
kill $(lsof -ti :11434)

# Check logs
cat ~/.ollama/logs/server.log | tail -50

# Restart
brew services restart ollama
```

### Model not found after restart

**Symptom:** `ollama run qwen3.5-dev` returns "model not found".

**Cause:** Model was deleted or pull was interrupted.

**Fix:**
```bash
# List available models
ollama list

# Re-pull if missing
ollama pull qwen3.5:9b

# Recreate custom modelfile
cat <<'EOF' > ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
FROM qwen3.5:9b
PARAMETER num_ctx 8192
EOF
ollama create qwen3.5-dev -f ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
```

### Slow inference (< 15 tok/s)

**Symptom:** Token generation is noticeably slower than usual.

**Cause:** Memory pressure, other apps consuming resources, or model needs recreation.

**Fix:**
```bash
# Check memory pressure
memory_pressure  # macOS

# Unload unused models
ollama ps  # See what's loaded
# Models stay loaded for 5min by default, or until restart

# Restart Ollama to clear state
brew services restart ollama

# Test again
ollama run qwen3.5-dev "Test" --verbose 2>&1 | grep "eval rate"
```

### High memory usage after stopping

**Symptom:** `ollama ps` shows no models but memory is still high.

**Cause:** Ollama keeps models in memory for 5 minutes by default (`keep_alive`).

**Fix:**
```bash
# Force unload all models
curl -X POST http://localhost:11434/api/generate -d '{"model": "qwen3.5-dev", "keep_alive": 0}'

# Or restart Ollama
brew services restart ollama
```

### API returns 500 error

**Symptom:** `curl` returns HTTP 500 or "context length exceeded".

**Cause:** Request exceeds context window or model is overloaded.

**Fix:**
```bash
# Check model parameters
ollama show qwen3.5-dev

# Reduce context if needed
cat <<'EOF' > ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
FROM qwen3.5:9b
PARAMETER num_ctx 4096
EOF
ollama create qwen3.5-dev -f ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
brew services restart ollama
```

## Recovery

### Model data corrupted

**Symptom:** Model loads but produces garbled or nonsensical output.

**Steps:**
```bash
# 1. Stop Ollama
brew services stop ollama

# 2. Remove corrupted model
ollama rm qwen3.5:9b
rm -rf ~/.ollama/models/blobs/*qwen3.5*

# 3. Re-pull model
ollama pull qwen3.5:9b

# 4. Recreate custom modelfile
cat <<'EOF' > ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
FROM qwen3.5:9b
PARAMETER num_ctx 8192
EOF
ollama create qwen3.5-dev -f ~/.ollama/modelfiles/Modelfile-qwen3.5-dev

# 5. Restart
brew services start ollama

# 6. Verify
ollama run qwen3.5-dev "Test response."
```

### Full reset (nuclear option)

Removes all Ollama data. Use when migrating or after catastrophic failure:

```bash
# 1. Stop service
brew services stop ollama

# 2. Remove all data
rm -rf ~/.ollama

# 3. Reinstall
brew reinstall ollama
brew services start ollama

# 4. Re-run stack setup
# Follow: ../stacks/dev-ollama-qwen3.5.md
ollama pull qwen3.5:9b
```

### Restore from backup

If you backed up custom modelfiles:
```bash
# Restore modelfile
cp ~/backups/Modelfile-qwen3.5-dev ~/.ollama/modelfiles/
ollama create qwen3.5-dev -f ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
```

## Maintenance

### Updates

**Ollama:**
```bash
# macOS
brew upgrade ollama
brew services restart ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Verify
ollama --version
```

**Models:**
```bash
# Pull latest quantisation
ollama pull qwen3.5:9b

# Recreate custom modelfile after update
ollama create qwen3.5-dev -f ~/.ollama/modelfiles/Modelfile-qwen3.5-dev
```

### Cleanup

**Remove unused models:**
```bash
ollama list
ollama rm <unused-model>
```

**Reclaim disk space:**
```bash
# Check Ollama disk usage
du -sh ~/.ollama/models

# Prune model cache (removes partial downloads)
rm -rf ~/.ollama/models/blobs/tmp*

# Docker cleanup (if using containers)
docker system prune -a
```

### Backup

**What to back up:**
- Custom modelfiles: `~/.ollama/modelfiles/`
- Ollama config: `~/.ollama/config.yaml` (if exists)

**Backup commands:**
```bash
# Backup modelfiles
mkdir -p ~/backups/ollama
cp -r ~/.ollama/modelfiles ~/backups/ollama/

# Backup config
cp ~/.ollama/config.yaml ~/backups/ollama/ 2>/dev/null || true

# List backups
ls -la ~/backups/ollama/
```

**Schedule:** Weekly, or before major updates.

## Service Dependencies

This service is a dependency for:

- [Offline Chat Service guide](../guides/01-offline-chat-service.md) — Open WebUI requires Ollama
- [Agentic Workflows guide](../guides/02-agentic-workflows.md) — Qwen-Agent requires Ollama API

If this service is down, those applications will fail with connection errors.
