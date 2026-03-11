# NVIDIA DGX Spark (128 GB)

## Specs
- **Memory:** 128 GB unified (shared CPU/GPU via Grace Blackwell architecture)
- **Memory type:** Unified (LPDDR5X)
- **Compute:** NVIDIA GB10 Grace Blackwell Superchip
- **Storage:** 4 TB NVMe SSD
- **OS:** Ubuntu 22.04+ (DGX OS)

## Memory Budget
| Use | Allocation |
|-----|-----------|
| OS + system | ~8 GB |
| Runtime + application stack | ~8 GB |
| **Available for model** | **~112 GB** |

## What fits
| Model size | Quant | Context | Fits? |
|-----------|-------|---------|-------|
| 7–9B | FP16 | 262K | 🟢 ~24 GB |
| 14B | FP16 | 128K | 🟢 ~38 GB |
| 32B | FP16 | 32K | 🟢 ~68 GB |
| 70B | Q4_K_M | 32K | 🟢 ~48 GB |
| 70B | FP16 | 32K | 🔴 ~145 GB exceeds budget |
| Multiple 7–9B models | Q4_K_M | 8K | 🟢 3–4 models simultaneously |

## Compatible runtimes
| Runtime | Status | Notes |
|---------|--------|-------|
| [Ollama](../runtimes/ollama.md) | Tested | CUDA acceleration, good for dev and simple serving |
| vLLM | Tested | Production serving, OpenAI-compatible API, recommended |
| SGLang | Tested | Structured generation, function calling |

## Setup notes
- Ships with DGX OS (Ubuntu-based) and NVIDIA container runtime pre-installed.
- Docker with `--gpus=all` is the standard deployment method.
- For production serving, use vLLM or SGLang behind a reverse proxy.
- Supports running multiple models concurrently for multi-agent setups.
- See [NVIDIA DGX Spark documentation](https://docs.nvidia.com/dgx/) for initial device setup.
