# Publishing Workflow

> From Claude Code skill → draft → human review → GitBook publish

This runbook covers the end-to-end workflow for generating, reviewing, and publishing documentation to the GitBook-hosted knowledge base.

## Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  1. Generate │────▶│  2. Review    │────▶│  3. Commit   │────▶│  4. Publish  │
│  (Claude Code│     │  (Human)     │     │  (Git)       │     │  (GitBook)   │
│   skills)    │     │              │     │              │     │              │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
```

---

## Prerequisites

- Claude Code CLI installed and configured
- Git repo cloned: `frugal-knowledge-base`
- GitBook space connected via Git Sync (see [One-time setup](#one-time-setup-gitbook-git-sync) below)

---

## Step 1: Generate a draft with Claude Code skills

Each doc type has a dedicated skill that fetches real data from source URLs and fills the template.

### Available skills

| Skill | Command | Input | Output |
|-------|---------|-------|--------|
| Model card | `/gen-model-card <HF-url>` | Hugging Face model page | `docs/components/models/*.md` |
| Runtime card | `/gen-runtime-card <docs-url>` | Official docs URL | `docs/components/runtimes/*.md` |
| Framework card | `/gen-framework-card <github-url>` | GitHub or docs URL | `docs/components/frameworks/*.md` |
| Stack | `/gen-stack` | Hardware + runtime + model combo | `docs/stacks/*.md` |
| Guide | `/gen-guide` | Stack + framework reference | `docs/guides/*.md` |
| Runbook | `/gen-runbook` | Operational scope | `docs/runbooks/*.md` |

### Example: generate a model card

```bash
# In Claude Code, run the skill with a source URL
/gen-model-card https://huggingface.co/Qwen/Qwen3.5-9B
```

Claude Code will:
1. Fetch the Hugging Face page and community benchmarks
2. Read `templates/model-card-template.md` for the canonical structure
3. Read an existing model card as a style example
4. Write a draft to `docs/components/models/qwen-3.5-9b.md`

### Example: generate a guide

```bash
/gen-guide
# Claude Code will ask which stack and framework to use
```

All skill output is **draft-only** — it is never publish-ready without human review.

---

## Step 2: Human review and verification

Every generated draft must pass a manual review before committing. Use this checklist:

### Universal checks (all doc types)

- [ ] **No placeholders** — no `TBD`, `...`, `[your-model-here]`, or empty fields
- [ ] **Inferred data marked** — anything not from a primary source has `*(inferred)*`
- [ ] **Commands are real** — copy-paste every command and verify it runs
- [ ] **Links resolve** — check all relative links (`../stacks/...`, `../components/...`)
- [ ] **Consistent tone** — matches existing docs in the same category

### Model card checks

- [ ] Source URLs present and valid
- [ ] Frugal Rating matches actual memory footprint
- [ ] Quantisation variants list actual Ollama tags or HF model IDs
- [ ] "Not Good For" section has specific anti-use-cases
- [ ] Tool calling support noted (Yes native / Yes via prompt / No)

### Stack checks

- [ ] All referenced component docs exist in `docs/components/`
- [ ] Verification step included with expected tokens/sec and memory usage
- [ ] Memory scaling table uses real numbers from model card

### Guide checks

- [ ] Links to a stack as prerequisite (does not duplicate stack setup)
- [ ] Framework selection is explicit
- [ ] Step-by-step instructions tested on target hardware

### Runbook checks

- [ ] Health check table present
- [ ] Troubleshooting section has symptom → cause → fix format
- [ ] Recovery and maintenance sections included

### Fixing issues

Edit the draft directly in your editor or use Claude Code:

```bash
# Ask Claude Code to fix specific issues
# e.g., "The memory footprint in the frugal rating is wrong — it should be 6.2 GB not 8 GB"
```

---

## Step 3: Commit and push

Once the draft passes review, commit it to trigger GitBook sync.

### Add the new doc to SUMMARY.md

Every new page must be listed in `docs/SUMMARY.md` for GitBook to include it in the sidebar navigation.

```markdown
# Example: adding a new model card to docs/SUMMARY.md

## Components — Models

* [Qwen3.5-9B](components/models/qwen-3.5-9b.md)
* [Llama 3.1 8B](components/models/llama-3.1-8b-instruct.md)   ← new entry
```

The SUMMARY.md format rules:
- `##` headings create sidebar groups
- `*` bullet items with `[Title](path)` create pages
- Indent with spaces for child pages
- Each file can only appear once
- Paths are relative to `docs/`

### Commit

```bash
git add docs/components/models/llama-3.1-8b-instruct.md
git add docs/SUMMARY.md
git commit -m "Add Llama 3.1 8B Instruct model card"
git push
```

---

## Step 4: GitBook publishes automatically

Once the commit lands on the synced branch, GitBook will:

1. Detect the new commit via Git Sync
2. Parse `docs/SUMMARY.md` for navigation structure
3. Render all Markdown into the published docs site
4. Update the live site within seconds

No manual publish step is needed. GitBook sync is bidirectional — if someone edits directly in GitBook's web editor, those changes will also appear as commits in the repo.

### Verify the publish

1. Open your GitBook space URL
2. Check the sidebar — the new page should appear under its group
3. Open the page and verify formatting, links, and content

---

## One-time setup: GitBook Git Sync

This only needs to be done once per GitBook space.

### 1. Create a GitBook space

1. Go to [gitbook.com](https://www.gitbook.com) and sign in
2. Create a new space for the knowledge base

### 2. Install the GitBook GitHub app

1. In your GitBook space, go to the top-right menu → **Configure**
2. Select **GitHub Sync** as the provider
3. Authenticate with GitHub when prompted
4. Install the GitBook app on your GitHub account/org
5. Grant access to the `frugal-knowledge-base` repository

### 3. Configure sync settings

| Setting | Value |
|---------|-------|
| Repository | `frugal-knowledge-base` |
| Branch | `main` |
| Direction (first sync) | **GitHub → GitBook** (repo has existing content) |

### 4. Add the .gitbook.yaml config

This file already exists at the repo root:

```yaml
root: ./docs/

structure:
  readme: index.md
  summary: SUMMARY.md
```

- `root: ./docs/` tells GitBook to only read the `docs/` folder — templates, skills, and CLAUDE.md are excluded
- `readme: index.md` sets `docs/index.md` as the landing page
- `summary: SUMMARY.md` sets `docs/SUMMARY.md` as the table of contents

### 5. Enable sync

Click **Sync** in GitBook. The space will exit live-edit mode and begin syncing from the GitHub branch.

---

## What lives where

| Path | Published to GitBook? | Purpose |
|------|-----------------------|---------|
| `docs/` | Yes | All publishable documentation |
| `docs/index.md` | Yes | Landing page |
| `docs/SUMMARY.md` | Yes | Table of contents / sidebar nav |
| `docs/components/` | Yes | Reference cards |
| `docs/stacks/` | Yes | Tested combinations |
| `docs/guides/` | Yes | Step-by-step builds |
| `docs/runbooks/` | Yes | Operational docs |
| `templates/` | No | Templates for doc generation |
| `.skills/` | No | Claude Code skill definitions |
| `CLAUDE.md` | No | Claude Code project instructions |
| `README.md` | No | GitHub repo README |
| `.gitbook.yaml` | No (config only) | GitBook sync configuration |

---

## Workflow cheat sheet

```bash
# 1. Generate
/gen-model-card https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct

# 2. Review — read the draft, check the checklist above
#    Fix any issues manually or with Claude Code

# 3. Register in SUMMARY.md
#    Add the new page entry under the correct group

# 4. Commit and push
git add docs/components/models/llama-3.1-8b-instruct.md docs/SUMMARY.md
git commit -m "Add Llama 3.1 8B Instruct model card"
git push

# 5. Verify — check the live GitBook site
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| New page not in sidebar | Missing from `docs/SUMMARY.md` | Add the page entry and push |
| Page shows but with broken links | Relative paths wrong after move to `docs/` | Links between docs use `../` — verify paths |
| GitBook sync stuck | Merge conflict or invalid SUMMARY.md | Check GitBook sync status page; fix conflicts in repo |
| Duplicate page error | Same file referenced twice in SUMMARY.md | Each file can only appear once — remove the duplicate |
| Landing page blank | `index.md` not found | Verify `.gitbook.yaml` has `readme: index.md` and file exists in `docs/` |
| Changes in GitBook not in repo | Bidirectional sync issue | Pull latest from remote before making local changes |
