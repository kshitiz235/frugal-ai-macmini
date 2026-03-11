# Dify

Open-source platform for building RAG applications, chatbots, and AI workflows. Visual workflow builder with built-in document ingestion and retrieval.

## When to use
- RAG applications over local documents
- AI workflow automation (multi-step pipelines)
- Team-facing AI tools with user management
- Pilot and production deployments

## Requires
- An Ollama or OpenAI-compatible API endpoint
- Docker Compose
- 4–6 GB additional memory (app + vector DB + Redis)
- Embedding model for RAG (e.g., `nomic-embed-text` via Ollama)

## Key features
- Visual drag-and-drop workflow builder
- Built-in RAG pipeline (document upload, chunking, retrieval)
- Multiple LLM provider support (Ollama, OpenAI-compatible, cloud APIs)
- Knowledge base management with versioning
- API endpoints for integration
- User management and access control

## Compatibility
| Runtime | Status | Notes |
|---------|--------|-------|
| [Ollama](../runtimes/ollama.md) | Tested | Configure as OpenAI-compatible provider |
| vLLM | Tested | Via OpenAI-compatible endpoint |

| Hardware | Status | Notes |
|---------|--------|-------|
| [Mac Mini 24 GB](../hardware/apple-m4-mini-24gb.md) | Possible | Tight — model + Dify stack need ~10 GB combined |
| [Mac 64 GB](../hardware/apple-mac-64gb.md) | Recommended | Comfortable for dev/pilot |
| [DGX Spark](../hardware/nvidia-dgx-spark.md) | Recommended | Production deployments |

## Links
- [dify.ai](https://dify.ai)
- [Dify GitHub](https://github.com/langgenius/dify)
- [Dify docs](https://docs.dify.ai)
