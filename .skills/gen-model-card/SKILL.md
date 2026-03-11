---
name: gen-model-card
description: Generate Frugal AI model cards from a Hugging Face model link. Output is inference-focused and ready for use in stacks and guides.
---

# gen-model-card

## Preferred input
- Hugging Face URL (or official model URL)

## Workflow
1. Parse model identity from URL (family, size, variant, base model, languages).
2. **Fetch HF README** via WebFetch to ground all metadata (params, architecture, context, license, tool calling).
3. **Search for community benchmarks** via WebSearch for real-world performance data on Apple Silicon / NVIDIA.
4. Estimate inference performance on target devices (Mac Mini 24 GB, Mac 64 GB, DGX Spark).
5. Compute Frugal Rating based on memory footprint on unified memory devices.
6. Fill `templates/model-card-template.md` (the single source of truth for card structure).
7. Add specific use cases and not-good-for anti-use-cases.
8. **Cite sources inline** — every non-obvious fact must note its origin.

## Output
- Write to `components/models/[family]-[size]-[variant].md`
- Must be complete enough for a contributor to assess model-device fit at a glance.

## Hard rules
- No placeholders (`TBD`, `...`).
- Must include source URL and license.
- Must include inference performance table with all 3 target devices.
- Must note tool calling support (Yes native / Yes via prompt / No).
- Frugal Rating is based on total memory footprint (weights + KV cache), not VRAM.
