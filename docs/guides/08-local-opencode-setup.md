# Guide: Local OpenCode Environment

> **Stack:** [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md)
> **Framework:** [OpenCode](https://opencode.ai/) (open-source terminal AI coding agent)
> **Time:** 20 minutes

Set up OpenCode — an open-source, terminal-based AI coding agent — backed by a local Ollama instance. Your code never leaves your machine: no API keys, no cloud, no vendor lock-in.

## Prerequisites
- Stack setup complete: [dev-ollama-qwen3.5](../stacks/dev-ollama-qwen3.5.md)
- Ollama running and verified (`ollama ps` shows the model)
- Terminal emulator (WezTerm, Alacritty, Ghostty, Kitty, or macOS Terminal)
- Node.js 18+ (for npm install method) or Homebrew

## Steps

### 1. Install OpenCode

Pick one method:

**Homebrew (macOS):**
```bash
brew install anomalyco/tap/opencode
```

**npm:**
```bash
npm install -g opencode-ai
```

**Install script:**
```bash
curl -fsSL https://opencode.ai/install | bash
```

Verify the install:
```bash
opencode --version
```

### 2. Create a coding-tuned Ollama model

OpenCode requires a larger context window than the default 8K dev model. Create a 32K variant for coding tasks *(source: [Ollama OpenCode integration docs](https://docs.ollama.com/integrations/opencode))*:

```bash
cat <<'EOF' > /tmp/Modelfile-qwen3.5-code
FROM qwen3.5:9b
PARAMETER num_ctx 32768
PARAMETER num_predict 8192
EOF

ollama create qwen3.5-code -f /tmp/Modelfile-qwen3.5-code
```

This uses ~8 GB total memory (model weights + KV cache at 32K context). Fits comfortably on a Mac Mini 24 GB.

> **Why 32K?** Coding agents pass file contents, tool results, and conversation history in context. 8K fills up fast. 32K handles most single-file refactors and multi-step tool calls. See the [stack memory scaling table](../stacks/dev-ollama-qwen3.5.md) for higher context costs.

### 3. Configure OpenCode for local Ollama

Create the OpenCode configuration file:

```bash
mkdir -p ~/.config/opencode
```

Write the Ollama provider config:

```bash
cat <<'EOF' > ~/.config/opencode/opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "qwen3.5-code": {
          "name": "Qwen3.5-9B Code (local, 32K)",
          "limit": {
            "context": 32768,
            "output": 8192
          }
        }
      }
    }
  },
  "model": "ollama/qwen3.5-code"
}
EOF
```

This tells OpenCode to route all requests to your local Ollama instance at `localhost:11434` *(source: [OpenCode provider docs](https://opencode.ai/docs/providers/))*.

### 4. Launch OpenCode in a project

Navigate to any code project and start OpenCode:

```bash
cd ~/your-project
opencode
```

On first run, OpenCode will detect the local Ollama provider. If prompted to connect, select the Ollama provider you configured.

### 5. Initialise the project context

Inside the OpenCode TUI, run:

```
/init
```

This analyses your project structure and generates an `AGENTS.md` file — similar to `CLAUDE.md` — that gives the model context about your codebase.

### 6. Select the local model

Run the model selector:

```
/models
```

Select `Qwen3.5-9B Code (local, 32K)` from the list. OpenCode will route all subsequent requests through your local Ollama backend.

### 7. Test with a coding task

Ask OpenCode to perform a real task to verify the full loop (inference + tool calling):

```
Read the README and summarise this project in three bullet points.
```

OpenCode should:
1. Use the file-read tool to open your README
2. Stream the response from Qwen3.5-9B via Ollama
3. Display the summary in the terminal

## Verify

| Check | Expected |
|-------|----------|
| `opencode --version` | Version prints without error |
| Ollama model loaded | `ollama ps` shows `qwen3.5-code` running |
| OpenCode connects to Ollama | No connection errors on launch |
| `/models` shows local model | `Qwen3.5-9B Code (local, 32K)` listed |
| File read tool works | OpenCode reads project files on request |
| Response generates | Tokens stream in terminal at ~25–35 tok/s |
| Memory usage (model + OpenCode) | ~8–9 GB total |

## Troubleshooting

- **"Connection refused" or "Could not connect"** — Ollama must be running before OpenCode. Start it with `ollama serve` or check the menu bar app is active. Verify with `curl http://localhost:11434/api/tags`.
- **Tool calls fail or model ignores tools** — Context window is too small. Ensure you created the `qwen3.5-code` model with `num_ctx 32768`, not the default `qwen3.5-dev` (8K). Run `ollama show qwen3.5-code` to confirm parameters.
- **Slow responses (<10 tok/s)** — 32K context uses more memory than 8K. Check `Activity Monitor → Memory Pressure`. If yellow/red, close browsers or Docker containers. Drop to `num_ctx 16384` if needed.
- **Model not appearing in `/models`** — Check `~/.config/opencode/opencode.json` is valid JSON. The model key (`qwen3.5-code`) must exactly match the Ollama model name from `ollama list`.
- **"opencode: command not found"** — Restart your terminal after install, or verify the binary is on your PATH: `which opencode`.
- **OpenCode hangs on launch** — On macOS, ensure your terminal emulator supports the TUI. If using basic Terminal.app, try WezTerm or Alacritty for better compatibility.

## Mac 64 GB variant

For heavier coding workloads (large repos, longer context), use the Q6_K quant with 64K context:

```bash
cat <<'EOF' > /tmp/Modelfile-qwen3.5-code-pilot
FROM qwen3.5:9b-q6_K
PARAMETER num_ctx 65536
PARAMETER num_predict 16384
EOF

ollama create qwen3.5-code-pilot -f /tmp/Modelfile-qwen3.5-code-pilot
```

Update `opencode.json` to add the pilot model alongside the dev model, then select it via `/models`.

## Privacy note

With this setup, all code and prompts stay on your machine. OpenCode is open source ([GitHub](https://github.com/anomalyco/opencode)) and auditable. The Ollama backend runs entirely offline. No telemetry is sent to external services when using a local provider.
