#!/usr/bin/env bash
# =============================================================================
# BidLens — Hetzner one-shot deploy
# =============================================================================
# Run from the project root on your laptop:
#
#   BIDLENS_SSH_HOST=root@<your-hetzner-ip> ./deploy/hetzner/deploy.sh
#
# Optional overrides:
#   BIDLENS_PORT=3080                   host port on the server
#   BIDLENS_ENV_FILE=.env.local         where the secrets live on your laptop
#   REMOTE_DIR=/opt/bidlens             target dir on the server
#   BIDLENS_REPO=https://github.com/santoshrnath/bidlens.git
#   BIDLENS_BRANCH=main
#
# What it does:
#   1. SSH to the server, git clone or fast-forward update to ${REMOTE_DIR}.
#   2. scp your local .env.local to the server as .env.
#   3. docker compose up -d --build.
#   4. prisma db push to apply the schema.
#   5. (optional) seed synthetic demo data.
# =============================================================================
set -euo pipefail

: "${BIDLENS_SSH_HOST:?Set BIDLENS_SSH_HOST=user@ip (e.g. root@1.2.3.4)}"
BIDLENS_PORT="${BIDLENS_PORT:-3080}"
BIDLENS_ENV_FILE="${BIDLENS_ENV_FILE:-.env.local}"
REMOTE_DIR="${REMOTE_DIR:-/opt/bidlens}"
BIDLENS_REPO="${BIDLENS_REPO:-https://github.com/santoshrnath/bidlens.git}"
BIDLENS_BRANCH="${BIDLENS_BRANCH:-main}"
BIDLENS_SEED="${BIDLENS_SEED:-1}"

if [ ! -f "$BIDLENS_ENV_FILE" ]; then
  echo "✗ Missing env file at $BIDLENS_ENV_FILE" >&2
  echo "  Copy .env.example to .env.local and fill in ANTHROPIC_API_KEY." >&2
  exit 1
fi

echo "→ Project: bidlens"
echo "→ Target:  $BIDLENS_SSH_HOST:$REMOTE_DIR"
echo "→ Port:    $BIDLENS_PORT"
echo "→ Repo:    $BIDLENS_REPO ($BIDLENS_BRANCH)"
echo

echo "▸ git sync on server"
ssh "$BIDLENS_SSH_HOST" "set -e; \
  mkdir -p $REMOTE_DIR; \
  cd $REMOTE_DIR; \
  if [ -d .git ]; then \
    echo '  [update]'; \
    git fetch --depth=1 origin $BIDLENS_BRANCH && git reset --hard origin/$BIDLENS_BRANCH; \
  else \
    echo '  [clone]'; \
    git clone --depth=1 -b $BIDLENS_BRANCH $BIDLENS_REPO .; \
  fi; \
  git log -1 --oneline"

echo "▸ writing .env on server (from $BIDLENS_ENV_FILE)"
scp "$BIDLENS_ENV_FILE" "$BIDLENS_SSH_HOST:$REMOTE_DIR/.env"

echo "▸ docker compose up -d --build"
ssh "$BIDLENS_SSH_HOST" \
  "cd $REMOTE_DIR && BIDLENS_PORT=$BIDLENS_PORT docker compose up -d --build"

echo "▸ prisma db push"
ssh "$BIDLENS_SSH_HOST" \
  "cd $REMOTE_DIR && docker compose exec -T bidlens-app npx prisma db push --skip-generate || true"

if [ "$BIDLENS_SEED" = "1" ]; then
  echo "▸ seeding synthetic demo data"
  ssh "$BIDLENS_SSH_HOST" \
    "cd $REMOTE_DIR && docker compose exec -T bidlens-app node node_modules/.bin/tsx prisma/seed.ts || true"
fi

HOST_IP="${BIDLENS_SSH_HOST#*@}"
PUBLIC_HOST=$(grep -E '^PUBLIC_HOSTNAME=' "$BIDLENS_ENV_FILE" | head -n1 | cut -d= -f2-)
PUBLIC_HOST="${PUBLIC_HOST:-bidlens.oneplaceplatform.com}"

echo
echo "✓ Deployed."
echo "  Public (via Traefik): https://${PUBLIC_HOST}"
echo "  Direct (smoke test):  http://${HOST_IP}:${BIDLENS_PORT}"
echo
echo "  Tail logs with:  ssh ${BIDLENS_SSH_HOST} 'cd ${REMOTE_DIR} && docker compose logs -f'"
