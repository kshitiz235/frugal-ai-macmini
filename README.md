# Frugal AI Knowledge Base

Deploy AI with minimal resource intensity and maximum local control. No cloud required.

[Frugal AI](https://www.col.org/frugal) is a design philosophy from the [Commonwealth of Learning](https://www.col.org) that treats AI as durable institutional infrastructure — not an externally sourced service. It prioritises sovereign data ownership, economic resilience through open-source components, and local technical capacity over vendor dependency.

This knowledge base provides the practical implementation: open-source stacks running on consumer hardware, offline-first, with copy-paste setup guides.

**[Read the docs](docs/index.md)**

## Quick start

| Step | What you do |
|------|------------|
| 0 | [Set up your dev environment](docs/runbooks/dev-environment-mac-mini-24gb.md) |
| 1 | [Set up inference](docs/stacks/dev-ollama-qwen3.5.md) |
| 2 | [Build a chat service](docs/guides/01-offline-chat-service.md) |
| 3 | [Operate your chat service](docs/runbooks/open-webui-ops.md) |

## Repository structure

```
docs/                     # Publishable documentation (export to GitHub Pages)
  index.md                # Docs landing page
  components/
    hardware/             # Device profiles
    runtimes/             # Inference runtimes (Ollama, LM Studio, vLLM)
    models/               # Model reference cards
    frameworks/           # Application frameworks (Open WebUI, Dify, agents)
    environments/         # Development, Pilot, Production
  stacks/                 # Tested component combinations
  guides/                 # Step-by-step build docs
  runbooks/               # Operational runbooks
templates/                # Templates for each doc type (not published)
.skills/                  # Claude Code skills for drafting (not published)
```

## Contributing

Generate drafts with Claude Code skills, then review:

| Skill | Creates | Input |
|-------|---------|-------|
| `/gen-model-card <HF-url>` | `docs/components/models/*.md` | Hugging Face URL |
| `/gen-runtime-card <docs-url>` | `docs/components/runtimes/*.md` | Official docs URL |
| `/gen-framework-card <github-url>` | `docs/components/frameworks/*.md` | GitHub or docs URL |
| `/gen-stack` | `docs/stacks/*.md` | Hardware + runtime + model combo |
| `/gen-guide` | `docs/guides/*.md` | Stack + framework reference |
| `/gen-runbook` | `docs/runbooks/*.md` | Operational scope |

> Skills live in `.skills/`. Output is **draft-only** until human-verified.

## Rules

1. No placeholders (`TBD`, `...`, empty fields).
2. Mark inferred data with `*(inferred)*`.
3. Commands must be real and copy-pasteable.
4. Stacks must include a verify step with expected results.
5. Guides must link to a stack as prerequisite.
6. Runbooks must include health check, troubleshooting, recovery, and maintenance.
7. Skill output is draft-only until human-verified.
