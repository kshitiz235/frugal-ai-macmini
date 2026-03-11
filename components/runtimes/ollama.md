# Ollama

Local inference runtime for running open-weight models. Offline-capable, single-binary install, OpenAI-compatible API.

## When to use
- Development and pilot environments
- Offline / air-gapped deployments
- Quick prototyping and local chat
- Apple Silicon (Metal acceleration built in)

## When NOT to use
- High-concurrency production serving (use vLLM instead)
- Requires CUDA-specific features (tensor parallelism, speculative decoding)

## Key features
- GGUF model format (quantized, efficient)
- OpenAI-compatible API at `http://localhost:11434`
- Automatic Metal (macOS) and CUDA (Linux) acceleration
- Built-in model management (`ollama pull`, `ollama list`)
- Function/tool calling support via `/api/chat`

## Key settings
| Setting | Default | Notes |
|---------|---------|-------|
| `OLLAMA_MAX_LOADED_MODELS` | 1 | Increase on 64 GB+ machines |
| `OLLAMA_NUM_PARALLEL` | 1 | Concurrent request slots |
| `num_ctx` | 2048 | Context window — increase per stack doc |
| `OLLAMA_HOST` | `127.0.0.1:11434` | Bind address for API |

## Compatibility
| Hardware | Status | Notes |
|---------|--------|-------|
| [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md) | Tested | Metal, recommended |
| [Mac 64 GB](../hardware/apple-mac-64gb.md) | Tested | Metal, recommended |
| [DGX Spark](../hardware/nvidia-dgx-spark.md) | Tested | CUDA |

## Install (quick reference)

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Full device-specific configuration is in the stack docs.

## Links
- [ollama.com](https://ollama.com)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Model library](https://ollama.com/library)
