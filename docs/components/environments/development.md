# Environment: Development

Local machine, single user. Optimised for fast iteration and experimentation.

## Constraints
| Constraint | Value |
|-----------|-------|
| Hardware | Mac Mini 24 GB (default) or equivalent |
| Connectivity | Offline-capable (no cloud dependency) |
| Users | 1 (developer) |
| Uptime | Not required — restart freely |
| Data sensitivity | Local only — no PII in prompts |

## Defaults
| Setting | Value | Rationale |
|---------|-------|-----------|
| Runtime | Ollama | Simplest local setup |
| Quant | Q4_K_M | Best quality-to-memory ratio |
| Context | 8K–32K | Fits comfortably in 24 GB |
| Model serving | Single model loaded | Memory constraint |

## Promotion criteria
Ready to promote to Pilot when:
- [ ] Inference verified (tokens/sec meets expectations)
- [ ] Application (chat/RAG/agent) tested with real prompts
- [ ] No crashes under normal use for 1 day
- [ ] Team demo completed successfully
