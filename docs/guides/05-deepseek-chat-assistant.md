# Guide: DeepSeek Chat Assistant

> **Stack:** [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md)
> **Framework:** [Dify](../components/frameworks/dify.md)
> **Time:** 60 minutes

Turn your local DeepSeek model into a polished chat assistant. The existing stack gives you Ollama, GPUs, and monitoring; this guide layers on Dify for orchestration plus a lightweight UI served from your machine.

## Prerequisites
- Complete the [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md) stack (installs Ollama and verifies the base runtime)
- Pull a DeepSeek build that fits your hardware, e.g. `ollama pull deepseek-r1:14b`
- Docker Desktop (or Engine + Compose) with ≥2 vCPUs and ≥8 GB assigned to the VM
- Node.js 18+ for the optional local web client

## Steps

### 1. Prepare DeepSeek inside Ollama
1. Pull and cache the quant you want to expose:
   ```bash
   ollama pull deepseek-r1:14b
   ```
2. Create a modelfile so Dify can reference a stable tag:
   ```bash
   cat <<'EOF' > ~/.ollama/modelfiles/Modelfile-deepseek-chat
   FROM deepseek-r1:14b
   PARAMETER num_ctx 12288
   PARAMETER temperature 0.6
   EOF
   ollama create deepseek-chat -f ~/.ollama/modelfiles/Modelfile-deepseek-chat
   ```
3. Sanity-check output speed before wiring anything else:
   ```bash
   ollama run deepseek-chat "Explain how DeepSeek handles long reasoning chains."
   ```

### 2. Deploy Dify with Docker Compose[^1]
1. Clone the release that matches the current tag and start the stack:
   ```bash
   git clone --branch "$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | jq -r .tag_name)" https://github.com/langgenius/dify.git
   cd dify/docker
   cp .env.example .env
   docker compose up -d
   docker compose ps
   ```
2. Visit `http://localhost/install` to set the admin account, then sign in at `http://localhost`.

### 3. Connect Dify to the local DeepSeek provider[^2]
1. Inside Dify, go to **Settings → Model Providers → Local (Ollama)**.
2. Add a credential with:
   - **Base URL:** `http://host.docker.internal:11434` (Docker on macOS/Windows) or `http://localhost:11434` (Linux)
   - **LLM model:** `deepseek-chat`
   - **Embedding model:** `nomic-embed-text` (pull with `ollama pull nomic-embed-text` if you plan to store long-term memories)
3. Click **Test** then **Save**. The provider now appears as an option anywhere you select models.

### 4. Assemble the DeepSeek chatflow[^3]
1. Open **Studio → Create Application → Chatflow**.
2. Canvas layout:
   - **User Input node:** add optional fields for “Department” or “Tone” if you want metadata captured.
   - **LLM node:** select `deepseek-chat`, set temperature `0.4`, and add a system instruction like:
     > You are DeepSeek, a concise institutional assistant. Ground every answer in provided context or say you don’t know. Prefer structured lists.
   - **Answer node:** enable markdown + citations (optional if you later add a knowledge base).
3. Use **Debug & Preview** to confirm multi-turn memory is working and adjust max tokens (start with 2048 to stay under the quantized context window).

### 5. Publish the chat app & capture the API key[^4]
1. Click **Publish → Chat Web App** so teammates can reach the hosted UI with full conversation memory.
2. In **Publish → API**, copy the generated key—this fuels the custom UI below.
3. Test the endpoint quickly:
   ```bash
   curl https://localhost/v1/chat-messages \
     -H "Authorization: Bearer <DIFY_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"query":"Summarize DeepSeek's strengths","response_mode":"blocking"}'
   ```

### 6. Launch the standalone DeepSeek UI (optional but recommended)
1. Copy the prepared artifacts into place:
   ```bash
   rsync -av artifacts/05-deepseek-chat-assistant/ ~/deepseek-chat-assistant/
   cd ~/deepseek-chat-assistant
   cp config/.env.example config/.env
   ```
2. Edit `config/.env` with your Dify key and endpoint URL.
3. Install dependencies and start the Express server that serves the static UI and proxies API traffic:
   ```bash
   npm install
   npm start
   ```
4. Open [http://localhost:4173](http://localhost:4173). Every message now flows to Dify without exposing the key in the browser because `/api/chat` is proxied via `scripts/server.js`.
5. To customize the look or copy, edit:
   - `artifacts/05-deepseek-chat-assistant/app/index.html`
   - `artifacts/05-deepseek-chat-assistant/app/styles.css`
   - `artifacts/05-deepseek-chat-assistant/app/main.js`

## Verify
| Check | Command / Action | Expected |
|-------|------------------|----------|
| Dify containers healthy | `docker compose ps` (inside `dify/docker`) | All services `Up`/`healthy` |
| DeepSeek reachable | `curl http://localhost:11434/api/show -d '{"name":"deepseek-chat"}'` | JSON with model parameters |
| Chatflow output | Dify **Debug & Preview** | Responses reference DeepSeek persona |
| API call | `curl` request above | HTTP 200 with JSON answer |
| Custom UI | Visit `http://localhost:4173` | User + DeepSeek bubbles render, requests succeed |

## Troubleshooting
- **Docker containers flapping** — Run `docker compose logs api` for detailed errors; ensure Docker Desktop exposes ≥8 GB RAM before restarting the stack.[^1]
- **Dify cannot hit Ollama** — Verify the URL is `http://host.docker.internal:11434` for Docker Desktop. Use `curl` from inside the `api` container (`docker compose exec api curl http://host.docker.internal:11434/api/tags`).[^2]
- **DeepSeek fails with “context window exceeded”** — Lower `num_ctx` in your modelfile or trim prompts; huge system prompts plus multi-turn chats can overflow quantized models.
- **API returns 401** — Recopy the API key after publishing; keys are per-application and rotating them revokes the old value.[^4]
- **Custom UI shows 502 / error bubble** — Confirm `config/.env` has the correct Dify URL and restart `npm start`. Inspect terminal logs for upstream errors.

[^1]: Dify Docs — Deploy Dify with Docker Compose (hardware prerequisites, clone workflow, admin bootstrap).
[^2]: Dify Docs — Model Providers (configuring custom/local providers such as Ollama and adding credentials).
[^3]: Dify Docs — 30-Minute Quick Start (chatflow creation workflow, node configuration, testing).
[^4]: Dify Docs — Chat Web Apps (publishing chatflows, managing hosted UI/API access).
