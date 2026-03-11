# Agentic / Multi-Agent Frameworks

Frameworks for building AI agents that use tools, make decisions, and orchestrate multi-step workflows.

## When to use
- AI agents that call tools (web search, file access, APIs)
- Multi-agent systems (planner + executor, debate, delegation)
- Autonomous workflows beyond simple chat or RAG

## Requires
- An OpenAI-compatible API endpoint with **tool/function calling support**
- A model with native tool calling (e.g., Qwen3.5, Llama 3.1+, Mistral with function calling)
- Python 3.11+
- More memory headroom than chat or RAG (agent loops hold longer context)

## Candidate frameworks

> This section will be expanded as frameworks are evaluated against frugal constraints (local-first, offline-capable, open-source).

| Framework | Focus | Local-first? | Status |
|-----------|-------|-------------|--------|
| CrewAI | Multi-agent teams | Yes (with local LLM) | To evaluate |
| LangGraph | Stateful agent graphs | Yes (with local LLM) | To evaluate |
| AutoGen | Multi-agent conversations | Yes (with local LLM) | To evaluate |
| Qwen-Agent | Tool use, code execution | Yes (native Qwen support) | To evaluate |
| smolagents | Lightweight agents | Yes (HF ecosystem) | To evaluate |

## Evaluation criteria for frugal use
- **Runs offline** with local models (no cloud API required)
- **Tool calling** works via Ollama or vLLM OpenAI-compatible endpoint
- **Memory efficient** — agent framework overhead under 1 GB
- **Works with small models** (7–14B parameter range)
- **Open source** with permissive license

## Model requirements
For agentic use, the model must support tool/function calling. Check the model card for:
- **Tool calling: Yes (native)** — best option
- **Tool calling: Yes (via prompt)** — works but less reliable
- **Tool calling: No** — not suitable for agentic use

## Links
- Guides for agentic applications will be added as frameworks are evaluated.
