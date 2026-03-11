---
name: gen-runbook
description: Generate operational runbooks for lifecycle management of environments and services.
---

# gen-runbook

## Preferred input
- Operational scope (e.g., "dev environment on Mac Mini 24 GB" or "Open WebUI ops")

## Grounding source
- Related stack and guide docs
- Component docs for installed software
- Official documentation for update/backup procedures (fetched via WebFetch)

## Workflow
1. Identify all components in scope from stack/guide docs.
2. Fetch official docs for update and maintenance procedures via WebFetch.
3. Fill `templates/runbook-template.md`.
4. Ensure all commands are real and tested on the target platform.
5. Include health check table, troubleshooting, recovery, and maintenance sections.

## Output
- Write to `docs/runbooks/[scope-description].md`

## Example doc
- `docs/runbooks/dev-environment-mac-mini-24gb.md`

## Hard rules
- No placeholders — every command must be real and copy-pasteable.
- Must include health check table with specific commands and expected output.
- Must include troubleshooting with symptom/cause/fix format.
- Must include recovery procedures for common failure modes.
- Must include maintenance schedule (updates, cleanup, backup).
