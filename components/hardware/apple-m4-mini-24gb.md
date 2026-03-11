# Apple Mac Mini M4 (24 GB)

## Specs
- **Memory:** 24 GB unified (shared between CPU and GPU)
- **Memory type:** Unified
- **Compute:** Apple M4 (10-core GPU, 16-core Neural Engine)
- **Storage:** 512 GB SSD (minimum config)
- **OS:** macOS 15 (Sequoia)+

## Memory Budget
| Use | Allocation |
|-----|-----------|
| OS + system | ~6 GB |
| Runtime + app overhead | ~2 GB |
| **Available for model** | **~16 GB** |

## What fits
| Model size | Quant | Context | Fits? |
|-----------|-------|---------|-------|
| 7–9B | Q4_K_M | 8K | 🟢 ~6 GB |
| 7–9B | Q4_K_M | 32K | 🟢 ~8 GB |
| 7–9B | Q6_K | 32K | 🟢 ~11 GB |
| 7–9B | Q4_K_M | 128K | 🟡 ~15 GB tight |
| 14B | Q4_K_M | 8K | 🟢 ~10 GB |
| 14B | Q4_K_M | 32K | 🟡 ~13 GB |
| 70B+ | any | any | 🔴 won't fit |

## Compatible runtimes
| Runtime | Status | Notes |
|---------|--------|-------|
| [Ollama](../runtimes/ollama.md) | Tested | Metal acceleration, native macOS, recommended |
| [LM Studio](../runtimes/lm-studio.md) | Tested | GUI, Metal acceleration |
| vLLM | Not recommended | Requires CUDA; no native macOS support |

## Setup notes
- Unified memory means the model competes with macOS and apps for the same 24 GB. Monitor with `Activity Monitor → Memory` or `sudo powermetrics --samplers gpu_power`.
- Close memory-heavy apps (browsers, Docker) when running large models.
- Metal acceleration is automatic via Ollama — no driver install needed.
- For best performance, keep model + KV cache under 16 GB to avoid memory pressure.
