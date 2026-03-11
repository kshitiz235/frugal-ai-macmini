# Model Card: Qwen3.5-9B

## Identity
- **Model ID:** Qwen/Qwen3.5-9B
- **Base model:** Qwen/Qwen3.5-9B-Base
- **Source:** https://huggingface.co/Qwen/Qwen3.5-9B
- **Modality:** Multimodal (Text, Image, Video)
- **Languages:** 201 languages and dialects (multilingual)
- **License:** [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Frugal Rating
- **Rating:** 🟢 Light
- **Memory footprint:** ~6 GB at Q4_K_M with 8K context
- **Fits on:** [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md), [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md)

## Specs
- **Parameters:** 9B
- **Architecture:** Hybrid Gated DeltaNet + Gated Attention with Vision Encoder (early fusion)
- **Context window:** 262K native (extensible to 1M+ with YaRN)
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native Qwen3 format)

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~6 GB | ~35 | ~0.8s |
| Mac 64 GB | Q6_K | 32K | ~12 GB | ~50 | ~0.5s |
| DGX Spark 128 GB | FP16 | 262K | ~24 GB | ~120 | ~0.2s |

## Good For
- Complex multi-step reasoning and mathematics
- Multimodal document understanding (images, charts, diagrams)
- Long-context analysis and summarisation (262K native)
- Multilingual instruction following (201 languages)
- Agentic tool-calling workflows with structured output

## Not Good For
- Devices with less than 12 GB available memory (even Q4 is tight)
- Deterministic output without tuning sampling parameters (thinking mode is default)
- Hour-scale video analysis without frame sampling configuration

## Limitations
- Thinking mode requires large `max_tokens` (32K–81K), increasing latency
- Training data skews toward English and Chinese; low-resource language quality is unverified
- Community GGUF quants only — no official quantisations from Qwen team
- YaRN context extension is static and may degrade short-text performance
