---
name: gen-stack
description: Generate tested stack docs by composing existing hardware, runtime, model, and environment components.
---

# gen-stack

## Preferred input
- Hardware + runtime + model + environment combination (e.g., "Mac Mini + Ollama + Llama 3.1 8B")

## Grounding source
- Existing component docs in `docs/components/` (hardware, runtime, model, environment)
- Memory scaling data from model cards
- Performance estimates from inference benchmarks

## Workflow
1. Read all referenced component docs.
2. Fill `templates/stack-template.md` with real commands.
3. Compute memory scaling table from model card data.
4. Add verification step with expected metrics.
5. Add variants for other target devices.
6. Add troubleshooting section.

## Output
- Write to `docs/stacks/[env]-[runtime]-[model].md`

## Example doc
- `docs/stacks/dev-ollama-qwen3.5.md`

## Hard rules
- All referenced components must exist as docs in `docs/components/`.
- Commands must be real — use actual Ollama tags or HF model IDs.
- Must include verification with expected tokens/sec and memory usage.
- Must include at least one device variant.
