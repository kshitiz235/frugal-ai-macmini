# Model Card: Gemma 4 E2B

## Identity
- **Model ID:** google/gemma-4-E2B
- **Base model:** None (original base model)
- **Source:** [Hugging Face](https://huggingface.co/google/gemma-4-E2B)
- **Modality:** Multimodal (Text, Image, Audio, Video)
- **Languages:** 35+ languages out-of-box, pre-trained on 140+ *(source: [HF model card](https://huggingface.co/google/gemma-4-E2B))*
- **License:** [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Frugal Rating
- **Rating:** 🟢 Light
- **Memory footprint:** ~7-8 GB at Q4_K_M with 8K context *(source: [Ollama registry](https://ollama.com/library/gemma4:e2b) — 7.2 GB download)*
- **Fits on:** [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md), [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md)

## Specs
- **Parameters:** 5.1B total (2.3B effective via Per-Layer Embeddings) *(source: [HF model card](https://huggingface.co/google/gemma-4-E2B))*
- **Architecture:** Dense Transformer with hybrid attention (local sliding window 512 + global) and Proportional RoPE (p-RoPE), 35 layers, 262K vocabulary *(source: [HF model card](https://huggingface.co/google/gemma-4-E2B))*
- **Context window:** 128K *(source: [HF model card](https://huggingface.co/google/gemma-4-E2B))*
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native) — structured function calling for agentic workflows *(source: [HF model card](https://huggingface.co/google/gemma-4-E2B))*
- **Thinking mode:** Optional — trigger with `<|think|>` token in system prompt (disabled by default)

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~7-8 GB | ~30–45 *(estimated)* | ~0.6s *(estimated)* |
| Mac 64 GB | Q6_K | 32K | ~10 GB *(estimated)* | ~45–60 *(estimated)* | ~0.4s *(estimated)* |
| DGX Spark 128 GB | FP16 | 128K | ~10 GB *(estimated)* | ~150+ *(estimated)* | ~0.2s *(estimated)* |

**Note:** Ollama tag `gemma4:e2b` is 7.2 GB (Q4_K_M, includes 262K vocabulary embedding table and PLE). Only 2.3B parameters are active per token, but all 5.1B must remain in memory *(source: [Ollama registry](https://ollama.com/library/gemma4:e2b), [Google AI model card](https://ai.google.dev/gemma/docs/core/model_card_4))*.

## Good For
- Ultra-lightweight on-device deployment (phones, Raspberry Pi, laptops) *(source: [MindStudio](https://www.mindstudio.ai/blog/gemma-4-edge-deployment-e2b-e4b-models))*
- Audio transcription and speech translation (up to 30s clips) — shared with E4B only
- Quick image captioning and classification with low token budgets (70–140 tokens per image)
- Multilingual chat on memory-constrained devices (35+ languages)
- Prototyping agentic tool-calling workflows before scaling to larger models

## Not Good For
- Complex multi-step reasoning (MMLU Pro 60% vs 85% on 31B) *(source: [HF model card](https://huggingface.co/google/gemma-4-E2B))*
- Long-form code generation or competitive programming (LiveCodeBench 44%)
- Fine-grained document OCR requiring high image resolution (larger models handle this better)
- Tasks requiring extended audio beyond 30 seconds or video beyond 60 seconds

## Limitations
- Smallest model in the family — reasoning and coding quality drops significantly compared to 26B/31B variants
- Per-Layer Embeddings inflate disk size to 5.1B despite only 2.3B effective parameters
- Audio encoder adds ~300M parameters of overhead even when audio is unused
- Training data cutoff is January 2025
