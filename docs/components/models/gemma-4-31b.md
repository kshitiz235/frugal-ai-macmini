# Model Card: Gemma 4 31B

## Identity
- **Model ID:** google/gemma-4-31B
- **Base model:** None (original base model)
- **Source:** [Hugging Face](https://huggingface.co/google/gemma-4-31B)
- **Modality:** Multimodal (Text, Image, Video) — no audio support
- **Languages:** 35+ languages out-of-box, pre-trained on 140+ *(source: [HF model card](https://huggingface.co/google/gemma-4-31B))*
- **License:** [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Frugal Rating
- **Rating:** 🟡 Moderate
- **Memory footprint:** ~20 GB at Q4_K_M with 8K context *(source: [Ollama registry](https://ollama.com/library/gemma4))*
- **Fits on:** [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md). Does not fit comfortably on [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md).

## Specs
- **Parameters:** 30.7B (dense) *(source: [HF model card](https://huggingface.co/google/gemma-4-31B))*
- **Architecture:** Dense Transformer with hybrid attention (local sliding window 1024 + global), 60 layers, 262K vocabulary, ~550M vision encoder *(source: [HF model card](https://huggingface.co/google/gemma-4-31B))*
- **Context window:** 256K *(source: [HF model card](https://huggingface.co/google/gemma-4-31B))*
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native) — structured function calling for agentic workflows *(source: [HF model card](https://huggingface.co/google/gemma-4-31B))*
- **Thinking mode:** Optional — trigger with `<|think|>` token in system prompt (disabled by default)

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~20 GB | ~8–12 *(estimated, swap likely)* | ~3s *(estimated)* |
| Mac 64 GB | Q4_K_M | 32K | ~24 GB | ~20–28 *(estimated)* | ~1.2s *(estimated)* |
| Mac 64 GB | Q6_K | 32K | ~30 GB *(estimated)* | ~18–25 *(estimated)* | ~1.5s *(estimated)* |
| DGX Spark 128 GB | FP16 | 256K | ~62 GB *(estimated)* | ~60–80 *(estimated)* | ~0.5s *(estimated)* |

**Note:** This is the flagship dense model in the Gemma 4 family. On Mac Mini 24 GB it will swap to disk and produce very slow output — use the 26B MoE or E4B variants instead. Ollama tag: `gemma4:31b` (20 GB).

## Good For
- Highest-quality reasoning in the Gemma 4 family — MMLU Pro 85.2%, AIME 2026 89.2% *(source: [HF model card](https://huggingface.co/google/gemma-4-31B))*
- Competitive programming and advanced code generation (LiveCodeBench 80%, Codeforces ELO 2150)
- Complex multimodal reasoning over images, charts, and documents (MMMU Pro 76.9%, MATH-Vision 85.6%)
- Long-context analysis up to 256K tokens for legal, research, and technical documents
- Production-grade agentic workflows on Mac 64 GB or DGX Spark

## Not Good For
- Mac Mini 24 GB — model exceeds available memory, swapping degrades performance to <5 tok/s
- Audio transcription or speech tasks (audio encoder not included in 26B/31B variants)
- Low-latency interactive chat on consumer hardware (60 dense layers = slower prefill)
- Mobile or edge deployment — use E2B or E4B variants instead

## Limitations
- Dense 30.7B architecture requires ~20 GB minimum at Q4 — no MoE efficiency trick to reduce memory
- No audio support — only E2B and E4B variants include the audio encoder
- Training data cutoff is January 2025
- At full 256K context on DGX Spark, FP16 memory exceeds 60 GB due to KV cache across 60 layers
