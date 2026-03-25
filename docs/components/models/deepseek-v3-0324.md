# Model Card: DeepSeek-V3-0324

## Identity
- **Model ID:** deepseek-ai/DeepSeek-V3-0324
- **Base model:** deepseek-ai/DeepSeek-V3
- **Source:** https://huggingface.co/deepseek-ai/DeepSeek-V3-0324
- **Modality:** Text
- **Languages:** Multilingual (strong in English and Chinese)
- **License:** [MIT](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324/blob/main/LICENSE)

## Frugal Rating
- **Rating:** 🔴 Heavy
- **Memory footprint:** ~352 GB at Q4_K_M with 8K context (685 GB BF16)
- **Fits on:** [NVIDIA DGX Spark](../hardware/nvidia-dgx-spark.md) (128 GB unified, with aggressive quantisation or ktransformers)

## Specs
- **Parameters:** 685B (MoE, 37B active per token)
- **Architecture:** Mixture-of-Experts (MoE) with Multi-Token Prediction (MTP), 256 routed experts, 8 experts per token
- **Context window:** 128K (source: [HF model card](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324))
- **Recommended quant:** IQ2_XXS (~203 GB) or Q2_K_XL (~231 GB)
- **Tool calling:** Yes (native, improved from V3 per [HF README](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324))

## Inference Performance

| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | N/A | — | — | — | — |
| Mac 64 GB | IQ1_S (1.78-bit) | 8K | ~151 GB | ~1.5 | very slow |
| DGX Spark 128 GB | IQ2_XXS (2-bit) | 8K | ~203 GB | ~15 | slow |
| M3 Ultra 512 GB | Q4 (4-bit) | 16K | ~352 GB | ~20 | fast |

> Source: M3 Ultra benchmarks from [Hardware Corner](https://www.hardware-corner.net/studio-m3-ultra-running-deepseek-v3/) and [Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1jq13ik/mac_studio_m3_ultra_512gb_deepseek_v30324_iq2_xxs/). DGX Spark estimated based on unified memory bandwidth.

### Quantisation sizes (source: [Unsloth](https://unsloth.ai/docs/models/tutorials/deepseek-v3-0324-how-to-run-locally))

| Quantisation | Bits | Disk Size | Accuracy |
|--------------|------|-----------|----------|
| BF16 | 16-bit | 715 GB | Full |
| Q4_K_M | ~4-bit | 404 GB | High |
| Q2_K_XL | ~2.7-bit | 231 GB | Good |
| IQ2_XXS | ~2-bit | 203 GB | Fair |
| IQ1_S | ~1.78-bit | 151–173 GB | Ok |

## Good For
- Complex multi-step reasoning and mathematics (AIME 2024: 59.4 per [HF README](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324))
- Long-context analysis with 128K window
- Code generation and front-end web development (improved per [VentureBeat](https://venturebeat.com/ai/deepseek-v3-now-runs-at-20-tokens-per-second-on-mac-studio-and-thats-a-nightmare-for-openai/))
- Bilingual tasks (English/Chinese) with high quality
- Function calling and structured JSON output (improved in 0324 per [HF README](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324))

## Not Good For
- Devices with less than 128 GB unified memory (Mac Mini 24 GB, Mac 64 GB, standard consumer hardware)
- Real-time interactive chat (even on 512 GB M3 Ultra, token generation drops to ~6 tok/s at 16K context)
- Scenarios requiring low latency (TTFT on consumer hardware is 5–10 seconds minimum)
- Memory-constrained environments (MoE architecture requires loading all 685B parameters regardless of quantisation)

## Limitations
- **Hugging Face Transformers not directly supported** — official HF Transformers does not support DeepSeek-V3 architecture directly (per [HF README](https://huggingface.co/deepseek-ai/DeepSeek-V3-0324))
- **Ollama support is community GGUF only** — official Ollama library may not have the model; use community quants from Unsloth or LM Studio
- **Memory wall** — MoE reduces compute but not memory footprint; all 685B params must be in memory for expert routing
- **Context scaling degrades performance** — at 16K tokens, generation speed drops from 21 tok/s to ~6 tok/s on M3 Ultra
- **Not practical for Frugal AI target devices** — requires either expensive Mac Studio M3 Ultra (512 GB, ~$9,499) or DGX Spark with ktransformers optimization

## Frugal Assessment

DeepSeek-V3-0324 is a powerful model but **not suitable for Frugal AI's target devices** (Mac Mini 24 GB, Mac 64 GB, DGX Spark 128 GB) without significant trade-offs:

- **Mac Mini 24 GB:** Cannot run — model requires 150+ GB minimum
- **Mac 64 GB:** Can run IQ1_S at ~1.5 tok/s — unusable for practical purposes
- **DGX Spark 128 GB:** Can run IQ2_XXS at ~15 tok/s — functional but slow; requires ktransformers or similar for optimal performance

For sovereign GenAI on consumer hardware, consider [Qwen3.5-9B](../models/qwen-3.5-9b.md) instead — it fits comfortably on Mac Mini 24 GB and delivers ~35 tok/s.

## Run locally

### Ollama (community quant)
```bash
# Requires community GGUF - check Ollama library for available quants
ollama pull deepseek-v3-0324
```

### llama.cpp (manual)
```bash
# Clone and build llama.cpp with Metal support (macOS) or CUDA (NVIDIA)
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && mkdir build && cd build && cmake .. -DGGML_METAL=ON && make

# Run with Apple Metal (M3 Ultra example)
./llama-cli \
  --model DeepSeek-V3-0324-UD-IQ2_XXS.gguf \
  --n-gpu-layers 62 \
  --ctx-size 16384 \
  -p "Explain Frugal AI in two sentences."
```

### DGX Spark (ktransformers)
```bash
# ktransformers provides 3x decode speedup for DeepSeek MoE models
pip install ktransformers
# See: https://github.com/kvcache-ai/ktransformers
```
