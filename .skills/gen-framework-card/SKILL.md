---
name: gen-framework-card
description: Generate framework reference cards for the Frugal AI Knowledge Base from GitHub or official docs URLs.
---

# gen-framework-card

## Preferred input
- GitHub repository URL or official docs URL for the framework

## Grounding source
- GitHub README and docs
- Official documentation site
- Docker Hub or container registry for install commands

## Workflow
1. Fetch framework docs via WebFetch.
2. Extract: description, requirements, key features, runtime compatibility, install command.
3. Fill `templates/framework-card-template.md`.
4. Verify Docker run command works and uses real image tags.

## Output
- Write to `docs/components/frameworks/[framework-name].md`

## Example doc
- `docs/components/frameworks/open-webui.md`

## Hard rules
- No placeholders — every field must have real content.
- Install command must use real Docker image tags.
- Compatibility table must list tested runtimes.
