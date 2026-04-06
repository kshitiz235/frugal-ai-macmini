# Model Card: Qwen3.5-9B

## Identity
- **Model ID:** Qwen/Qwen3.5-9B
- **Base model:** Qwen/Qwen3.5-9B-Base
- **Source:** [Hugging Face](https://huggingface.co/Qwen/Qwen3.5-9B)
- **Modality:** Multimodal (Text, Image, Video)
- **Languages:** 201 languages and dialects *(source: [HF model card](https://huggingface.co/Qwen/Qwen3.5-9B))*
- **License:** [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Frugal Rating
- **Rating:** 🟢 Light
- **Memory footprint:** ~6.6 GB at Q4_K_M with 8K context *(source: [Ollama registry](https://ollama.com/library/qwen3.5:9b))*
- **Fits on:** [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md), [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md)

## Specs
- **Parameters:** 9.65B *(source: [HF model card](https://huggingface.co/Qwen/Qwen3.5-9B))*
- **Architecture:** Hybrid Gated DeltaNet + Gated Attention with Multi-Token Prediction (MTP) and Vision Encoder (early fusion) *(source: [HF model card](https://huggingface.co/Qwen/Qwen3.5-9B))*
- **Context window:** 262K native, extensible to 1M+ with YaRN *(source: [HF model card](https://huggingface.co/Qwen/Qwen3.5-9B))*
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native) — supports vLLM (`--tool-call-parser qwen3_coder`), SGLang, and MCP via Qwen-Agent *(source: [HF model card](https://huggingface.co/Qwen/Qwen3.5-9B))*
- **Default mode:** Thinking mode enabled — generates `<think>...</think>` before responses; disable via `enable_thinking: False`

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~6.6 GB | ~30–35 *(estimated)* | ~0.8s *(estimated)* |
| Mac 64 GB | Q6_K | 32K | ~12 GB *(estimated)* | ~45–50 *(estimated)* | ~0.5s *(estimated)* |
| DGX Spark 128 GB | FP16 | 262K | ~24 GB *(estimated)* | ~120 *(estimated)* | ~0.2s *(estimated)* |

## Good For
- Complex multi-step reasoning and mathematics with thinking mode
- Multimodal document understanding (images, charts, diagrams, video)
- Long-context analysis and summarisation (262K native context)
- Multilingual instruction following across 201 languages
- Agentic tool-calling workflows with native function calling and MCP support

## Not Good For
- Devices with less than 12 GB available memory (Q4_K_M alone is ~6.6 GB before KV cache)
- Latency-sensitive applications without tuning (thinking mode inflates output tokens by 32K–81K)
- Low-resource language tasks requiring verified accuracy (training skews English/Chinese)

## Limitations
- Thinking mode is on by default and requires large `max_tokens` (32K–81K), increasing latency and memory for KV cache
- Training data skews toward English and Chinese; quality on low-resource languages from the 201 supported is unverified
- Community GGUF quants only — no official quantisations from Qwen team
- YaRN context extension beyond 262K is static and may degrade short-text performance
