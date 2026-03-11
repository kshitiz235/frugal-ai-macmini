# Open WebUI

Self-hosted chat interface for local AI models. Provides a ChatGPT-like experience that runs entirely offline.

## When to use
- Private ChatGPT alternative for individuals or small teams
- First application layer on top of a local inference stack
- Demos and pilot deployments

## Requires
- An Ollama or OpenAI-compatible API endpoint
- Docker (recommended) or Python 3.11+
- 1–2 GB additional memory for the application

## Key features
- Multi-model chat (switch between loaded models)
- Conversation history (local SQLite)
- Document upload for in-context Q&A
- User management (multi-user with auth)
- Responsive web UI

## Compatibility
| Runtime | Status | Notes |
|---------|--------|-------|
| [Ollama](../runtimes/ollama.md) | Tested | Native integration, auto-detects models |
| vLLM | Tested | Via OpenAI-compatible endpoint |
| [LM Studio](../runtimes/lm-studio.md) | Tested | Via local API server |

## Install (quick reference)
```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```
Full setup is in the guide: [01-offline-chat-service.md](../../guides/01-offline-chat-service.md)

## Links
- [open-webui.com](https://openwebui.com)
- [Open WebUI GitHub](https://github.com/open-webui/open-webui)
