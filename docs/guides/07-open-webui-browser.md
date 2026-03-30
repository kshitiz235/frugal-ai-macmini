# Guide: Open WebUI Browser Verification

> **Stack:** [dev-ollama-local](../stacks/dev-ollama-local.md)
> **Framework:** [Open WebUI](../components/frameworks/open-webui.md)
> **Time:** 30 minutes

Spin up Open WebUI on your laptop, hook it to the running Ollama model from the stack, and verify end-to-end responses directly in the browser.

## Prerequisites
- Stack complete: [dev-ollama-local](../stacks/dev-ollama-local.md) (Ollama service + `qwen3.5-local` tag ready)
- Docker Desktop or Docker Engine + Compose v2
- 2+ CPU cores and ~2 GB free RAM for Open WebUI[^openwebui-quickstart]

## Steps

### 1. Confirm Ollama is serving the model
```bash
ollama ps
curl -s http://localhost:11434/api/chat -d '{
  "model": "qwen3.5-local",
  "messages": [{"role": "user", "content": "Ping"}],
  "stream": false
}' | jq '.message.content'
```
You should see a short reply, proving the stack is healthy.

### 2. Run Open WebUI via Docker[^openwebui-quickstart]
```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```
Key flags:
- `-v open-webui:/app/backend/data` persists conversations/config
- `--add-host=host.docker.internal:host-gateway` lets the container reach the host Ollama endpoint on macOS/Windows

### 3. Create the admin account and connect Ollama[^openwebui-ollama]
1. Open [http://localhost:3000](http://localhost:3000). The first signup becomes the administrator.
2. Go to **Admin Settings → Connections → Ollama → Manage (wrench icon)**.
3. Set **URL** to `http://host.docker.internal:11434` (use `http://localhost:11434` if you run Docker on Linux where the daemon shares the host network).
4. Click **Save** then **Test**. The UI should report “Connected”.
5. Use the model dropdown in the chat pane to select `qwen3.5-local`. If it is missing, hit the reload icon to refresh the model list.

### 4. Verify end-to-end in the browser
1. In the left sidebar, start a new chat.
2. Ask a question grounded in your documents, e.g., “Summarize what the Frugal AI stack prioritizes.”
3. Observe typing indicators and ensure latency matches expectations (<2 seconds TTFT on Q4 quant with Mac Mini).
4. Check the response history persists after refreshing the page—proof that the volume mount works.

## Verify
| Check | Command / Action | Expected |
|-------|------------------|----------|
| Container healthy | `docker ps --filter name=open-webui` | STATUS `Up` on port 3000 |
| Admin portal loads | Visit `http://localhost:3000` | Signup/login screen |
| Ollama connection | Admin Settings → Connections → **Test** | “Connected” banner |
| Browser chat | Send prompt in Open WebUI | Answer from `qwen3.5-local` in ≤2s TTFT |
| Persistence | Refresh browser | Conversation history intact |

## Troubleshooting
- **“Connection error” when selecting Ollama** — Ensure you used `http://host.docker.internal:11434` inside Docker Desktop; `localhost` resolves to the container itself, not the host runtime.[^openwebui-ollama]
- **Stuck on signup** — The very first user becomes admin. If you created a throwaway account, remove the volume (`docker volume rm open-webui`) and rerun the container to recreate the instance.[^openwebui-quickstart]
- **Models missing from dropdown** — Confirm `ollama list` shows `qwen3.5-local`, then reload the model selector or restart the container after the connection is configured.[^openwebui-ollama]
- **Port 3000 already in use** — Change the published port (`-p 3001:8080`) and update the URL you visit.

[^openwebui-quickstart]: Open WebUI docs — “Quick Start” (Docker install, role model, recommended resources). https://docs.openwebui.com/getting-started/quick-start/
[^openwebui-ollama]: Open WebUI docs — “Connect a Provider: Ollama” (host networking tips, connection management workflow). https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-ollama
