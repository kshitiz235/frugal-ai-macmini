#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"

echo "Checking Open WebUI at ${BASE_URL}"

curl -fsS "${BASE_URL}/health" >/dev/null || {
  echo "Health endpoint failed" >&2
  exit 1
}

curl -fsS -X POST "${BASE_URL}/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"change-me"}' >/dev/null && {
  echo "Login endpoint reachable"
} || {
  echo "Warning: Login test failed (expected until admin user exists)."
}

echo "Open WebUI appears healthy."
