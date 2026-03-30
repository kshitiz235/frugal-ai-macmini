# Stack: Dev — Ollama Local

> **Hardware:** [Mac Mini M4 24 GB](../components/hardware/apple-m4-mini-24gb.md)
> **Runtime:** [Ollama](../components/runtimes/ollama.md)
> **Model:** [Qwen3.5-9B](../components/models/qwen-3.5-9b.md)
> **Environment:** [Development](../components/environments/development.md)

Baseline stack for local LLM UI experiments. Provides a stable Ollama service with Qwen3.5-9B tuned for 8K context windows — perfect for pairing with frameworks like Open WebUI.

## Prerequisites
- Mac Mini M4 (24 GB) or better
- macOS 15 (Sequoia) or later
- 20 GB free disk
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
Set context window to 8192 (default 2048 is small; 262K is too large for 24 GB):
```bash
# Create a modelfile with tuned settings
cat <<'EOF' > /tmp/Modelfile-qwen3.5-local
FROM qwen3.5:9b
PARAMETER num_ctx 8192
EOF

ollama create qwen3.5-local -f /tmp/Modelfile-qwen3.5-local
```

### 4. Verify
```bash
ollama run qwen3.5-local "Explain what Frugal AI means in two sentences."
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

If tokens/sec is below 20, close memory-heavy apps.

### 5. Test the API endpoint
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3.5-local",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": false
}'
```
This endpoint fuels frameworks (Open WebUI, Dify, etc.).

## Memory scaling reference
| Context | Model memory | KV cache | Total | Fits on 24 GB? |
|---------|--------------|----------|-------|----------------|
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
Use full precision and long context via vLLM:
```bash
pip install vllm
vllm serve Qwen/Qwen3.5-9B --port 8000 \
  --tensor-parallel-size 1 \
  --max-model-len 262144 \
  --reasoning-parser qwen3
```

## Troubleshooting
- **`ollama: command not found`** — Restart terminal after `brew install`, or add `/opt/homebrew/bin` to PATH.
- **Slow generation (<10 tok/s)** — Check `Activity Monitor → Memory Pressure`. Close browsers/Docker if yellow/red.
- **`Error: model not found`** — Run `ollama list` to verify the model tag. Typos are common.
- **Port 11434 in use** — Another Ollama instance is running. Check with `lsof -i :11434` and stop it.

## Next steps
With this stack running, you can layer:
- [Offline Chat Service](../guides/01-offline-chat-service.md) — Adds Open WebUI for a ChatGPT-style interface.
- [Local LLM UI Setup](../guides/06-local-llm-ui-setup.md) — Hardens Open WebUI for team use.
