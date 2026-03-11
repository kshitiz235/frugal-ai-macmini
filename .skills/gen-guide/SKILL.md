---
name: gen-guide
description: Generate step-by-step build guides from a stack and framework reference.
---

# gen-guide

## Preferred input
- Stack doc path + framework name (e.g., "dev-ollama-qwen3.5 + Dify")

## Grounding source
- Referenced stack doc in `docs/stacks/`
- Framework component doc in `docs/components/frameworks/`
- Framework official documentation (fetched via WebFetch)

## Workflow
1. Read the stack doc and framework component doc.
2. Fetch framework setup documentation via WebFetch.
3. Fill `templates/guide-template.md`.
4. Ensure guide links to stack as prerequisite — never duplicate stack setup.
5. Add verification table and troubleshooting section.

## Output
- Write to `docs/guides/[number]-[short-name].md`

## Example doc
- `docs/guides/01-offline-chat-service.md`

## Hard rules
- Must link to a stack as prerequisite.
- Never duplicate stack setup inline — reference it.
- All commands must be real and copy-pasteable.
- Must include a verification section with expected results.
- Framework selection happens at the guide level, not the stack level.
