# Model Card: Mistral-7B-Instruct-v0.3

## Identity
- **Model ID:** mistralai/Mistral-7B-Instruct-v0.3
- **Base model:** mistralai/Mistral-7B-v0.3
- **Source:** https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3
- **Modality:** Text
- **Languages:** English (primary)
- **License:** [Apache 2.0](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3/blob/main/LICENSE)

## Frugal Rating
- **Rating:** 🟢 Light
- **Memory footprint:** ~4.4 GB at Q4_K_M, 8K context
- **Fits on:** [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md), [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md)

## Specs
- **Parameters:** 7B
- **Architecture:** Dense Transformer
- **Context window:** 32K (32768 tokens)
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native, supported in v0.3)

## Inference Performance

| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~4.4 GB | ~18 | ~0.4s |
| Mac Mini 24 GB | Q4_K_M | 32K | ~5.5 GB | ~12 | ~0.8s |
| Mac 64 GB | Q6_K | 8K | ~5.5 GB | ~30 | ~0.3s |
| DGX Spark 128 GB | FP16 | 8K | ~14 GB | ~80 | ~0.1s |

> Source: Apple Silicon benchmarks from [Advanced Stack](https://advanced-stack.com/resources/inference-performance-benchmark-of-mistral-ai-instruct-using-llama-cpp.html) (M1 Metal), [Medium](https://medium.com/@santhoshnumber1/running-mistral-7b-lally-on-macbook-m1-pro-benchmarking-llama-cpp-89631f6c04b6) (M1 Pro). DGX Spark estimated.

## Good For
- General instruction-following and chat
- Summarisation and text generation
- Code completion and simple programming tasks
- Lightweight agentic tasks via function calling (source: [HF model card](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3))
- Long-context tasks with 32K window
- Fine-tuning base for domain-specific models (724 community adapters on HF)

## Not Good For
- Multilingual tasks beyond English (see [Qwen3.5-9B](../models/qwen-3.5-9b.md) for multilingual)
- Complex multi-step reasoning (see [DeepSeek-V3-0324](../models/deepseek-v3-0324.md) for reasoning)
- State-of-the-art quality on par with larger models
- High-throughput production inference without vLLM (see [runtimes](../components/runtimes/ollama.md))

## Limitations
- **No moderation** — model has no built-in content filtering (per [HF model card](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3))
- **English-only** — not optimised for multilingual workloads
- **Smaller than modern 9-14B models** — Qwen3.5-9B offers better quality at similar memory footprint
- **Function calling requires transformers 4.42+** — tool use via chat template (per [HF model card](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3))

## Run locally

### Ollama
```bash
ollama pull mistral
ollama run mistral
```

> Tag `mistral` defaults to v0.3 (latest). Use `mistral:7b` for explicit 7B variant or `mistral:v0.3` for specific version (per [Ollama library](https://ollama.com/library/mistral)).

### llama.cpp (manual)
```bash
# Download Q4_K_M quant from TheBloke
huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.3-GGUF mistral-7b-instruct-v0.3.Q4_K_M.gguf --local-dir ./models

# Run with Metal (macOS)
./llama-cli -m ./models/mistral-7b-instruct-v0.3.Q4_K_M.gguf -ngl 33 -c 8192 -p "Explain local AI in one sentence."
```

## Comparison

| Model | Params | Memory | Quality | Best for |
|-------|--------|--------|---------|----------|
| Mistral-7B-Instruct-v0.3 | 7B | ~4.4 GB | Good | Lightweight English tasks |
| Qwen3.5-9B | 9B | ~5.5 GB | Better | Multilingual, reasoning |
| DeepSeek-V3-0324 | 685B MoE | 150+ GB | Best | Heavy reasoning workloads |

Mistral-7B-Instruct-v0.3 is a solid choice for English-only lightweight tasks. For multilingual or reasoning-heavy workloads, prefer [Qwen3.5-9B](../models/qwen-3.5-9b.md).
