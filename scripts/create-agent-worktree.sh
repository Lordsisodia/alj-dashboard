#!/usr/bin/env bash
# create-agent-worktree.sh — Bootstrap a properly configured agent worktree
#
# Usage:
#   bash scripts/create-agent-worktree.sh <branch-suffix> <port>
#
# Example:
#   bash scripts/create-agent-worktree.sh qualify-fixes 3002
#
# This creates:
#   - Git worktree at ../isso-dashboard-<branch-suffix>
#   - Branch: feat/<branch-suffix>
#   - Symlinked .env.local
#   - Synced src/components/ui/
#   - ALLOW_NODE_ANY=1 in .env.worktree
#   - Dev server started on <port> (confirmed clean compile)

set -e

MAIN_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard"
BRANCH_SUFFIX="${1:-}"
PORT="${2:-}"

if [ -z "$BRANCH_SUFFIX" ] || [ -z "$PORT" ]; then
  echo "Usage: bash scripts/create-agent-worktree.sh <branch-suffix> <port>"
  echo "Example: bash scripts/create-agent-worktree.sh qualify-fixes 3002"
  exit 1
fi

WORKTREE_DIR="/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-${BRANCH_SUFFIX}"
BRANCH_NAME="feat/${BRANCH_SUFFIX}"

echo ""
echo "Creating agent worktree: $BRANCH_SUFFIX on port $PORT"
echo "  Branch:   $BRANCH_NAME"
echo "  Path:     $WORKTREE_DIR"
echo ""

cd "$MAIN_DIR"

# ── 1. Create worktree ────────────────────────────────────────────────────────

if [ -d "$WORKTREE_DIR" ]; then
  echo "Worktree already exists at $WORKTREE_DIR — skipping creation"
else
  git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME"
  echo "Worktree created"
fi

# ── 2. Symlink .env.local ─────────────────────────────────────────────────────

if [ ! -f "$WORKTREE_DIR/.env.local" ] && [ ! -L "$WORKTREE_DIR/.env.local" ]; then
  ln -s "$MAIN_DIR/.env.local" "$WORKTREE_DIR/.env.local"
  echo ".env.local symlinked"
else
  echo ".env.local already present"
fi

# ── 3. Sync src/components/ui/ ────────────────────────────────────────────────

mkdir -p "$WORKTREE_DIR/src/components/ui"
rsync -a --update "$MAIN_DIR/src/components/ui/" "$WORKTREE_DIR/src/components/ui/"
echo "src/components/ui/ synced"

# ── 4. Write .env.worktree with ALLOW_NODE_ANY ────────────────────────────────

echo "ALLOW_NODE_ANY=1" > "$WORKTREE_DIR/.env.worktree"
echo ".env.worktree written"

# ── 5. Install deps if node_modules missing ───────────────────────────────────

if [ ! -d "$WORKTREE_DIR/node_modules" ]; then
  echo "Installing dependencies (this may take a minute)..."
  cd "$WORKTREE_DIR"
  ALLOW_NODE_ANY=1 pnpm install --frozen-lockfile 2>/dev/null || pnpm install
  cd "$MAIN_DIR"
  echo "Dependencies installed"
else
  echo "node_modules already present — skipping install"
fi

# ── 6. Start dev server + confirm clean compile ───────────────────────────────

echo ""
echo "Starting dev server on port $PORT..."
LOGFILE="/tmp/worktree-${BRANCH_SUFFIX}-server.log"

cd "$WORKTREE_DIR"
ALLOW_NODE_ANY=1 pnpm dev --port "$PORT" > "$LOGFILE" 2>&1 &
SERVER_PID=$!

# Wait up to 30s for Ready
MAX_WAIT=30
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
  if grep -q "Ready in" "$LOGFILE" 2>/dev/null; then
    break
  fi
  if grep -qi "error\|failed\|cannot" "$LOGFILE" 2>/dev/null && ! grep -q "Ready in" "$LOGFILE" 2>/dev/null; then
    echo ""
    echo "Dev server hit errors — check $LOGFILE"
    tail -20 "$LOGFILE"
    exit 1
  fi
  sleep 1
  WAITED=$((WAITED + 1))
done

if ! grep -q "Ready in" "$LOGFILE" 2>/dev/null; then
  echo "Dev server did not become ready within ${MAX_WAIT}s — check $LOGFILE"
  exit 1
fi

echo "Dev server ready"
echo ""

# ── 7. Confirm no build errors on first page load ────────────────────────────

sleep 3
if grep -qi "build error\|module not found\|failed to compile" "$LOGFILE" 2>/dev/null; then
  echo "Build errors detected — check $LOGFILE"
  grep -i "build error\|module not found\|failed to compile" "$LOGFILE"
  exit 1
fi

# ── Done ──────────────────────────────────────────────────────────────────────

echo "Worktree ready"
echo ""
echo "  URL:      http://localhost:${PORT}"
echo "  Path:     $WORKTREE_DIR"
echo "  Branch:   $BRANCH_NAME"
echo "  Server:   PID $SERVER_PID (logs: $LOGFILE)"
echo ""
echo "Agent setup:"
echo "  - .env.local is symlinked from main — always current"
echo "  - src/components/ui/ is synced — run sync-worktree.sh if main adds new components"
echo "  - ALLOW_NODE_ANY=1 is set"
echo ""
echo "Before agent starts work, it should run:"
echo "  bash scripts/sync-worktree.sh $BRANCH_SUFFIX"
echo ""
echo "Before agent commits, it must run:"
echo "  bash scripts/verify-worktree.sh $BRANCH_SUFFIX $PORT"
