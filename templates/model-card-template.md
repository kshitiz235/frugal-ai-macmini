# Model Card: [Model Name]

## Identity
- **Model ID:** [e.g., Qwen/Qwen3.5-9B]
- **Base model:** [parent model ID, or "None" for base models]
- **Source:** [Hugging Face or official page URL]
- **Modality:** [Text / Multimodal]
- **Languages:** [e.g., en, zh, multilingual (201)]
- **License:** [name + link]

## Frugal Rating
- **Rating:** [🟢 Light / 🟡 Moderate / 🔴 Heavy]
- **Memory footprint:** [e.g., ~6 GB at Q4_K_M, 8K context]
- **Fits on:** [e.g., Mac Mini 24 GB, Mac 64 GB]

## Specs
- **Parameters:** [e.g., 9B]
- **Architecture:** [e.g., Dense Transformer, MoE, Vision Encoder + LLM]
- **Context window:** [e.g., 262K]
- **Recommended quant:** [e.g., Q4_K_M]
- **Tool calling:** [Yes (native) / Yes (via prompt) / No]

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | [e.g., ~6 GB] | [e.g., ~35] | [e.g., ~0.8s] |
| Mac 64 GB | Q6_K | 32K | [e.g., ~12 GB] | [e.g., ~50] | [e.g., ~0.5s] |
| DGX Spark 128 GB | FP16 | 262K | [e.g., ~24 GB] | [e.g., ~120] | [e.g., ~0.2s] |

## Good For
- [Specific use case 1]
- [Specific use case 2]
- [Specific use case 3]

## Not Good For
- [Specific anti-use-case 1]
- [Specific anti-use-case 2]

## Limitations
- [Specific known weakness 1]
- [Specific known weakness 2]
