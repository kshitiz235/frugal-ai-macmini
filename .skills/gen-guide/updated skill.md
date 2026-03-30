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

5. Detect steps that require code (applications, configs, scripts).
6. Generate required code separately and save to a guide-specific artifacts directory.
7. Reference generated files in the guide using relative file paths (do NOT inline large code).

8. Add verification table and troubleshooting section.

## Output
- Guide file: `docs/guides/[number]-[short-name].md`
- Artifacts directory: `artifacts/[number]-[short-name]/`

## Artifact Rules
IF step includes:
  - "create file"
  - "write code"
  - "build app"
  - "edit config file"
THEN:
  → generate artifacts

ELSE:
  → NO artifacts
- All generated code must be stored under:
  `artifacts/[guide-name]/`
- The `[guide-name]` must exactly match the guide file name (without `.md`).
- Do NOT mix artifacts between different guides.
- Regenerating a guide must overwrite its existing artifact folder.
- Use structured subfolders where needed:
  - `app/` for application code
  - `config/` for configuration files
  - `scripts/` for runnable scripts
  - `tests/` for verification code

## Guide Writing Rules (Updated)
- Do NOT inline large code blocks.
- All non-trivial code must be generated as artifacts.
- Reference files using relative paths.

### Example:
Instead of:
```python
# long code...



Create the application file:

Path: artifacts/02-sql-injection-lab/app/main.py

Hard rules
Must link to a stack as prerequisite.
Never duplicate stack setup inline — reference it.
All commands must be real and copy-pasteable.
Must include a verification section with expected results.
Framework selection happens at the guide level, not the stack level.
Do NOT inline large code blocks — always use artifact references.
- Do NOT generate artifacts unless the guide explicitly requires creating files (application code, config files, scripts).
- If the guide only involves installing, configuring, or running existing tools, no artifacts directory should be created.