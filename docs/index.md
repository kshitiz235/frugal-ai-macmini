# Frugal AI Knowledge Base

Deploy AI with minimal resource intensity and maximum local control. No cloud required.

[Frugal AI](https://www.col.org/frugal) is a design philosophy from the [Commonwealth of Learning](https://www.col.org) that treats AI as durable institutional infrastructure — not an externally sourced service. It prioritises sovereign data ownership, economic resilience through open-source components, and local technical capacity over vendor dependency. ([Read the roadmap](https://www.col.org/news/frugal-ai-a-roadmap-to-sovereign-genai-for-education/))

This knowledge base is the practical implementation: open-source stacks running on consumer hardware, offline-first, with copy-paste setup guides.

## Start here

You have a Mac Mini (24 GB). You want to run AI locally.

| Step | What you do | Time |
|------|------------|------|
| 0 | Set up your dev environment: [dev-environment-mac-mini-24gb](runbooks/dev-environment-mac-mini-24gb.md) | 30 min |
| 1 | Set up inference: [dev-ollama-qwen3.5](stacks/dev-ollama-qwen3.5.md) | 15 min |
| 2 | Build a chat service: [01-offline-chat-service](guides/01-offline-chat-service.md) | 30 min |
| 3 | Operate your chat service: [open-webui-ops](runbooks/open-webui-ops.md) | — |
| 4 | Build a RAG app: *coming soon* | — |
| 5 | Build with agents: *coming soon* | — |

## How it's organised

```
components (what things ARE)
    ↓ composed into
stacks (what combinations WORK)
    ↓ used by
guides (how to BUILD)    runbooks (how to OPERATE)
```

**Components** = reference cards. What is this model? What are this device's limits? What does this runtime do?

**Stacks** = tested combinations. "Mac Mini + Ollama + Qwen3.5 works — here's the setup."

**Guides** = step-by-step builds. "Here's how to run an offline chat service using that stack."

**Runbooks** = operational docs. "Here's how to maintain your dev environment day-to-day."

### Swap components, keep the structure

- **Dev:** Mac Mini 24 GB + Ollama + Qwen3.5-9B (Q4)
- **Pilot:** Mac 64 GB + Ollama + Qwen3.5-9B (Q6)
- **Production:** DGX Spark 128 GB + vLLM + Qwen3.5-9B (FP16)

Same guides, different stacks.

## Components

| Type | What it answers | Contents |
|------|----------------|----------|
| [Hardware](components/hardware/) | "What device do I have?" | Mac Mini, Mac 64 GB, DGX Spark |
| [Runtimes](components/runtimes/) | "What runs the model?" | Ollama, LM Studio |
| [Models](components/models/) | "Which AI model do I load?" | Qwen3.5-9B |
| [Frameworks](components/frameworks/) | "What do I build with?" | Open WebUI, Dify, agent frameworks |
| [Environments](components/environments/) | "What stage am I at?" | Development, Pilot, Production |

## Frugal Rating

Every model card rates total memory footprint (model + KV cache), not just VRAM:

| Rating | Memory footprint | Default device |
|--------|-----------------|----------------|
| 🟢 Light | ≤16 GB | Mac Mini 24 GB |
| 🟡 Moderate | 17–48 GB | Mac 64 GB |
| 🔴 Heavy | 49+ GB | DGX Spark 128 GB |
