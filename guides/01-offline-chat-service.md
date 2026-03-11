# Guide: Offline Chat Service

> **Stack:** [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md)
> **Framework:** [Open WebUI](../components/frameworks/open-webui.md)
> **Time:** 30 minutes

Build a private, offline ChatGPT-like service on your Mac Mini. No cloud, no API keys, no data leaving your machine.

## Prerequisites
- Stack setup complete: [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md)
- Ollama running and verified (`ollama ps` shows the model)
- Docker installed ([docker.com/get-started](https://www.docker.com/get-started/))

## Steps

### 1. Start Open WebUI
```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

### 2. Create admin account
Open [http://localhost:3000](http://localhost:3000) in your browser.

First visit prompts you to create an admin account. This is local-only — pick any email/password.

### 3. Select model
In the chat interface, click the model dropdown at the top. Select `qwen3.5-dev` (or whatever tag you created in the stack setup).

If no models appear:
- Confirm Ollama is running: `ollama ps`
- Open WebUI auto-detects Ollama at `http://host.docker.internal:11434`

### 4. Test a conversation
Send a few messages to verify:
- Response generates at ~30+ tokens/sec
- Multi-turn conversation works (context carries over)
- No errors in the Docker logs: `docker logs open-webui`

## Verify
| Check | Expected |
|-------|----------|
| Open WebUI loads at localhost:3000 | Yes |
| Model appears in dropdown | `qwen3.5-dev` visible |
| Response generates | ~30–40 tok/s |
| Multi-turn works | Context carries over |
| Memory (model + app) | ~7–8 GB total |

## Optional: enable document upload
Open WebUI supports uploading documents for in-context Q&A (not full RAG — for that, see the Dify guide).

1. Click the `+` icon in the chat input
2. Upload a PDF or text file
3. Ask questions about the document

This uses the model's context window — works best with documents under 8K tokens (the context limit set in the stack).

## Troubleshooting
- **"Could not connect to Ollama"** — Ollama must be running before Open WebUI starts. Run `ollama serve` first, then restart the container: `docker restart open-webui`.
- **Models not showing** — Check Open WebUI settings → Connections. The Ollama URL should be `http://host.docker.internal:11434` (Docker on Mac) or `http://localhost:11434` (native install).
- **Slow responses** — Same as stack troubleshooting: check memory pressure, close other apps.
- **Container won't start** — Check if port 3000 is in use: `lsof -i :3000`. Change the port: `-p 3001:8080`.

## Stop / restart
```bash
# Stop
docker stop open-webui

# Start again
docker start open-webui

# Remove completely (keeps data in volume)
docker rm open-webui

# Remove data too
docker volume rm open-webui
```
