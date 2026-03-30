# Guide: Local LLM UI Setup

> **Stack:** [dev-ollama-local](../stacks/dev-ollama-local.md)
> **Framework:** [Open WebUI](../components/frameworks/open-webui.md)
> **Time:** 45 minutes

Ship a polished ChatGPT-style UI on top of your local Ollama stack. This guide deploys Open WebUI with Docker Compose, connects it to the running Qwen3.5 model, and hardens the instance for team access.

## Prerequisites
- Stack setup complete: [dev-ollama-local](../stacks/dev-ollama-local.md)
- Docker Desktop (or Engine + Compose v2) with ≥2 vCPUs and 4–6 GB RAM[^openwebui-quickstart]
- An Ollama model tag ready (e.g., `qwen3.5-local` from the stack doc)

## Steps

### 1. Confirm the stack is healthy
```bash
ollama ps
curl -s http://localhost:11434/api/show -d '{"name":"qwen3.5-local"}' | jq '.parameters.num_ctx'
```
You should see the custom tag loaded with `num_ctx` at 8192. Fix stack issues before introducing a UI.

### 2. Deploy Open WebUI via Compose[^openwebui-quickstart]
1. Copy the curated Compose bundle:
   ```bash
   rsync -av artifacts/06-local-llm-ui-setup/ ~/local-llm-ui/
   cd ~/local-llm-ui
   cp config/openwebui.env config/openwebui.local.env
   ```
2. Edit `config/openwebui.local.env` with your preferred admin email/name and, if needed, change `OLLAMA_BASE_URL` (use `http://localhost:11434` on Linux, `http://host.docker.internal:11434` on macOS/Windows).[ ^openwebui-ollama]
3. Launch the container:
   ```bash
   docker compose -f app/docker-compose.yml --env-file config/openwebui.local.env up -d
   docker compose -f app/docker-compose.yml ps
   ```
   The service should listen on `http://localhost:3000` with data persisted in the `openwebui-data` volume.

### 3. Create the admin account and connect Ollama[^openwebui-ollama]
1. Visit `http://localhost:3000` and register the first user — this account becomes the administrator per Open WebUI’s role model.
2. Navigate to **Admin Settings → Connections → Ollama** and click the wrench icon. Set:
   - **URL:** `http://host.docker.internal:11434`
   - **Prefix ID:** leave blank unless you run multiple Ollama nodes
   - **Model filter:** optional whitelist (e.g., `qwen3.5-local`)
3. Save, then open the model selector. Trigger a test prompt; Open WebUI will pull missing tags automatically if they exist in Ollama.

### 4. Harden the workspace[^openwebui-quickstart]
1. Open **Admin Settings → Workspace** and rename the instance for clarity.
2. In **User Management**, require approval for new sign-ups (default). Invite teammates by sending them the URL; approve them from the pending list.
3. Decide between multi-user mode (default) or single-user mode. To disable auth entirely, set `WEBUI_AUTH=False` in `config/openwebui.local.env` before restarting — but you cannot toggle back without recreating the volume.
4. (Optional) Enable GPU usage by editing `app/docker-compose.yml` and adding `--gpus all` or switching the image tag to `ghcr.io/open-webui/open-webui:cuda` if you want to leverage NVIDIA acceleration.

### 5. Validate with the health script
1. Make the helper executable:
   ```bash
   chmod +x scripts/openwebui-healthcheck.sh
   ./scripts/openwebui-healthcheck.sh http://localhost:3000
   ```
2. The script checks `/health` and attempts a login request (expected to warn until you update the default credentials). Wire it into `cron` or your monitoring stack for ongoing checks.

## Verify
| Check | Command / Action | Expected |
|-------|------------------|----------|
| Containers running | `docker compose -f app/docker-compose.yml ps` | `openwebui` `Up` on port 3000 |
| Ollama reachable inside container | **Admin Settings → Connections → Test** | “Connected” banner |
| Chat completion | Send prompt via Open WebUI | Response from `qwen3.5-local` in <2s TTFT |
| Health script | `./scripts/openwebui-healthcheck.sh` | Outputs “Open WebUI appears healthy.” |

## Troubleshooting
- **Open WebUI container restarts** — Check `docker compose logs` for permission errors. Ensure the project folder resides on a filesystem Docker can mount (on macOS, stay within `$HOME`).
- **Connection timeout to Ollama** — Use `http://host.docker.internal:11434` when Ollama runs on the host OS; inside containers `localhost` resolves internally.[^openwebui-ollama]
- **First user not admin** — Delete the `openwebui-data` volume (`docker volume rm local-llm-ui_openwebui-data`) and redeploy; the initial sign-up always receives administrator privileges.[^openwebui-quickstart]
- **Model missing from dropdown** — Confirm the tag exists via `ollama list` and refresh the Open WebUI model list by clicking the reload icon next to “Models”.

[^openwebui-quickstart]: Open WebUI Docs — “Quick Start” (Docker requirements, first-user role behavior, deployment flags). https://docs.openwebui.com/getting-started/quick-start
[^openwebui-ollama]: Open WebUI Docs — “Connect a Provider: Ollama” (connection tips, host networking, admin UI workflow). https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-ollama
