# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Frugal AI Knowledge Base** — a documentation repository for building local-first AI systems on consumer hardware. It is organised into components (reference cards), stacks (tested combinations), guides (step-by-step builds), and runbooks (operational docs).

## Repository Structure

```
components/
  hardware/         # Device profiles (Mac Mini, Mac 64GB, DGX Spark)
  runtimes/         # Inference runtimes (Ollama, LM Studio, vLLM)
  models/           # Model reference cards
  frameworks/       # Application frameworks (Open WebUI, Dify, agents)
  environments/     # Development, Pilot, Production
stacks/             # Tested component combinations
guides/             # Step-by-step build docs
runbooks/           # Operational runbooks (environment setup, day-to-day ops)
templates/          # Templates for each doc type (single source of truth)
.skills/            # Claude Code skills for drafting
```

## How docs compose

```
components (what things ARE)
    ↓ composed into
stacks (what combinations WORK)
    ↓ used by
guides (how to BUILD)    runbooks (how to OPERATE)
```

- A **stack** picks one hardware + runtime + model + environment and provides copy-paste setup + verification.
- A **guide** uses a stack as prerequisite and builds an application on top (chat, RAG, agents). Framework selection (Open WebUI, Dify, n8n) happens at the guide level — same stack, different frameworks.
- A **runbook** covers lifecycle operations: environment setup, day-to-day ops, troubleshooting, recovery, and maintenance.

### Guides vs Runbooks

- **Guide** = "Build X" — one-time app setup on a running stack.
- **Runbook** = "Operate X" — lifecycle: environment setup, day-to-day ops, troubleshooting, recovery.

## Target Hardware

| Device | Memory | Role |
|--------|--------|------|
| Mac Mini M4 (24 GB) | 24 GB unified | Default development device |
| Apple Mac (64 GB) | 64 GB unified | Pilot / heavy development |
| NVIDIA DGX Spark | 128 GB unified | Production |

## Frugal Rating

Based on total memory footprint (model weights + KV cache), not discrete VRAM:

| Rating | Memory footprint | Fits on |
|--------|-----------------|---------|
| 🟢 Light | ≤16 GB | Mac Mini 24 GB |
| 🟡 Moderate | 17–48 GB | Mac 64 GB |
| 🔴 Heavy | 49+ GB | DGX Spark 128 GB |

## Skills

All skills live in `.skills/` and generate draft docs from reference URLs + templates + examples.

| Skill | Template | Output | Input |
|-------|----------|--------|-------|
| `gen-model-card` | `templates/model-card-template.md` | `components/models/` | Hugging Face URL |
| `gen-runtime-card` | `templates/runtime-card-template.md` | `components/runtimes/` | Official docs URL |
| `gen-framework-card` | `templates/framework-card-template.md` | `components/frameworks/` | GitHub/docs URL |
| `gen-stack` | `templates/stack-template.md` | `stacks/` | Component combination |
| `gen-guide` | `templates/guide-template.md` | `guides/` | Stack + framework |
| `gen-runbook` | `templates/runbook-template.md` | `runbooks/` | Operational scope |

Each skill uses WebFetch/WebSearch to ground content from real sources. Output is draft-only until human-verified.

## Key Conventions

- **No placeholders** in any doc — every field must have real content. Mark inferred data with `*(inferred)*`.
- **Source URLs are mandatory** on every model card.
- **Commands must be real and copy-pasteable** — use actual Ollama tags or HF model IDs, never `[your-model-here]`.
- **Frugal Ratings** are based on total memory footprint on unified memory devices, not discrete VRAM.
- **Stacks must include verification** with expected metrics (tokens/sec, memory usage).
- **Guides must link to a stack** as prerequisite — never duplicate stack setup inline.
- **Runbooks must include** health check table, troubleshooting (symptom/cause/fix), recovery, and maintenance sections.
- **Model cards focus on inference** — no benchmarks, no RAG/vision setup (those go in guides).
- **Runtimes:** Ollama (development/pilot), vLLM (production), LM Studio (GUI), SGLang (structured gen).
- **Use cases must be specific** — "Structured JSON extraction from legal documents" not "General purpose".
- **"Not Good For"** anti-use-cases should be listed for every model.
- **Tool calling support** must be noted on every model card (Yes native / Yes via prompt / No).
- **Framework selection** happens at the guide level, not the stack level.
- **Skills must ground content** via WebFetch (primary source) and WebSearch (community data) — cite sources inline.
