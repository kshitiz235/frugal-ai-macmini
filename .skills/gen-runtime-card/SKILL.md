---
name: gen-runtime-card
description: Generate runtime reference cards for the Frugal AI Knowledge Base from official documentation URLs.
---

# gen-runtime-card

## Preferred input
- Official docs URL or GitHub repository URL for the runtime

## Grounding source
- Official documentation site
- GitHub README and release notes
- Community benchmarks for performance data

## Workflow
1. Fetch runtime documentation via WebFetch.
2. Extract: description, key features, settings, install commands, compatibility.
3. Fill `templates/runtime-card-template.md`.
4. Verify install commands are real and copy-pasteable.

## Output
- Write to `components/runtimes/[runtime-name].md`

## Example doc
- `components/runtimes/ollama.md`

## Hard rules
- No placeholders — every field must have real content.
- Install commands must be real for both macOS and Linux.
- Compatibility table must list all 3 target devices.
