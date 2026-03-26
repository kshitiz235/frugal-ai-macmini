# Guide: Document Q&A with Dify RAG

> **Stack:** [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)
> **Framework:** [Dify](../components/frameworks/dify.md)
> **Time:** 60 minutes

Build a private document question-answering system that runs entirely on your Mac, pairing the existing Ollama stack with Dify’s built-in knowledge base and retrieval workflow.

## Prerequisites
- Stack setup complete: [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)
- Docker Desktop (or Docker Engine + Compose plugin) with ≥2 vCPUs and 8 GB assigned to the VM[^1]
- Models pulled locally: `qwen3.5-dev` for chat, `nomic-embed-text` (or another embedding) for retrieval
- A folder of reference documents (PDF, DOCX, or Markdown under 15 MB each)

## Steps

### 1. Deploy Dify services
1. Clone the latest Dify release and start the Docker stack:
   ```bash
   git clone --branch "$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | jq -r .tag_name)" https://github.com/langgenius/dify.git
   cd dify/docker
   cp .env.example .env
   docker compose up -d
   docker compose ps
   ```
   All containers (`api`, `web`, `worker`, `redis`, `postgres`, `weaviate`, etc.) should report `Up` or `healthy` status.[^1]
2. Leave the stack running; it exposes HTTP on ports 80/443 via the bundled Nginx proxy.

### 2. Initialize the workspace and connect Ollama
1. Visit `http://localhost/install` to create the Dify admin account, then sign in at `http://localhost`.[^1]
2. In the workspace, open **Settings → Model Providers → Local (Ollama)**.
3. Add a credential that points to your Ollama endpoint:
   - **Base URL:** `http://host.docker.internal:11434` (Docker on macOS) or `http://localhost:11434`
   - **LLM model:** `qwen3.5-dev`
   - **Embedding model:** `nomic-embed-text`
   - Click **Test** and then **Save**. Local providers simply need the Ollama URL and pulled models.[^2]
4. (Optional) Add rerank credentials (e.g., Cohere) if you plan to use rerankers later; otherwise stay with semantic/keyword weighting.

### 3. Build the knowledge base
1. Navigate to **Knowledge → Create Knowledge**.
2. Choose **Import from file**, upload up to five documents (<15 MB each), and wait for indexing to finish.[^3]
3. Set **Indexing Mode** to **High Quality**, chunk size 500 tokens, overlap 75. Select `nomic-embed-text` as the embedding model so retrieval stays local.
4. Tag documents (e.g., `policy`, `procedures`) to enable metadata filters later.
5. Use the **Retrieval Testing** icon to issue sample questions and confirm the right chunks are returned before wiring the app.[^5]

### 4. Wire the RAG chatflow
1. Go to **Studio → Create Application → Chatflow**.
2. In the canvas, drag these nodes and connect them sequentially:
   - **User Input** (captures the question)
   - **Knowledge Retrieval** (select the knowledge base you just built, enable metadata filtering if you tagged docs)
   - **LLM** (select `qwen3.5-dev`, temperature 0.2–0.3 for factual answers)
   - **Answer** (outputs text + citations)
3. Open the **Context** panel → **Add knowledge**, select your dataset, then set **Retrieval Mode** to **Weighted Score** with Semantic weight `0.7` / Keyword weight `0.3` for balanced recall.[^4]
4. Enable **Citation & Attribution** so Dify returns chunk references with every answer.[^4]
5. Click **Debug & Preview**, ask a few document questions, and check that citations point to the right files. Adjust TopK or the weight sliders if responses miss context.[^4]

### 5. Publish and expose the Q&A endpoint
1. When satisfied, click **Publish** → **Chat Web App** so teammates can use the hosted UI.[^4]
2. Copy the **API Key** from **Publish → API** and store it in your password manager.
3. Test the API endpoint locally:
   ```bash
   curl https://localhost/v1/chat-messages \
     -H "Authorization: Bearer <DIFY_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{
       "inputs": {},
       "query": "What does the disaster recovery plan say about RPO?",
       "response_mode": "streaming"
     }'
   ```
   You should receive a streamed JSON response referencing the uploaded documents.

## Verify
| Check | Command / Action | Expected |
|-------|------------------|----------|
| Containers healthy | `docker compose ps` | All Dify services `Up`/`healthy` |
| Admin portal loads | Visit `http://localhost` | Login screen appears |
| Knowledge retrieval | In **Knowledge → Retrieval Testing** ask a doc question | Relevant chunks + citations returned[^5] |
| Chatflow output | Use **Debug & Preview** | Answer cites uploaded files |
| API test | `curl` request above | HTTP 200 + streamed JSON |

## Troubleshooting
- **Container stuck in `Restarting`:** Run `docker compose logs <service>` to find port or resource conflicts; ensure at least 8 GB is assigned to Docker.[^1]
- **Dify cannot reach Ollama:** Confirm `qwen3.5-dev` runs via `curl http://localhost:11434/api/tags`; if Dify runs in Docker, use `http://host.docker.internal:11434` instead of `localhost` inside the container network.[^2]
- **Documents never finish indexing:** Large or unsupported files exceed limits—check the job in **Knowledge → Documents**, then reduce file size or raise `UPLOAD_FILE_SIZE_LIMIT` / `UPLOAD_FILE_BATCH_LIMIT` in `.env` before restarting.[^3]
- **Answers ignore new docs:** Open **Retrieval Testing**, ensure the document status is `Completed`, and increase `TopK` or semantic weight under **Context → Retrieval Settings**.[^4][^5]

[^1]: Dify Docs — Deploy Dify with Docker Compose (hardware/software requirements, clone + compose workflow, admin init URL).
[^2]: Dify Docs — Model Providers (local Ollama provider requirements and credential flow).
[^3]: Dify Docs — Upload Local Files (file limits, batch uploads, environment overrides).
[^4]: Dify Docs — Integrate Knowledge within Apps (linking datasets, retrieval settings, citations, publish flow).
[^5]: Dify Docs — Test Knowledge Retrieval (testing interface and behavior).
