---
name: gen-model-card
description: >
  Generate structured AI model cards for the Frugal AI Knowledge Base.
  Use this skill whenever a user provides a Hugging Face model URL, an official model
  page link, or a model identifier and asks to document it, add it to the repo,
  create a model card, or generate deployment/contributor docs. Also trigger when the
  user says things like "document this model", "add [model] to the registry", "write
  a card for [model]", or "create docs for [model]". Always use this skill if a
  Hugging Face URL or model family + size is mentioned alongside any documentation intent.
---

# gen-model-card

Generates an inference-focused model reference card for the Frugal AI Knowledge Base.
No placeholders. No TBDs. Every field must contain real, sourced information.

---

## Inputs

| Field | Required | Notes |
|---|---|---|
| Model URL | Yes | Hugging Face page or official model page |

If the URL is missing, ask the user for it before proceeding.

---

## Workflow

### Step 1 — Parse Model Identity

From the URL, extract:
- **Model family** — e.g. `qwen`, `llama`, `mistral`, `gemma`
- **Parameter size** — e.g. `7b`, `8b`, `72b`
- **Variant** — e.g. `instruct`, `chat`, `base`, `vision`
- **Organization** — e.g. `Qwen`, `meta-llama`, `mistralai`
- **Base model** — the parent model if this is a quant, finetune, or merge. Use "None" for original base models.
- **Languages** — supported languages (e.g. `en, zh`, `multilingual`)

Derive the output filename:
```
components/models/[family]-[size]-[variant].md
```
Examples:
- `Qwen/Qwen3.5-9B` → `docs/components/models/qwen-3.5-9b.md`
- `meta-llama/Llama-3.1-8B-Instruct` → `docs/components/models/llama-3.1-8b-instruct.md`

### Step 2 — Fetch Source Data (grounding)

**2a. Fetch the Hugging Face README** using WebFetch on the model URL. This is the primary source for all metadata. Extract:

| Field | Where to find it |
|---|---|
| Parameter count | Model card title, README, config.json |
| Architecture | README, config.json |
| Context window | README, model config |
| License | HF "License" tag or README |
| Modality | README (text/multimodal) |
| Languages | README, model card metadata |
| Tool calling support | README, chat template, function calling docs |
| Quantization options | README, community quant repos |

**2b. Search for community benchmarks** using WebSearch to find real-world inference performance data (tokens/sec, memory usage) on Apple Silicon and NVIDIA hardware. Prefer results from:
- Ollama community benchmarks
- Reddit r/LocalLLaMA performance posts
- GitHub issues with benchmark data

**2c. Cite sources inline.** Every non-obvious fact must note where it came from:
```
- **Context window:** 262K *(source: HF model card)*
- **Tokens/sec on Mac Mini:** ~35 *(source: r/LocalLLaMA benchmark thread)*
```

**If a field cannot be confirmed via WebFetch or WebSearch**, infer and mark clearly:
```
- **Context window:** 262K *(inferred from Qwen3.5 architecture)*
```

### Step 3 — Estimate Inference Performance

Estimate performance on the three target devices. Use model size, quant format, and architecture to project:

| Device | Quant | Context | Memory | Tokens/sec | TTFT |
|--------|-------|---------|--------|------------|------|
| Mac Mini 24 GB | Q4_K_M | 8K | ? | ? | ? |
| Mac 64 GB | Q6_K | 32K | ? | ? | ? |
| DGX Spark 128 GB | FP16 | full context | ? | ? | ? |

**Memory estimation:**
- Weights: parameter count × bytes per param (Q4 ≈ 0.5B/GB, Q6 ≈ 0.75B/GB, FP16 ≈ 2B/GB)
- KV cache: scales with context length and layer count
- Mark estimates as `*(estimated)*` if not from measured benchmarks

### Step 4 — Compute Frugal Rating

Based on total memory footprint (weights + KV cache) at Q4_K_M with 8K context:

| Rating | When to use |
|---|---|
| 🟢 Light | ≤16 GB footprint — fits on Mac Mini 24 GB |
| 🟡 Moderate | 17–48 GB footprint — needs Mac 64 GB |
| 🔴 Heavy | 49+ GB footprint — needs DGX Spark 128 GB |

The **"Fits on"** field must name specific devices, not abstract GB numbers.

### Step 5 — Good For / Not Good For

**Good For:** 3–5 specific use cases. Avoid vague terms.
- Yes: "Structured JSON extraction from legal documents"
- No: "General text generation"

**Not Good For:** 2–3 anti-use-cases based on known weaknesses.
- Yes: "Real-time streaming on devices with less than 12 GB available memory"
- No: "Not for everything"

### Step 6 — Limitations

2–3 specific limitations. No generic disclaimers like "may hallucinate."

### Step 7 — Write the File

Read `templates/model-card-template.md` for the canonical structure, then write the completed card to `docs/components/models/[family]-[size]-[variant].md`.

---

## Hard Rules (enforced at every generation)

1. **No placeholders.** Every field must contain real content. Mark inferred data as `*(inferred)*` or `*(estimated)*`.
2. **Source URL is mandatory.**
3. **License is mandatory** with a link to the license text.
4. **Inference performance table** must include all 3 target devices (Mac Mini, Mac 64 GB, DGX Spark).
5. **Tool calling support** must be explicitly noted (Yes native / Yes via prompt / No).
6. **Frugal Rating** is based on total memory footprint on unified memory, not discrete VRAM.
7. **Commands must be real** — use actual Ollama tags or HF model IDs, never `[your-model-here]`.
8. **No generic use cases.** "General purpose" is not a use case.
9. **No benchmarks section.** Model cards focus on inference performance, not academic benchmarks.
10. **No RAG/vision/fine-tuning sections.** Those topics belong in guides, not model cards.

---

## Output path convention

```
components/models/[family]-[size]-[variant].md
```

Write the file using the `Write` tool. Confirm the path to the user after writing.
