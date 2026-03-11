# Apple Mac (64 GB)

Covers Mac Mini M4 Pro, MacBook Pro M4 Pro/Max, Mac Studio, or any Apple Silicon Mac with 64 GB unified memory.

## Specs
- **Memory:** 64 GB unified (shared between CPU and GPU)
- **Memory type:** Unified
- **Compute:** Apple M4 Pro/Max (varies by config)
- **Storage:** 1 TB SSD (typical config)
- **OS:** macOS 15 (Sequoia)+

## Memory Budget
| Use | Allocation |
|-----|-----------|
| OS + system | ~8 GB |
| Runtime + app + dev tools | ~8 GB |
| **Available for model** | **~48 GB** |

## What fits
| Model size | Quant | Context | Fits? |
|-----------|-------|---------|-------|
| 7–9B | Q6_K | 128K | 🟢 ~18 GB |
| 14B | Q6_K | 32K | 🟢 ~16 GB |
| 14B | Q4_K_M | 128K | 🟢 ~22 GB |
| 32B | Q4_K_M | 32K | 🟢 ~22 GB |
| 70B | Q4_K_M | 8K | 🟡 ~42 GB |
| 70B | Q4_K_M | 32K | 🔴 ~55 GB exceeds budget |

## Compatible runtimes
| Runtime | Status | Notes |
|---------|--------|-------|
| [Ollama](../runtimes/ollama.md) | Tested | Metal acceleration, recommended for dev/pilot |
| [LM Studio](../runtimes/lm-studio.md) | Tested | GUI option |
| vLLM | Not recommended | Requires CUDA |

## Setup notes
- Same unified memory model as M4 Mini — just more headroom.
- Can comfortably run dev tools (IDE, Docker, browser) alongside a 14B model.
- Good for pilot deployments serving a small team (2–5 concurrent users with Ollama).
- Monitor memory pressure: `memory_pressure` command or Activity Monitor.
