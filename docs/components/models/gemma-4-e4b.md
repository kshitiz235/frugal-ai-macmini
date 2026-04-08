# Model Card: Gemma 4 E4B

## Identity
- **Model ID:** google/gemma-4-E4B
- **Base model:** None (original base model)
- **Source:** [Hugging Face](https://huggingface.co/google/gemma-4-E4B)
- **Modality:** Multimodal (Text, Image, Audio, Video)
- **Languages:** 35+ languages out-of-box, pre-trained on 140+ *(source: [HF model card](https://huggingface.co/google/gemma-4-E4B))*
- **License:** [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Frugal Rating
- **Rating:** 🟢 Light
- **Memory footprint:** ~10 GB at Q4_K_M with 8K context *(source: [Ollama registry](https://ollama.com/library/gemma4:e4b) — 9.6 GB download)*
- **Fits on:** [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md), [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md)

## Specs
- **Parameters:** 8B total (4.5B effective via Per-Layer Embeddings) *(source: [HF model card](https://huggingface.co/google/gemma-4-E4B))*
- **Architecture:** Dense Transformer with hybrid attention (local sliding window 512 + global) and Proportional RoPE (p-RoPE), 42 layers, 262K vocabulary *(source: [HF model card](https://huggingface.co/google/gemma-4-E4B))*
- **Context window:** 128K *(source: [HF model card](https://huggingface.co/google/gemma-4-E4B))*
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native) — supports structured function calling for agentic workflows *(source: [HF model card](https://huggingface.co/google/gemma-4-E4B))*
- **Thinking mode:** Optional — trigger with `<|think|>` token in system prompt (disabled by default) *(source: [HF model card](https://huggingface.co/google/gemma-4-E4B))*

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~10 GB | ~18–25 *(estimated)* | ~1.0s *(estimated)* |
| Mac 64 GB | Q6_K | 32K | ~14 GB *(estimated)* | ~30–40 *(estimated)* | ~0.6s *(estimated)* |
| DGX Spark 128 GB | FP16 | 128K | ~16 GB *(estimated)* | ~100+ *(estimated)* | ~0.3s *(estimated)* |

**Note:** Ollama tag `gemma4:e4b` is 9.6 GB (Q4_K_M, includes 262K vocabulary embedding table and PLE). Only 4.5B parameters are active per token, but all 8B must remain in memory. Community benchmarks measured ~18–24 tok/s on Mac Mini M4 *(source: [Medium benchmark](https://medium.com/@rviragh/can-googles-gemma4-e4b-10-gb-benchmark-itself-06b79218a071), [Lothar Schulz benchmarks](https://www.lotharschulz.info/2026/04/04/gemma-4-performance-showdown-linux-vs-mac-benchmarks/))*.

## Good For
- On-device multimodal understanding (text + image + audio in a single model)
- Audio transcription and translation (up to 30s clips) — only E2B and E4B include the audio encoder *(source: [Google AI model card](https://ai.google.dev/gemma/docs/core/model_card_4))*
- Document and PDF parsing with configurable image token budgets (70–1120 tokens per image)
- Lightweight agentic tool-calling on memory-constrained devices
- Multilingual chat and instruction following (35+ languages)

## Not Good For
- Long audio processing beyond 30 seconds (hard limit on audio encoder)
- Extended video analysis beyond 60 seconds / 60 frames (1 fps cap)
- Tasks requiring large context beyond 128K tokens (no YaRN or context extension)
- High-throughput batch inference where larger models (31B, 26B MoE) would justify the extra memory

## Limitations
- Per-Layer Embeddings (PLE) inflate the download size to 8B despite only 4.5B effective parameters — disk footprint is larger than the active compute suggests
- Audio encoder adds ~300M parameters of overhead even when audio is unused
- Training data cutoff is January 2025; knowledge of events after that date is absent
- 128K context is the hard ceiling — no dynamic extension like YaRN
