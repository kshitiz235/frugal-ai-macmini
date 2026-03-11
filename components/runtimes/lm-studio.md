# LM Studio

Desktop GUI for running open-weight models locally. Good for non-CLI users and visual model management.

## When to use
- Desktop users who prefer a GUI over terminal
- Quick model comparison and testing
- Windows and macOS local inference

## When NOT to use
- Headless servers or production deployments
- CI/CD or automated pipelines
- Multi-model concurrent serving

## Key features
- Visual model browser and download manager
- Chat interface built in
- OpenAI-compatible local API server
- GGUF model support with quantization selection
- Metal (macOS) and CUDA (Windows/Linux) acceleration

## Compatibility
| Hardware | Status | Notes |
|---------|--------|-------|
| [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md) | Tested | Metal acceleration |
| [Mac 64 GB](../hardware/apple-mac-64gb.md) | Tested | Metal acceleration |
| [DGX Spark](../hardware/nvidia-dgx-spark.md) | Not recommended | No GUI on headless Ubuntu |

## Install
Download from [lmstudio.ai](https://lmstudio.ai). Drag to Applications (macOS) or run installer (Windows).

## Links
- [lmstudio.ai](https://lmstudio.ai)
