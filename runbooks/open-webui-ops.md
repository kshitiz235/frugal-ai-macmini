# Runbook: Open WebUI Operations

> **Scope:** Day-to-day operation of the Open WebUI chat service
> **Prerequisites:** [Offline Chat Service guide](../guides/01-offline-chat-service.md) completed

Operate, maintain, and troubleshoot your Open WebUI deployment.

*This is a stub. Full content will be generated via `/gen-runbook` when needed.*

## Overview

Open WebUI runs as a Docker container connecting to a local Ollama instance. This runbook covers start/stop, updates, user management, chat history backup, and recovery.

## Day-to-Day Operations

### Start / Stop / Restart
```bash
docker start open-webui
docker stop open-webui
docker restart open-webui
```

### Check Status
```bash
docker ps --filter name=open-webui
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000
```

## Health Check

| Check | Command | Expected |
|-------|---------|----------|
| Container running | `docker ps --filter name=open-webui --format '{{.Status}}'` | `Up ...` |
| Web UI responds | `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000` | `200` |
| Ollama connected | Check Settings → Connections in the UI | Green status |

## Maintenance

### Update
```bash
docker pull ghcr.io/open-webui/open-webui:main
docker stop open-webui && docker rm open-webui
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

### Backup Chat History
```bash
docker cp open-webui:/app/backend/data/webui.db ~/backups/webui-$(date +%Y%m%d).db
```

### Restore Chat History
```bash
docker stop open-webui
docker cp ~/backups/webui-YYYYMMDD.db open-webui:/app/backend/data/webui.db
docker start open-webui
```

## Troubleshooting

*Detailed troubleshooting to be added — see [guide](../guides/01-offline-chat-service.md#troubleshooting) for initial issues.*
