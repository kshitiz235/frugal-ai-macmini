# Model Card: Llama-3.1-8B-Instruct

## Identity
- **Model ID:** meta-llama/Llama-3.1-8B-Instruct
- **Base model:** meta-llama/Llama-3.1-8B
- **Source:** https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct
- **Modality:** Text
- **Languages:** English, German, French, Italian, Portuguese, Hindi, Spanish, Thai
- **License:** Llama 3.1 Community License (https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/LICENSE)

## Frugal Rating
- **Rating:** 🟢 Light
- **Memory footprint:** ~5.2 GB at Q4_K_M, 8K context
- **Fits on:** Mac Mini 24 GB, Mac 64 GB, DGX Spark

## Specs
- **Parameters:** 8B
- **Architecture:** Dense Transformer with Grouped-Query Attention (GQA)
- **Context window:** 128K
- **Recommended quant:** Q4_K_M (Mac Mini), Q6_K (Mac 64 GB)
- **Tool calling:** Yes (native)

## Inference Performance
| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ~5.2 GB | ~32 | ~0.9s |
| Mac 64 GB | Q6_K | 32K | ~7.8 GB | ~48 | ~0.6s |
| DGX Spark 128 GB | FP16 | 128K | ~14 GB | ~85 | ~0.3s |

## Good For
- General conversation and assistant applications
- Complex reasoning and problem-solving tasks
- Code generation and programming assistance
- Multilingual chat applications (8 supported languages)
- Tool calling and API integration workflows
- Content creation and copywriting
- Research and information retrieval

## Not Good For
- Highly specialized domain expertise (medical, legal, financial)
- Processing documents with extreme length (>100K tokens)
- Real-time systems requiring sub-500ms latency
- Batch processing of thousands of concurrent requests
- Creative generation requiring very long-form output

## Limitations
- Knowledge cutoff is December 2023
- Limited to 8 officially supported languages for optimal performance
- Requires careful prompt engineering for best tool calling results
- Memory usage scales linearly with context window size
- Commercial use requires compliance with Llama 3.1 Acceptable Use Policy