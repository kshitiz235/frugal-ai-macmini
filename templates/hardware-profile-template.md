# [Device Name]

## Specs
- **Memory:** [e.g., 24 GB unified]
- **Memory type:** [Unified / Discrete VRAM]
- **Compute:** [e.g., Apple M4 (10-core GPU) / NVIDIA GB10]
- **Storage:** [e.g., 512 GB SSD]
- **OS:** [e.g., macOS 15+]

## Memory Budget
| Use | Allocation |
|-----|-----------|
| OS + system | [e.g., 6 GB] |
| Runtime + app overhead | [e.g., 2 GB] |
| **Available for model** | [e.g., 16 GB] |

## What fits
| Model size | Quant | Context | Fits? |
|-----------|-------|---------|-------|
| 7–9B | Q4_K_M | 8K | [e.g., 🟢 ~6 GB] |
| 7–9B | Q4_K_M | 32K | [e.g., 🟢 ~8 GB] |
| 7–9B | Q4_K_M | 128K | [e.g., 🟡 ~15 GB tight] |
| 14B | Q4_K_M | 8K | [e.g., 🟡 ~10 GB] |
| 70B+ | Q4_K_M | any | [e.g., 🔴 won't fit] |

## Compatible runtimes
| Runtime | Status | Notes |
|---------|--------|-------|
| [e.g., Ollama] | [Tested/Untested] | [e.g., Metal acceleration, native macOS] |

## Setup notes
[Device-specific OS settings, prerequisites, known quirks]
