# Stack: Dev — Ollama + Qwen3.5-9B

> **Hardware:** [Mac Mini M4 24 GB](../components/hardware/apple-m4-mini-24gb.md)
> **Runtime:** [Ollama](../components/runtimes/ollama.md)
> **Model:** [Qwen3.5-9B](../components/models/qwen-3.5-9b.md)
> **Environment:** [Development](../components/environments/development.md)

The default development stack. Gets you from zero to local inference in 15 minutes.

## Prerequisites
- Mac Mini M4 with 24 GB (or any Apple Silicon Mac with 16 GB+)
- macOS 15 (Sequoia) or later
- 20 GB free disk space
- Terminal access

## Setup

### 1. Install Ollama
```bash
brew install ollama
```

Or download from [ollama.com/download](https://ollama.com/download).

Start the service:
```bash
ollama serve
```
> On macOS, Ollama may auto-start as a menu bar app. If so, skip `ollama serve`.

### 2. Pull the model
```bash
ollama pull qwen3.5:9b
```
This downloads the Q4_K_M quantisation (~5.5 GB).

### 3. Configure for Mac Mini memory
Set context window to 8192 (default 2048 is too small; 262K is too large for 24 GB):
```bash
# Create a modelfile with tuned settings
cat <<'EOF' > /tmp/Modelfile-qwen3.5-dev
FROM qwen3.5:9b
PARAMETER num_ctx 8192
EOF

ollama create qwen3.5-dev -f /tmp/Modelfile-qwen3.5-dev
```

### 4. Verify
```bash
ollama run qwen3.5-dev "Explain what Frugal AI means in two sentences."
```

Check memory usage:
```bash
# In another terminal
ollama ps
```

**Expected results:**
| Metric | Expected |
|--------|----------|
| Tokens/sec | ~30–40 |
| Memory usage | ~6 GB |
| Status | Running |

If tokens/sec is below 20, check that no other memory-heavy apps are running.

### 5. Test the API endpoint
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3.5-dev",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": false
}'
```
This endpoint is what frameworks (Open WebUI, Dify) connect to.

## Memory scaling reference
| Context | Model memory | KV cache | Total | Fits on 24 GB? |
|---------|-------------|----------|-------|----------------|
| 4K | ~5.5 GB | ~0.3 GB | ~5.8 GB | 🟢 comfortable |
| 8K | ~5.5 GB | ~0.6 GB | ~6.1 GB | 🟢 comfortable |
| 32K | ~5.5 GB | ~2.4 GB | ~7.9 GB | 🟢 fine |
| 128K | ~5.5 GB | ~9.6 GB | ~15.1 GB | 🟡 tight with apps |

## Variant: Mac 64 GB
Use a higher quant and longer context:
```bash
ollama pull qwen3.5:9b-q6_K
cat <<'EOF' > /tmp/Modelfile-qwen3.5-pilot
FROM qwen3.5:9b-q6_K
PARAMETER num_ctx 32768
EOF
ollama create qwen3.5-pilot -f /tmp/Modelfile-qwen3.5-pilot
```

## Variant: DGX Spark
Use full precision and full context via vLLM instead:
```bash
pip install vllm
vllm serve Qwen/Qwen3.5-9B --port 8000 \
  --tensor-parallel-size 1 \
  --max-model-len 262144 \
  --reasoning-parser qwen3
```

## Troubleshooting
- **`ollama: command not found`** — Restart terminal after brew install, or add `/opt/homebrew/bin` to PATH.
- **Slow generation (<10 tok/s)** — Check `Activity Monitor → Memory Pressure`. Close browsers/Docker if yellow/red.
- **`Error: model not found`** — Run `ollama list` to verify the model name. Typos in model tags are common.
- **Port 11434 in use** — Another Ollama instance is running. Check with `lsof -i :11434` and stop it.

## Next steps
With this stack running, you can build:
- [Offline Chat Service](../guides/01-offline-chat-service.md) — Add Open WebUI for a ChatGPT-like interface
