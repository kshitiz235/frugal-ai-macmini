# Model Card: Gemma 4 26B A4B

## Identity
- **Model ID:** google/gemma-4-26B-A4B
- **Base model:** None (original base model)
- **Source:** [Hugging Face](https://huggingface.co/google/gemma-4-26B-A4B)
- **Modality:** Multimodal (Text, Image, Video) — no audio support
- **Languages:** 35+ languages out-of-box, pre-trained on 140+ *(source: [HF model card](https://huggingface.co/google/gemma-4-26B-A4B))*
- **License:** [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Frugal Rating
- **Rating:** 🟡 Moderate
- **Memory footprint:** ~18 GB at Q4_K_M with 8K context *(source: [Ollama registry](https://ollama.com/library/gemma4))*
- **Fits on:** [Mac 64 GB](../hardware/apple-mac-64gb.md), [DGX Spark](../hardware/nvidia-dgx-spark.md). Tight on [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md) — leaves only ~6 GB for OS and apps.

## Specs
- **Parameters:** 25.2B total, 3.8B active per token (MoE: 8 of 128 experts + 1 shared expert) *(source: [HF model card](https://huggingface.co/google/gemma-4-26B-A4B))*
- **Architecture:** Mixture-of-Experts Transformer with hybrid attention (local sliding window 1024 + global), 30 layers, 262K vocabulary, ~550M vision encoder *(source: [HF model card](https://huggingface.co/google/gemma-4-26B-A4B))*
- **Context window:** 256K *(source: [HF model card](https://huggingface.co/google/gemma-4-26B-A4B))*
- **Recommended quant:** Q4_K_M
- **Tool calling:** Yes (native) — structured function calling for agentic workflows *(source: [HF model card](https://huggingface.co/google/gemma-4-26B-A4B))*
- **Thinking mode:** Optional — trigger with `<|think|>` token in system prompt (disabled by default)

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~18 GB | ~20–30 *(estimated)* | ~1.5s *(estimated)* |
| Mac 64 GB | Q6_K | 32K | ~28 GB *(estimated)* | ~30–40 *(estimated)* | ~0.8s *(estimated)* |
| DGX Spark 128 GB | FP16 | 256K | ~50 GB *(estimated)* | ~80–100 *(estimated)* | ~0.4s *(estimated)* |

**Note:** Despite 25.2B total parameters, only 3.8B are active per token — inference speed is closer to a 4B model. All 25.2B parameters must remain in memory for expert routing. Ollama tag: `gemma4:26b` (18 GB).

## Good For
- High-quality reasoning at near-4B inference cost — MMLU Pro 82.6%, AIME 2026 88.3% *(source: [HF model card](https://huggingface.co/google/gemma-4-26B-A4B))*
- Code generation and competitive programming (LiveCodeBench 77.1%, Codeforces ELO 1718)
- Long-context document analysis up to 256K tokens
- Agentic tool-calling workflows requiring strong reasoning with moderate memory
- Multimodal image understanding with variable-resolution support (70–1120 tokens per image)

## Not Good For
- Mac Mini 24 GB as primary device — leaves very little headroom for OS, browser, and frameworks
- Audio transcription or speech tasks (audio encoder not included in 26B/31B variants)
- Latency-sensitive applications on devices with less than 32 GB — expert routing adds overhead despite fewer active params
- Offline deployment where disk space is constrained (18 GB download for Q4_K_M)

## Limitations
- All 25.2B parameters must be loaded into memory even though only 3.8B are active — MoE does not reduce memory, only compute
- No audio support — only E2B and E4B variants include the audio encoder
- Training data cutoff is January 2025
- Expert routing overhead means latency can spike unpredictably on memory-constrained devices where swapping occurs
